type GuideLike = { heroImageUrl?: string | null; domain?: string | null; guideType?: string | null }

const domainFallbacks: Record<string, string> = {
  'Digital Workspace': '/image.png',
  'Digital Core Business': '/image.png',
  'Digital Backoffice': '/image.png',
  'Digital Enablement': '/image.png',
  'Blueprints': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

const typeFallbacks: Record<string, string> = {
  'Policy': '/image.png',
  'SOP': '/image.png',
  'Process': '/image.png',
  'Checklist': '/image.png',
  'Template': '/image.png',
  'Best Practice': '/image.png',
  'Blueprint': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

