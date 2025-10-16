import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const MarkdownRenderer: React.FC<{ body: string; onRendered?: () => void }> = ({ body, onRendered }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkSlug]}
      rehypePlugins={[[rehypeAutolinkHeadings, { behavior: 'append' }], rehypeRaw, rehypeSanitize] as any}
      components={{
        img: ({ node, ...props }) => (
          // Constrain and lazy-load images for performance
          <img loading="lazy" decoding="async" style={{ maxWidth: '100%', height: 'auto' }} {...props as any} />
        )
      }}
    >
      {body}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

