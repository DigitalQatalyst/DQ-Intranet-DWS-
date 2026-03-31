import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { HomeIcon, ChevronRightIcon, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../components/Header/context/AuthContext'
import { glossaryTerms, GlossaryTerm, CATEGORIES, categoryColors } from './glossaryData'

const GlossaryBrowsePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get all available letters
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const lettersWithTerms = useMemo(() => {
    return Array.from(new Set(glossaryTerms.map(t => t.term.charAt(0).toUpperCase()))).sort((a, b) => a.localeCompare(b))
  }, [])

  // Filter terms based on selected GHC dimensions, A–Z letter, and search
  const filteredTerms = useMemo(() => {
    // Restrict this page to only show the DQ Vision card
    return glossaryTerms.filter(term => {
      if (term.id !== 'dq-vision') {
        return false
      }
      // GHC Dimension (category) filter
      const categoryMatch =
        selectedCategories.includes('all') ||
        selectedCategories.some(cat => term.categories.includes(cat))

      // Letter filter
      const letterMatch =
        selectedLetter === null ||
        term.term.charAt(0).toUpperCase() === selectedLetter

      // Search filter
      const searchMatch =
        searchQuery === '' ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      return categoryMatch && letterMatch && searchMatch
    })
  }, [selectedCategories, selectedLetter, searchQuery])

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all'])
    } else {
      setSelectedCategories(prev => {
        const newCats = prev.includes(categoryId)
          ? prev.filter(c => c !== categoryId)
          : [...prev.filter(c => c !== 'all'), categoryId]
        return newCats.length === 0 ? ['all'] : newCats
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
                <Link to="/marketplace/guides?tab=resources" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Resources
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/guides/glossary" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Glossary
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Browse</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DQ Glossary</h1>
          <p className="text-base text-gray-600 max-w-3xl">
            Quick reference for DQ and DWS terms with short, operational explanations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
              {/* Total Count */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900">
                  {filteredTerms.length} of {glossaryTerms.length} terms
                </p>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)]"
                />
              </div>

              {/* Category Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategories.includes(category.id)
                          ? categoryColors[category.color] + ' ring-2 ring-offset-1 ring-gray-300'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.label}
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
                    setSelectedCategories(['all'])
                    setSelectedLetter(null)
                    setSearchQuery('')
                  }}
                  className="mt-4 text-sm text-[var(--guidelines-primary)] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTerms.map(term => (
                  <GlossaryCard
                    key={term.id}
                    term={term}
                    onClick={() => handleCardClick(term.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

interface GlossaryCardProps {
  term: GlossaryTerm
  onClick: () => void
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ term, onClick }) => {
  const category = CATEGORIES.find(c => term.categories.includes(c.id)) || CATEGORIES[0]
  const colorClass = categoryColors[category.color] || categoryColors.gray
  const visibleTags = term.tags.slice(0, 2)
  const remainingTags = term.tags.length - 2

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all group"
    >
      {/* Category Pill */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
          {category.label}
        </span>
      </div>

      {/* Term Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--guidelines-primary)] transition-colors">
        {term.term}
      </h3>

      {/* Explanation */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {term.explanation}
      </p>

      {/* Tags */}
      {term.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
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
    </div>
  )
}

export default GlossaryBrowsePage
