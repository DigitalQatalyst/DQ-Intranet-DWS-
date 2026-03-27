import React from 'react'
import GuideCard from './GuideCard'

interface Props {
  items: any[]
  onClickGuide: (g: any) => void
  hideEmptyState?: boolean
  emptyStateTitle?: string
  emptyStateMessage?: string
  imageOverrideUrl?: string
}

export const GuidesGrid: React.FC<Props> = ({ items, onClickGuide, hideEmptyState, emptyStateTitle = 'No guides found', emptyStateMessage = 'Try adjusting your filters or search', imageOverrideUrl }) => {
  if (!items || items.length === 0) {
    if (hideEmptyState) return null
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">{emptyStateTitle}</h3>
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((g, i) => (
        <GuideCard key={g.id || i} guide={g} onClick={() => onClickGuide(g)} imageOverrideUrl={imageOverrideUrl} />
      ))}
    </div>
  )
}

export default GuidesGrid
