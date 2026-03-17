import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { VisionMissionHeroSection } from './VisionMissionHeroSection'
import { VisionMissionSideNav } from './VisionMissionSideNav'
import { GuidelineSection } from '../l24-working-rooms/GuidelineSection'
import { GuideCard } from '../../../components/guides/GuideCard'
import { ExternalLink } from 'lucide-react'

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

function VisionMissionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const currentSlug = 'dq-vision-and-mission'
  
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
      
      {/* Hero Section */}
      <VisionMissionHeroSection lastUpdatedAt={currentGuide?.lastUpdatedAt} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Foundation Section */}
              <GuidelineSection id="foundation" title="Foundation">
                <p className="mb-4">
                  At DQ, everything we do is connected to our strategy and vision. A clear vision outlines our long-term aspirations, while our strategy provides the roadmap to get there. This connection empowers every associate to make informed decisions and feel invested in our collective success.
                </p>
                <p>
                  Understanding DQ&apos;s vision and mission connects your role to DQ&apos;s goals, allowing you to make informed decisions and feel more invested in our collective success. This knowledge also opens doors to new opportunities as we navigate changes and initiatives.
                </p>
              </GuidelineSection>

              {/* Introduction Section */}
              <GuidelineSection id="introduction" title="Introduction">
                <p>
                  Our vision and mission are built on core beliefs that guide how we think, operate, and deliver value. These beliefs—rooted in Digital Transformation 2.0 (DT2.0), Digital Cognitive Organizations (DCO), and Digital Business Platforms (DBP)—form the foundation for everything we do.
                </p>
              </GuidelineSection>

              {/* Our Beliefs Section */}
              <GuidelineSection id="our-beliefs" title="Our Beliefs">
                <p className="mb-6">
                  Our beliefs define why DQ exists and how we think differently. They shape our vision and guide our mission execution.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">DQ World View: Digital Cognitive Organizations (DCO)</h3>
                  <p className="mb-4">
                    In today&apos;s fast-paced landscape, industries must transcend traditional methods to thrive. Digital Cognitive Organizations (DCOs) represent the pinnacle of this evolution, seamlessly integrating digital technology and AI with human expertise.
                  </p>
                  <p className="mb-4">
                    <strong>Why DCOs Matter:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>Harmonious collaboration between humans and AI drives increased revenue</li>
                    <li>Reduced operational costs through intelligent automation</li>
                    <li>Superior customer experiences that set organizations apart</li>
                  </ul>
                  <p>
                    For DQ, promoting DCOs means enabling industries to achieve these transformative benefits, ensuring their competitive edge and long-term success.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">De Facto Architecture: Digital Business Platform (DBP)</h3>
                  <p className="mb-4">
                    To evolve into a Digital Cognitive Organization, organizations need a foundational Digital Business Platform (DBP)—an integrated suite of advanced technologies that positions them at the pinnacle of their industries.
                  </p>
                  <p>
                    <strong>Transformation Management as a Service (TMaaS) Role:</strong> TMaaS provides the expertise and tools necessary to design and deploy a formidable DBP effectively, making the journey clear and streamlined. Learn more about our <Link to="/marketplace/non-financial" className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"><span>GHC service</span><ExternalLink size={14} /></Link> that supports this transformation.
                  </p>
                </div>

                {/* Vision Subsection */}
                <div className="mb-6" id="vision">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Vision</h3>
                  <p className="mb-4">
                    <strong className="text-lg">Perfecting Life&apos;s Transactions</strong>
                  </p>
                  <p className="mb-4">
                    At DQ, we envision a world where digital technologies are seamlessly integrated across all sectors of the economy, creating a more empowering and fulfilling life for everyone, regardless of demographic background.
                  </p>
                  <p className="mb-4">
                    <strong>Our Goal:</strong> Harness the power of digital transformation to enhance everyday interactions, making transactions smoother, more efficient, and ultimately more rewarding.
                  </p>
                  <p>
                    By deploying cutting-edge digital solutions, we aim to improve quality of life for all, driving societal progress and inclusivity through technological advancement.
                  </p>
                </div>

                {/* Mission Subsection */}
                <div className="mb-6" id="mission">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Mission</h3>
                  <p className="mb-6">
                    Our mission unfolds through strategic phases that demonstrate what DQ does and how we execute:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-600 pl-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2023</h4>
                      <p className="text-gray-700">
                        Launch DQ2.0, the foundation for our digital transformation journey
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-600 pl-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2024</h4>
                      <p className="text-gray-700">
                        Establish a dedicated Center of Excellence, build skilled teams across Business Units, and equip our workforce with new knowledge through educational tools
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-600 pl-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2025</h4>
                      <p className="text-gray-700">
                        Establish two high-performing DCO operations globally and accelerate transformation with DQ Digital Business Platform and DT2.0 Accelerators
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-600 pl-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">2026 & Beyond</h4>
                      <p className="text-gray-700">
                        Continue our long-term DCO transformation journey, extending our impact past 2025
                      </p>
                    </div>
                  </div>
                </div>
              </GuidelineSection>
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <VisionMissionSideNav />
            </aside>
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

export default VisionMissionPage

