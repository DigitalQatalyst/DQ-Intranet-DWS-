import React from 'react'
import { GlassmorphismHeroSection } from '../../../components/shared/GlassmorphismHeroSection'

interface HeroSectionProps {
  title?: string
  date?: string
  author?: string
}

export function HeroSection({ title = 'DQ Work From Home (WFH) Guidelines', date = 'December 19, 2025', author = 'DQ Operations • Digital Qatalyst' }: HeroSectionProps) {
  return (
    <GlassmorphismHeroSection
      title={title}
      date={date}
      author={author}
    />
  )
}


