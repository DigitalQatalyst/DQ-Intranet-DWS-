import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, BookOpen, Clock, User, Home, ChevronRight } from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { supabaseClient } from '../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../services/knowledgeHubClient'
import MarkdownRenderer from '../../components/guides/MarkdownRenderer'
import { AccentHeading } from '../../components/shared/AccentHeading'

interface Guide {
  id: string
  title: string
  slug: string
  body: string
  summary?: string
  hero_image_url?: string
  domain?: string
  guide_type?: string
  estimated_time_min?: number
  last_updated_at?: string
}

interface Section {
  id: string
  title: string
  content: string
}

function GuideDetailsPage() {
  const { itemId } = useParams<{ itemId: string }>()
  const params = useParams()
  console.log('🔍 [GuideDetails] All URL params:', params)
  console.log('🔍 [GuideDetails] Extracted itemId:', itemId)
  
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [activeSection, setActiveSection] = useState<string>('')

  // Parse sections from guide body - only H1 headings for TOC
  const parseSections = (body: string): Section[] => {
    const parsedSections: Section[] = []
    const lines = body.split('\n')
    let currentSection: Section | null = null
    let currentContent: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Check if line is an H1 heading (starts with single #)
      const isH1 = trimmed.startsWith('# ') && !trimmed.startsWith('## ')
      
      if (isH1) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.join('\n')
          parsedSections.push(currentSection)
        }
        
        // Start new section - include the heading in the content
        const title = trimmed.replace(/^#\s*/, '')
        currentSection = {
          id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          title: title,
          content: ''
        }
        // Add the heading line to content so it gets rendered
        currentContent = [line]
      } else {
        // Add content to current section (including H2, H3, etc.)
        if (currentSection) {
          currentContent.push(line)
        }
      }
    }
    
    // Add last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n')
      parsedSections.push(currentSection)
    }
    
    return parsedSections
  }

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true)
        console.log('🔍 [GuideDetails] Fetching guide with itemId:', itemId)
        
        const { data, error: fetchError } = await knowledgeHubSupabase
          .from('guides')
          .select('*')
          .eq('slug', itemId)
          .maybeSingle()
        
        console.log('🔍 [GuideDetails] Fetch result:', { data, error: fetchError })
        
        if (fetchError) throw fetchError
        
        if (data) {
          setGuide(data)
          const parsedSections = parseSections(data.body || '')
          setSections(parsedSections)
          console.log('🔍 [GuideDetails] Parsed sections:', parsedSections)
          if (parsedSections.length > 0) {
            setActiveSection(parsedSections[0].id)
          }
        } else {
          console.error('🔍 [GuideDetails] No guide found for itemId:', itemId)
          setError('Guide not found')
        }
      } catch (err: any) {
        console.error('🔍 [GuideDetails] Error fetching guide:', err)
        setError(err.message || 'Failed to load guide')
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      fetchGuide()
    } else {
      console.error('🔍 [GuideDetails] No itemId provided')
      setError('No itemId provided')
      setLoading(false)
    }
  }, [itemId])

  // Track active section on scroll
  useEffect(() => {
    if (sections.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header

      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section.id)
        
        if (element) {
          const { offsetTop } = element
          
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    // Initial check
    handleScroll()

    // Add scroll listener with throttle
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update active section immediately for better UX
      setActiveSection(sectionId)
    }
  }

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
      
      <main className="flex-1">
        {/* ── Hero Banner — glassmorphism, radial gradient mesh ── */}
        <div
          className="relative overflow-hidden pt-4 pb-20 px-6"
          style={{
            background: `linear-gradient(to right, #192D6C, #051139)`,
          }}
        >
          {/* Floating orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, hsl(var(--cta) / 0.6), transparent 70%)' }} />
            <div className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(260 70% 60% / 0.5), transparent 70%)' }} />
            <div className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, hsl(200 80% 60% / 0.5), transparent 70%)' }} />
          </div>

          {/* Fade-to-white gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, white, transparent)' }} />

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* ── Breadcrumbs row — Lovable HeroBanner pattern ── */}
            <nav className="flex items-center justify-between pb-6">
              <ol className="flex items-center gap-1 text-sm">
                <li className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }} />
                  <Link
                    to="/"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link
                    to="/marketplace/guides"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Guides
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span
                    className="font-medium max-w-[220px] truncate"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.85)' }}
                  >
                    {guide.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Glassmorphism content panel */}
            <div
              className="rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(210,220,255,0.07)',
                border: '1px solid rgba(210,220,255,0.12)',
              }}
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                  style={{ color: 'hsl(var(--hero-foreground))' }}>
                  {guide.title}
                </h1>

                {guide.summary && (
                  <p className="max-w-2xl text-base md:text-lg leading-relaxed"
                    style={{ color: 'hsl(var(--hero-muted))' }}>
                    {guide.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="h-6 w-1 bg-gradient-to-b from-[#030E31] via-[#030E31]/60 to-transparent rounded-full flex-shrink-0"></span>
                  Table of Contents
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content - Right Side */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Guide Content Sections */}
                {sections.length > 0 ? (
                  <div className="space-y-8">
                    {sections.map((section, index) => (
                      <section key={section.id} id={section.id} className="scroll-mt-24">
                        {/* Section Content - MarkdownRenderer handles headers */}
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                          <MarkdownRenderer body={section.content.trim()} />
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600 mb-4">
                      The detailed content for this guide hasn't been added to the database yet.
                    </p>
                    <p className="text-sm text-gray-500">
                      To add content, run the SQL migration script: <code className="bg-gray-100 px-2 py-1 rounded">update_ghc_overview_content.sql</code>
                    </p>
                  </div>
                )}
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

export default GuideDetailsPage
