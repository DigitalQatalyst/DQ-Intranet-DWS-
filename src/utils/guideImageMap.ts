type GuideLike = {
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  id?: string | null
  slug?: string | null
  title?: string | null
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

const strategyFallbacks: string[] = [
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1552664688-cf412ec27db2?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1521790366321-3e7a44a5bc48?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
]

const neutralFallback = '/image.png'

const stringHash = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getGuideImageUrl(g: GuideLike): string {
  // Check if this is a blueprint
  const isBlueprint = (g.domain || '').toLowerCase().includes('blueprint') || 
                      (g.guideType || '').toLowerCase().includes('blueprint')
  
  if (isBlueprint) {
    // For blueprints, use a unique blueprint-related image
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
  
  // Prioritize heroImageUrl - check if it's a valid URL
  const src = (g.heroImageUrl || '').trim()
  if (src && src.startsWith('http')) {
    return src
  }

  const isStrategy = (g.domain || '').toLowerCase().includes('strategy') || (g.guideType || '').toLowerCase().includes('strategy')
  if (isStrategy && strategyFallbacks.length) {
    const key = (g.slug || g.id || g.title || '').trim()
    const idx = key ? stringHash(key) % strategyFallbacks.length : 0
    return strategyFallbacks[idx]
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

