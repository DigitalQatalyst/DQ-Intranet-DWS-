import React from 'react'
import { GlossaryTerm } from '../../pages/guides/glossaryData'
import { GHC_DIMENSIONS, SIX_XD_DIMENSIONS, TERM_ORIGINS } from '../../pages/guides/glossaryFilters'
import { ArrowRight } from 'lucide-react'

interface Props {
  items: GlossaryTerm[]
  onClickTerm: (term: GlossaryTerm) => void
  hideEmptyState?: boolean
}

interface GlossaryCardProps {
  term: GlossaryTerm
  onClick: () => void
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ term, onClick }) => {
  // Get Knowledge System badge
  const knowledgeSystemLabel = term.knowledgeSystem === 'ghc' ? 'GHC' : '6xD'
  const knowledgeSystemColor = term.knowledgeSystem === 'ghc' 
    ? 'bg-purple-100 text-purple-700 border-purple-200' 
    : 'bg-blue-100 text-blue-700 border-blue-200'
  
  // Get Dimension label
  const dimensionLabel = term.knowledgeSystem === 'ghc' && term.ghcDimension
    ? GHC_DIMENSIONS.find(d => d.id === term.ghcDimension)?.name
    : term.knowledgeSystem === '6xd' && term.sixXdDimension
    ? SIX_XD_DIMENSIONS.find(d => d.id === term.sixXdDimension)?.name
    : null
  
  // Get Term Origin label
  const termOriginLabel = term.termOrigin
    ? TERM_ORIGINS.find(o => o.id === term.termOrigin)?.name
    : null

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all group flex flex-col h-full min-h-[280px]"
    >
      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {/* GHC or 6xD Badge */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${knowledgeSystemColor}`}>
          {knowledgeSystemLabel}
        </span>
        {/* Dimension Badge */}
        {dimensionLabel && (
          <span className="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {dimensionLabel}
          </span>
        )}
        {/* Term Origin Badge */}
        {termOriginLabel && (
          <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
            {termOriginLabel}
          </span>
        )}
      </div>

      {/* Term Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--guidelines-primary)] transition-colors">
        {term.term}
      </h3>

      {/* Short Intro / Story Line */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
        {term.shortIntro || term.explanation}
      </p>

      {/* CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="mt-auto w-full bg-[#162862] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3568] transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>View term</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export const GlossaryGrid: React.FC<Props> = ({ items, onClickTerm, hideEmptyState }) => {
  if (!items || items.length === 0) {
    if (hideEmptyState) return null
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No glossary terms found</h3>
        <p className="text-gray-500">Try adjusting your filters or search</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((term) => (
        <GlossaryCard key={term.id} term={term} onClick={() => onClickTerm(term)} />
      ))}
    </div>
  )
}

export default GlossaryGrid

