import { getProductMetadata } from './productMetadata'

type GuideLike = {
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  id?: string | null
  slug?: string | null
  title?: string | null
  subDomain?: string | null
}

const domainFallbacks: Record<string, string> = {
  'Digital Workspace': '/image.png',
  'Digital Core Business': '/image.png',
  'Digital Backoffice': '/image.png',
  'Digital Enablement': '/image.png',
}

const typeFallbacks: Record<string, string> = {
  'Policy': '/image.png',
  'SOP': '/image.png',
  'Process': '/image.png',
  'Checklist': '/image.png',
  'Template': '/image.png',
  'Best Practice': '/image.png',
}

// GHC image - golden honeycomb with bees
const GHC_IMAGE = '/images/honeycomb.png'

// HoV (House of Values) main image
const HOV_IMAGE = '/images/House%20of%20Values.png'

// Guidelines image
const GUIDELINES_IMAGE = '/images/guidelines.PNG'

// Specific guide images - Creative mappings for key guides
const specificGuideImages: Record<string, string> = {
  // DQ Vision and Mission - Inspiring vision, global perspective, purpose
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-vision-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'vision-and-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
}

// HoV Guiding Values - Creative image mappings that match each value's essence
const hovValueImages: Record<string, string> = {
  // Mantra 01: Self-Development
  'dq-competencies-emotional-intelligence': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-growth-mindset': 'https://images.unsplash.com/photo-1503676260721-1d00d5eef0e3?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Mantra 02: Lean Working
  'dq-competencies-purpose': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-perceptive': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-proactive': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-perseverance': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-precision': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Mantra 03: Value Co-Creation
  'dq-competencies-customer': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-learning': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-collaboration': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-responsibility': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies-trust': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
}

// Strategy images - use local GHC/strategy assets from public/images
const strategyFallbacks: string[] = [
  '/images/DQ%20GHC%20Overview%20(6).png',
  '/images/DQ%20GHC%20Overview%20.png',
  '/images/Vision.png',
  '/images/Persona.png',
  '/images/Agile%206xD.png',
  '/images/Agile%20TMS.png',
  '/images/Agile%20SoS.png',
  '/images/Agile%20Flows.png',
  '/images/House%20of%20Values.png',
]

// Explicit strategy/GHC mappings keyed by slug fragments
const strategyGuideImages: Record<string, string> = {
  'dq-agile-6xd': '/images/Agile%206xD.png',
  'agile-6xd': '/images/Agile%206xD.png',
  'dq-agile-flows': '/images/Agile%20Flows.png',
  'agile-flows': '/images/Agile%20Flows.png',
  'dq-agile-sos': '/images/Agile%20SoS.png',
  'agile-sos': '/images/Agile%20SoS.png',
  'dq-agile-tms': '/images/Agile%20TMS.png',
  'agile-tms': '/images/Agile%20TMS.png',
  'dq-ghc': '/images/DQ%20GHC%20Overview%20.png',
  'ghc-overview': '/images/DQ%20GHC%20Overview%20.png',
  'golden-honeycomb': '/images/DQ%20GHC%20Overview%20.png',
  'golden honeycomb': '/images/DQ%20GHC%20Overview%20.png',
  'dq-golden-honeycomb': '/images/DQ%20GHC%20Overview%20.png',
  'dq golden honeycomb': '/images/DQ%20GHC%20Overview%20.png',
  'dq-vision': '/images/Vision.png',
  'vision': '/images/Vision.png',
  'dq-persona': '/images/Persona.png',
  'persona': '/images/Persona.png',
  'dq-hov': '/images/House%20of%20Values.png',
  'hov': '/images/House%20of%20Values.png'
}

const neutralFallback = '/image.png'

// --- Module-level helpers ---

/** Search a slug/title lookup map, returning the first matching URL or null. */
function findInMap(map: Record<string, string>, slug: string, title: string): string | null {
  for (const [match, url] of Object.entries(map)) {
    if (slug.includes(match) || title.includes(match)) return url
  }
  return null
}

/** True when the guide is the top-level GHC overview (not a sub-framework). */
function isMainGHCGuide(slug: string, title: string): boolean {
  return slug === 'dq-ghc'
    || slug.includes('golden-honeycomb')
    || title.includes('golden honeycomb')
    || title.includes('dq ghc')
}

/** True when the guide belongs to the Guidelines domain only (not blueprint/strategy/HoV/GHC). */
function isGuidelinesOnlyGuide(
  g: GuideLike,
  isGuidelinesDomain: boolean,
  isBlueprint: boolean,
  isStrategy: boolean,
  isTestimonial: boolean
): boolean {
  return isGuidelinesDomain && !isHOVGuide(g) && !isGHCGuide(g) && !isBlueprint && !isStrategy && !isTestimonial
}

/** Return the image for a blueprint/product guide. */
function getBlueprintImage(title: string | null | undefined): string {
  const productMeta = getProductMetadata(title)
  if (productMeta?.imageUrl) return productMeta.imageUrl
  return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}

/** Return a domain-then-type fallback image, or the neutral default. */
function getTypeFallbackImage(g: GuideLike): string {
  const byDomain = g.domain ? domainFallbacks[g.domain] : undefined
  if (byDomain) return byDomain
  const byType = g.guideType ? typeFallbacks[g.guideType] : undefined
  return byType ?? neutralFallback
}

// Check if guide is HoV (House of Values) related
function isHOVGuide(g: GuideLike): boolean {
  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()
  const subDomain = (g.subDomain || '').toLowerCase()

  const hovSlugs = ['dq-hov', 'dq-competencies', 'house-of-values', 'hov']
  if (hovSlugs.some(hovSlug => slug === hovSlug || slug.includes(hovSlug))) return true

  const guidingValueSlugs = [
    'dq-competencies-emotional-intelligence', 'dq-competencies-growth-mindset',
    'dq-competencies-purpose', 'dq-competencies-perceptive', 'dq-competencies-proactive',
    'dq-competencies-perseverance', 'dq-competencies-precision', 'dq-competencies-customer',
    'dq-competencies-learning', 'dq-competencies-collaboration',
    'dq-competencies-responsibility', 'dq-competencies-trust',
  ]
  if (guidingValueSlugs.some(valueSlug => slug.includes(valueSlug))) return true
  if (title.includes('house of values') || title.includes('hov')
    || (title.includes('competencies') && !title.includes('ghc'))) return true
  if (subDomain === 'hov' || subDomain === 'competencies') return true
  return false
}

// Check if guide is GHC-related (but not HoV)
function isGHCGuide(g: GuideLike): boolean {
  if (isHOVGuide(g)) return false

  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()
  const subDomain = (g.subDomain || '').toLowerCase()

  const ghcSlugs = [
    'dq-ghc', 'dq-vision', 'dq-persona', 'dq-agile-tms',
    'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd', 'ghc', 'golden-honeycomb',
  ]
  if (ghcSlugs.some(ghcSlug => slug.includes(ghcSlug))) return true
  if (title.includes('ghc') || title.includes('golden honeycomb')) return true
  if (subDomain === 'ghc') return true
  return false
}

export function getGuideImageUrl(g: GuideLike): string {
  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()

  const isBlueprint = (g.domain || '').toLowerCase().includes('blueprint')
    || (g.guideType || '').toLowerCase().includes('blueprint')
  const domainLower = (g.domain || '').toLowerCase()
  const guideTypeLower = (g.guideType || '').toLowerCase()
  const isStrategy = domainLower.includes('strategy') || guideTypeLower.includes('strategy')
    || domainLower.includes('ghc') || guideTypeLower.includes('ghc')
  const isTestimonial = (g.domain || '').toLowerCase().includes('testimonial')
    || (g.guideType || '').toLowerCase().includes('testimonial')
  const isGuidelinesDomain = (g.domain || '').toLowerCase().trim() === 'guidelines'
    || (g.domain || '').toLowerCase().trim() === 'guideline'

  if (isGuidelinesOnlyGuide(g, isGuidelinesDomain, isBlueprint, isStrategy, isTestimonial)) return GUIDELINES_IMAGE
  if (isHOVGuide(g)) return HOV_IMAGE
  if (isStrategy || isGHCGuide(g)) {
    const mapped = findInMap(strategyGuideImages, slug, title)
    if (mapped) return mapped
    if (isMainGHCGuide(slug, title)) return '/images/DQ%20GHC%20Overview%20.png'
    return strategyFallbacks[0] ?? GHC_IMAGE
  }

  const src = (g.heroImageUrl || '').trim()
  if (src.startsWith('http')) return src

  const specificImg = findInMap(specificGuideImages, slug, title)
  if (specificImg) return specificImg
  if (isBlueprint) return getBlueprintImage(g.title)

  return getTypeFallbackImage(g)
}
