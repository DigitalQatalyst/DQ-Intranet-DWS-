type GuideLike = { heroImageUrl?: string | null; domain?: string | null; guideType?: string | null }

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

const neutralFallback = '/image.png'

export function getGuideImageUrl(g: GuideLike): string {
  const src = (g.heroImageUrl || '').trim()
  if (src) return src
  const byDomain = g.domain ? domainFallbacks[g.domain] : undefined
  if (byDomain) return byDomain
  const byType = g.guideType ? typeFallbacks[g.guideType] : undefined
  if (byType) return byType
  return neutralFallback
}

