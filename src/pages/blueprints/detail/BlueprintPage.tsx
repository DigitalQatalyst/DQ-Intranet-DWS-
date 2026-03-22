import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, ExternalLink, Share2, Download, Clock, User, Building2, Calendar, Tag, Award, FileText, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { getGuideImageUrl } from '../../../utils/guideImageMap'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
import { SummaryTable } from '../../../pages/strategy/SummaryTable'
import { FullTableModal } from '../../../pages/strategy/FullTableModal'
import React from 'react'
const Markdown = React.lazy(() => import('../../../components/guides/MarkdownRenderer'))

interface GuideRecord {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  functionArea?: string | null
  subDomain?: string | null
  unit?: string | null
  location?: string | null
  status?: string | null
  complexityLevel?: string | null
  skillLevel?: string | null
  estimatedTimeMin?: number | null
  lastUpdatedAt?: string | null
  authorName?: string | null
  authorOrg?: string | null
  isEditorsPick?: boolean | null
  downloadCount?: number | null
  documentUrl?: string | null
  body?: string | null
}

function BlueprintPage() {
  const { itemId } = useParams()
  const location = useLocation() as any
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [guide, setGuide] = useState<GuideRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [bestPracticesModalOpen, setBestPracticesModalOpen] = useState(false)
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false)
  const [technologyStackModalOpen, setTechnologyStackModalOpen] = useState(false)
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false)
  const [aiToolsModalOpen, setAiToolsModalOpen] = useState(false)

  // Parse blueprint body into sections
  const parseBlueprintSections = (body: string) => {
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
        // Normalize section titles - ensure Overview, Features, and AI Tools are separate
        let normalizedTitle = title
        if (title.toLowerCase().includes('overview')) {
          normalizedTitle = 'Overview'
        } else if (title.toLowerCase().includes('feature')) {
          normalizedTitle = 'Features'
        } else if (title.toLowerCase().includes('ai tool')) {
          normalizedTitle = 'AI Tools'
        }
        const id = normalizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        currentSection = { id, title: normalizedTitle, content: '' }
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

    // Ensure Overview is first, then Features, then AI Tools, then others
    const orderedSections: Array<{ id: string; title: string; content: string }> = []
    const overviewSection = sections.find(s => s.id === 'overview' || s.title.toLowerCase() === 'overview')
    const featuresSection = sections.find(s => s.id === 'features' || s.title.toLowerCase().includes('feature'))
    const aiToolsSection = sections.find(s => s.id === 'ai-tools' || s.title.toLowerCase().includes('ai tool'))
    const otherSections = sections.filter(s => 
      s.id !== 'overview' && 
      s.id !== 'features' && 
      s.title.toLowerCase() !== 'overview' && 
      !s.title.toLowerCase().includes('feature') &&
      !s.title.toLowerCase().includes('ai tool')
    )

    if (overviewSection) orderedSections.push(overviewSection)
    if (featuresSection) orderedSections.push(featuresSection)
    if (aiToolsSection) orderedSections.push(aiToolsSection)
    orderedSections.push(...otherSections)

    return orderedSections.length > 0 ? orderedSections : sections
  }


  const blueprintSections = useMemo(() => {
    if (!guide?.body) return []
    return parseBlueprintSections(guide.body)
  }, [guide?.body])

  const sideNavSections = useMemo(() => {
    return blueprintSections.map(section => ({
      id: section.id,
      label: section.title
    }))
  }, [blueprintSections])

  // Parse Best Practices table from markdown content
  const parseBestPracticesTable = (content: string) => {
    const lines = content.split('\n')
    let overview = ''
    let inTable = false
    let tableHeaders: string[] = []
    const tableRows: Record<string, string>[] = []
    let foundFirstTableRow = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip the section title
      if (line.startsWith('##')) continue
      
      // Detect table start (first row with |)
      if (line.startsWith('|') && !inTable) {
        inTable = true
        // Parse headers (remove leading/trailing | and split)
        const cells = line.split('|').map(c => c.trim()).filter(c => c)
        if (cells.length > 0 && !cells[0].includes('---')) {
          tableHeaders = cells
          foundFirstTableRow = true
        }
        continue
      }
      
      // Skip separator row (|---|---|)
      if (inTable && line.includes('---') && foundFirstTableRow) {
        continue
      }
      
      // Parse table data rows
      if (inTable && line.startsWith('|') && foundFirstTableRow) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c)
        if (cells.length === tableHeaders.length) {
          const row: Record<string, string> = {}
          tableHeaders.forEach((header, idx) => {
            // Convert header to accessor (lowercase, replace spaces with hyphens)
            const accessor = header.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/\*\*/g, '') // Remove bold markers
              .trim()
            row[accessor] = (cells[idx] || '').replace(/\*\*/g, '').trim() // Remove bold markers from data
          })
          tableRows.push(row)
        }
      } else if (!inTable && line.length > 0) {
        // Collect overview paragraph (before table)
        overview += line + ' '
      } else if (inTable && line.length === 0 && tableRows.length > 0) {
        // End of table (empty line after table)
        break
      }
    }

    return {
      overview: overview.trim(),
      columns: tableHeaders.map(header => ({
        header: header.replace(/\*\*/g, '').trim(), // Remove bold markers
        accessor: header.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/\*\*/g, '')
          .trim()
      })),
      data: tableRows
    }
  }

  // Fetch guide data - using same approach as GuideDetailPage
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!itemId) {
        console.warn('BlueprintPage: No itemId provided')
        setLoading(false)
        return
      }
      
      console.log('BlueprintPage: Fetching blueprint with itemId:', itemId)
      setLoading(true)
      try {
        // First try API endpoint
        try {
          const apiUrl = `/api/guides/${encodeURIComponent(itemId || '')}`
          console.log('BlueprintPage: Trying API endpoint:', apiUrl)
          const res = await fetch(apiUrl)
          if (res.ok) {
            console.log('BlueprintPage: API fetch successful')
            const data = await res.json()
            if (!cancelled) {
              // Map API response to GuideRecord format
              const mapped: GuideRecord = {
                id: data.id,
                slug: data.slug,
                title: data.title,
                summary: data.summary ?? undefined,
                heroImageUrl: data.hero_image_url ?? data.heroImageUrl ?? null,
                domain: data.domain ?? null,
                guideType: data.guide_type ?? data.guideType ?? null,
                functionArea: data.function_area ?? null,
                subDomain: data.sub_domain ?? data.subDomain ?? null,
                unit: data.unit ?? null,
                location: data.location ?? null,
                status: data.status ?? null,
                complexityLevel: data.complexity_level ?? null,
                skillLevel: data.skill_level ?? data.skillLevel ?? null,
                estimatedTimeMin: data.estimated_time_min ?? data.estimatedTimeMin ?? null,
                lastUpdatedAt: data.last_updated_at ?? data.lastUpdatedAt ?? null,
                authorName: data.author_name ?? data.authorName ?? null,
                authorOrg: data.author_org ?? data.authorOrg ?? null,
                isEditorsPick: data.is_editors_pick ?? data.isEditorsPick ?? null,
                downloadCount: data.download_count ?? data.downloadCount ?? null,
                documentUrl: data.document_url ?? data.documentUrl ?? null,
                body: data.body ?? null,
              }
              setGuide(mapped)
              setLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.warn('BlueprintPage: API fetch failed, falling back to Supabase:', apiError)
        }

        // Fallback to direct Supabase query
        const key = String(itemId || '')
        console.log('BlueprintPage: Trying Supabase query with key:', key)
        const { data: initialRow, error: err1 } = await knowledgeHubSupabase
          .from('guides')
          .select('*')
          .eq('slug', key)
          .maybeSingle()
        
        if (err1) {
          console.error('BlueprintPage: Supabase slug query error:', err1)
          throw err1
        }
        
        let row = initialRow
        if (!row) {
          console.log('BlueprintPage: No result by slug, trying by id')
          const { data: row2, error: err2 } = await knowledgeHubSupabase
            .from('guides')
            .select('*')
            .eq('id', key)
            .maybeSingle()
          if (err2) {
            console.error('BlueprintPage: Supabase id query error:', err2)
            throw err2
          }
          row = row2 as any
        }
        
        if (!row) {
          console.error('BlueprintPage: Blueprint not found in database with key:', key)
          throw new Error('Not found')
        }
        
        console.log('BlueprintPage: Found blueprint:', row.title)
        
        // Map database row to GuideRecord format
        const mapped: GuideRecord = {
          id: row.id,
          slug: row.slug,
          title: row.title,
          summary: row.summary ?? undefined,
          heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
          domain: row.domain ?? null,
          guideType: row.guide_type ?? row.guideType ?? null,
          functionArea: row.function_area ?? null,
          subDomain: row.sub_domain ?? row.subDomain ?? null,
          unit: row.unit ?? null,
          location: row.location ?? null,
          status: row.status ?? null,
          complexityLevel: row.complexity_level ?? null,
          skillLevel: row.skill_level ?? row.skillLevel ?? null,
          estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
          lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,
          authorName: row.author_name ?? row.authorName ?? null,
          authorOrg: row.author_org ?? row.authorOrg ?? null,
          isEditorsPick: row.is_editors_pick ?? row.isEditorsPick ?? null,
          downloadCount: row.download_count ?? row.downloadCount ?? null,
          documentUrl: row.document_url ?? row.documentUrl ?? null,
          body: row.body ?? null,
        }
        
        if (!cancelled) {
          setGuide(mapped)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
        if (!cancelled) {
          setGuide(null)
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [itemId])


  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide?.title || 'Blueprint',
          text: guide?.summary || '',
          url: url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const formatLabel = (value?: string | null) => {
    if (!value) return ''
    return value
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  const getComplexityColor = (level?: string | null) => {
    if (!level) return 'gray'
    const l = level.toLowerCase()
    if (l.includes('beginner') || l.includes('basic')) return 'green'
    if (l.includes('intermediate') || l.includes('medium')) return 'yellow'
    if (l.includes('advanced') || l.includes('expert')) return 'red'
    return 'blue'
  }

  const getStatusColor = (status?: string | null) => {
    if (!status) return 'gray'
    const s = status.toLowerCase()
    if (s === 'approved' || s === 'active') return 'green'
    if (s === 'draft' || s === 'pending') return 'yellow'
    if (s === 'archived' || s === 'deprecated') return 'gray'
    return 'blue'
  }

  // Construct proper back URL with query parameters
  const backSearchParams = new URLSearchParams()
  
  // Preserve existing query params from location.search if they exist
  const currentSearchParams = new URLSearchParams(location.search)
  currentSearchParams.forEach((value, key) => {
    if (key !== 'tab') { // Don't preserve existing tab, we'll set it to blueprints
      backSearchParams.set(key, value)
    }
  })
  
  // Always set tab=blueprints to ensure we go to blueprints tab
  backSearchParams.set('tab', 'blueprints')
  
  const backHref = `/marketplace/guides?${backSearchParams.toString()}`

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => undefined} sidebarOpen={false} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blueprint...</p>
          </div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => undefined} sidebarOpen={false} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Blueprint Not Found</h2>
            <p className="text-gray-500 mb-4">The blueprint you're looking for doesn't exist or has been removed.</p>
            <Link to={backHref} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
              Back to Blueprints
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  const imageUrl = getGuideImageUrl({
    heroImageUrl: guide.heroImageUrl || undefined,
    domain: guide.domain || undefined,
    guideType: guide.guideType || undefined,
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
  })

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
                  <Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Blueprints
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{guide.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection
        title={guide.title}
        lastUpdatedAt={guide.lastUpdatedAt}
        authorName={guide.authorName}
        authorOrg={guide.authorOrg}
        heroImageUrl={imageUrl}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* View Blueprint Button - Top Right */}
              {guide.documentUrl && (
                <div className="mb-8 text-right">
                  <a
                    href={guide.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#030E31' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#020A28'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#030E31'
                    }}
                  >
                    <span>View Blueprint</span>
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}

              {/* Render sections */}
              {blueprintSections.length > 0 ? (
                blueprintSections.map((section, index) => {
                  const isOverview = section.id === 'overview' || section.title.toLowerCase() === 'overview'
                  const isBestPractices = section.id === 'best-practices' || section.title.toLowerCase().includes('best practices')
                  const isArchitecture = section.id === 'architecture' || section.title.toLowerCase().includes('architecture')
                  const isTechnologyStack = section.id === 'technology-stack' || section.title.toLowerCase().includes('technology stack') || section.title.toLowerCase().includes('stack')
                  const isFeatures = section.id === 'features' || section.title.toLowerCase().includes('features')
                  const isAITools = section.id === 'ai-tools' || section.title.toLowerCase().includes('ai tools') || section.title.toLowerCase().includes('ai-tools')
                  
                  // Parse table data for sections that use SummaryTable
                  const bestPracticesData = isBestPractices ? parseBestPracticesTable(section.content) : null
                  const architectureData = isArchitecture ? parseBestPracticesTable(section.content) : null
                  const technologyStackData = isTechnologyStack ? parseBestPracticesTable(section.content) : null
                  const featuresData = isFeatures ? parseBestPracticesTable(section.content) : null
                  const aiToolsData = isAITools ? parseBestPracticesTable(section.content) : null
                  
                  return (
                    <React.Fragment key={section.id}>
                      <GuidelineSection id={section.id} title={section.title}>
                        {isBestPractices && bestPracticesData ? (
                          <>
                            {/* Overview paragraph */}
                            {bestPracticesData.overview && (
                              <p className="mb-6 text-gray-700">{bestPracticesData.overview}</p>
                            )}
                            {/* SummaryTable */}
                            <SummaryTable
                              columns={bestPracticesData.columns}
                              data={bestPracticesData.data}
                              onViewFull={() => setBestPracticesModalOpen(true)}
                            />
                            {/* FullTableModal */}
                            <FullTableModal
                              isOpen={bestPracticesModalOpen}
                              onClose={() => setBestPracticesModalOpen(false)}
                              title="Best Practices"
                              columns={bestPracticesData.columns}
                              data={bestPracticesData.data}
                            />
                          </>
                        ) : isArchitecture && architectureData ? (
                          <>
                            {/* Overview paragraph */}
                            {architectureData.overview && (
                              <p className="mb-6 text-gray-700">{architectureData.overview}</p>
                            )}
                            {/* SummaryTable */}
                            <SummaryTable
                              columns={architectureData.columns}
                              data={architectureData.data}
                              onViewFull={() => setArchitectureModalOpen(true)}
                            />
                            {/* FullTableModal */}
                            <FullTableModal
                              isOpen={architectureModalOpen}
                              onClose={() => setArchitectureModalOpen(false)}
                              title="Architecture"
                              columns={architectureData.columns}
                              data={architectureData.data}
                            />
                          </>
                        ) : isTechnologyStack && technologyStackData ? (
                          <>
                            {/* Overview paragraph */}
                            {technologyStackData.overview && (
                              <p className="mb-6 text-gray-700">{technologyStackData.overview}</p>
                            )}
                            {/* SummaryTable */}
                            <SummaryTable
                              columns={technologyStackData.columns}
                              data={technologyStackData.data}
                              onViewFull={() => setTechnologyStackModalOpen(true)}
                            />
                            {/* FullTableModal */}
                            <FullTableModal
                              isOpen={technologyStackModalOpen}
                              onClose={() => setTechnologyStackModalOpen(false)}
                              title="Technology Stack"
                              columns={technologyStackData.columns}
                              data={technologyStackData.data}
                            />
                          </>
                        ) : isFeatures && featuresData ? (
                          <>
                            {/* Overview paragraph */}
                            {featuresData.overview && (
                              <p className="mb-6 text-gray-700">{featuresData.overview}</p>
                            )}
                            {/* SummaryTable */}
                            <SummaryTable
                              columns={featuresData.columns}
                              data={featuresData.data}
                              onViewFull={() => setFeaturesModalOpen(true)}
                            />
                            {/* FullTableModal */}
                            <FullTableModal
                              isOpen={featuresModalOpen}
                              onClose={() => setFeaturesModalOpen(false)}
                              title="Features"
                              columns={featuresData.columns}
                              data={featuresData.data}
                            />
                          </>
                        ) : isAITools && aiToolsData ? (
                          <>
                            {/* Overview paragraph */}
                            {aiToolsData.overview && (
                              <p className="mb-6 text-gray-700">{aiToolsData.overview}</p>
                            )}
                            {/* SummaryTable */}
                            <SummaryTable
                              columns={aiToolsData.columns}
                              data={aiToolsData.data}
                              onViewFull={() => setAiToolsModalOpen(true)}
                            />
                            {/* FullTableModal */}
                            <FullTableModal
                              isOpen={aiToolsModalOpen}
                              onClose={() => setAiToolsModalOpen(false)}
                              title="AI Tools"
                              columns={aiToolsData.columns}
                              data={aiToolsData.data}
                            />
                          </>
                        ) : (
                          <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                            <Markdown body={section.content} />
                          </React.Suspense>
                        )}
                        {/* View Codebase button - only show for Overview section */}
                        {isOverview && (
                          <div className="mt-6 text-right">
                            <a
                              href="https://github.com/digitalqatalyst/dws-intranet"
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
                              <span>View Codebase</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        )}
                      </GuidelineSection>
                    </React.Fragment>
                  )
                })
              ) : guide.summary ? (
                <GuidelineSection id="overview" title="Overview">
                  <p>{guide.summary}</p>
                  <div className="mt-6 text-right">
                    <a
                      href="https://github.com/digitalqatalyst/dws-intranet"
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
                      <span>View Codebase</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </GuidelineSection>
              ) : null}
            </div>

            <aside className="lg:col-span-1">
              {/* Side Navigation */}
              <SideNav sections={sideNavSections} />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default BlueprintPage

