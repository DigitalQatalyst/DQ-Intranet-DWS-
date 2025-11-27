import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const MarkdownRenderer: React.FC<{ body: string; onRendered?: () => void }> = ({ body, onRendered }) => {
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
      rehypePlugins={[[rehypeAutolinkHeadings, { behavior: 'append' }], rehypeRaw, rehypeStripListIcons as any, rehypeSanitize] as any}
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
        )
      }}
    >
      {processedBody}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

