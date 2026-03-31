import React from 'react'
import { GlassmorphismHeroSection } from '../../../components/shared/GlassmorphismHeroSection'

interface HeroSectionProps {
  readonly title?: string
}

export function HeroSection({ title = 'DQ Associate Owned Asset Guidelines' }: HeroSectionProps) {
  return (
    <GlassmorphismHeroSection
      title={title}
    />
  )
}


