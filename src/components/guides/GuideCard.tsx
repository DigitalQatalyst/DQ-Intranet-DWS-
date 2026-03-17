import React from 'react'
import { toTimeBucket } from '../../utils/guides'
import { getGuideImageUrl } from '../../utils/guideImageMap'
import { useNavigate } from 'react-router-dom'
import { supabaseClient } from '../../lib/supabaseClient'
import { getProductMetadata } from '../../utils/productMetadata'

function formatAuthorText(authorName?: string, authorOrg?: string): string | null {
  const text = `${authorName || ''}${authorOrg ? ` - ${authorOrg}` : ''}`.trim()
  return (text.toLowerCase() === 'bb' || text.length <= 2) ? null : text
}

function formatLabel(value?: string | null): string {
  if (!value) return ''
  return value
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizeTag(value?: string | null): string {
  if (!value) return ''
  const cleaned = value.toLowerCase().replace(/[_-]+/g, ' ').trim()
  return cleaned.endsWith('s') ? cleaned.slice(0, -1) : cleaned
}

const GHC_TITLE_BY_SLUG: Record<string, string> = {
  'dq-ghc': 'GHC Overview',
  'dq-vision': 'GHC 1 - Vision (Purpose)',
  'dq-hov': 'GHC 2 - House of Values (HoV)',
  'dq-persona': 'GHC 3 - Persona',
  'dq-agile-tms': 'GHC 4 - Agile TMS',
  'dq-agile-sos': 'GHC 5 - Agile SoS',
  'dq-agile-flows': 'GHC 6 - Agile Flows',
  'dq-agile-6xd': 'GHC 7 - Agile 6xD (Products)',
}

const HOV_ORDER = [
  'dq-competencies-emotional-intelligence', 'dq-competencies-growth-mindset',
  'dq-competencies-purpose', 'dq-competencies-perceptive', 'dq-competencies-proactive',
  'dq-competencies-perseverance', 'dq-competencies-precision', 'dq-competencies-customer',
  'dq-competencies-learning', 'dq-competencies-collaboration',
  'dq-competencies-responsibility', 'dq-competencies-trust',
]

const KNOWN_PRODUCT_NAMES = [
  'Digital Workspace System (DWS)',
  'Digital Transformation Management Academy (DTMA)',
  'Digital Business Platforms (DBP Assists)',
  'Digital Transformation Management Platform (DTMP)',
  'DTO4T – Digital Transformation Operating Framework',
  'TMaaS – Transformation Management as a Service',
]

function hovTitleFromSlug(s: string): string | null {
  const idx = HOV_ORDER.indexOf(s)
  if (idx === -1) return null
  const label = s.replace('dq-competencies-', '').replace(/-/g, ' ')
  const nice = label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return `HoV ${idx + 1} - ${nice}`
}

function resolveGhcTitle(rawTitle: string, slug: string): string {
  if (GHC_TITLE_BY_SLUG[slug]) return GHC_TITLE_BY_SLUG[slug]
  const hovTitle = hovTitleFromSlug(slug)
  if (hovTitle) return hovTitle
  if (rawTitle.toLowerCase().includes('golden honeycomb')) return 'GHC Overview'
  const match = rawTitle.match(/^GHC\s+Competency\s+(\d+):\s*(.+)/i)
  if (match) return `GHC ${match[1]} - ${match[2].trim()}`
  return rawTitle
}

function resolveDwsTitle(title: string, cleanedTitle: string, productMetadata: any): string | null {
  const lower = title.toLowerCase()
  if (!lower.includes('dws') || lower.includes('digital workspace system')) return null
  if (productMetadata && (lower.includes('dws') || lower.includes('digital workspace'))) return 'Digital Workspace System (DWS)'
  if (cleanedTitle.toLowerCase() === 'dws') return 'Digital Workspace System (DWS)'
  if (cleanedTitle.toLowerCase().startsWith('dws')) return cleanedTitle.replace(/^dws\s*/i, 'Digital Workspace System (DWS)')
  return null
}

function matchKnownProduct(productMetadata: any): string | null {
  if (!productMetadata) return null
  for (const productName of KNOWN_PRODUCT_NAMES) {
    const meta = getProductMetadata(productName)
    if (meta && meta.productType === productMetadata.productType && meta.productStage === productMetadata.productStage) {
      return productName
    }
  }
  return null
}

function resolveBlueprintTitle(title: string, hasStaticProps: boolean, productMetadata: any): string {
  if (hasStaticProps) return title
  const cleanedTitle = title.replace(/\s*Blueprint\s*/gi, '').trim()
  const dwsTitle = resolveDwsTitle(title, cleanedTitle, productMetadata)
  if (dwsTitle) return dwsTitle
  const finalTitle = cleanedTitle.replace(/\s*blueprint\s*/gi, '').trim()
  const knownProduct = matchKnownProduct(productMetadata)
  if (knownProduct) return knownProduct
  return (!finalTitle || finalTitle.toLowerCase() === 'blueprint') ? 'Product' : finalTitle
}

export interface GuideCardProps {
  guide: any
  onClick: () => void
  imageOverrideUrl?: string
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick, imageOverrideUrl }) => {
  const timeBucket = toTimeBucket(guide.estimatedTimeMin)
  const lastUpdated = guide.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const domain = guide.domain as string | undefined
  const navigate = useNavigate()
  // Check if this is a product (blueprint or static product)
  const isBlueprint = ((guide.domain || '').toLowerCase().includes('blueprint')) || 
                      ((guide.guideType || '').toLowerCase().includes('blueprint')) ||
                      (guide.domain === 'Product') ||
                      (guide.productType && guide.productStage)
  const handleViewGuideline = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const { data, error } = await supabaseClient
        .from('guides')
        .select('slug')
        .eq('status', 'Approved')
        .ilike('domain', 'guidelines')
        .eq('title', guide.title)
        .maybeSingle()
      if (!error && data?.slug) {
        navigate(`/marketplace/guides/${encodeURIComponent(data.slug)}`, { state: { fromBlueprint: true } })
        return
      }
    } catch (_) {}
    // Fallback to Guidelines tab search
    navigate(`/marketplace/guides?tab=guidelines&q=${encodeURIComponent(guide.title)}`)
  }
  // Determine the badge label based on framework for Strategy guides
  const getBadgeLabel = (): string => {
    if (isBlueprint) return 'Product'
    if (domain?.toLowerCase() === 'strategy') {
      const slug = (guide.slug || '').toLowerCase()
      const subDomain = (guide.subDomain || (guide as any).sub_domain || '').toLowerCase()
      
      // Check for HoV framework first (more specific)
      // HoV includes: dq-hov and all dq-competencies-* guides
      if (slug === 'dq-hov' || slug.includes('competencies') || subDomain.includes('hov') || subDomain.includes('competencies')) {
        return 'GHC'
      }
      
      // Check for GHC framework (but not overview)
      // GHC includes: dq-vision, dq-persona, dq-agile-* (excluding overview)
      if (slug === 'dq-vision' || 
          slug === 'dq-persona' || 
          slug.includes('agile-') ||
          (subDomain.includes('ghc') && !subDomain.includes('competencies'))) {
        return 'GHC'
      }
      
      // Default to Strategy if no framework match
      return formatLabel(domain)
    }
    return formatLabel(domain)
  }
  
  const domainLabel = getBadgeLabel()
  const isDuplicateTag = normalizeTag(domain) !== '' && normalizeTag(domain) === normalizeTag(guide.guideType)
  
  // Get product metadata if this is a product
  // Use direct productType/productStage if available (from static products), otherwise look up by title
  const productMetadata = isBlueprint ? (
    (guide.productType && guide.productStage) ? {
      productType: guide.productType,
      productStage: guide.productStage,
      description: guide.summary || '',
      imageUrl: guide.heroImageUrl || ''
    } : getProductMetadata(guide.title)
  ) : null
  
  // Transform title to remove "Blueprint" and use proper product naming
  const getDisplayTitle = (): string => {
    if (!isBlueprint) return resolveGhcTitle(guide.title || '', (guide.slug || '').toLowerCase())
    return resolveBlueprintTitle(guide.title || '', !!(guide.productType && guide.productStage), productMetadata)
  }
  
  const displayTitle = getDisplayTitle()
  
  // Ensure we're using the correct property name - check both camelCase and snake_case
  const heroImage = guide.heroImageUrl || (guide as any).hero_image_url || null
  const subDomain = guide.subDomain || (guide as any).sub_domain || null

  // For products/blueprints, prioritize the product image from metadata (e.g. TMaaS card image)
  const defaultImageUrl = isBlueprint && productMetadata?.imageUrl
    ? productMetadata.imageUrl
    : getGuideImageUrl({
        heroImageUrl: heroImage,
        domain: guide.domain,
        guideType: guide.guideType,
        subDomain: subDomain,
        id: guide.id,
        slug: guide.slug || guide.id,
        title: guide.title,
      })

  const imageUrl = imageOverrideUrl || defaultImageUrl
  const isTestimonial = ((guide.domain || '').toLowerCase().includes('testimonial')) || ((guide.guideType || '').toLowerCase().includes('testimonial'))
  const isGhcOverview = (guide.slug || '').toLowerCase() === 'dq-ghc'
  
  // Use product description if available, otherwise use summary
  const displayDescription = productMetadata?.description || guide.summary || ''
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If image fails to load, try to use a fallback
    const target = e.currentTarget
    if (target.src && !target.src.includes('/image.png')) {
      // Try fallback image
      target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  }
  
  // Check if guide is in Draft status
  const isDraft = guide.status === 'Draft'
  const isPublished = guide.status === 'Published' || guide.status === 'Approved'
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer h-[400px] flex flex-col" onClick={isDraft ? undefined : onClick}>
      {imageUrl && (
        <div className="rounded-lg overflow-hidden mb-2.5 bg-slate-50 flex-shrink-0" style={{ height: '160px', minHeight: '160px', maxHeight: '160px' }}>
          <img 
            src={imageUrl} 
            alt={displayTitle} 
            className="w-full h-full object-cover"
            loading="lazy" 
            decoding="async" 
            width={640} 
            height={160}
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        </div>
      )}
      <h3 className="font-semibold text-gray-900 mb-2 flex-shrink-0" style={{ 
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '44px',
        maxHeight: '44px',
        lineHeight: '1.375rem'
      }} title={displayTitle}>{displayTitle}</h3>
      <p className="text-sm text-gray-600 mb-2.5 flex-shrink-0" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '36px',
        maxHeight: '36px',
        lineHeight: '1.125rem'
      }}>{displayDescription}</p>
      <div className="flex flex-wrap gap-2 mb-2 flex-shrink-0">
        {!isBlueprint && (
          <>
            {domain && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                {domainLabel}
              </span>
            )}
            {guide.guideType && !isTestimonial && !isDuplicateTag && !((guide.slug || '').toLowerCase() === 'dq-ghc') && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                {formatLabel(guide.guideType)}
              </span>
            )}
            {isTestimonial && guide.unit && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                {formatLabel(guide.unit)}
              </span>
            )}
            {isTestimonial && guide.location && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                {formatLabel(guide.location)}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex items-center text-xs text-gray-500 gap-3 mb-2.5 flex-shrink-0">
        {timeBucket && <span>{timeBucket}</span>}
        {lastUpdated && <span>{lastUpdated}</span>}
      </div>
      {/* Show author info only when provided and not a product or GHC/Strategy guide or Guidelines */}
      {(!isBlueprint && !isGhcOverview && domain?.toLowerCase() !== 'strategy' && domain?.toLowerCase() !== 'guidelines' && (guide.authorName || guide.authorOrg)) && (
        <div className="text-xs text-gray-600 mb-2.5 flex-shrink-0">
          <span
            className="truncate"
            title={`${guide.authorName || ""}${guide.authorOrg ? " - " + guide.authorOrg : ""}`}
          >
            {formatAuthorText(guide.authorName, guide.authorOrg)}
          </span>
        </div>
      )}
      {/* Spacer to push button to bottom */}
      <div className="pt-2 mt-auto border-t border-gray-100 flex-shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (!isDraft && !isBlueprint) {
              onClick()
            }
          }}
          disabled={isDraft || isBlueprint}
          className={`w-full inline-flex items-center justify-center rounded-full text-sm font-semibold px-4 py-2 transition-all focus:outline-none focus:ring-2 ${
            isDraft || isBlueprint
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#030E31] text-white hover:bg-[#020A28] focus:ring-[#030E31]'
          }`}
          aria-label={isDraft || isBlueprint ? 'Coming soon' : 'Read more'}
        >
          {isDraft || isBlueprint ? 'Coming Soon' : 'Read More'}
        </button>
      </div>
    </div>
  )
}

export default GuideCard
