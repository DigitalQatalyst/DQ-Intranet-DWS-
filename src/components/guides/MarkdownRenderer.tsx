import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const MarkdownRenderer: React.FC<{ body: string; onRendered?: () => void }> = ({ body, onRendered }) => {
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
        img: ({ node, ...props }) => (
          // Constrain and lazy-load images for performance
          <img loading="lazy" decoding="async" style={{ maxWidth: '100%', height: 'auto' }} {...(props as any)} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 space-y-1" {...(props as any)} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 space-y-1" {...(props as any)} />
        ),
        li: ({ node, ...props }) => (
          <li className="ml-1" {...(props as any)} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-200 rounded-lg" {...(props as any)} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-50" {...(props as any)} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="bg-white divide-y divide-gray-200" {...(props as any)} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-gray-50 transition-colors" {...(props as any)} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200" style={{ minWidth: '180px', color: '#000000' }} {...(props as any)} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-6 py-4 text-sm border-b border-gray-100" style={{ minWidth: '300px', color: '#000000' }} {...(props as any)} />
        ),
        div: (props: any) => {
          const { node, children, className, class: classProp, ...restProps } = props
          
          // CRITICAL: Check node.properties FIRST (this is where rehypePreserveDivClass sets it)
          const nodeClass = node?.properties?.className || node?.properties?.class
          const nodeClassStr = nodeClass 
            ? (Array.isArray(nodeClass) ? nodeClass.join(' ') : String(nodeClass))
            : ''
          
          // Also check props (fallback)
          const propsClass = className || classProp
          const propsClassStr = propsClass
            ? (Array.isArray(propsClass) ? propsClass.join(' ') : String(propsClass))
            : ''
          
          // Combine and check
          const combinedClass = nodeClassStr || propsClassStr
          const isFeatureBox = combinedClass && combinedClass.includes('feature-box')
          
          if (isFeatureBox) {
            // Filter out empty children (whitespace-only text nodes, empty elements)
            const filteredChildren = React.Children.toArray(children).filter((child: any) => {
              if (typeof child === 'string') {
                return child.trim().length > 0
              }
              if (React.isValidElement(child)) {
                // Check if element has meaningful content
                const childProps = child.props || {}
                const childChildren = childProps.children
                if (typeof childChildren === 'string') {
                  return childChildren.trim().length > 0
                }
                return true
              }
              return true
            })
            
            // Don't render if no meaningful content
            if (filteredChildren.length === 0) {
              return null
            }
            
            return (
              <div
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4"
                {...restProps}
              >
                {filteredChildren}
              </div>
            )
          }
          
          // Default div rendering - preserve className
          return <div className={combinedClass || className || classProp} {...restProps}>{children}</div>
        }
      }}
    >
      {processedBody}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

