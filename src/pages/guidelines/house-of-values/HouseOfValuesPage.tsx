import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { GuidelineSection } from '../l24-working-rooms/GuidelineSection'
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

function HouseOfValuesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { itemId } = useParams()
  const currentSlug = itemId || 'house-of-values'
  
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [relatedGuidesLoading, setRelatedGuidesLoading] = useState(true)
  const [currentGuide, setCurrentGuide] = useState<{ domain?: string | null; guideType?: string | null; lastUpdatedAt?: string | null } | null>(null)

  // Fetch current guide data
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: guideData, error } = await knowledgeHubSupabase
          .from('guides')
          .select('domain, guide_type, last_updated_at')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled) {
          if (guideData) {
            setCurrentGuide({
              domain: guideData.domain,
              guideType: guideData.guide_type,
              lastUpdatedAt: guideData.last_updated_at
            })
          } else {
            setCurrentGuide({ domain: null, guideType: null, lastUpdatedAt: null })
          }
        }
      } catch (error) {
        console.error('Error fetching current guide:', error)
        if (!cancelled) {
          setCurrentGuide({ domain: null, guideType: null, lastUpdatedAt: null })
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
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Introduction Section with Image */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Introduction Text */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0A1A3B' }}>
                  House of Values (HoV)
                </h1>
                <div className="space-y-4 text-gray-700">
                  <p>
                    At DQ, we believe culture is not something you hope for. It&apos;s something you <strong>build</strong>.
                  </p>
                  <p>
                    Every company has values — written on walls, buried in onboarding slides. But what matters is how those values show up when stakes are high, time is short, or no one is watching.
                  </p>
                  <p>
                    That&apos;s why we built a culture system. We call it the <strong>House of Values (HoV)</strong>.
                  </p>
                </div>
              </div>
              
              {/* Right: House of Values Image */}
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="/assets/house-of-values.png" 
                  alt="House of Values Diagram"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Three Mantras Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8">
              It&apos;s made up of <strong>three Mantras</strong> that guide how Qatalysts think, behave, and collaborate.
            </p>

            {/* 1. Self-Development */}
            <GuidelineSection id="self-development" title="1. Self-Development">
              <p className="mb-4">
                This mantra reinforces that growth is not passive — it&apos;s a daily responsibility.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700 mb-4">
                &quot;We grow ourselves and others through every experience.&quot;
              </blockquote>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Emotional Intelligence</strong> — We stay calm, present, and accountable under pressure</li>
                <li><strong>Growth Mindset</strong> — We embrace feedback, learn from failure, and evolve fast</li>
              </ul>
            </GuidelineSection>

            {/* 2. Lean Working */}
            <GuidelineSection id="lean-working" title="2. Lean Working">
              <p className="mb-4">
                This is how we protect momentum and reduce waste.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700 mb-4">
                &quot;We pursue clarity, efficiency, and prompt outcomes in everything we do.&quot;
              </blockquote>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Purpose</strong> – We stay connected to why the work matters</li>
                <li><strong>Perceptive</strong> – We anticipate needs and make thoughtful choices</li>
                <li><strong>Proactive</strong> – We take initiative and move things forward</li>
                <li><strong>Perseverance</strong> – We push through setbacks with focus</li>
                <li><strong>Precision</strong> – We sweat the details that drive performance</li>
              </ul>
            </GuidelineSection>

            {/* 3. Value Co-Creation */}
            <GuidelineSection id="value-co-creation" title="3. Value Co-Creation">
              <p className="mb-4">
                Collaboration isn&apos;t optional — it&apos;s how we scale intelligence.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700 mb-4">
                &quot;We partner with others to create greater impact together.&quot;
              </blockquote>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Customer</strong> – We design with empathy for those we serve</li>
                <li><strong>Learning</strong> – We remain open, curious, and teachable</li>
                <li><strong>Collaboration</strong> – We work as one, not in silos</li>
                <li><strong>Responsibility</strong> – We own our decisions and their consequences</li>
                <li><strong>Trust</strong> – We build it through honesty, clarity, and consistency</li>
              </ul>
            </GuidelineSection>

            {/* Closing Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="mb-4">
                These are reinforced by <strong>12 Guiding Values</strong> — practical behaviors that help us lead with focus, collaborate with trust, and perform under pressure.
              </p>
              <p className="mb-4">
                Whether in a sprint, a client engagement, or a tough feedback session — these principles give us direction.
              </p>
              <p className="mb-4">
                They keep us aligned when things move fast.
              </p>
              <p className="mb-4">
                They raise the bar when standards slip.
              </p>
              <p className="mb-4">
                They make performance sustainable — because they&apos;re shared.
              </p>
              <p className="text-lg font-semibold text-gray-900">
                At DQ, culture isn&apos;t an extra layer.
              </p>
              <p className="text-lg font-semibold text-gray-900">
                It&apos;s the structure beneath everything we do.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Related Guides Section */}
      <section className="bg-white border-t border-gray-200 py-16 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
              Related Guides
            </h2>
            <p className="text-gray-600">
              Explore other guides that might be helpful
            </p>
          </div>
          
          {relatedGuidesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : relatedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onClick={() => handleGuideClick(guide)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No related guides found at this time.</p>
            </div>
          )}
        </div>
      </section>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default HouseOfValuesPage

