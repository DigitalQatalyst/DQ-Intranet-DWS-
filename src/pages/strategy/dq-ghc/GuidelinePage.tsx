import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, ExternalLink } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
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
  const currentSlug = 'dq-ghc'
  
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
      <Header toggleSidebar={() => undefined} sidebarOpen={false} />
      
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ GHC</span>
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
              {/* Our Foundation & DNA */}
              <GuidelineSection id="overview" title="Our Foundation & DNA">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    DQ is on a mission to "Accelerate Life's Transactions Improvements, using Digital Blueprints."
                  </p>
                </div>
                <p className="mb-6">
                  We aim to achieve this tall order by helping organisations—across all sectors of the economy—better leverage digital technologies to deliver highly engaging and pro-active services in every interaction and transaction they offer.
                </p>
                <p className="mb-6">
                  This is a <strong>big, bold,</strong> and <strong>audacious</strong> endeavour. Yet, we are not scared.
                </p>
                <p className="mb-6">
                  We are confident we will succeed in this mission because we are guided in all we do by the <strong>DQ Golden Honeycomb of Competencies (GHC)</strong>.
                </p>
              </GuidelineSection>

              {/* GHC Image */}
              <div className="mb-12">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/images/ghc.png" 
                    alt="DQ Golden Honeycomb of Competencies (GHC)" 
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
                {/* Vision & Mission Link - Positioned on right like table buttons */}
                <div className="text-right">
                  <Link
                    to="/marketplace/guides/dq-vision-and-mission"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
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
                    <span>View Vision & Mission</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* GHC - What is it */}
              <GuidelineSection id="what-is-it" title="GHC - What is it">
                <p className="mb-6">
                  The <strong>DQ Golden Honeycomb of Competencies (GHC)</strong> is a master framework—a <em>Framework of Frameworks</em>—that articulates the complete <strong>DNA of DigitalQatalyst</strong>.
                </p>
                <p className="mb-6">
                  It brings together <strong>visionary, strategic, operational, psychological, and behavioural</strong> design dimensions into a single, unified organisational system.
                </p>
                <p className="mb-6">
                  The GHC defines:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>How we think</li>
                  <li>How we work</li>
                  <li>How we create value</li>
                  <li>How we grow—internally and with every partner we serve.</li>
                </ul>
                <p className="mb-6">
                  At the heart of the GHC are <strong>7 interlinked core elements</strong>, each addressing a foundational question that underpins a high-performing, purpose-driven digital organisation.
                </p>
              </GuidelineSection>

              {/* GHC - Why such a framework */}
              <GuidelineSection id="why-such-a-framework" title="GHC - Why such a framework">
                <p className="mb-6">
                  In an age where <strong>agility, intelligence, and coherence</strong> define organisational success, the <strong>DQ GHC</strong> stands as the <strong>master compass</strong> for DigitalQatalyst.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">For employees</h3>
                  <p className="mb-4 text-gray-700">
                    The GHC offers clarity, alignment, and identity. It distills our complex digital ecosystem into seven practical and powerful pillars that guide every Qatalyst—our changemakers—in their roles.
                  </p>
                  <p className="mb-4 text-gray-700">
                    It defines how we collaborate, solve problems, grow in our competencies, and contribute to a shared digital mission.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">For customers and partners</h3>
                  <p className="mb-4 text-gray-700">
                    The GHC instils confidence. It is the invisible architecture behind every engagement.
                  </p>
                  <p className="mb-4 text-gray-700">
                    From agile delivery methods and strategy scaffolding to technical value chains and bold digital visions, the GHC ensures every project is underpinned by rigour, consistency, and forward-thinking design.
                  </p>
                  <p className="mb-4 text-gray-700">
                    This is what makes working with DQ feel seamless, strategic, and impactful.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">For investors and stakeholders</h3>
                  <p className="mb-4 text-gray-700">
                    The GHC reflects deep organisational maturity. It shows that DigitalQatalyst is not just reactive to market changes but proactively engineered for sustained growth, scale, and influence.
                  </p>
                  <p className="mb-4 text-gray-700">
                    The GHC proves that DQ operates on a blueprint that is both <strong>scalable</strong> and deeply <strong>aligned to the demands of the global digital economy</strong>.
                  </p>
                </div>
              </GuidelineSection>

              {/* 01. The DQ Vision (Purpose) */}
              <GuidelineSection id="dq-vision" title="01. The DQ Vision (Purpose)">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-lg font-semibold italic text-gray-800 mb-2">
                    "People don't buy what you do, they buy why you do it."
                  </p>
                  <p className="text-sm text-gray-600">— Simon Sinek</p>
                </div>
                <p className="mb-6">
                  Every organisation has a mission. But not every organisation is clear on <em>why</em> it exists.
                </p>
                <p className="mb-6">
                  At DigitalQatalyst, our work is bold, technical, and complex — but it is rooted in something simple: A belief that the world moves forward when human needs and digital systems are designed to serve one another — intelligently, and consistently.
                </p>
                <p className="mb-6">
                  That belief is the heartbeat of everything we do. It's what unifies hundreds of choices we make daily — in how we work, what we build, and where we focus.
                </p>
                <p className="mb-6">
                  <strong>Our why is this:</strong> <strong>To perfect life's transactions.</strong>
                </p>
                <p className="mb-6">
                  This vision is not powered by guesswork. It is driven by <strong>Digital Blueprints</strong> — modular frameworks and systems that guide organisations in their evolution from traditional structures to <strong>Digital Cognitive Organisations (DCOs)</strong>.
                </p>
                <p className="mb-6">
                  Because in a world that is rapidly digitising, the future will belong to organisations that can <strong><em>think</em></strong>, <strong><em>learn</em></strong>, and <strong><em>adapt</em></strong>— not just deploy tools, but deliver purpose through them.
                </p>
                <p className="mb-6">
                  Our vision gives us direction. It grounds every product, every playbook, every plan and it reminds us that we're not just building technology. We're building trust, momentum, and clarity — system by system, transaction by transaction, life by life.
                </p>
              </GuidelineSection>

              {/* 02. HoV (Culture) */}
              <GuidelineSection id="hov-culture" title="02. HoV (Culture)">
                <p className="mb-6">
                  At DQ, we believe culture is not something you hope for. It's something you <strong>build</strong>.
                </p>
                <p className="mb-6">
                  Every company has values — written on walls, buried in onboarding slides. But what matters is how those values show up when stakes are high, time is short, or no one is watching.
                </p>
                <p className="mb-6">
                  That's why we built a culture system. We call it the <strong>House of Values (HoV)</strong>.
                </p>
                <p className="mb-6">
                  It's made up of <strong>three Mantras</strong> that guide how Qatalysts think, behave, and collaborate.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Self-Development</h3>
                  <p className="mb-4 text-gray-700">
                    This mantra reinforces that growth is not passive — it's a daily responsibility.
                  </p>
                  <div className="mb-4 p-4 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                    <p className="text-lg font-semibold italic text-gray-800">
                      "We grow ourselves and others through every experience."
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Emotional Intelligence</p>
                        <p className="text-gray-700">We stay calm, present, and accountable under pressure</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Growth Mindset</p>
                        <p className="text-gray-700">We embrace feedback, learn from failure, and evolve fast</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Lean Working</h3>
                  <p className="mb-4 text-gray-700">
                    This is how we protect momentum and reduce waste.
                  </p>
                  <div className="mb-4 p-4 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                    <p className="text-lg font-semibold italic text-gray-800">
                      "We pursue clarity, efficiency, and prompt outcomes in everything we do."
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Purpose</p>
                        <p className="text-gray-700">We stay connected to why the work matters</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Perceptive</p>
                        <p className="text-gray-700">We anticipate needs and make thoughtful choices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Proactive</p>
                        <p className="text-gray-700">We take initiative and move things forward</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Perseverance</p>
                        <p className="text-gray-700">We push through setbacks with focus</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Precision</p>
                        <p className="text-gray-700">We sweat the details that drive performance</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Value Co-Creation</h3>
                  <p className="mb-4 text-gray-700">
                    Collaboration isn't optional — it's how we scale intelligence.
                  </p>
                  <div className="mb-4 p-4 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                    <p className="text-lg font-semibold italic text-gray-800">
                      "We partner with others to create greater impact together."
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Customer</p>
                        <p className="text-gray-700">We design with empathy for those we serve</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Learning</p>
                        <p className="text-gray-700">We remain open, curious, and teachable</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Collaboration</p>
                        <p className="text-gray-700">We work as one, not in silos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Responsibility</p>
                        <p className="text-gray-700">We own our decisions and their consequences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                      <div>
                        <p className="font-semibold text-gray-900">Trust</p>
                        <p className="text-gray-700">We build it through honesty, clarity, and consistency</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-6">
                  These are reinforced by <strong>12 Guiding Values</strong> — practical behaviors that help us lead with focus, collaborate with trust, and perform under pressure.
                </p>
                <p className="mb-6">
                  Whether in a sprint, a client engagement, or a tough feedback session — these principles give us direction. They keep us aligned when things move fast. They raise the bar when standards slip. They make performance sustainable — because they're shared.
                </p>
                <p className="mb-6">
                  <strong>At DQ, culture isn't an extra layer.</strong> <strong>It's the structure beneath everything we do.</strong>
                </p>
              </GuidelineSection>

              {/* 03. Persona (Identity) */}
              <GuidelineSection id="persona-identity" title="03. Persona (Identity)">
                <p className="mb-6">
                  Every transformation journey begins with people. And at DQ, we've learned: it's not just about hiring talent. It's about <strong>finding fit</strong>.
                </p>
                <p className="mb-6">
                  The DQ Persona is our shared identity — a set of traits and behaviours that define not just who thrives here, but <em>why</em> they do.
                </p>
                <p className="mb-6">
                  In every interaction, across every role — from employees to clients, partners to investors — the most impactful people at DQ are:
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">Purpose-driven</p>
                      <p className="text-gray-700">Anchored in the why</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">Perceptive</p>
                      <p className="text-gray-700">Aware of system, self, and signals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">Proactive</p>
                      <p className="text-gray-700">Acting before being asked</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">Persevering</p>
                      <p className="text-gray-700">Unshaken by ambiguity or challenge</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">Precise</p>
                      <p className="text-gray-700">Making clarity and craft non-negotiable</p>
                    </div>
                  </div>
                </div>
                <p className="mb-6">
                  This Persona shapes how we build teams, assign roles, and make partnerships. It helps us move faster — because we don't waste energy on misalignment.
                </p>
                <p className="mb-6">
                  In a world where skills evolve quickly, <strong>fit is the future</strong>. And at DQ, fit means more than matching values — it means amplifying the mission.
                </p>
              </GuidelineSection>

              {/* 04. Agile TMS */}
              <GuidelineSection id="agile-tms" title="04. Agile TMS">
                <p className="mb-6">
                  The Agile TMS (Task Management System) is how DQ turns strategy into motion — every day, in every team. It's the living rhythm of how we plan, prioritise, deliver, and adapt — all without sacrificing speed or coherence.
                </p>
                <p className="mb-6">
                  Agile TMS breaks down work into clear, actionable units — with <strong>ownership</strong>, <strong>urgency</strong>, and <strong>intent</strong> baked in. This isn't just about managing tasks, it's about creating momentum — with purpose.
                </p>
                <p className="mb-6">
                  Our teams move in weekly sprints, daily check-ins, and structured reviews. We use rituals like <strong>Co-Working Sessions (CWS)</strong>, <strong>Blitz Sprints</strong>, and <strong>Feedback Loops</strong> to unblock friction and drive clarity.
                </p>
                <p className="mb-6">
                  And most importantly, we treat every task as a signal — a chance to ask: <em>Does this move the needle?</em> <em>Is this tied to a larger outcome?</em> <em>Will this help us get better, not just busier?</em>
                </p>
              </GuidelineSection>

              {/* 05. Agile SoS (Governance) */}
              <GuidelineSection id="agile-sos" title="05. Agile SoS (Governance)">
                <p className="mb-6">
                  Most organisations treat governance like brakes. At DQ, it's a <strong>steering wheel</strong>.
                </p>
                <p className="mb-6">
                  Agile SoS — our System of Systems — is the governance model that helps us move fast <strong>without losing direction</strong>. It's not about control. It's about <strong>coherence</strong> — ensuring that quality, alignment, and value flow through everything we do.
                </p>
                <p className="mb-6">
                  It's composed of four systems:
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">System of Governance (SoG)</p>
                      <p className="text-gray-700">Sets strategic direction and operating rhythm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">System of Quality (SoQ)</p>
                      <p className="text-gray-700">Reinforces excellence and builds mastery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">System of Value (SoV)</p>
                      <p className="text-gray-700">Defines impact, aligns outcomes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--guidelines-primary)' }}></span>
                    <div>
                      <p className="font-semibold text-gray-900">System of Discipline (SoD)</p>
                      <p className="text-gray-700">Tackles root frictions, not just symptoms</p>
                    </div>
                  </div>
                </div>
                <p className="mb-6">
                  They are designed layers that help us scale — where each team knows how to move, and why it matters.
                </p>
                <p className="mb-6">
                  This is how we make agility sustainable. Not just for today — but for the future we're building.
                </p>
              </GuidelineSection>

              {/* 06. Agile Flows (Value Streams) */}
              <GuidelineSection id="agile-flows" title="06. Agile Flows (Value Streams)">
                <p className="mb-6">
                  Ideas are easy. What's hard is getting them across the finish line — intact, on time, and aligned to purpose.
                </p>
                <p className="mb-6">
                  <strong>Agile Flows</strong> is our answer to that challenge. It's how we design and manage value streams across the DQ organisation — from market insight to customer impact.
                </p>
                <p className="mb-6">
                  Rather than siloing work by function, we structure it by <strong>flow</strong> — end-to-end streams. Each stream connects product, design, engineering, delivery, and strategy — with shared artefacts and handoffs that keep everyone in sync.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">The Six Stages of the Value Chain:</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Market to Lead</h4>
                      <p className="text-gray-700 italic mb-2">Where opportunities begin.</p>
                      <p className="text-gray-700">
                        Marketing and ecosystem teams work to generate awareness, attract interest, and shape demand around DQ's products and services.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Lead to Opportunity</h4>
                      <p className="text-gray-700 italic mb-2">Where interest becomes intent.</p>
                      <p className="text-gray-700">
                        Business development qualifies leads, frames client needs, and shapes solution proposals.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Opportunity to Order</h4>
                      <p className="text-gray-700 italic mb-2">Where solutions are formalized.</p>
                      <p className="text-gray-700">
                        Cross-functional teams align on scope, timeline, and delivery approach — moving from proposal to signed engagement.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">4. Order to Fulfillment</h4>
                      <p className="text-gray-700 italic mb-2">Where delivery begins.</p>
                      <p className="text-gray-700">
                        Product, engineering, and delivery teams collaborate to design, build, and launch the solution — bringing ideas into reality.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">5. Fulfillment to Revenue</h4>
                      <p className="text-gray-700 italic mb-2">Where outcomes are recognized.</p>
                      <p className="text-gray-700">
                        Operations and finance ensure that delivery is measured, value is tracked, and agreements are fulfilled with discipline.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">6. Revenue to Loyalty</h4>
                      <p className="text-gray-700 italic mb-2">Where value is sustained.</p>
                      <p className="text-gray-700">
                        Customer teams drive retention, gather insights, and support long-term relationships — closing the loop and feeding improvements back into the system.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-6">
                  This architecture allows us to: → Eliminate duplication → Reduce blockers → See problems before they scale → Deliver as one
                </p>
                <p className="mb-6">
                  Because when you design delivery like a system, you create room for excellence to scale.
                </p>
              </GuidelineSection>

              {/* 07. Agile 6xD (Products) */}
              <GuidelineSection id="agile-6xd" title="07. Agile 6xD (Products)">
                <p className="mb-6">
                  Transformation isn't something we talk about. It's something we <strong>build</strong>.
                </p>
                <p className="mb-6">
                  The <strong>Agile 6xD Framework</strong> is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.
                </p>
                <p className="mb-6">
                  It's built on <strong>Six Essential Perspectives</strong> — each answering a fundamental question every organisation must face on its path to relevance in the digital age.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">The 6 Digital Perspectives:</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Digital Economy (DE)</h4>
                      <p className="text-gray-700 italic mb-2">Why should organisations change?</p>
                      <p className="text-gray-700">
                        Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Digital Cognitive Organisation (DCO)</h4>
                      <p className="text-gray-700 italic mb-2">Where are organisations headed?</p>
                      <p className="text-gray-700">
                        Defines the future enterprise — intelligent, adaptive, and orchestrated — capable of learning, responding, and coordinating seamlessly across people, systems, and decisions.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Digital Business Platforms (DBP)</h4>
                      <p className="text-gray-700 italic mb-2">What must be built to enable transformation?</p>
                      <p className="text-gray-700">
                        Focuses on the modular, integrated, and data-driven architectures that unify operations and make transformation scalable and resilient.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">4. Digital Transformation 2.0 (DT2.0)</h4>
                      <p className="text-gray-700 italic mb-2">How should transformation be designed and deployed?</p>
                      <p className="text-gray-700">
                        Positions transformation as a discipline of design and orchestration, introducing the methods, flows, and governance needed to make change repeatable and outcome-driven.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">5. Digital Worker & Workspace (DW:WS)</h4>
                      <p className="text-gray-700 italic mb-2">Who delivers the change, and how do they work?</p>
                      <p className="text-gray-700">
                        Centers on people and their environments — redefining roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">6. Digital Accelerators (Tools)</h4>
                      <p className="text-gray-700 italic mb-2">When will value be realised, and how fast, effective, and aligned will it be?</p>
                      <p className="text-gray-700">
                        Drives execution speed and alignment through tools, systems, and strategies that compress time-to-value and scale measurable impact.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-6">
                  Together, these six perspectives form a <strong>transformation compass</strong> — a blueprint that helps organisations move with clarity, discipline, and speed.
                </p>
                <p className="mb-6">
                  They help organisations not only design for change, but <strong>live it</strong> — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.
                </p>
              </GuidelineSection>

              {/* GHC - In Short */}
              <GuidelineSection id="in-short" title="GHC - In Short">
                <p className="mb-6">
                  The <strong>Golden Honeycomb of Competencies (GHC)</strong> brings structure to how we think, work, and grow.
                </p>
                <p className="mb-6">
                  Each cell in this StoryBook reflects one part of the system — from the values that shape our culture, to the agile rhythms that guide our work, to the strategy and frameworks that align us around shared outcomes.
                </p>
                <p className="mb-6">
                  In short, the <strong>DQ GHC shapes our operating system</strong>. It is the <strong>north star for all Qatalysts</strong>; the <strong>bedrock</strong> upon which we will continue to shape better digital futures—<strong>transaction by transaction, life by life, organisation by organisation</strong>.
                </p>
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

