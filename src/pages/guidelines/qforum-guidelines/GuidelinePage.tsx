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
  const currentSlug = 'forum-guidelines'
  
  // Modal state management for each table
  const [keyCharacteristicsModalOpen, setKeyCharacteristicsModalOpen] = useState(false)
  const [typesOfForumsModalOpen, setTypesOfForumsModalOpen] = useState(false)
  const [preparationModalOpen, setPreparationModalOpen] = useState(false)
  const [duringForumModalOpen, setDuringForumModalOpen] = useState(false)
  const [afterForumModalOpen, setAfterForumModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Forum Guidelines</span>
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
                  Forums are a cornerstone of how Digital Qatalyst (DQ) collaborates, governs, and drives progress. They provide a structured environment for teams and stakeholders to align on objectives, share insights, resolve challenges, and make informed decisions. To ensure every Forum operates with clarity, efficiency, and purpose, these guidelines establish a common framework that reflects DQ&apos;s culture, strategic ambitions, and commitment to operational excellence. By following them, we create a consistent experience that maximizes value for both participants and the organization.
                </p>
              </GuidelineSection>

              {/* Forum Definition Section */}
              <GuidelineSection id="forum-definition" title="Forum Definition">
                <p>
                  In the context of Digital Qatalyst (DQ), a Forum is a structured platform — physical, virtual, or hybrid — designed to facilitate focused discussions, collaboration, and knowledge sharing among targeted participants. Forums are organized around specific topics, projects, domains, or strategic objectives, enabling associates to exchange ideas, provide updates, solve problems, and align on decisions.
                </p>
              </GuidelineSection>

              {/* Forum Purpose Section */}
              <GuidelineSection id="forum-purpose" title="Forum Purpose">
                <p>
                  The core function of a Forum is to bring together the right people at the right time to address defined objectives. Forums act as an essential governance and collaboration mechanism within DQ, ensuring that decisions are made efficiently, updates are communicated transparently, and collective expertise is leveraged to drive progress.
                </p>
              </GuidelineSection>

              {/* Key Characteristics Section */}
              <GuidelineSection id="key-characteristics" title="Key Characteristics">
                <p className="mb-6">
                  The following key characteristics define how Forums are structured and conducted across DQ to ensure consistency, alignment, and value delivery.
                </p>
                <SummaryTable
                  title="Key Characteristics"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Structured and Goal-Oriented',
                      description: 'Forums are scheduled with a clear agenda, expected outcomes, and defined timeframes to maintain focus and productivity.',
                    },
                    {
                      number: '02',
                      item: 'Collaborative Environment',
                      description: 'Forums encourage open participation, respectful dialogue, and constructive feedback among all participants.',
                    },
                    {
                      number: '03',
                      item: 'Aligned to DQ Objectives',
                      description: 'Each Forum serves a specific role in advancing DQ\'s projects, products, or strategic initiatives.',
                    },
                    {
                      number: '04',
                      item: 'Documented Outcomes',
                      description: 'Forums produce records such as minutes, action items, or decisions, which are archived for transparency and future reference.',
                    },
                  ]}
                  onViewFull={() => setKeyCharacteristicsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={keyCharacteristicsModalOpen}
                  onClose={() => setKeyCharacteristicsModalOpen(false)}
                  title="Key Characteristics"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Structured and Goal-Oriented',
                      description: 'Forums are scheduled with a clear agenda, expected outcomes, and defined timeframes to maintain focus and productivity.',
                    },
                    {
                      number: '02',
                      item: 'Collaborative Environment',
                      description: 'Forums encourage open participation, respectful dialogue, and constructive feedback among all participants.',
                    },
                    {
                      number: '03',
                      item: 'Aligned to DQ Objectives',
                      description: 'Each Forum serves a specific role in advancing DQ\'s projects, products, or strategic initiatives.',
                    },
                    {
                      number: '04',
                      item: 'Documented Outcomes',
                      description: 'Forums produce records such as minutes, action items, or decisions, which are archived for transparency and future reference.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Types of Forums Section */}
              <GuidelineSection id="types-of-forums" title="Types of Forums">
                <p className="mb-6">
                  DQ uses different types of Forums to serve specific purposes — from daily alignment to urgent problem-solving. Each type of Forum is designed to maximize efficiency, foster collaboration, and ensure timely decision-making.
                </p>
                <SummaryTable
                  title="Types of Forums"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Scrum',
                      action: 'A short, structured daily meeting where the whole team aligns on what was achieved the previous day, what is planned for the current day, and any blockers that need attention.',
                    },
                    {
                      number: '02',
                      guideline: 'Control Tower',
                      action: 'A review session focused on the overall status and health of a project or initiative, ensuring alignment with timelines and strategic goals.',
                    },
                    {
                      number: '03',
                      guideline: 'Collaborative Working Session (CWS)',
                      action: 'A planned, hands-on session where participants work together in real-time to solve problems, develop deliverables, or progress specific tasks.',
                    },
                    {
                      number: '04',
                      guideline: 'Urgent Working Session (UWS)',
                      action: 'A quickly organized session to address critical issues or urgent matters that require immediate discussion and resolution.',
                    },
                    {
                      number: '05',
                      guideline: 'Blitz Working Session (BWS)',
                      action: 'An intensive, time-boxed session designed to rapidly complete a set of tasks or meet a pressing deadline, often involving cross-functional collaboration.',
                    },
                    {
                      number: '06',
                      guideline: 'Retrospective (Retro)',
                      action: 'A reflective session held after a sprint, project phase, or major activity to evaluate what went well, what could be improved, and how to apply lessons learned moving forward.',
                    },
                  ]}
                  onViewFull={() => setTypesOfForumsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={typesOfForumsModalOpen}
                  onClose={() => setTypesOfForumsModalOpen(false)}
                  title="Types of Forums"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Scrum',
                      action: 'A short, structured daily meeting where the whole team aligns on what was achieved the previous day, what is planned for the current day, and any blockers that need attention.',
                    },
                    {
                      number: '02',
                      guideline: 'Control Tower',
                      action: 'A review session focused on the overall status and health of a project or initiative, ensuring alignment with timelines and strategic goals.',
                    },
                    {
                      number: '03',
                      guideline: 'Collaborative Working Session (CWS)',
                      action: 'A planned, hands-on session where participants work together in real-time to solve problems, develop deliverables, or progress specific tasks.',
                    },
                    {
                      number: '04',
                      guideline: 'Urgent Working Session (UWS)',
                      action: 'A quickly organized session to address critical issues or urgent matters that require immediate discussion and resolution.',
                    },
                    {
                      number: '05',
                      guideline: 'Blitz Working Session (BWS)',
                      action: 'An intensive, time-boxed session designed to rapidly complete a set of tasks or meet a pressing deadline, often involving cross-functional collaboration.',
                    },
                    {
                      number: '06',
                      guideline: 'Retrospective (Retro)',
                      action: 'A reflective session held after a sprint, project phase, or major activity to evaluate what went well, what could be improved, and how to apply lessons learned moving forward.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Guidelines for Preparation Section */}
              <GuidelineSection id="preparation-guidelines" title="Guidelines for Preparation Before the Forum">
                <p className="mb-6">
                  Proper preparation is critical to the success of any Forum. The following guidelines ensure that all contextual, and role-based requirements are addressed before the session begins.
                </p>
                <SummaryTable
                  title="Guidelines for Preparation Before the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Include Context, Purpose, and Agenda in Invite',
                      action: 'When setting up the Forum, clearly state the context, purpose, agenda, and any related materials in the Teams invite so participants are fully informed.',
                    },
                    {
                      number: '02',
                      guideline: 'Ensure All Relevant Participants Are Invited',
                      action: 'Identify and invite all associates who need to be part of the Forum, ensuring they receive timely notification.',
                    },
                    {
                      number: '03',
                      guideline: 'Check Participants\' Availability',
                      action: 'Review participant calendars to confirm availability and avoid double booking expect in case of an UWS. (Use Scheduling Assistance on teams)',
                    },
                    {
                      number: '04',
                      guideline: 'Book Sessions in Advance',
                      action: 'Schedule all Forum sessions at least 24 hours before the meeting time. The only exception to this is UWS.',
                    },
                    {
                      number: '05',
                      guideline: 'Assign Roles in Advance',
                      action: 'Clearly assign who will serve as the facilitator, note-taker, and presenters for the Forum before the meeting is held.',
                    },
                  ]}
                  onViewFull={() => setPreparationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={preparationModalOpen}
                  onClose={() => setPreparationModalOpen(false)}
                  title="Guidelines for Preparation Before the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Include Context, Purpose, and Agenda in Invite',
                      action: 'When setting up the Forum, clearly state the context, purpose, agenda, and any related materials in the Teams invite so participants are fully informed.',
                    },
                    {
                      number: '02',
                      guideline: 'Ensure All Relevant Participants Are Invited',
                      action: 'Identify and invite all associates who need to be part of the Forum, ensuring they receive timely notification.',
                    },
                    {
                      number: '03',
                      guideline: 'Check Participants\' Availability',
                      action: 'Review participant calendars to confirm availability and avoid double booking expect in case of an UWS. (Use Scheduling Assistance on teams)',
                    },
                    {
                      number: '04',
                      guideline: 'Book Sessions in Advance',
                      action: 'Schedule all Forum sessions at least 24 hours before the meeting time. The only exception to this is UWS.',
                    },
                    {
                      number: '05',
                      guideline: 'Assign Roles in Advance',
                      action: 'Clearly assign who will serve as the facilitator, note-taker, and presenters for the Forum before the meeting is held.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Guidelines During the Forum Section */}
              <GuidelineSection id="during-forum" title="Guidelines During the Forum">
                <p className="mb-6">
                  The effectiveness of a Forum depends on how it is conducted in real time. The following guidelines outline best practices to ensure productive discussions, clear decision-making, and active engagement during the session.
                </p>
                <SummaryTable
                  title="Guidelines During the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Confirm Attendance at Start',
                      action: 'At the beginning of the Forum, verify that all required participants are present and note any absentees.',
                    },
                    {
                      number: '02',
                      guideline: 'Start on Time',
                      action: 'Begin the Forum promptly to respect participants\' schedules and maintain time discipline.',
                    },
                    {
                      number: '03',
                      guideline: 'Reconfirm Context, Purpose, and Agenda',
                      action: 'Open the session by restating the Forum\'s context, purpose, and agenda to align all participants.',
                    },
                    {
                      number: '04',
                      guideline: 'Facilitate Structured Discussion',
                      action: 'The facilitator should guide the discussion, ensuring each agenda item is addressed without deviation.',
                    },
                    {
                      number: '05',
                      guideline: 'Encourage Active Participation',
                      action: 'Create space for all relevant participants to contribute ideas, feedback, and updates.',
                    },
                    {
                      number: '06',
                      guideline: 'Manage Time per Agenda Item',
                      action: 'Allocate appropriate time to each topic and prevent prolonged discussion on non-critical points.',
                    },
                    {
                      number: '07',
                      guideline: 'Capture Decisions and Action Items in Real Time',
                      action: 'The note-taker should record decisions, assigned owners, and deadlines as they are agreed upon.',
                    },
                    {
                      number: '08',
                      guideline: 'Address Blockers Promptly',
                      action: 'Identify and discuss blockers, escalating unresolved issues if necessary',
                    },
                    {
                      number: '09',
                      guideline: 'Summarize Before Closing',
                      action: 'Recap the key points, decisions, and next steps before ending the Forum.',
                    },
                  ]}
                  onViewFull={() => setDuringForumModalOpen(true)}
                />
                <FullTableModal
                  isOpen={duringForumModalOpen}
                  onClose={() => setDuringForumModalOpen(false)}
                  title="Guidelines During the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Confirm Attendance at Start',
                      action: 'At the beginning of the Forum, verify that all required participants are present and note any absentees.',
                    },
                    {
                      number: '02',
                      guideline: 'Start on Time',
                      action: 'Begin the Forum promptly to respect participants\' schedules and maintain time discipline.',
                    },
                    {
                      number: '03',
                      guideline: 'Reconfirm Context, Purpose, and Agenda',
                      action: 'Open the session by restating the Forum\'s context, purpose, and agenda to align all participants.',
                    },
                    {
                      number: '04',
                      guideline: 'Facilitate Structured Discussion',
                      action: 'The facilitator should guide the discussion, ensuring each agenda item is addressed without deviation.',
                    },
                    {
                      number: '05',
                      guideline: 'Encourage Active Participation',
                      action: 'Create space for all relevant participants to contribute ideas, feedback, and updates.',
                    },
                    {
                      number: '06',
                      guideline: 'Manage Time per Agenda Item',
                      action: 'Allocate appropriate time to each topic and prevent prolonged discussion on non-critical points.',
                    },
                    {
                      number: '07',
                      guideline: 'Capture Decisions and Action Items in Real Time',
                      action: 'The note-taker should record decisions, assigned owners, and deadlines as they are agreed upon.',
                    },
                    {
                      number: '08',
                      guideline: 'Address Blockers Promptly',
                      action: 'Identify and discuss blockers, escalating unresolved issues if necessary',
                    },
                    {
                      number: '09',
                      guideline: 'Summarize Before Closing',
                      action: 'Recap the key points, decisions, and next steps before ending the Forum.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Guidelines After the Forum Section */}
              <GuidelineSection id="after-forum" title="Guidelines After the Forum">
                <p className="mb-6">
                  The value of a Forum is fully realized when discussions and decisions are translated into clear actions. The following guidelines ensure timely documentation, accountability, and follow-through after the session ends.
                </p>
                <SummaryTable
                  title="Guidelines After the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Share Meeting Notes in Teams Channels',
                      example: 'Post the meeting notes in the respective Teams channel within 24 hours, clearly listing all action items along with assigned owners and timelines for closure.',
                    },
                    {
                      number: '02',
                      type: 'Confirm Action Item Ownership',
                      example: 'Ensure all assigned owners acknowledge their responsibilities and deadlines.',
                    },
                    {
                      number: '03',
                      type: 'Follow Up on Outstanding Items',
                      example: 'Monitor progress on agreed actions and address delays before the next scheduled Forum.',
                    },
                    {
                      number: '04',
                      type: 'Document Lessons Learned',
                      example: 'Capture insights, improvement points, and good practices for future Forums.',
                    },
                    {
                      number: '05',
                      type: 'Close the Loop with Associates',
                      example: 'Share key outcomes with stakeholders who were not present but are impacted by the decisions made.',
                    },
                  ]}
                  onViewFull={() => setAfterForumModalOpen(true)}
                />
                <FullTableModal
                  isOpen={afterForumModalOpen}
                  onClose={() => setAfterForumModalOpen(false)}
                  title="Guidelines After the Forum"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Share Meeting Notes in Teams Channels',
                      example: 'Post the meeting notes in the respective Teams channel within 24 hours, clearly listing all action items along with assigned owners and timelines for closure.',
                    },
                    {
                      number: '02',
                      type: 'Confirm Action Item Ownership',
                      example: 'Ensure all assigned owners acknowledge their responsibilities and deadlines.',
                    },
                    {
                      number: '03',
                      type: 'Follow Up on Outstanding Items',
                      example: 'Monitor progress on agreed actions and address delays before the next scheduled Forum.',
                    },
                    {
                      number: '04',
                      type: 'Document Lessons Learned',
                      example: 'Capture insights, improvement points, and good practices for future Forums.',
                    },
                    {
                      number: '05',
                      type: 'Close the Loop with Associates',
                      example: 'Share key outcomes with stakeholders who were not present but are impacted by the decisions made.',
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

