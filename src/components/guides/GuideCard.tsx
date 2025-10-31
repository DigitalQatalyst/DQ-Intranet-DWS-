import React from 'react'
import { Calendar, Clock, Building2 } from 'lucide-react'
import { toTimeBucket } from '../../utils/guides'
import { getGuideImageUrl } from '../../utils/guideImageMap'

export interface GuideCardProps {
  guide: any
  onClick: () => void
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick }) => {
  const timeBucket = toTimeBucket(guide.estimatedTimeMin)
  const hasTemplate = Array.isArray(guide.templates) && guide.templates.length > 0
  const hasInteractive = Array.isArray(guide.templates) && guide.templates.some((t: any) => (t.kind || '').toLowerCase() === 'interactive')
  const cta = hasInteractive ? 'Open Tool' : hasTemplate ? 'Use Template' : 'View Guide'
  const lastUpdated = guide.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const domain = guide.domain as string | undefined
  const domainStyles = (d?: string) => {
    const normalized = (d || '').toLowerCase()
    switch (normalized) {
      case 'digital workspace': return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'digital core business': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'digital backoffice': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'digital enablement': return 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100';
      case 'strategy': return 'bg-sky-50 text-sky-700 border border-sky-100';
      case 'guidelines': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'blueprints': return 'bg-cyan-50 text-cyan-700 border border-cyan-100';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
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
  const domainLabel = formatLabel(domain)
  const imageUrl = getGuideImageUrl({ heroImageUrl: guide.heroImageUrl, domain: guide.domain, guideType: guide.guideType })
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" onClick={onClick}>
      {imageUrl && (
        <img src={imageUrl} alt={guide.title} className="w-full h-40 object-cover rounded mb-3" loading="lazy" decoding="async" width={640} height={180} />
      )}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[40px]" title={guide.title}>{guide.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-3">{guide.summary}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {domain && <span className={`px-2 py-0.5 text-xs rounded-full ${domainStyles(domain)}`}>{domainLabel}</span>}
        {guide.guideType && <span className="px-2 py-0.5 text-[var(--guidelines-primary)] bg-[var(--guidelines-primary-surface)] text-xs rounded-full">{formatLabel(guide.guideType)}</span>}
      </div>
      <div className="flex items-center text-xs text-gray-500 gap-3 mb-3">
        {timeBucket && <span className="flex items-center"><Clock size={14} className="mr-1" />{timeBucket}</span>}
        {lastUpdated && <span className="flex items-center"><Calendar size={14} className="mr-1" />{lastUpdated}</span>}
      </div>
      {(guide.authorName || guide.authorOrg) && (
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <Building2 size={14} className="mr-1" />
          <span className="truncate" title={`${guide.authorName || ''}${guide.authorOrg ? ' • ' + guide.authorOrg : ''}`}>{guide.authorName || ''}{guide.authorOrg ? ` • ${guide.authorOrg}` : ''}</span>
        </div>
      )}
      <div className="mt-auto">
        <button className="w-full px-4 py-2 text-sm font-bold text-white bg-[var(--guidelines-primary-solid)] hover:bg-[var(--guidelines-primary-solid-hover)] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]">
          {cta}
        </button>
      </div>
    </div>
  )
}

export default GuideCard
