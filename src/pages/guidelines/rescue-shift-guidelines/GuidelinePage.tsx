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
  const currentSlug = 'dq-rescue-shift-guidelines'
  
  // Modal state management
  const [structureOverviewModalOpen, setStructureOverviewModalOpen] = useState(false)
  const [planningModalOpen, setPlanningModalOpen] = useState(false)
  const [duringShiftModalOpen, setDuringShiftModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [remoteWorkingModalOpen, setRemoteWorkingModalOpen] = useState(false)
  const [payrollComplianceModalOpen, setPayrollComplianceModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Rescue Shift Guidelines</span>
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
              <GuidelineSection id="context" title="Context">
                <p>
                  The Rescue Shift Guidelines are being created to ensure the completion of high volume backlog work items by allocating additional resources outside of normal working hours. These shifts are necessary to address periods of high workload, enabling associates to contribute extra hours to clear critical tasks. The guidelines apply to all associates, project managers, scrum masters, line managers, and HR involved in coordinating and executing rescue shifts.
                </p>
              </GuidelineSection>

              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-6">
                  The primary goal of these guidelines is to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Ensure clarity and consistency in how rescue shifts are scheduled, tracked, and compensated.</li>
                  <li>Provide clear specifications and estimate time effort for each task.</li>
                  <li>Provide accountability by clearly outlining roles, responsibilities, and expectations for all involved.</li>
                  <li>Enhance alignment between associates, project managers, scrum masters, and HR to ensure smooth operations.</li>
                  <li>Ensure timely completion of backlog tasks, thereby improving project delivery and operational efficiency.</li>
                </ul>
              </GuidelineSection>

              <GuidelineSection id="structure-overview" title="Structure Overview">
                <p className="mb-6">
                  The Rescue Shift process consists of the following main components:
                </p>
                <SummaryTable
                  title="Structure Overview"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Shift Types',
                      description: 'Weekday (4 hours post-working hours) and Weekend (agreed hours).',
                    },
                    {
                      number: '02',
                      item: 'Shift Planning',
                      description: 'Involves backlog & specs compilation along with effort estimate and coordination with scrum masters, and approvals from line managers and HR.',
                    },
                    {
                      number: '03',
                      item: 'Execution',
                      description: 'Associates work during their designated rescue hours, attending check-ins, providing progress updates, and completing tasks.',
                    },
                    {
                      number: '04',
                      item: 'Payroll Confirmation',
                      description: 'Payment is processed only after task completion and manager confirmation.',
                    },
                  ]}
                  onViewFull={() => setStructureOverviewModalOpen(true)}
                />
                <FullTableModal
                  isOpen={structureOverviewModalOpen}
                  onClose={() => setStructureOverviewModalOpen(false)}
                  title="Structure Overview"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Shift Types',
                      description: 'Weekday (4 hours post-working hours) and Weekend (agreed hours).',
                    },
                    {
                      number: '02',
                      item: 'Shift Planning',
                      description: 'Involves backlog & specs compilation along with effort estimate and coordination with scrum masters, and approvals from line managers and HR.',
                    },
                    {
                      number: '03',
                      item: 'Execution',
                      description: 'Associates work during their designated rescue hours, attending check-ins, providing progress updates, and completing tasks.',
                    },
                    {
                      number: '04',
                      item: 'Payroll Confirmation',
                      description: 'Payment is processed only after task completion and manager confirmation.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="planning-process" title="Rescue Shift Planning Process">
                <p className="mb-6">
                  The Rescue Shift Planning process consists of the following main components:
                </p>
                <SummaryTable
                  title="Rescue Shift Planning Process"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Backlog Compilation',
                      action: 'The Project Manager/Coordinator compiles a list of outstanding work items, including clear specifications and estimated effort required for completion.',
                    },
                    {
                      number: '02',
                      item: 'Associate Availability Check',
                      action: 'The Project Manager/Coordinator coordinates with the relevant Scrum Master to confirm the availability and suitable timeslots for associates who will be assigned the tasks.',
                    },
                    {
                      number: '03',
                      item: 'Task Linkage',
                      action: 'All work items assigned to associates must link back to their tasks/CLIs to track and provide visibility on the rescue shift.',
                    },
                    {
                      number: '04',
                      item: 'Shift List Approval',
                      action: 'Once availability is confirmed, the Project Manager/Coordinator sends the proposed list of associates and tasks to the Line Manager for approval.',
                    },
                    {
                      number: '05',
                      item: 'HR Approval',
                      action: 'After receiving approval from the Line Manager, the list is sent to HR for final validation and approval.',
                    },
                    {
                      number: '06',
                      item: 'Moderator Appointment',
                      action: 'The Project Manager/Coordinator assigns a Moderator for each rescue shift to oversee progress and provide support where necessary.',
                    },
                    {
                      number: '07',
                      item: 'Confirmation Timing',
                      action: 'The rescue shift for the week should be confirmed at the start of the week, or in urgent cases, at least 2 days prior to the scheduled shift.',
                    },
                    {
                      number: '08',
                      item: 'Official Notification',
                      action: 'Associates are officially notified of their scheduled rescue shifts and tasks, ensuring they are informed well in advance.',
                    },
                  ]}
                  onViewFull={() => setPlanningModalOpen(true)}
                />
                <FullTableModal
                  isOpen={planningModalOpen}
                  onClose={() => setPlanningModalOpen(false)}
                  title="Rescue Shift Planning Process"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Backlog Compilation',
                      action: 'The Project Manager/Coordinator compiles a list of outstanding work items, including clear specifications and estimated effort required for completion.',
                    },
                    {
                      number: '02',
                      item: 'Associate Availability Check',
                      action: 'The Project Manager/Coordinator coordinates with the relevant Scrum Master to confirm the availability and suitable timeslots for associates who will be assigned the tasks.',
                    },
                    {
                      number: '03',
                      item: 'Task Linkage',
                      action: 'All work items assigned to associates must link back to their tasks/CLIs to track and provide visibility on the rescue shift.',
                    },
                    {
                      number: '04',
                      item: 'Shift List Approval',
                      action: 'Once availability is confirmed, the Project Manager/Coordinator sends the proposed list of associates and tasks to the Line Manager for approval.',
                    },
                    {
                      number: '05',
                      item: 'HR Approval',
                      action: 'After receiving approval from the Line Manager, the list is sent to HR for final validation and approval.',
                    },
                    {
                      number: '06',
                      item: 'Moderator Appointment',
                      action: 'The Project Manager/Coordinator assigns a Moderator for each rescue shift to oversee progress and provide support where necessary.',
                    },
                    {
                      number: '07',
                      item: 'Confirmation Timing',
                      action: 'The rescue shift for the week should be confirmed at the start of the week, or in urgent cases, at least 2 days prior to the scheduled shift.',
                    },
                    {
                      number: '08',
                      item: 'Official Notification',
                      action: 'Associates are officially notified of their scheduled rescue shifts and tasks, ensuring they are informed well in advance.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="during-shift" title="Process During the Rescue Shift">
                <p className="mb-6">
                  The process during the rescue shift consists of the following main components:
                </p>
                <SummaryTable
                  title="Process During the Rescue Shift"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Join the Collab Call',
                      action: 'Check in on your respective HR channel and join the Collab Call to continue working during your designated rescue hours.',
                    },
                    {
                      number: '02',
                      item: 'Task Alignment:',
                      action: 'Confirm alignment on the tasks you will be working on. If any tasks are unclear, reach out to the Moderator or your squad lead (if they are on rescue) for clarification.',
                    },
                    {
                      number: '03',
                      item: 'Progress Tracking',
                      action: 'Provide clear visibility on your progress throughout the shift by updating the team on the status of your assigned tasks.',
                    },
                    {
                      number: '04',
                      item: 'Mandatory Check-ins',
                      action: 'There will be 3 check-ins per day in the Collab Call to align on progress. Associates are mandatory to attend at least one check-in during the shift.',
                    },
                    {
                      number: '05',
                      item: 'Shift Cancellation',
                      action: 'If an associate fails to join the rescue shift one hour after its start time, the shift will be canceled.',
                    },
                  ]}
                  onViewFull={() => setDuringShiftModalOpen(true)}
                />
                <FullTableModal
                  isOpen={duringShiftModalOpen}
                  onClose={() => setDuringShiftModalOpen(false)}
                  title="Process During the Rescue Shift"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Join the Collab Call',
                      action: 'Check in on your respective HR channel and join the Collab Call to continue working during your designated rescue hours.',
                    },
                    {
                      number: '02',
                      item: 'Task Alignment:',
                      action: 'Confirm alignment on the tasks you will be working on. If any tasks are unclear, reach out to the Moderator or your squad lead (if they are on rescue) for clarification.',
                    },
                    {
                      number: '03',
                      item: 'Progress Tracking',
                      action: 'Provide clear visibility on your progress throughout the shift by updating the team on the status of your assigned tasks.',
                    },
                    {
                      number: '04',
                      item: 'Mandatory Check-ins',
                      action: 'There will be 3 check-ins per day in the Collab Call to align on progress. Associates are mandatory to attend at least one check-in during the shift.',
                    },
                    {
                      number: '05',
                      item: 'Shift Cancellation',
                      action: 'If an associate fails to join the rescue shift one hour after its start time, the shift will be canceled.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="roles-responsibilities" title="Roles & Responsibilities">
                <p className="mb-6">
                  This section defines the responsibilities of all roles involved to ensure accountability and effective governance.
                </p>
                <SummaryTable
                  title="Roles & Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Key Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={[
                    {
                      number: '01',
                      role: 'Project Manager/Coordinator',
                      responsibilities: '- Compile backlog items/specs and estimate effort.\n- Coordinate with scrum masters for availability.\n- Obtain approvals from line managers and HR.\n- Notify associates about their shifts and appoint moderators.\n- Confirm associate participation and provide confirmation for payroll',
                    },
                    {
                      number: '02',
                      role: 'Scrum Master',
                      responsibilities: '- Confirm associate availability and provide timeslots.\n- Ensure associates are assigned tasks aligned with their skills and availability.',
                    },
                    {
                      number: '03',
                      role: 'Line Manager',
                      responsibilities: '- Review and approve the rescue shift list.\n- Confirm associate participation and progress of the task',
                    },
                    {
                      number: '04',
                      role: 'HR',
                      responsibilities: '- Approve and validate rescue shift assignments.\n- Ensure compliance with payroll requirements.',
                    },
                    {
                      number: '05',
                      role: 'Associates',
                      responsibilities: '- Confirm participation in the rescue shift.\n- Complete assigned tasks and report progress.\n- Attend at least one check-in per shift and follow up on issues with the moderator or squad lead.',
                    },
                  ]}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles & Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Key Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={[
                    {
                      number: '01',
                      role: 'Project Manager/Coordinator',
                      responsibilities: '- Compile backlog items/specs and estimate effort.\n- Coordinate with scrum masters for availability.\n- Obtain approvals from line managers and HR.\n- Notify associates about their shifts and appoint moderators.\n- Confirm associate participation and provide confirmation for payroll',
                    },
                    {
                      number: '02',
                      role: 'Scrum Master',
                      responsibilities: '- Confirm associate availability and provide timeslots.\n- Ensure associates are assigned tasks aligned with their skills and availability.',
                    },
                    {
                      number: '03',
                      role: 'Line Manager',
                      responsibilities: '- Review and approve the rescue shift list.\n- Confirm associate participation and progress of the task',
                    },
                    {
                      number: '04',
                      role: 'HR',
                      responsibilities: '- Approve and validate rescue shift assignments.\n- Ensure compliance with payroll requirements.',
                    },
                    {
                      number: '05',
                      role: 'Associates',
                      responsibilities: '- Confirm participation in the rescue shift.\n- Complete assigned tasks and report progress.\n- Attend at least one check-in per shift and follow up on issues with the moderator or squad lead.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="remote-working" title="Remote Working in Rescue Shift">
                <p className="mb-6">
                  This section defines Remote working in the recue shift.
                </p>
                <SummaryTable
                  title="Remote Working in Rescue Shift"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'WFH Request Submission',
                      action: 'The Project Coordinator/Manager must submit a formal request for associates who need to work from home due to logistical concerns, together with the rescue shift approval.',
                    },
                    {
                      number: '02',
                      item: 'Operational Confirmation',
                      action: 'The Project Coordinator/Manager must confirm in the request that the associate is capable of performing all required activities effectively while working remotely during the rescue shift.',
                    },
                    {
                      number: '03',
                      item: 'Guidelines Compliance',
                      action: 'Remote-working associates are required to follow all rescue shift guidelines, ensuring responsiveness, task delivery, and availability throughout the shift.',
                    },
                  ]}
                  onViewFull={() => setRemoteWorkingModalOpen(true)}
                />
                <FullTableModal
                  isOpen={remoteWorkingModalOpen}
                  onClose={() => setRemoteWorkingModalOpen(false)}
                  title="Remote Working in Rescue Shift"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'WFH Request Submission',
                      action: 'The Project Coordinator/Manager must submit a formal request for associates who need to work from home due to logistical concerns, together with the rescue shift approval.',
                    },
                    {
                      number: '02',
                      item: 'Operational Confirmation',
                      action: 'The Project Coordinator/Manager must confirm in the request that the associate is capable of performing all required activities effectively while working remotely during the rescue shift.',
                    },
                    {
                      number: '03',
                      item: 'Guidelines Compliance',
                      action: 'Remote-working associates are required to follow all rescue shift guidelines, ensuring responsiveness, task delivery, and availability throughout the shift.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="payroll-compliance" title="Payroll Compliance">
                <p className="mb-6">
                  This section defines the payroll compliance and protocol for the recue shift.
                </p>
                <SummaryTable
                  title="Payroll Compliance"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Task Completion Confirmation',
                      action: 'Payment will only be processed if the associate completes all assigned tasks and the Project Manager or Line Manager verifies the completion.',
                    },
                    {
                      number: '02',
                      item: 'Non-Completion Consequence',
                      action: 'If expectations are not met, the shift will not be compensated.',
                    },
                    {
                      number: '03',
                      item: 'Shift Cancellation',
                      action: 'If an associate does not join the rescue shift within one hour of the start time, the shift will be canceled, and no payment will be made.',
                    },
                  ]}
                  onViewFull={() => setPayrollComplianceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={payrollComplianceModalOpen}
                  onClose={() => setPayrollComplianceModalOpen(false)}
                  title="Payroll Compliance"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Task Completion Confirmation',
                      action: 'Payment will only be processed if the associate completes all assigned tasks and the Project Manager or Line Manager verifies the completion.',
                    },
                    {
                      number: '02',
                      item: 'Non-Completion Consequence',
                      action: 'If expectations are not met, the shift will not be compensated.',
                    },
                    {
                      number: '03',
                      item: 'Shift Cancellation',
                      action: 'If an associate does not join the rescue shift within one hour of the start time, the shift will be canceled, and no payment will be made.',
                    },
                  ]}
                />
              </GuidelineSection>
            </div>

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

