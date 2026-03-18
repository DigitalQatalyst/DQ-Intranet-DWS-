import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const MarkdownRenderer: React.FC<{ body: string }> = ({ body }) => {
  // Rehype plugin: preserve class attribute on div elements and ensure feature-box is detected
  const rehypePreserveDivClass = React.useMemo(() => {
    return () => (tree: any) => {
      const walk = (node: any) => {
        if (!node || typeof node !== 'object') return
        if (node.type === 'element' && node.tagName === 'div') {
          // Ensure class is preserved in properties
          if (node.properties) {
            // Get class value (could be string or array)
            const classValue = node.properties.class
            if (classValue) {
              // Convert to string
              const classStr = Array.isArray(classValue) 
                ? classValue.join(' ') 
                : String(classValue)
              
              // ALWAYS set className from class (this is critical for react-markdown)
              node.properties.className = classStr
              // Also keep class for compatibility
              node.properties.class = classStr
            }
            // If className exists but is array, convert to string
            if (node.properties.className && Array.isArray(node.properties.className)) {
              node.properties.className = node.properties.className.join(' ')
            }
          }
        }
        const kids = node.children || []
        for (const k of kids) walk(k)
      }
      walk(tree)
    }
  }, [])
  
  // Rehype plugin: remove leading icon nodes (img/svg/span with img) from list items
  const rehypeStripListIcons = React.useMemo(() => {
    const stripText = (s: string) => {
      return (s || '')
        .replace(/^(?:[\u25A0-\u25FF]\uFE0F?\s*)+/, '') // geometric arrows
        .replace(/^[\u200d\ufe0f\uFE0F\u2060\s]*[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]+\s*/u, '') // emoji
    }
    const containsImage = (node: any): boolean => {
      if (!node || typeof node !== 'object') return false
      if (node.type === 'element' && (node.tagName === 'img' || node.tagName === 'picture' || node.tagName === 'svg')) return true
      const kids = (node.children || []) as any[]
      for (const k of kids) { if (containsImage(k)) return true }
      return false
    }
    const stripLeadingInContainer = (node: any) => {
      if (!node || !Array.isArray(node.children)) return
      // Work inside <li> and inside its first <p>
      const cleanFront = (arr: any[]) => {
        while (arr.length) {
          const first = arr[0]
          if (first?.type === 'text') {
            const next = stripText(first.value)
            if (next !== first.value) first.value = next
            if (!first.value || !first.value.trim()) { arr.shift(); continue }
            break
          }
          if (first?.type === 'element') {
            if (first.tagName === 'img' || first.tagName === 'picture' || first.tagName === 'svg' || (first.tagName === 'span' && containsImage(first))) { arr.shift(); continue }
            if (first.tagName === 'p' && Array.isArray(first.children)) { cleanFront(first.children); if (first.children.length === 0) { arr.shift(); continue } }
          }
          break
        }
      }
      cleanFront(node.children)
    }
    const walk = (node: any) => {
      if (!node || typeof node !== 'object') return
      if (node.type === 'element') {
        if (node.tagName === 'li' || node.tagName === 'summary') stripLeadingInContainer(node)
        // Keep <details>/<summary> intact so dropdowns work
      }
      const kids = node.children || []
      for (const k of kids) walk(k)
    }
    return () => (tree: any) => { walk(tree); }
  }, [])
  const sanitizeDecorators = React.useCallback((text: string): string => {
    const stripLine = (s: string) => {
      let line = s
      // Preserve markdown list bullet prefix
      const m = line.match(/^(\s*[-*+]\s*)/)
      const prefix = m ? m[1] : ''
      if (prefix) line = line.slice(prefix.length)
      // Remove leading geometric-shape arrows/bullets (includes ▶, ►, ▸ and many others)
      line = line.replace(/^(?:[\u25A0-\u25FF]\uFE0F?\s*)+/, '')
      // Remove leading emoji pictographs
      line = line.replace(/^[\u200d\ufe0f\uFE0F\u2060\s]*[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]+\s*/u, '')
      // Replace leading markdown/HTML image icons with their alt text (to keep names)
      line = line
        .replace(/^<img[^>]*alt=["']?([^"'>]+)[^>]*>\s*/i, '$1 ')
        .replace(/^!\[([^\]]*)\]\([^)]*\)\s*/i, '$1 ')
      // For list items: convert inline images to their alt text (remove icon but keep name)
      if (prefix) {
        line = line
          .replace(/<img[^>]*alt=["']?([^"'>]+)[^>]*>/gi, '$1')
          .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      }
      // Drop stray heading-only lines like '#', '##', '###'
      if ((prefix + line).trim().match(/^#{1,6}\s*$/)) return ''
      return (prefix + line)
    }
    return (text || '').split('\n').map(stripLine).join('\n')
  }, [])
  const processedBody = React.useMemo(() => sanitizeDecorators(body), [body, sanitizeDecorators])
  return (
    <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={([remarkGfm as any, remarkSlug as any] as any)}
      rehypePlugins={[
        [rehypeAutolinkHeadings, { behavior: 'append' }], 
        rehypeRaw,
        rehypePreserveDivClass as any,
        [
          rehypeSanitize,
          {
            tagNames: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote'],
            attributes: {
              div: ['class', 'className'],
              '*': ['class', 'className', 'id']
            },
            strip: []
          }
        ],
        rehypeStripListIcons as any
      ] as any}
      components={{
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4 pl-4 relative border-0 border-l-0 [&_*]:border-0" {...(props as any)}>
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent"></span>
            {props.children}
          </h2>
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4 pl-4 relative border-0 border-l-0 [&_*]:border-0" {...(props as any)}>
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent"></span>
            {props.children}
          </h3>
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-bold text-gray-900 mt-4 mb-3 pl-4 relative border-0 border-l-0 [&_*]:border-0" {...(props as any)}>
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent"></span>
            {props.children}
          </h4>
        ),
        img: ({ node, ...props }) => (
          // Constrain and lazy-load images for performance
          <img loading="lazy" decoding="async" style={{ maxWidth: '100%', height: 'auto' }} {...props as any} />
          ),
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-900" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-semibold mt-3 mb-2 text-gray-900" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-semibold mt-2 mb-2 text-gray-900" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 underline hover:text-blue-800 transition-colors" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, inline, ...props }: any) => 
            inline ? (
              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
          ),
      }}
    >
      {processedBody}
    </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer

