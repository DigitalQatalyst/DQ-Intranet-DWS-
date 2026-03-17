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
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Earth from space, global vision
  'dq-vision-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'vision-and-mission': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
}

// HoV Guiding Values - Creative image mappings that match each value's essence
const hovValueImages: Record<string, string> = {
  // Mantra 01: Self-Development
  'dq-competencies-emotional-intelligence': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Mindfulness, calm, self-awareness - meditation/zen
  'dq-competencies-growth-mindset': 'https://images.unsplash.com/photo-1503676260721-1d00d5eef0e3?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Growth, sprouting, upward movement - plant growth
  
  // Mantra 02: Lean Working
  'dq-competencies-purpose': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Direction, compass, navigation - mountain path with purpose
  'dq-competencies-perceptive': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Vision, insight, awareness - telescope/observatory
  'dq-competencies-proactive': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Action, forward movement, initiative - running/athletic movement
  'dq-competencies-perseverance': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Resilience, strength, determination - climbing/overcoming obstacles
  'dq-competencies-precision': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Focus, detail, accuracy - precision tools/engineering
  
  // Mantra 03: Value Co-Creation
  'dq-competencies-customer': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Connection, service, empathy - helping hands/connection
  'dq-competencies-learning': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Knowledge, books, education - open book/learning
  'dq-competencies-collaboration': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Teamwork, unity, togetherness - team collaboration
  'dq-competencies-responsibility': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Accountability, ownership, reliability - structure/foundation
  'dq-competencies-trust': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3', // Handshake, partnership, integrity - handshake/partnership
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

// Explicit strategy/GHC mappings keyed by slug fragments to ensure card names get the right image
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

const stringHash = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

// Check if guide is HoV (House of Values) related
function isHOVGuide(g: GuideLike): boolean {
  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()
  const subDomain = (g.subDomain || '').toLowerCase()
  
  // Main HoV guides
  const hovSlugs = [
    'dq-hov',
    'dq-competencies',
    'house-of-values',
    'hov'
  ]
  
  if (hovSlugs.some(hovSlug => slug === hovSlug || slug.includes(hovSlug))) {
    return true
  }
  
  // Check for 12 guiding values
  const guidingValueSlugs = [
    'dq-competencies-emotional-intelligence',
    'dq-competencies-growth-mindset',
    'dq-competencies-purpose',
    'dq-competencies-perceptive',
    'dq-competencies-proactive',
    'dq-competencies-perseverance',
    'dq-competencies-precision',
    'dq-competencies-customer',
    'dq-competencies-learning',
    'dq-competencies-collaboration',
    'dq-competencies-responsibility',
    'dq-competencies-trust'
  ]
  
  if (guidingValueSlugs.some(valueSlug => slug.includes(valueSlug))) {
    return true
  }
  
  // Check title for HoV indicators
  if (title.includes('house of values') || title.includes('hov') || 
      title.includes('competencies') && !title.includes('ghc')) {
    return true
  }
  
  // Check sub-domain
  if (subDomain === 'hov' || subDomain === 'competencies') {
    return true
  }
  
  return false
}

// Check if guide is GHC-related (but not HoV)
function isGHCGuide(g: GuideLike): boolean {
  // Exclude HoV guides from GHC
  if (isHOVGuide(g)) {
    return false
  }
  
  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()
  const subDomain = (g.subDomain || '').toLowerCase()
  
  // Check for GHC-specific slugs
  const ghcSlugs = [
    'dq-ghc',
    'dq-vision',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd',
    'ghc',
    'golden-honeycomb'
  ]
  
  if (ghcSlugs.some(ghcSlug => slug.includes(ghcSlug))) {
    return true
  }
  
  // Check title for GHC indicators
  if (title.includes('ghc') || title.includes('golden honeycomb')) {
    return true
  }
  
  // Check sub-domain
  if (subDomain === 'ghc') {
    return true
  }
  
  return false
}

export function getGuideImageUrl(g: GuideLike): string {
  const slug = (g.slug || '').toLowerCase()
  const title = (g.title || '').toLowerCase()
  const isMainGHC = () => {
    return slug === 'dq-ghc' ||
           slug.includes('golden-honeycomb') ||
           title.includes('golden honeycomb') ||
           title.includes('dq ghc')
  }
  
  // Determine guide categories first
  const isBlueprint = (g.domain || '').toLowerCase().includes('blueprint') || 
                      (g.guideType || '').toLowerCase().includes('blueprint')
  const domainLower = (g.domain || '').toLowerCase()
  const guideTypeLower = (g.guideType || '').toLowerCase()
  const isStrategy = domainLower.includes('strategy') ||
                     guideTypeLower.includes('strategy') ||
                     domainLower.includes('ghc') || guideTypeLower.includes('ghc')
  const isTestimonial = (g.domain || '').toLowerCase().includes('testimonial') ||
                        (g.guideType || '').toLowerCase().includes('testimonial')
  
  // Check if this is a guidelines guide - only apply guidelines image if domain is explicitly "Guidelines"
  // This ensures the image only appears in the guidelines tab, not products/blueprints tab
  const isGuidelinesDomain = (g.domain || '').toLowerCase().trim() === 'guidelines' ||
                             (g.domain || '').toLowerCase().trim() === 'guideline'
  
  // Only apply guidelines image if domain is explicitly Guidelines (not for products/blueprints)
  if (isGuidelinesDomain && !isHOVGuide(g) && !isGHCGuide(g) && !isBlueprint && !isStrategy && !isTestimonial) {
    return GUIDELINES_IMAGE
  }

  // HoV: always use local House of Values image, overriding remote hero images
  if (isHOVGuide(g)) {
    return HOV_IMAGE
  }

  // For GHC/Strategy guides: ALWAYS prioritize local assets over Supabase images
  // This ensures consistent branding and prevents database images from overriding local assets
  if (isStrategy || isGHCGuide(g)) {
    // Check for explicit strategy guide mappings first
    for (const [match, imageUrl] of Object.entries(strategyGuideImages)) {
      if (slug.includes(match) || title.includes(match)) {
        return imageUrl
      }
    }
    
    // For main GHC overview, use the overview image
    if (isMainGHC()) {
      return '/images/DQ%20GHC%20Overview%20.png'
    }
    
    // Fallback to first strategy image or honeycomb
    return strategyFallbacks[0] || GHC_IMAGE
  }
  
  // PRIORITY 1: For non-Strategy guides, prioritize heroImageUrl from database if it's a valid URL
  // This ensures database images are used for Guidelines, Products, etc.
  const src = (g.heroImageUrl || '').trim()
  if (src && src.startsWith('http')) {
    return src
  }
  
  // Check for specific guide images (DQ Vision and Mission, etc.)
  for (const [guideSlug, imageUrl] of Object.entries(specificGuideImages)) {
    if (slug === guideSlug || slug.includes(guideSlug) || title.includes(guideSlug)) {
      return imageUrl
    }
  }
  
  // Check if this is an HoV guide - use appropriate HoV images
  if (isHOVGuide(g)) {
    // Check for specific guiding value images
    for (const [valueSlug, imageUrl] of Object.entries(hovValueImages)) {
      if (slug.includes(valueSlug)) {
        return imageUrl
      }
    }
    
    // Main HoV guides (dq-hov, dq-competencies) use the house-of-values image
    if (slug === 'dq-hov' || slug === 'dq-competencies' || slug.includes('house-of-values')) {
      return HOV_IMAGE
    }
    
    // Default HoV image for other HoV-related guides
    return HOV_IMAGE
  }
  
  // Check if this is a GHC guide - use golden honeycomb image
  if (isGHCGuide(g)) {
    // First try explicit mappings so card titles get matching artwork
    for (const [match, imageUrl] of Object.entries(strategyGuideImages)) {
      if (slug.includes(match) || title.includes(match)) {
        return imageUrl
      }
    }
    // Deterministic fallback for GHC: first strategy image or honeycomb
    return strategyFallbacks[0] || GHC_IMAGE
  }
  
  // Check if this is a blueprint/product
  if (isBlueprint) {
    // Check for product-specific metadata and use its image
    const productMeta = getProductMetadata(g.title)
    if (productMeta?.imageUrl) {
      return productMeta.imageUrl
    }
    // Fallback to generic product image
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }

  // Check if this is a strategy guide - use dark abstract images
  if (isStrategy && strategyFallbacks.length) {
    // Prefer explicit strategy mappings (non-GHC cases)
    for (const [match, imageUrl] of Object.entries(strategyGuideImages)) {
      if (slug.includes(match) || title.includes(match)) {
        return imageUrl
      }
    }
    // Deterministic fallback: use first strategy image to avoid random assignment
    return strategyFallbacks[0]
  }
  
  // Fallback to domain-based images
  const byDomain = g.domain ? domainFallbacks[g.domain] : undefined
  if (byDomain) return byDomain
  
  // Fallback to type-based images
  const byType = g.guideType ? typeFallbacks[g.guideType] : undefined
  if (byType) return byType
  
  // Final fallback
  return neutralFallback
}

