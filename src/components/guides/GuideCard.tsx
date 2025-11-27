import React from 'react'
import { toTimeBucket } from '../../utils/guides'
import { getGuideImageUrl } from '../../utils/guideImageMap'
import { useNavigate } from 'react-router-dom'
import { supabaseClient } from '../../lib/supabaseClient'

export interface GuideCardProps {
  guide: any
  onClick: () => void
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick }) => {
  const timeBucket = toTimeBucket(guide.estimatedTimeMin)
  const lastUpdated = guide.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const domain = guide.domain as string | undefined
  const navigate = useNavigate()
  const isBlueprint = ((guide.domain || '').toLowerCase().includes('blueprint')) || ((guide.guideType || '').toLowerCase().includes('blueprint'))
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
  const formatLabel = (value?: string | null) => {
    if (!value) return ''
    return value
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }
  const normalizeTag = (value?: string | null) => {
    if (!value) return ''
    const cleaned = value.toLowerCase().replace(/[_-]+/g, ' ').trim()
    return cleaned.endsWith('s') ? cleaned.slice(0, -1) : cleaned
  }
  const domainLabel = formatLabel(domain)
  const isDuplicateTag = normalizeTag(domain) !== '' && normalizeTag(domain) === normalizeTag(guide.guideType)
  // Ensure we're using the correct property name - check both camelCase and snake_case
  const heroImage = guide.heroImageUrl || (guide as any).hero_image_url || null
  const imageUrl = getGuideImageUrl({
    heroImageUrl: heroImage,
    domain: guide.domain,
    guideType: guide.guideType,
    id: guide.id,
    slug: guide.slug || guide.id,
    title: guide.title,
  })
  const isTestimonial = ((guide.domain || '').toLowerCase().includes('testimonial')) || ((guide.guideType || '').toLowerCase().includes('testimonial'))
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If image fails to load, try to use a fallback
    const target = e.currentTarget
    if (target.src && !target.src.includes('/image.png')) {
      // Try fallback image
      target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" onClick={onClick}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={guide.title} 
          className="w-full h-40 object-cover rounded mb-3" 
          loading="lazy" 
          decoding="async" 
          width={640} 
          height={180}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      )}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[40px]" title={guide.title}>{guide.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-3">{guide.summary}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {domain && (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
            {domainLabel}
          </span>
        )}
        {guide.guideType && !isTestimonial && !isDuplicateTag && (
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
      </div>
      <div className="flex items-center text-xs text-gray-500 gap-3 mb-3">
        {timeBucket && <span>{timeBucket}</span>}
        {lastUpdated && <span>{lastUpdated}</span>}
      </div>
      {(guide.authorName || guide.authorOrg) && (
        <div className="text-xs text-gray-600 mb-3">
          <span
            className="truncate"
            title={`${guide.authorName || ''}${guide.authorOrg ? ' • ' + guide.authorOrg : ''}`}
          >
            {guide.authorName || ''}
            {guide.authorOrg ? ` • ${guide.authorOrg}` : ''}
          </span>
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
            className="w-full inline-flex items-center justify-center rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold px-4 py-2 transition-all hover:bg-[var(--guidelines-primary-solid-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
            aria-label="View details"
          >
            View Details
        </button>
      </div>
    </div>
  )
}

export default GuideCard
