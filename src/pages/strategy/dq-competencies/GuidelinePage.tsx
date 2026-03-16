import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
import { HouseOfValuesImage } from './HouseOfValuesImage'
import { GuideCard } from '../../../components/guides/GuideCard'

interface RelatedGuide {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  lastUpdatedAt?: string | null
  downloadCount?: number | null
  isEditorsPick?: boolean | null
  estimatedTimeMin?: number | null
}

function GuidelinePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const currentSlug = 'dq-competencies'
  
  // Related guides state
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [relatedGuidesLoading, setRelatedGuidesLoading] = useState(true)
  const [currentGuide, setCurrentGuide] = useState<{ domain?: string | null; guideType?: string | null } | null>(null)

  // Fetch current guide data
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: guideData, error } = await knowledgeHubSupabase
          .from('guides')
          .select('domain, guide_type')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled) {
          if (guideData) {
            setCurrentGuide({
              domain: guideData.domain,
              guideType: guideData.guide_type
            })
          } else {
            setCurrentGuide({ domain: null, guideType: null })
          }
        }
      } catch (error) {
        console.error('Error fetching current guide:', error)
        if (!cancelled) {
          setCurrentGuide({ domain: null, guideType: null })
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Fetch related guides
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (currentGuide === null) return
      
      setRelatedGuidesLoading(true)
      try {
        const selectCols = 'id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick,estimated_time_min'
        let first: any[] = []
        
        if (currentGuide.domain) {
          const { data: rows } = await knowledgeHubSupabase
            .from('guides')
            .select(selectCols)
            .eq('domain', currentGuide.domain)
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          first = rows || []
        }
        
        let results = first
        
        if ((results?.length || 0) < 6 && currentGuide.guideType) {
          const { data: rows2 } = await knowledgeHubSupabase
            .from('guides')
            .select(selectCols)
            .eq('guide_type', currentGuide.guideType)
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          
          const map = new Map<string, any>()
          for (const r of (first || [])) map.set(r.slug || r.id, r)
          for (const r of (rows2 || [])) {
            const k = r.slug || r.id
            if (!map.has(k)) map.set(k, r)
          }
          results = Array.from(map.values()).slice(0, 6)
        }
        
        if ((results?.length || 0) < 6 && !currentGuide.domain && !currentGuide.guideType) {
          const { data: rows3 } = await knowledgeHubSupabase
            .from('guides')
            .select(selectCols)
            .ilike('domain', '%strategy%')
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          
          const map = new Map<string, any>()
          for (const r of (results || [])) map.set(r.slug || r.id, r)
          for (const r of (rows3 || [])) {
            const k = r.slug || r.id
            if (!map.has(k)) map.set(k, r)
          }
          results = Array.from(map.values()).slice(0, 6)
        }
        
        if (!cancelled) {
          setRelatedGuides((results || []).map((r: any) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            summary: r.summary,
            heroImageUrl: r.hero_image_url,
            domain: r.domain,
            guideType: r.guide_type,
            lastUpdatedAt: r.last_updated_at,
            downloadCount: r.download_count,
            isEditorsPick: r.is_editors_pick,
            estimatedTimeMin: r.estimated_time_min,
          })))
          setRelatedGuidesLoading(false)
        }
      } catch (error) {
        console.error('Error fetching related guides:', error)
        if (!cancelled) {
          setRelatedGuides([])
          setRelatedGuidesLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentGuide, currentSlug])

  const handleGuideClick = (guide: RelatedGuide) => {
    const slug = guide.slug || guide.id
    navigate(`/marketplace/guides/${encodeURIComponent(slug)}`)
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
                  <HomeIcon size={16} className="mr-1" />
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Competencies</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              <GuidelineSection id="overview" title="Overview">
                <p className="mb-4 text-lg italic text-gray-600">
                  "Culture is not a vibe. It's a system."
                </p>
                <p className="mb-6">
                  At DigitalQatalyst, <strong>the Golden Honeycomb of Competencies (GHC)</strong> is the overall framework guiding all aspects of the organisation. The <strong>HoV</strong> is a central pillar of the <strong>DQ GHC</strong>, and functions as the <strong>cultural operating system</strong> for all Qatalysts — our employees, partners, and collaborators.
                </p>
                <p className="mb-6">
                  At DQ, we've made peace with a difficult truth: Culture will happen — with or without design, and if we don't shape it, it will shape us. So we designed it. Not around slogans, but around a system that helps every Qatalyst know what good looks like — and what to do when the moment asks for more.
                </p>
                
                {/* Text above the image */}
                <p className="mb-4 text-xl md:text-2xl font-bold text-center" style={{ color: 'var(--guidelines-primary)' }}>
                  We call it the DQ House of Values (HoV)
                </p>
                
                {/* House of Values Image - Placed right after the text */}
                <HouseOfValuesImage />
                
                {/* GHC Link - Positioned below the image, on right like table buttons */}
                <div className="mt-6 text-right">
                  <a 
                    href="https://digital-qatalyst.shorthandstories.com/ad30db59-9684-4331-921d-2e564f9dfe58/index.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: '#030E31'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#020A28'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#030E31'
                    }}
                  >
                    <span>Read the full GHC overview for more context</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </GuidelineSection>

              {/* House of Values Section - Heading and content below the image */}
              <GuidelineSection id="house-of-values" title="The DQ House of Values (HoV)">
                <p className="mb-6">
                  The <strong>House of Values (HoV)</strong> is the blueprint for how we think, behave, and build trust across every interaction. It defines the emotional, operational, and collaborative foundations that shape how we show up — within our teams, with our clients, and across our impact footprint.
                </p>
                <p className="mb-6">
                  At DQ, culture is not an afterthought — it's an engineered system. At the heart of this system are <strong>3 Mantras</strong>, each brought to life through a set of <strong>Guiding Values</strong>.
                </p>

                <p className="mb-6 mt-6">
                  The House of Values structures the DQ culture into <strong>3 mantras</strong>, framing the Qatalyst's mindset and attitude:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
                  <li className="font-semibold">The <strong>foundational mantra</strong>: Self-Development</li>
                  <li className="font-semibold">The <strong>pillars mantra</strong>: Lean Working</li>
                  <li className="font-semibold">The <strong>roof mantra</strong>: Value Co-Creation</li>
                </ol>
                <p>
                  Each <strong>mantra</strong> builds on the one below it. Each helps us answer a deeper question — not just <em>what</em> we're doing, but <em>how</em> we're becoming the kind of organisation that can do it well. Each <strong>Mantra</strong> is a cultural doctrine — a core belief that shapes how we engage with ourselves, each other, and our work. The <strong>Guiding Values</strong> provide behavioural direction and decision-making clarity.
                </p>
              </GuidelineSection>

              {/* Mantra 01: Self-Development */}
              <GuidelineSection id="mantra-01" title="DQ HoV - Mantra 01: Self-Development">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    "We grow ourselves and others through every experience."
                  </p>
                </div>
                <p className="mb-6">
                  We treat every interaction — no matter how small — as an opportunity to become wiser, stronger, and more capable. Growth at DQ is not optional; it's our way of being. Emotional awareness and a learning mindset are not extras — they are essentials.
                </p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Guiding Values:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Emotional Intelligence</p>
                        <p className="text-gray-700">We remain calm, aware, and accountable under pressure.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Growth Mindset</p>
                        <p className="text-gray-700">We use feedback and failure to drive personal and collective evolution.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GuidelineSection>

              {/* Mantra 02: Lean Working */}
              <GuidelineSection id="mantra-02" title="DQ HoV - Mantra 02: Lean Working">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    "We pursue clarity, efficiency, and prompt outcomes in everything we do."
                  </p>
                </div>
                <p className="mb-6">
                  We value speed and structure. At DQ, good intentions are not enough — only structured delivery counts. From idea to outcome, we optimise everything to ensure results are swift, efficient, and meaningful.
                </p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Guiding Values:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Purpose</p>
                        <p className="text-gray-700">We stay connected to why the work matters.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Perceptive</p>
                        <p className="text-gray-700">We anticipate needs and make thoughtful choices.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Proactive</p>
                        <p className="text-gray-700">We take initiative and move things forward.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Perseverance</p>
                        <p className="text-gray-700">We push through setbacks with focus.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Precision</p>
                        <p className="text-gray-700">We sweat the details that drive performance.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GuidelineSection>

              {/* Mantra 03: Value Co-Creation */}
              <GuidelineSection id="mantra-03" title="DQ HoV - Mantra 03: Value Co-Creation">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    "We partner with others to create greater impact together."
                  </p>
                </div>
                <p className="mb-6">
                  We believe great things are co-created. Collaboration is not a soft skill — it's a competitive advantage. We listen deeply, work openly, and build trust through shared responsibility and impact.
                </p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Guiding Values:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Customer</p>
                        <p className="text-gray-700">We design with empathy for those we serve.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Learning</p>
                        <p className="text-gray-700">We remain open, curious, and teachable.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Collaboration</p>
                        <p className="text-gray-700">We work as one, not in silos.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Responsibility</p>
                        <p className="text-gray-700">We own our decisions and their consequences.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Trust</p>
                        <p className="text-gray-700">We build it through honesty, clarity, and consistency.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GuidelineSection>
            </div>

            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

