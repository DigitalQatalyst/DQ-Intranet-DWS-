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
import { SummaryTable } from './SummaryTable'
import { FullTableModal } from './FullTableModal'
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
  const currentSlug = 'dq-scrum-master-guidelines'
  
  // Modal state management for each table
  const [positionVsRoleModalOpen, setPositionVsRoleModalOpen] = useState(false)
  const [smCoeModalOpen, setSmCoeModalOpen] = useState(false)
  const [smSectorModalOpen, setSmSectorModalOpen] = useState(false)
  const [smFactoryModalOpen, setSmFactoryModalOpen] = useState(false)
  const [smTowerModalOpen, setSmTowerModalOpen] = useState(false)
  const [smWorkingRoomModalOpen, setSmWorkingRoomModalOpen] = useState(false)
  const [smDeliveryModalOpen, setSmDeliveryModalOpen] = useState(false)
  const [smAtpModalOpen, setSmAtpModalOpen] = useState(false)
  
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
            .ilike('domain', '%guideline%')
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
                  <Link to="/marketplace/guides?tab=guidelines" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Guidelines
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Scrum Master Guidelines</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Context Section */}
              <GuidelineSection id="context" title="Context">
                <p>
                  DQ is deploying a unified Scrum Master Framework where every associate functions as a Scrum Master at different levels, depending on their position and responsibilities.
                </p>
                <p className="mt-4">
                  This adds to the previous structure of Sector Leads, Factory Leads, Tower Leads, and traditional Scrum Masters with a streamlined 5-type Scrum Master model that enhances agility, alignment, accountability, and delivery momentum across all units.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-4">
                  These guidelines define the structure, roles, responsibilities, and governance expectations of the new Scrum Master Framework.
                </p>
                <p>
                  They ensure standardization across all units, clarity of responsibilities, and alignment to DQ&apos;s culture of execution, visibility, and accountability.
                </p>
              </GuidelineSection>

              {/* Understanding Position SM vs Role SM Section */}
              <GuidelineSection id="position-vs-role" title="Understanding Position SM vs Role SM">
                <p className="mb-6">
                  Below is the difference between Position SM and Role SM.
                </p>
                <SummaryTable
                  title="Understanding Position SM vs Role SM"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Position SM',
                      description: 'Located in CoE(EVMO)',
                    },
                    {
                      number: '02',
                      item: 'Position Examples',
                      description: 'SM (CoE), SM (Unit), SM (Delivery).',
                    },
                    {
                      number: '03',
                      item: 'Multi-role Execution',
                      description: 'Position SMs may take on additional roles such as SM (Working Room).',
                    },
                    {
                      number: '04',
                      item: 'Role SM',
                      description: 'A functional responsibility performed when required.',
                    },
                    {
                      number: '05',
                      item: 'Role Examples',
                      description: 'SM (Working Room), SM (ATP).',
                    },
                    {
                      number: '06',
                      item: 'Universality',
                      description: 'SM(ATP) applies to all associates',
                    },
                  ]}
                  onViewFull={() => setPositionVsRoleModalOpen(true)}
                />
                <FullTableModal
                  isOpen={positionVsRoleModalOpen}
                  onClose={() => setPositionVsRoleModalOpen(false)}
                  title="Understanding Position SM vs Role SM"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Position SM',
                      description: 'Located in CoE(EVMO)',
                    },
                    {
                      number: '02',
                      item: 'Position Examples',
                      description: 'SM (CoE), SM (Unit), SM (Delivery).',
                    },
                    {
                      number: '03',
                      item: 'Multi-role Execution',
                      description: 'Position SMs may take on additional roles such as SM (Working Room).',
                    },
                    {
                      number: '04',
                      item: 'Role SM',
                      description: 'A functional responsibility performed when required.',
                    },
                    {
                      number: '05',
                      item: 'Role Examples',
                      description: 'SM (Working Room), SM (ATP).',
                    },
                    {
                      number: '06',
                      item: 'Universality',
                      description: 'SM(ATP) applies to all associates',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (CoE) Section */}
              <GuidelineSection id="sm-coe" title="SM (CoE) - Position">
                <p className="mb-6">
                  The below table showcases the roles and responsibilities of CoE Scrum Master
                </p>
                <SummaryTable
                  title="SM (CoE) - Position"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Location',
                      description: 'Sits in the CoE (EVMO) unit.',
                    },
                    {
                      number: '02',
                      item: 'Core Function',
                      description: 'Governance, compliance, and ensuring adherence to DQ\'s L24 WR guidelines.',
                    },
                    {
                      number: '03',
                      item: 'Deployment Involvement',
                      description: 'Highly involved in the initial deployment phase to onboard SM (Working Room) and activate each Working Room.',
                    },
                    {
                      number: '04',
                      item: 'Stabilization Activities',
                      description: 'Conduct high-level scans across all Working Rooms once operational to ensure guidelines and the WR essence are intact.',
                    },
                    {
                      number: '05',
                      item: 'Gap Resolution',
                      description: 'Identify gaps in WR performance/compliance and ensure corrective action via Unit/Factory/Tower SMs.',
                    },
                    {
                      number: '06',
                      item: 'Standards Creation',
                      description: 'Develop and maintain Working Room guidelines (structure, flow, expectations).',
                    },
                    {
                      number: '07',
                      item: 'Compliance Assurance',
                      description: 'Ensure guideline deployment and associate compliance across all units.',
                    },
                    {
                      number: '08',
                      item: 'Continuous Optimization',
                      description: 'Optimize guidelines weekly based on observations, WR performance, and feedback.',
                    },
                  ]}
                  onViewFull={() => setSmCoeModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smCoeModalOpen}
                  onClose={() => setSmCoeModalOpen(false)}
                  title="SM (CoE) - Position"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Location',
                      description: 'Sits in the CoE (EVMO) unit.',
                    },
                    {
                      number: '02',
                      item: 'Core Function',
                      description: 'Governance, compliance, and ensuring adherence to DQ\'s L24 WR guidelines.',
                    },
                    {
                      number: '03',
                      item: 'Deployment Involvement',
                      description: 'Highly involved in the initial deployment phase to onboard SM (Working Room) and activate each Working Room.',
                    },
                    {
                      number: '04',
                      item: 'Stabilization Activities',
                      description: 'Conduct high-level scans across all Working Rooms once operational to ensure guidelines and the WR essence are intact.',
                    },
                    {
                      number: '05',
                      item: 'Gap Resolution',
                      description: 'Identify gaps in WR performance/compliance and ensure corrective action via Unit/Factory/Tower SMs.',
                    },
                    {
                      number: '06',
                      item: 'Standards Creation',
                      description: 'Develop and maintain Working Room guidelines (structure, flow, expectations).',
                    },
                    {
                      number: '07',
                      item: 'Compliance Assurance',
                      description: 'Ensure guideline deployment and associate compliance across all units.',
                    },
                    {
                      number: '08',
                      item: 'Continuous Optimization',
                      description: 'Optimize guidelines weekly based on observations, WR performance, and feedback.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (Unit) Section */}
              <GuidelineSection id="sm-unit" title="SM (Unit) — Position">
                <p className="mb-6">
                  The below table showcases the roles and responsibilities of Unit Scrum Masters: SM (Unit) represents the Scrum Masters operating at the Sector, Factory, and Tower levels within each unit.
                </p>
                <p className="mb-6">
                  They ensure that all parts of the unit function efficiently, align with DQ&apos;s delivery structure, and maintain consistent performance.
                </p>

                {/* SM (Sector) Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.4.1 SM (Sector)</h3>
                  <p className="mb-6">
                    The below table showcases the roles and responsibilities of Sector level Scrum Master:
                  </p>
                  <SummaryTable
                    title="SM (Sector)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'DCO Operations, DBP Platform, DBP Delivery sectors.',
                      },
                      {
                        number: '02',
                        item: 'Working Room Support',
                        description: 'Act as SM (Working Room) when required.',
                      },
                      {
                        number: '03',
                        item: 'Factory Oversight',
                        description: 'Ensure factories under the sector operate efficiently.',
                      },
                      {
                        number: '04',
                        item: 'Unit Health',
                        description: 'Maintain visibility on sector-level performance and health.',
                      },
                      {
                        number: '05',
                        item: 'Tracker Accuracy',
                        description: 'Ensure sector functional trackers are accurate and updated.',
                      },
                      {
                        number: '06',
                        item: 'Gap Escalation',
                        description: 'Flag gaps to Factory SMs and drive resolution.',
                      },
                    ]}
                    onViewFull={() => setSmSectorModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smSectorModalOpen}
                    onClose={() => setSmSectorModalOpen(false)}
                    title="SM (Sector)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'DCO Operations, DBP Platform, DBP Delivery sectors.',
                      },
                      {
                        number: '02',
                        item: 'Working Room Support',
                        description: 'Act as SM (Working Room) when required.',
                      },
                      {
                        number: '03',
                        item: 'Factory Oversight',
                        description: 'Ensure factories under the sector operate efficiently.',
                      },
                      {
                        number: '04',
                        item: 'Unit Health',
                        description: 'Maintain visibility on sector-level performance and health.',
                      },
                      {
                        number: '05',
                        item: 'Tracker Accuracy',
                        description: 'Ensure sector functional trackers are accurate and updated.',
                      },
                      {
                        number: '06',
                        item: 'Gap Escalation',
                        description: 'Flag gaps to Factory SMs and drive resolution.',
                      },
                    ]}
                  />
                </div>

                {/* SM (Factory) Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.4.2 SM (Factory)</h3>
                  <p className="mb-6">
                    The below table showcases the roles and responsibilities of Factory level Scrum Master:
                  </p>
                  <SummaryTable
                    title="SM (Factory)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'Eg. Finance Factory, Deals Factory, Solution Factory, etc.',
                      },
                      {
                        number: '02',
                        item: 'Working Room Support',
                        description: 'Act as SM (Working Room) when required.',
                      },
                      {
                        number: '03',
                        item: 'Tower Oversight',
                        description: 'Ensure all towers under the factory operate effectively.',
                      },
                      {
                        number: '04',
                        item: 'Planning',
                        description: 'Establish clear monthly, weekly, and daily plans for each tower.',
                      },
                      {
                        number: '05',
                        item: 'Plan Monitoring',
                        description: 'Track progress against plans and maintain factory-level trackers.',
                      },
                      {
                        number: '06',
                        item: 'ATP Review',
                        description: 'Review and validate ATPs of all factory associates.',
                      },
                      {
                        number: '07',
                        item: 'Blocker Resolution',
                        description: 'Identify and proactively resolve blockers.',
                      },
                    ]}
                    onViewFull={() => setSmFactoryModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smFactoryModalOpen}
                    onClose={() => setSmFactoryModalOpen(false)}
                    title="SM (Factory)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'Eg. Finance Factory, Deals Factory, Solution Factory, etc.',
                      },
                      {
                        number: '02',
                        item: 'Working Room Support',
                        description: 'Act as SM (Working Room) when required.',
                      },
                      {
                        number: '03',
                        item: 'Tower Oversight',
                        description: 'Ensure all towers under the factory operate effectively.',
                      },
                      {
                        number: '04',
                        item: 'Planning',
                        description: 'Establish clear monthly, weekly, and daily plans for each tower.',
                      },
                      {
                        number: '05',
                        item: 'Plan Monitoring',
                        description: 'Track progress against plans and maintain factory-level trackers.',
                      },
                      {
                        number: '06',
                        item: 'ATP Review',
                        description: 'Review and validate ATPs of all factory associates.',
                      },
                      {
                        number: '07',
                        item: 'Blocker Resolution',
                        description: 'Identify and proactively resolve blockers.',
                      },
                    ]}
                  />
                </div>

                {/* SM (Tower) Subsection */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.4.3 SM (Tower)</h3>
                  <p className="mb-6">
                    The below table showcases the roles and responsibilities of Tower level Scrum Master:
                  </p>
                  <SummaryTable
                    title="SM (Tower)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'E.g. GPRC, Payables & Receivables, etc.',
                      },
                      {
                        number: '02',
                        item: 'Target Setting',
                        description: 'Set monthly/weekly/daily tower targets.',
                      },
                      {
                        number: '03',
                        item: 'Task Specification',
                        description: 'Ensure all tasks under the towers have specifications and dates which the monthly/weekly targets will be derived from',
                      },
                      {
                        number: '04',
                        item: 'Performance Tracking',
                        description: 'Track progress against plans and maintain factory-level trackers.',
                      },
                      {
                        number: '05',
                        item: 'Blocker Handling',
                        description: 'Resolve blockers or escalate when necessary.',
                      },
                      {
                        number: '06',
                        item: 'Visibility',
                        description: 'Review and validate ATPs of all factory associates.',
                      },
                      {
                        number: '07',
                        item: 'Blocker Resolution',
                        description: 'Communicate plan, progress, and blockers on team channels.',
                      },
                    ]}
                    onViewFull={() => setSmTowerModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smTowerModalOpen}
                    onClose={() => setSmTowerModalOpen(false)}
                    title="SM (Tower)"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Items', accessor: 'item' },
                      { header: 'Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        number: '01',
                        item: 'Scope',
                        description: 'E.g. GPRC, Payables & Receivables, etc.',
                      },
                      {
                        number: '02',
                        item: 'Target Setting',
                        description: 'Set monthly/weekly/daily tower targets.',
                      },
                      {
                        number: '03',
                        item: 'Task Specification',
                        description: 'Ensure all tasks under the towers have specifications and dates which the monthly/weekly targets will be derived from',
                      },
                      {
                        number: '04',
                        item: 'Performance Tracking',
                        description: 'Track progress against plans and maintain factory-level trackers.',
                      },
                      {
                        number: '05',
                        item: 'Blocker Handling',
                        description: 'Resolve blockers or escalate when necessary.',
                      },
                      {
                        number: '06',
                        item: 'Visibility',
                        description: 'Review and validate ATPs of all factory associates.',
                      },
                      {
                        number: '07',
                        item: 'Blocker Resolution',
                        description: 'Communicate plan, progress, and blockers on team channels.',
                      },
                    ]}
                  />
                </div>
              </GuidelineSection>

              {/* SM (Working Room) Section */}
              <GuidelineSection id="sm-working-room" title="SM (Working Room) - Role">
                <p className="mb-6">
                  The below table showcases the responsibilities of Working Room Scrum Master:
                </p>
                <SummaryTable
                  title="SM (Working Room) - Role"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Scope Session Leadership',
                      description: 'Facilitate Daily Working Room sessions.',
                    },
                    {
                      number: '02',
                      item: 'Focus Enforcement',
                      description: 'Keep sessions focused on execution and measurable outcomes.',
                    },
                    {
                      number: '03',
                      item: 'Monitor Engagement',
                      description: 'Track attendance, engagement, and task progress.',
                    },
                    {
                      number: '04',
                      item: 'Blocker Resolution',
                      description: 'Pull in resources/support in real time to resolve blockers.',
                    },
                    {
                      number: '05',
                      item: 'Routine Management',
                      description: 'Conduct CWS and Retros as per weekly agenda.',
                    },
                    {
                      number: '06',
                      item: 'Culture Alignment',
                      description: 'Uphold DQ culture: accountability, collaboration, delivery momentum.',
                    },
                    {
                      number: '07',
                      item: 'Reporting',
                      description: 'Post daily progress and unresolved items on relevant channels.',
                    },
                    {
                      number: '08',
                      item: 'Context & Purpose Enablement',
                      description: 'Understanding of overall context & purpose of the task enabling associates to make meaningful, effective progress that delivers real value.',
                    },
                  ]}
                  onViewFull={() => setSmWorkingRoomModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smWorkingRoomModalOpen}
                  onClose={() => setSmWorkingRoomModalOpen(false)}
                  title="SM (Working Room) - Role"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Scope Session Leadership',
                      description: 'Facilitate Daily Working Room sessions.',
                    },
                    {
                      number: '02',
                      item: 'Focus Enforcement',
                      description: 'Keep sessions focused on execution and measurable outcomes.',
                    },
                    {
                      number: '03',
                      item: 'Monitor Engagement',
                      description: 'Track attendance, engagement, and task progress.',
                    },
                    {
                      number: '04',
                      item: 'Blocker Resolution',
                      description: 'Pull in resources/support in real time to resolve blockers.',
                    },
                    {
                      number: '05',
                      item: 'Routine Management',
                      description: 'Conduct CWS and Retros as per weekly agenda.',
                    },
                    {
                      number: '06',
                      item: 'Culture Alignment',
                      description: 'Uphold DQ culture: accountability, collaboration, delivery momentum.',
                    },
                    {
                      number: '07',
                      item: 'Reporting',
                      description: 'Post daily progress and unresolved items on relevant channels.',
                    },
                    {
                      number: '08',
                      item: 'Context & Purpose Enablement',
                      description: 'Understanding of overall context & purpose of the task enabling associates to make meaningful, effective progress that delivers real value.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (Delivery) Section */}
              <GuidelineSection id="sm-delivery" title="SM (Delivery) - Position">
                <p className="mb-6">
                  The below table showcases the roles & responsibilities of Delivery Scrum Master
                </p>
                <SummaryTable
                  title="SM (Delivery) - Position"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Scope',
                      description: 'Dedicated Scrum Master for specific projects.',
                    },
                    {
                      number: '02',
                      item: 'Multi-WR Participation',
                      description: 'Move across all Working Rooms where the project is active.',
                    },
                    {
                      number: '03',
                      item: 'Delivery Flow',
                      description: 'Ensure project tasks progress smoothly across units.',
                    },
                    {
                      number: '04',
                      item: 'Control Tower',
                      description: 'Conduct Control Tower for respective projects weekly',
                    },
                    {
                      number: '05',
                      item: 'Visibility',
                      description: 'Maintain visibility and alignment across all WRs tied to the project.',
                    },
                    {
                      number: '06',
                      item: 'Escalation',
                      description: 'Proactively escalate risks, delays, or blockers and ensure resolution takes place.',
                    },
                  ]}
                  onViewFull={() => setSmDeliveryModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smDeliveryModalOpen}
                  onClose={() => setSmDeliveryModalOpen(false)}
                  title="SM (Delivery) - Position"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Scope',
                      description: 'Dedicated Scrum Master for specific projects.',
                    },
                    {
                      number: '02',
                      item: 'Multi-WR Participation',
                      description: 'Move across all Working Rooms where the project is active.',
                    },
                    {
                      number: '03',
                      item: 'Delivery Flow',
                      description: 'Ensure project tasks progress smoothly across units.',
                    },
                    {
                      number: '04',
                      item: 'Control Tower',
                      description: 'Conduct Control Tower for respective projects weekly',
                    },
                    {
                      number: '05',
                      item: 'Visibility',
                      description: 'Maintain visibility and alignment across all WRs tied to the project.',
                    },
                    {
                      number: '06',
                      item: 'Escalation',
                      description: 'Proactively escalate risks, delays, or blockers and ensure resolution takes place.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (ATP) Section */}
              <GuidelineSection id="sm-atp" title="SM (ATP- Associate) - Role">
                <p className="mb-6">
                  The below table showcases the responsibilities of Associate Scrum Master
                </p>
                <SummaryTable
                  title="SM (ATP- Associate) - Role"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Universal Responsibility',
                      description: 'Every associate act as their own Scrum Master.',
                    },
                    {
                      number: '02',
                      item: 'Planner Discipline',
                      description: 'Ensure each ATP task is linked to Planner with clear context, purpose, approach, and CLIs.',
                    },
                    {
                      number: '03',
                      item: 'Specification Clarity',
                      description: 'Define detailed specs and deadlines for each task.',
                    },
                    {
                      number: '04',
                      item: 'Progress Visibility',
                      description: 'Maintain daily and weekly visibility on progress.',
                    },
                    {
                      number: '05',
                      item: 'Self-Management',
                      description: 'Manage blockers independently and escalate when required.',
                    },
                    {
                      number: '06',
                      item: 'Discipline',
                      description: 'Manage blockers independently and escalate when required.',
                    },
                  ]}
                  onViewFull={() => setSmAtpModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smAtpModalOpen}
                  onClose={() => setSmAtpModalOpen(false)}
                  title="SM (ATP- Associate) - Role"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Universal Responsibility',
                      description: 'Every associate act as their own Scrum Master.',
                    },
                    {
                      number: '02',
                      item: 'Planner Discipline',
                      description: 'Ensure each ATP task is linked to Planner with clear context, purpose, approach, and CLIs.',
                    },
                    {
                      number: '03',
                      item: 'Specification Clarity',
                      description: 'Define detailed specs and deadlines for each task.',
                    },
                    {
                      number: '04',
                      item: 'Progress Visibility',
                      description: 'Maintain daily and weekly visibility on progress.',
                    },
                    {
                      number: '05',
                      item: 'Self-Management',
                      description: 'Manage blockers independently and escalate when required.',
                    },
                    {
                      number: '06',
                      item: 'Discipline',
                      description: 'Manage blockers independently and escalate when required.',
                    },
                  ]}
                />
              </GuidelineSection>
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Guides Section */}
      <section className="bg-white border-t border-gray-200 py-16 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
              Related Guidelines
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

      {/* Need Help Section */}
      <section className="bg-white border-t border-gray-200 py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left side - Title */}
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact the team for assistance
              </p>
            </div>

            {/* Right side - Contacts */}
            <div className="flex flex-wrap gap-4">
              {/* Contact 1 - Sreya Lakshmi */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">SL</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sreya Lakshmi</p>
                  <p className="text-xs text-gray-600">CoE Analyst</p>
                </div>
              </div>

              {/* Contact 2 - Fadil Alli */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">FA</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fadil Alli</p>
                  <p className="text-xs text-gray-600">CoE Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

