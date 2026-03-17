import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, PlayCircle, Eye, BookOpen } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from '../shared/HeroSection'
import { GUIDE_CONTENT } from '../../../constants/guideContent'

function GuidelinePage() {
  const { user } = useAuth()
  const currentSlug = 'dq-hov'
  const contentKey = 'dq-hov'
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'storybook' | 'course' | 'materials'>('overview')

  // Get content from constants using contentKey
  const content = GUIDE_CONTENT[contentKey]
  const displayTitle = content?.title || guide?.title || ''

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await knowledgeHubSupabase
          .from('guides')
          .select('*')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (fetchError) {
          console.error('❌ [DQ-HOV] Fetch error:', fetchError)
          throw fetchError
        }
        
        if (!cancelled) {
          if (data) {
            if (data.slug?.toLowerCase() !== currentSlug.toLowerCase()) {
              console.error(`Slug mismatch! Expected: ${currentSlug}, Got: ${data.slug}`)
              setError(`Data integrity error: Guide slug mismatch. Expected '${currentSlug}' but got '${data.slug}'`)
              setLoading(false)
              return
            }
            setGuide(data)
          } else {
            setError('Guide not found')
          }
          setLoading(false)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load guide')
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Guide not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
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
                    to="/marketplace/guides?tab=strategy"
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    GHC
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{displayTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection 
        title={displayTitle}
        subtitle={content.subtitle}
        imageUrl="/images/guidelines-content.PNG"
      />

      <main className="flex-1 bg-white">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('storybook')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                    activeTab === 'storybook'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    Understand
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('course')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                    activeTab === 'course'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle size={16} />
                    Learn & Practice
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                    activeTab === 'materials'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    Other Materials
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 gap-8">
              <div className="lg:col-span-3">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Main Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                      {content.shortOverview.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Course Highlights Section */}
                    <div className="space-y-5">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">House of Values Highlights</h3>
                      {content.highlights.map((highlight, index) => {
                        const [title, ...descParts] = highlight.split(':')
                        const description = descParts.join(':').trim()
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              <span className="font-semibold">{title}:</span> {description}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4">
                      <Link
                        to={`/marketplace/guides/${currentSlug}/details`}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                        style={{ backgroundColor: '#f55436' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4442e' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f55436' }}
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'storybook' && (
                  <div className="space-y-6">
                    {/* Storybook Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                      {content.storybookIntro.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* What You Will Learn Section */}
                    <div className="space-y-5">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Understand</h3>
                      {content.whatYouWillLearn.map((item, index) => {
                        const [title, ...descParts] = item.split(':')
                        const description = descParts.join(':').trim()
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              <span className="font-semibold">{title}:</span> {description}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Open Storybook Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => window.open('https://digital-qatalyst.shorthandstories.com/ad30db59-9684-4331-921d-2e564f9dfe58/index.html', '_blank')}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#f55436' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4442e' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f55436' }}
                      >
                        <BookOpen size={16} />
                        Read more in the storybook
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'course' && (
                  <div className="space-y-6">
                    {/* Course Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                      {content.courseIntro?.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* What You'll Practice & Understand Section */}
                    <div className="space-y-5">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn & Practice</h3>
                      {content.whatYouWillPractice?.map((item, index) => {
                        const [title, ...descParts] = item.split(':')
                        const description = descParts.join(':').trim()
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              <span className="font-semibold">{title}:</span> {description}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* View Course Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => window.open('https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/f930b2a4-b107-4e7b-af01-c820773e00bb', '_blank')}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#f55436' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4442e' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f55436' }}
                      >
                        <PlayCircle size={16} />
                        View Course
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                      <p className="text-gray-500 text-lg">Coming soon...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default GuidelinePage
