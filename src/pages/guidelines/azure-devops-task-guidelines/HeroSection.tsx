import React from 'react'

export function HeroSection() {
  return (
    <div className="relative w-full h-[325px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/guidelines-content.PNG)',
        }}
      >
        <div className="absolute inset-0 bg-[#030E31] bg-opacity-80"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            Guideline
          </span>

          <div className="text-sm text-white/90 mb-6 font-inter">
            December 19, 2025
          </div>

          <h1 className="text-[40px] font-bold mb-8 leading-tight font-inter">
            Azure DevOps Task | Step by Step Guidelines
          </h1>

          <div className="flex items-center gap-3 text-sm text-white/90 font-inter">
            <span>DQ Operations • Digital Qatalyst</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
    </div>
  )
}


