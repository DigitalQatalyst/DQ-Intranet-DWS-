import React from 'react'

interface VisionMissionHeroSectionProps {
  lastUpdatedAt?: string | null
}

export function VisionMissionHeroSection({ lastUpdatedAt }: VisionMissionHeroSectionProps) {
  const formattedDate = lastUpdatedAt 
    ? new Date(lastUpdatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'November 28, 2025'

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Dark Navy Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-[#030E31] bg-opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-4xl">
          {/* Pill Tag */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            Strategy
          </span>

          {/* Date */}
          <div className="text-sm text-white/90 mb-6 font-inter">
            {formattedDate}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-inter">
            DQ Vision and Mission
          </h1>

          {/* Meta Row */}
          <div className="flex items-center gap-3 text-sm text-white/90 font-inter">
            <span>DQ Leadership • Digital Qatalyst</span>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
    </div>
  )
}

