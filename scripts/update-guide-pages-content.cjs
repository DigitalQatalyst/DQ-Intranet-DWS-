/**
 * Script to update all 8 guide detail pages with new content structure
 * This updates the content to use the GUIDE_CONTENT constants
 */

const fs = require('fs');
const path = require('path');

// Define the pages to update (excluding ghc which is already done)
const pagesToUpdate = [
  { slug: 'dq-vision', folder: 'dq-vision' },
  { slug: 'dq-hov', folder: 'dq-hov' },
  { slug: 'dq-persona', folder: 'dq-persona' },
  { slug: 'dq-agile-tms', folder: 'dq-agile-tms' },
  { slug: 'dq-agile-sos', folder: 'dq-agile-sos' },
  { slug: 'dq-agile-flows', folder: 'dq-agile-flows' },
  { slug: 'dq-agile-6xd', folder: 'dq-agile-6xd' }
];

// Template for the updated page
const generatePageContent = (slug, folder) => {
  return `import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon, BookOpen, PlayCircle, Eye } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from '../shared/HeroSection'
import { GuidelineSection } from '../shared/GuidelineSection'
import { GUIDE_CONTENT } from '../../../constants/guideContent'

function GuidelinePage() {
  const currentSlug = '${slug}'
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'storybook' | 'course'>('overview')

  // Get content from constants
  const content = GUIDE_CONTENT[currentSlug]
  const displayTitle = content?.title || guide?.title || ''

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabaseClient
          .from('guides')
          .select('*')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (fetchError) throw fetchError
        
        if (!cancelled) {
          if (data) {
            if (data.slug?.toLowerCase() !== currentSlug.toLowerCase()) {
              console.error(\`Slug mismatch! Expected: \${currentSlug}, Got: \${data.slug}\`)
              setError(\`Data integrity error: Guide slug mismatch. Expected '\${currentSlug}' but got '\${data.slug}'\`)
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link to="/marketplace/guides?tab=strategy" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Strategy
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
        badge="Strategy Framework"
      />

      <main className="flex-1">
        <div className="px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={\`py-4 px-6 text-sm font-medium border-b-2 transition-colors focus:outline-none \${
                          activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }\`}
                      >
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          Overview
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('storybook')}
                        className={\`py-4 px-6 text-sm font-medium border-b-2 transition-colors focus:outline-none \${
                          activeTab === 'storybook'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }\`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} />
                          Explore Story Book
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('course')}
                        className={\`py-4 px-6 text-sm font-medium border-b-2 transition-colors focus:outline-none \${
                          activeTab === 'course'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }\`}
                      >
                        <div className="flex items-center gap-2">
                          <PlayCircle size={16} />
                          Course
                        </div>
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 md:p-8">
                    {activeTab === 'overview' && (
                      <div className="max-w-5xl mx-auto space-y-10">
                        {/* Main Description */}
                        <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                          <p>{content.shortOverview}</p>
                        </div>

                        {/* Course Highlights Section */}
                        <div className="space-y-5">
                          <h3 className="text-xl font-semibold text-gray-900">Course Highlights</h3>
                          <div className="space-y-4">
                            {content.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="text-gray-700 text-base leading-relaxed">
                                  {highlight}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="text-right pt-4">
                          <Link
                            to={\`/marketplace/guides/\${currentSlug}/details\`}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                            style={{ backgroundColor: '#030E31' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
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
                      <GuidelineSection id="storybook" title="Explore Story Book">
                        <div className="max-w-5xl mx-auto space-y-10">
                          {/* Storybook Description */}
                          <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                            <p>{content.storybookIntro}</p>
                          </div>

                          {/* What You Will Learn Section - Moved to Storybook Tab */}
                          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">What You'll Learn</h3>
                            </div>
                            <div className="space-y-5">
                              {content.whatYouWillLearn.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1.5">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  </div>
                                  <p className="text-gray-700 text-base leading-relaxed">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Open Storybook Button */}
                          <div className="text-center py-8">
                            <button
                              onClick={() => window.open('https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html', '_blank')}
                              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                              style={{ backgroundColor: '#030E31' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
                            >
                              <BookOpen size={16} />
                              Open Story Book
                            </button>
                          </div>
                        </div>
                      </GuidelineSection>
                    )}

                    {activeTab === 'course' && (
                      <GuidelineSection id="course" title="Course - Learning Center">
                        <div className="space-y-8">
                          <div className="text-center">
                            <PlayCircle size={64} className="mx-auto text-blue-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.title} Course</h3>
                            <p className="text-gray-600 mb-8">
                              Continue into the learning center to explore the course modules.
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{content.title} Course</h4>
                                <p className="text-sm text-gray-600">Learning center track</p>
                              </div>
                              <a
                                href="https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <PlayCircle size={16} />
                                <span>Start Course</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </GuidelineSection>
                    )}
                  </div>
                </div>
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
`;
};

// Update each page
pagesToUpdate.forEach(({ slug, folder }) => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'strategy', folder, 'GuidelinePage.tsx');
  const content = generatePageContent(slug, folder);
  
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${folder}/GuidelinePage.tsx`);
  } catch (error) {
    console.error(`❌ Failed to update ${folder}/GuidelinePage.tsx:`, error.message);
  }
});

console.log('\n✨ All guide pages have been updated with new content structure!');
console.log('\nChanges made:');
console.log('1. Tab 1 (Overview): Now shows shortOverview + highlights');
console.log('2. Tab 2 (Explore Storybook): Now shows storybookIntro + "What You Will Learn" section');
console.log('3. Content is pulled from GUIDE_CONTENT constants');
console.log('4. Subtitle added to HeroSection');
