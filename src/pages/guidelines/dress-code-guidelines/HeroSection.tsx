import React from 'react'
import { GlassmorphismHeroSection } from '../../../components/shared/GlassmorphismHeroSection'

interface HeroSectionProps {
  title?: string
  date?: string
  author?: string
}

export function HeroSection({ title = 'DQ Dress Code Guideline', date = 'September 2025', author = 'Version 1.0 • DQ Operations • Digital Qatalyst' }: HeroSectionProps) {
  return (
    <GlassmorphismHeroSection
      title={title}
      date={date}
      author={author}
    />
  )
}


