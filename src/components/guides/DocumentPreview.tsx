// CODEx: Changes Made
// - New DocumentPreview component to render a partial first page preview for PDFs via <embed>
// - Centered overlay "Open Document" button with backdrop blur and soft dim
// - Lazy-render using IntersectionObserver; skeleton fallback and error messaging
// - Telemetry delegated to parent via onOpen; guards for missing documentUrl

import React, { useEffect, useRef, useState } from 'react'

export const DocumentPreview: React.FC<{
  documentUrl?: string | null
  title?: string
  onOpen?: () => void
  height?: number
  onUnavailable?: () => void
}> = ({ documentUrl, title, onOpen, height, onUnavailable }) => {
  const [visible, setVisible] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const h = height ?? 460

  useEffect(() => {
    if (!wrapRef.current) return
    const el = wrapRef.current
    const io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (e?.isIntersecting) setVisible(true)
    }, { root: null, rootMargin: '100px', threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    setUnavailable(false)
  }, [documentUrl])

  useEffect(() => {
    if (unavailable) onUnavailable?.()
  }, [unavailable, onUnavailable])

  if (!documentUrl || unavailable) return null

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow relative overflow-hidden" aria-label="Document preview">
      <div ref={wrapRef} className="relative" style={{ height: h }}>
        {/* Skeleton */}
        {!visible && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden="true" />
        )}
        {/* Preview */}
        {visible && !unavailable && (
          <div className="absolute inset-0 overflow-hidden">
            <embed
              src={`${documentUrl}#view=FitH`}
              type="application/pdf"
              className="w-full h-[150%] -mt-16 select-none pointer-events-none"
              onError={() => setUnavailable(true)}
            />
            {/* gradient mask to softly fade the bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/70 to-transparent" />
          </div>
        )}

        {/* Overlay action */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onOpen}
            className="px-5 py-2.5 rounded-2xl bg-white/75 backdrop-blur-md shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)] text-gray-900"
            aria-label={`Open document${title ? `: ${title}` : ''}`}
          >
            Open Document
          </button>
        </div>
      </div>
    </section>
  )
}

export default DocumentPreview
