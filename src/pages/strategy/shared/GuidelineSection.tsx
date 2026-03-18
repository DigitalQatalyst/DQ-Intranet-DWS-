import React from 'react'

interface GuidelineSectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function GuidelineSection({ id, title, children }: GuidelineSectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="relative flex items-center">
        {/* Decorative left border with gradient - matches the image style */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent"></div>
        
        {/* Title with bold styling matching the image */}
        <h2 className="text-3xl md:text-4xl font-bold pl-6 font-inter tracking-tight" style={{ color: '#030E31' }}>
          {title}
        </h2>
      </div>
      
      {/* Content with better spacing */}
      <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed mt-8">
        {children}
      </div>
    </section>
  )
}

