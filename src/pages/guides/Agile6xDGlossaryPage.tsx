import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { HomeIcon, ChevronRightIcon, ArrowRight, BookOpen } from 'lucide-react'
import { useAuth } from '../../components/Header/context/AuthContext'
import { agile6xdTerms, AGILE_LAYERS, agileLayerColors } from './agile6xdGlossaryData'
import type { GlossaryTerm } from './glossaryData'

const Agile6xDGlossaryPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['all'])
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const lettersWithTerms = useMemo(
    () => Array.from(new Set(agile6xdTerms.map(t => t.term.charAt(0).toUpperCase()))).sort((a, b) => a.localeCompare(b)),
    []
  )

  const filteredTerms = useMemo(() => {
    return agile6xdTerms.filter(term => {
      const layerMatch =
        selectedLayers.includes('all') ||
        selectedLayers.some(layer => term.categories.includes(layer))

      const letterMatch =
        selectedLetter === null || term.term.charAt(0).toUpperCase() === selectedLetter

      const searchMatch =
        searchQuery === '' ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return layerMatch && letterMatch && searchMatch
    })
  }, [selectedLayers, selectedLetter, searchQuery])

  const toggleLayer = (layerId: string) => {
    if (layerId === 'all') {
      setSelectedLayers(['all'])
    } else {
      setSelectedLayers(prev => {
        const updated = prev.includes(layerId)
          ? prev.filter(id => id !== layerId)
          : [...prev.filter(id => id !== 'all'), layerId]
        return updated.length === 0 ? ['all'] : updated
      })
    }
  }

  const handleCardClick = (termId: string) => {
    navigate(`/marketplace/guides/glossary/${termId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link
                  to="/marketplace/guides?tab=resources"
                  className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                >
                  Resources
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link
                  to="/marketplace/guides/glossary"
                  className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                >
                  Glossary
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Agile 6xD</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agile 6xD Glossary</h1>
          <p className="text-base text-gray-600 max-w-3xl">
            Explore Agile 6xD layers and related glossary terms across D1–D6.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-[309px] flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4 min-h-[507px]">
              {/* Total Count */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900">
                  {filteredTerms.length} of {agile6xdTerms.length} terms
                </p>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)]"
                />
              </div>

              {/* Agile 6xD Layers */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Agile 6xD Layers</h3>
                <div className="space-y-2">
                  {AGILE_LAYERS.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLayers.includes(layer.id)
                          ? agileLayerColors[layer.color] + ' ring-2 ring-offset-1 ring-gray-300'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* A-Z Navigation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse A–Z</h3>
                <div className="grid grid-cols-6 gap-1">
                  {allLetters.map(letter => {
                    const hasTerms = lettersWithTerms.includes(letter)
                    const isActive = selectedLetter === letter
                    return (
                      <button
                        key={letter}
                        onClick={() => setSelectedLetter(isActive ? null : letter)}
                        disabled={!hasTerms}
                        className={`w-8 h-8 text-xs font-medium rounded transition-colors ${
                          isActive
                            ? 'bg-[var(--guidelines-primary)] text-white'
                            : hasTerms
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {letter}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Card Grid */}
          <div className="flex-1">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No terms found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedLayers(['all'])
                    setSelectedLetter(null)
                    setSearchQuery('')
                  }}
                  className="mt-4 text-sm text-[var(--guidelines-primary)] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Showing {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {filteredTerms.map(term => (
                  <AgileGlossaryCard
                    key={term.id}
                    term={term}
                    onClick={() => handleCardClick(term.id)}
                  />
                ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

interface AgileGlossaryCardProps {
  term: GlossaryTerm
  onClick: () => void
}

const AgileGlossaryCard: React.FC<AgileGlossaryCardProps> = ({ term, onClick }) => {
  const layer = AGILE_LAYERS.find(l => term.categories.includes(l.id)) || AGILE_LAYERS[0]
  const visibleTags = term.tags.slice(0, 3)
  const remainingTags = term.tags.length - 3

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full min-h-[340px]"
    >
      {/* Icon + Label at top */}
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-gray-500 font-medium">
          {layer.label}
        </span>
      </div>

      {/* Term Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
        {term.term}
      </h3>

      {/* Explanation */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
        {term.explanation}
      </p>

      {/* Tags */}
      {term.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {remainingTags > 0 && (
            <span className="text-xs text-gray-400">
              +{remainingTags} more
            </span>
          )}
        </div>
      )}

      {/* CTA Button at bottom */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="mt-auto w-full bg-[#162862] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3568] transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>View Details</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Agile6xDGlossaryPage