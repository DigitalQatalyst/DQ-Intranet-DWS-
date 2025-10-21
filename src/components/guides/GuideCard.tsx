import React from 'react'
import { Calendar, Clock, User, Building2 } from 'lucide-react'
import { toTimeBucket } from '../../utils/guides'

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
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      {guide.heroImageUrl && (
        <img src={guide.heroImageUrl} alt={guide.title} className="w-full h-40 object-cover rounded mb-3" loading="lazy" />
      )}
      <h3 className="font-semibold text-gray-900 mb-1 truncate" title={guide.title}>{guide.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{guide.summary}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {guide.guideType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{guide.guideType}</span>}
        {(guide.topics || []).slice(0,1).map((t: any, i: number) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{t.name || t}</span>
        ))}
      </div>
      <div className="flex items-center text-xs text-gray-500 gap-3 mb-3">
        {guide.skillLevel && <span className="flex items-center"><User size={14} className="mr-1" />{guide.skillLevel}</span>}
        {timeBucket && <span className="flex items-center"><Clock size={14} className="mr-1" />{timeBucket}</span>}
        {lastUpdated && <span className="flex items-center"><Calendar size={14} className="mr-1" />{lastUpdated}</span>}
      </div>
      {(guide.authorName || guide.authorOrg) && (
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <Building2 size={14} className="mr-1" />
          <span className="truncate" title={`${guide.authorName || ''}${guide.authorOrg ? ' • ' + guide.authorOrg : ''}`}>{guide.authorName || ''}{guide.authorOrg ? ` • ${guide.authorOrg}` : ''}</span>
        </div>
      )}
      <button className="w-full px-3 py-2 text-white font-medium rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600">
        {cta}
      </button>
    </div>
  )
}

export default GuideCard

