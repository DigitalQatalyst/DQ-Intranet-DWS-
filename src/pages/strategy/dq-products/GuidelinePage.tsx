import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, ExternalLink } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from '../shared/HeroSection'
import { SideNav } from '../shared/SideNav'
import { GuidelineSection } from '../shared/GuidelineSection'
import { GuideCard } from '../../../components/guides/GuideCard'
import React from 'react'
const Markdown = React.lazy(() => import('../../../components/guides/MarkdownRenderer'))

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
  const currentSlug = 'dq-products'

  // Related guides state
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [relatedGuidesLoading, setRelatedGuidesLoading] = useState(true)
  const [currentGuide, setCurrentGuide] = useState<{ domain?: string | null; guideType?: string | null; body?: string | null } | null>(null)

  // Fetch current guide data
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const { data: guideData, error } = await knowledgeHubSupabase
            .from('guides')
            .select('domain, guide_type, body')
            .eq('slug', currentSlug)
            .maybeSingle()

          if (error) throw error
          if (!cancelled) {
            if (guideData) {
              setCurrentGuide({
                domain: guideData.domain,
                guideType: guideData.guide_type,
                body: guideData.body
              })
            } else {
              setCurrentGuide({ domain: null, guideType: null, body: null })
            }
          }
        } catch (error) {
          console.error('Error fetching current guide:', error)
          if (!cancelled) {
            setCurrentGuide({ domain: null, guideType: null, body: null })
          }
        }
      })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Parse body into sections
  const parseSections = (body: string) => {
    const sections: Array<{ id: string; title: string; content: string }> = []
    const lines = body.split('\n')
    let currentSection: { id: string; title: string; content: string } | null = null

    for (const line of lines) {
      // Check for H2 headers (## Title)
      const h2Match = line.match(/^##\s+(.+)$/)
      if (h2Match) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection)
        }
        // Start new section
        const title = h2Match[1].trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        currentSection = { id, title, content: '' }
      } else if (currentSection) {
        currentSection.content += line + '\n'
      }
    }

    // Add last section
    if (currentSection) {
      sections.push(currentSection)
    }

    // If no sections found, create an overview section
    if (sections.length === 0 && body.trim()) {
      sections.push({
        id: 'overview',
        title: 'Overview',
        content: body
      })
    }

    return sections
  }

  const sections = useMemo(() => {
    if (!currentGuide?.body) return []
    return parseSections(currentGuide.body)
  }, [currentGuide?.body])

  const sideNavSections = useMemo(() => {
    return sections.map(section => ({
      id: section.id,
      label: section.title
    }))
  }, [sections])

  // Fetch related guides
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        if (currentGuide === null) return

        setRelatedGuidesLoading(true)
        try {
          const selectCols = 'id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick,estimated_time_min'
          let results: any[] = []

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
            results = rows || []
          }

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
            for (const r of (results || [])) map.set(r.slug || r.id, r)
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Products</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection
        title="DQ Products"
        subtitle="DQ Leadership • Digital Qatalyst"
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Render sections */}
              {sections.length > 0 ? (
                sections.map((section) => {
                  const isTMAaaS = section.id === 'tmaas' || section.title.toLowerCase().includes('tmaas')
                  return (
                    <div key={section.id}>
                      <GuidelineSection id={section.id} title={section.title}>
                        <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                          <Markdown body={section.content} />
                        </React.Suspense>
                        {/* TMaaS Link - Positioned on right like table buttons */}
                        {isTMAaaS && (
                          <div className="mt-6 text-right">
                            <a
                              href="https://arqitek.sharepoint.com/:p:/s/DELSPL.DBAAServicescopy/IQAFxKfXanpVS66niAVjPL_gAUBu4T8Q5LJJDNIruw7v0RQ?e=ppo1AB"
                              target="_blank"
                              rel="noopener noreferrer"
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
                              <span>View TMaaS Strategy Deck</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        )}
                      </GuidelineSection>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading content...</p>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <SideNav sections={sideNavSections} />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage
