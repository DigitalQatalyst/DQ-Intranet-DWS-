import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

function GuidelinePage() {
  const { user } = useAuth()
  const [guideTitle, setGuideTitle] = useState<string>('DQ Work From Home (WFH) Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('December 19, 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-wfh-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Work From Home (WFH) Guidelines')
          if (data.last_updated_at) {
            const date = new Date(data.last_updated_at)
            setLastUpdated(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
          }
        }
      } catch (error) {
        console.error('Error fetching guide title:', error)
      }
    })()
    return () => { cancelled = true }
  }, [])
  
  // Modal state management for each table
  const [coreComponentsModalOpen, setCoreComponentsModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)

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
                  <Link to="/marketplace/guides?tab=guidelines" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Guidelines
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{guideTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection title={guideTitle} date={lastUpdated} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Context Section */}
              <GuidelineSection id="context" title="Context">
                <p>
                  The Work From Home (WFH) Guidelines are designed to align DQ's remote work practices with the company's operational, cultural, and compliance standards.
                </p>
                <p>
                  As the organization continues to adopt flexible working models, it is essential to establish clear structures that ensure productivity, accountability, and collaboration remain consistent — whether associates are working remotely or from the office.
                </p>
                <p>
                  These guidelines provide a unified framework for associates, Practice Leads, and the DQ Operations (DQ Ops) team to coordinate and manage WFH arrangements transparently and efficiently.
                </p>
              </GuidelineSection>

              {/* Overview Section */}
              <GuidelineSection id="overview" title="Overview">
                <p className="mb-4">
                  The main objective of the WFH Guidelines is to ensure that remote work:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintains high standards of performance and accountability.</li>
                  <li>Promotes operational consistency across all DQ practices.</li>
                  <li>Supports flexible work arrangements without compromising team collaboration.</li>
                  <li>Provides clear approval, tracking, and visibility mechanisms.</li>
                </ul>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p>
                  The purpose of these guidelines is to define the process and expectations for associates working remotely. They ensure all WFH arrangements are pre-approved, transparent, and aligned with DQ's business continuity and performance expectations.
                </p>
              </GuidelineSection>

              {/* Scope Section */}
              <GuidelineSection id="scope" title="Scope">
                <p>
                  These guidelines apply to all DQ associates who may occasionally or regularly work remotely upon approval from their Line Managers.
                </p>
              </GuidelineSection>

              {/* Core Components Section */}
              <GuidelineSection id="core-components" title="Core Components">
                <p className="mb-6">
                  The Guidelines comprises of the following core components:
                </p>
                <SummaryTable
                  title="Core Components"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Program', accessor: 'program' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      program: 'Request Process',
                      description: 'All WFH requests must be submitted at least 24 hours in advance through the HR Channel, clearly stating the reason and date(s) requested.',
                    },
                    {
                      number: '02',
                      program: 'Approval Oversight',
                      description: '**Line Manager**: Provides pre-approval.\n**HR**: Gives final approval and ensures policy compliance.\n**HRA**: Manages compliance, tracking, and consistency.',
                    },
                    {
                      number: '03',
                      program: 'Visibility and Tracking',
                      description: 'Approved WFH schedules must be visible in the logistics channel and be approved in writing by the line manager.\n\nAssociates must create a thread on the HR Channel, posting their actions for the day and attaching channel engagement links for visibility.\n\nAttendance is tracked via DQ Live.\n\nIn emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device.',
                    },
                    {
                      number: '04',
                      program: 'Compliance and Performance',
                      description: 'Failure to post daily updates or remain active on DQ Live24 will be treated as an unpaid workday.\n\nNon-compliance may result in revocation of WFH privileges or performance review.',
                    },
                  ]}
                  onViewFull={() => setCoreComponentsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={coreComponentsModalOpen}
                  onClose={() => setCoreComponentsModalOpen(false)}
                  title="Core Components"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Program', accessor: 'program' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      program: 'Request Process',
                      description: 'All WFH requests must be submitted at least 24 hours in advance through the HR Channel, clearly stating the reason and date(s) requested.',
                    },
                    {
                      number: '02',
                      program: 'Approval Oversight',
                      description: '**Line Manager**: Provides pre-approval.\n**HR**: Gives final approval and ensures policy compliance.\n**HRA**: Manages compliance, tracking, and consistency.',
                    },
                    {
                      number: '03',
                      program: 'Visibility and Tracking',
                      description: 'Approved WFH schedules must be visible in the logistics channel and be approved in writing by the line manager.\n\nAssociates must create a thread on the HR Channel, posting their actions for the day and attaching channel engagement links for visibility.\n\nAttendance is tracked via DQ Live.\n\nIn emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device.',
                    },
                    {
                      number: '04',
                      program: 'Compliance and Performance',
                      description: 'Failure to post daily updates or remain active on DQ Live24 will be treated as an unpaid workday.\n\nNon-compliance may result in revocation of WFH privileges or performance review.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Roles and Responsibilities Section */}
              <GuidelineSection id="roles-responsibilities" title="Roles and Responsibilities">
                <p className="mb-6">
                  To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:
                </p>
                <SummaryTable
                  title="Roles and Responsibilities"
                  columns={[
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      step: '01',
                      description: '**Associate**\nMust submit WFH requests via HR Channel, post daily actions on HR channel, and stay active on DQ Live24.',
                    },
                    {
                      step: '02',
                      description: '**Line Manager**\nPre-approves requests, monitors deliverables.',
                    },
                    {
                      step: '03',
                      description: '**HR**\nManage WFH requests. Give final approval.',
                    },
                    {
                      step: '04',
                      description: '**HR & Admin**\nOversee compliance, tracking, and consistency.',
                    },
                  ]}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles and Responsibilities"
                  columns={[
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      step: '01',
                      description: '**Associate**\nMust submit WFH requests via HR Channel, post daily actions on HR channel, and stay active on DQ Live24.',
                    },
                    {
                      step: '02',
                      description: '**Line Manager**\nPre-approves requests, monitors deliverables.',
                    },
                    {
                      step: '03',
                      description: '**HR**\nManage WFH requests. Give final approval.',
                    },
                    {
                      step: '04',
                      description: '**HR & Admin**\nOversee compliance, tracking, and consistency.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Guiding Principles Section */}
              <GuidelineSection id="guiding-principles" title="Guiding Principles and Controls">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Transparency</strong>: All WFH activities must be visible to managers and teams.</li>
                  <li><strong>Accountability</strong>: Associates remain responsible for deliverables and communication.</li>
                  <li><strong>Equity</strong>: WFH approvals are granted fairly based on role and operational needs.</li>
                  <li><strong>Security</strong>: All company data handled remotely must follow DQ's data protection standards.</li>
                  <li><strong>Compliance</strong>: Violations may lead to privilege suspension or disciplinary review.</li>
                </ul>
              </GuidelineSection>

              {/* Tools and Resources Section */}
              <GuidelineSection id="tools-resources" title="Tools and Resources">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>DQ Live24</strong>: For visibility and communication.</li>
                  <li><strong>DQ Shifts</strong>: For time tracking and attendance management.</li>
                  <li><strong>DQ Logistics Channel</strong>: For sharing approved WFH schedules.</li>
                  <li><strong>HR Portal</strong>: For submitting requests and tracking WFH history.</li>
                </ul>
              </GuidelineSection>

              {/* KPIs Section */}
              <GuidelineSection id="kpis" title="Key Performance Indicators (KPIs)">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Percentage of associates compliant with WFH submission deadlines.</li>
                  <li>Number of unapproved or non-compliant WFH incidents.</li>
                  <li>Percentage of WFH attendance recorded via DQ Shifts.</li>
                  <li>Associate satisfaction and productivity levels during WFH.</li>
                  <li>Frequency of policy violations or exceptions reported.</li>
                </ul>
              </GuidelineSection>

              {/* Review Schedule Section */}
              <GuidelineSection id="review-schedule" title="Review and Update Schedule">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quarterly</strong>: The guidelines will be reviewed every three months to ensure they remain aligned with operational needs.</li>
                  <li><strong>Ad-Hoc Optimization</strong>: The guidelines can be optimized at any time if a need for optimization is identified.</li>
                </ul>
              </GuidelineSection>

            </div>

            {/* Right Column - Sidebar Navigation */}
            <div className="lg:col-span-1">
              <SideNav />
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

