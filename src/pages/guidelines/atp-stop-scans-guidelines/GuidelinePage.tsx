import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
import { SummaryTable } from './SummaryTable'
import { FullTableModal } from './FullTableModal'

function GuidelinePage() {
  const { user } = useAuth()
  
  // Modal state management for each table
  const [specifyModalOpen, setSpecifyModalOpen] = useState(false)
  const [socializeModalOpen, setSocializeModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [scrumModalOpen, setScrumModalOpen] = useState(false)
  const [structureModalOpen, setStructureModalOpen] = useState(false)
  const [succeedModalOpen, setSucceedModalOpen] = useState(false)
  const [speedUpModalOpen, setSpeedUpModalOpen] = useState(false)

  // Table data for each SFIA rating section
  const specifyData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Learning how to define tasks; needs full guidance.', how: 'No task defined as per DQ standard.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Follow task formats as per DQ standard.', how: 'At least 1 task accurately designed as per DQ standard.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Maintain best practice across all tasks.', how: 'Well documented planner as per DQ standard.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Accuracy in task structure content.', how: 'All tasks are accurately defined.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Guides team to format tasks per DQ standard.', how: 'Lead team\'s ATP.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Accuracy in teams task definition.', how: 'Accuracy in task output per definition.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influences task documentation practices across functions.', how: 'Improved implementation of DQ practices.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Sets best practice standards for clarity org-wide impacting externally.', how: 'New practices were introduced.' },
  ]

  const socializeData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Learning how to communicate progress.', how: 'No task has an active engagement.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Active real-time task engagement.', how: 'At least 1 task with real-time active engagement.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Maintain real-time active engagement across tasks.', how: 'Real-time active engagement across all tasks.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Clarity in engagement notes.', how: 'Well-structured engagement notes.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Incite team real-time updates for visibility and alignment.', how: 'Lead to the team\'s sustained engagement notes.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Real-time engagement across teams.', how: 'Cross teams\' sustained engagement notes.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influences communication across organizations.', how: 'Real-time engagement across organizations.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Influences communication across the organization for external impact.', how: 'Engagement note content indicating external impact.' },
  ]

  const shareData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Attends collaborative work sessions.', how: 'Observe and track engagement.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Attends collaborative work sessions but with minimal participation.', how: 'Contribute when prompted; track.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Participates actively in collaborative work sessions.', how: 'Contribute when prompted; give feedback of participation.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Leads discussions and share knowledge.', how: 'Share ideas and engage consistently.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Facilitates collaborative work sessions.', how: 'Plan, moderate and ensure participation of others.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Drive learning and collaboration with a team during collaborative work sessions.', how: 'Coach and share knowledge.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influence collaboration culture within the organization.', how: 'Promote collaboration, monitoring the adoption of teams internally.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Influence collaboration culture for external impact.', how: 'Extend collaboration beyond organization; track impact.' },
  ]

  const scrumData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Know Scrum process; attend.', how: 'Attend sessions.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Follow scrum process; attend regularly with little contribution.', how: 'Follow the agenda and be able to indicate basic understandings.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Active participation and contribution during scrum.', how: 'Share updates and contribute ideas.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Drives squad scrum participation.', how: 'Encourage team engagement.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Facilitates team scrums and ensures ceremonies add value.', how: 'Lead ceremonies ensure output and discussions aligns.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Instill scrum discipline across multiple teams.', how: 'Enlighten team, monitor adherence and improvement.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influences of agile adoption across organizations.', how: 'Promote agile practices across organizations and guides for adoption.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Drive strategic direction for organizational impact.', how: 'Shape agile strategy; align initiatives with business goals.' },
  ]

  const structureData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Learning how to document ATP.', how: 'Missing some task links on ATP.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Well documented ATP.', how: 'All task links in place on ATP with SEDU | WSU submitted.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'ATP alignment with tasks.', how: 'All task progress accurately mapped with ATP and timely submission of SEDU | WSU.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Effectively plan and task work with ATP.', how: 'SEDU | WSU well documented.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Incite team on task alignment with ATP.', how: 'Lead team\'s ATP.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Ensure consistency in task alignment with ATP.', how: 'Cross team sustained quality output.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influences ATP standards across the organization.', how: 'Improved task work and output.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Sets benchmarks for ATP governance and visibility.', how: 'Define ATP standards to ensure alignment with organization priorities.' },
  ]

  const succeedData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Learning ADP goals and KPIs.', how: 'Observe goals, ask questions, and seek guidance.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Understands goals and applies them to drive outcomes.', how: 'Connect tasks to ADP KPIs.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Achieves task outcomes.', how: 'Complete assigned tasks with relevant outputs.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Plan and deliver the above goals.', how: 'All tasks assigned completed with practical outcomes' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Enables team to align goals with outcomes.', how: 'Team members understand goals and team progress.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Ensure success across teams.', how: 'Coordination and impact within units.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Guides organizational goal alignment.', how: 'Drive organizational alignment; influences decision-making.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Shapes culture of excellence and outcome of ownership.', how: 'Drive outcomes and set benchmarks for organizational impact.' },
  ]

  const speedUpData = [
    { number: '01', rating: 'Level 00', title: 'Learning', what: 'Learning available tools.', how: 'Explores features.' },
    { number: '02', rating: 'Level 01', title: 'Follow', what: 'Use basic tools when guided.', how: 'Application of the use of basic tools with support.' },
    { number: '03', rating: 'Level 02', title: 'Assist', what: 'Use tools independently for daily tasks.', how: 'Completion of tasks using basic tools.' },
    { number: '04', rating: 'Level 03', title: 'Apply', what: 'Adopts tools to enhance performance.', how: 'Identifies automation opportunities and applies tools to improve workflow.' },
    { number: '05', rating: 'Level 04', title: 'Enable', what: 'Enables others to use automation effectively.', how: 'Coaches team on tool use and monitor team adoption.' },
    { number: '06', rating: 'Level 05', title: 'Ensure', what: 'Ensures tool integration & efficiency in team workflows.', how: 'Implement consistent processes; track adoption and efficiency across teams.' },
    { number: '07', rating: 'Level 06', title: 'Influence', what: 'Influences org-wide automation strategy.', how: 'Advocate automation initiatives; align cross team adoption; monitors impact.' },
    { number: '08', rating: 'Level 07', title: 'Inspire', what: 'Inspires innovation and adoption of intelligent automation.', how: 'Drives organizational culture for innovation beyond the organization.' },
  ]

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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Guidelines | ATP Stop Scans Guidelines</span>
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
              <GuidelineSection id="context" title="1.0 Context">
                <p>
                  The Stop Scan Review is a monthly performance assessment that will now utilize the SFIA (Skills Framework for the Information Age) (0-7) Rating Matrix against the TMS 7S Tenets (Specify, Socialize, Share, Scrum, Structure, Succeed, and Speed-up). This structured framework provides the basis for reviewing associate performance, ensuring that skill evaluations are visible, measurable, and consistently aligned with DQ's operational and strategic priorities.
                </p>
              </GuidelineSection>

              {/* Definition Section */}
              <GuidelineSection id="definition" title="2.0 Definition">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SFIA (0-7) Rating Matrix for TMS 7S Tenets</h3>
                <p>
                  This matrix is a competency framework that maps associate skill levels from 0 (Learning) to 7 (Inspire) against the seven TMS 7S Tenets (Specify, Socialize, Share, Scrum, Structure, Succeed, Speed-up). It is designed to enhance efficiency, alignment, and transparency in tracking associates' competency development and contributions, focusing on performance impact and capability.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="3.0 Purpose">
                <p>
                  The purpose of this guideline is to ensure that competency levels are evaluated consistently, aligned with business goals, and support accountability and development. It provides line managers with a structured approach to deliver actionable feedback, recognize current capabilities, and identify areas for continuous improvement and professional growth.
                </p>
              </GuidelineSection>

              {/* SFIA Rating Framework Section */}
              <GuidelineSection id="sfia-rating-framework" title="4.0 SFIA (0-7) Rating Framework">
                <p>
                  This framework defines the competency levels and the criteria used for evaluation across the seven TMS Tenets, utilizing the SFIA (0-7) scale.
                </p>
              </GuidelineSection>

              {/* Specify Section */}
              <GuidelineSection id="specify" title="4.1 Specify">
                <p className="mb-6">
                  The ability to accurately define and structure work, ensuring clarity and adherence to DQ standards.
                </p>
                <SummaryTable
                  title="Specify - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={specifyData}
                  onViewFull={() => setSpecifyModalOpen(true)}
                />
                <FullTableModal
                  isOpen={specifyModalOpen}
                  onClose={() => setSpecifyModalOpen(false)}
                  title="4.1 Specify - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={specifyData}
                />
              </GuidelineSection>

              {/* Socialize Section */}
              <GuidelineSection id="socialize" title="4.2 Socialize">
                <p className="mb-6">
                  The ability to actively communicate, engage, and update progress in real time for visibility and alignment.
                </p>
                <SummaryTable
                  title="Socialize - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={socializeData}
                  onViewFull={() => setSocializeModalOpen(true)}
                />
                <FullTableModal
                  isOpen={socializeModalOpen}
                  onClose={() => setSocializeModalOpen(false)}
                  title="4.2 Socialize - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={socializeData}
                />
              </GuidelineSection>

              {/* Share Section */}
              <GuidelineSection id="share" title="4.3 Share">
                <p className="mb-6">
                  The ability to participate, lead, coach, and drive a culture of knowledge sharing and collaboration.
                </p>
                <SummaryTable
                  title="Share - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={shareData}
                  onViewFull={() => setShareModalOpen(true)}
                />
                <FullTableModal
                  isOpen={shareModalOpen}
                  onClose={() => setShareModalOpen(false)}
                  title="4.3 Share - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={shareData}
                />
              </GuidelineSection>

              {/* Scrum Section */}
              <GuidelineSection id="scrum" title="4.4 Scrum">
                <p className="mb-6">
                  The ability to follow, participate in, drive, and influence agile adoption and strategy.
                </p>
                <SummaryTable
                  title="Scrum - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={scrumData}
                  onViewFull={() => setScrumModalOpen(true)}
                />
                <FullTableModal
                  isOpen={scrumModalOpen}
                  onClose={() => setScrumModalOpen(false)}
                  title="4.4 Scrum - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={scrumData}
                />
              </GuidelineSection>

              {/* Structure Section */}
              <GuidelineSection id="structure" title="4.5 Structure">
                <p className="mb-6">
                  The ability to document, align, and govern work planning using the Associate Timesheet Performance (ATP).
                </p>
                <SummaryTable
                  title="Structure - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={structureData}
                  onViewFull={() => setStructureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={structureModalOpen}
                  onClose={() => setStructureModalOpen(false)}
                  title="4.5 Structure - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={structureData}
                />
              </GuidelineSection>

              {/* Succeed Section */}
              <GuidelineSection id="succeed" title="4.6 Succeed">
                <p className="mb-6">
                  The ability to understand, align, plan, and deliver work to achieve organizational goals.
                </p>
                <SummaryTable
                  title="Succeed - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={succeedData}
                  onViewFull={() => setSucceedModalOpen(true)}
                />
                <FullTableModal
                  isOpen={succeedModalOpen}
                  onClose={() => setSucceedModalOpen(false)}
                  title="4.6 Succeed - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={succeedData}
                />
              </GuidelineSection>

              {/* Speed-up Section */}
              <GuidelineSection id="speed-up" title="4.7 Speed-up">
                <p className="mb-6">
                  The ability to adopt, use, integrate, and influence automation and tools for enhanced efficiency and innovation.
                </p>
                <SummaryTable
                  title="Speed-up - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={speedUpData}
                  onViewFull={() => setSpeedUpModalOpen(true)}
                />
                <FullTableModal
                  isOpen={speedUpModalOpen}
                  onClose={() => setSpeedUpModalOpen(false)}
                  title="4.7 Speed-up - SFIA Rating Matrix"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Rating', accessor: 'rating' },
                    { header: 'Title', accessor: 'title' },
                    { header: 'What (Competency Focus)', accessor: 'what' },
                    { header: 'How (Evidence/Behavior)', accessor: 'how' },
                  ]}
                  data={speedUpData}
                />
              </GuidelineSection>

              {/* STOP SCAN TEMPLATE Section */}
              <GuidelineSection id="stop-scan-template" title="5.0 STOP SCAN TEMPLATE">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Subject: [Month] ATP Stop Scan & Compliance Review</p>
                      <p className="text-gray-700">
                        Hi [Name],
                      </p>
                      <p className="text-gray-700 mt-2">
                        I have reviewed your [Month] ATP for compliance and identified several gaps that need to be addressed. Kindly aim to resolve these issues by [Due Date] and include actual screenshots to support the optimizations made.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">1. Specify</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to define and structure task work clearly)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Major Gaps (i.e. Task Definition, ...)</li>
                          <li>Minor Gaps (i.e. Task Definition, ...)</li>
                          <li>Clear Target (i.e. Output)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">2. Socialize</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to communicate and engage in real time for visibility and alignment)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Problems (i.e. Engagement, ...)</li>
                          <li>Major Gaps (i.e. Engagement, ...)</li>
                          <li>Minor Gaps (i.e. Engagement, ...)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">3. Share</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to participate and do collaborative work)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Major Gaps (i.e. Participation, ...)</li>
                          <li>Minor Gaps: (i.e. Participation, ...)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">4. Scrum</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to follow, participate in, drive and influence agile adoption)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Major Gaps (i.e. Participation, ...)</li>
                          <li>Minor Gaps (i.e. Participation, ...)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">5. Structure</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to document, align and govern task work using ATP)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Problems (i.e. Documentation, Links, ...):</li>
                          <li>Major Gaps (i.e. Documentation, Links, ...):</li>
                          <li>Minor Gaps (i.e. Documentation, Links, ...):</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">6. Succeed</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to plan, align and deliver outputs that drives organization goals)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Problems (i.e. Output, ...)</li>
                          <li>Major Gaps (i.e. Output, ...)</li>
                          <li>Minor Gaps: (i.e. Output, ...)</li>
                          <li>Clear Target (i.e. Monthly Target, ...)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">7. Speed-up</h4>
                        <p className="text-sm text-gray-600 mb-3">(Ability to adopt, integrate and influence tools & automation for efficiency)</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Problems (Tool Adoption, Automation, ...):</li>
                          <li>Major Gaps (Tool Adoption, Automation, ...):</li>
                          <li>Minor Gaps (Tool Adoption, Automation, ...):</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-6">
                      <p className="font-semibold text-gray-900 mb-4">I am therefore initiating the STOP process therefore and will be:</p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Sending a follow-up reminder today to ensure the resolutions are in progress.</li>
                        <li>Following up with an MS Teams call on day & date xxx if it is still unresolved.</li>
                        <li>Remain in scrum clinic on day & date xxx if gaps remain unresolved.</li>
                        <li>Set a BWS jail session on day & date xxx if resolutions remain unresolved.</li>
                        <li>Update the payroll tracker accordingly.</li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-300 pt-6">
                      <p className="font-semibold text-gray-900 mb-4">Additionally, note that the following must also be adhered to, addressed and updates provided by the stated dates:</p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>All ATP gaps must be resolved, with ACTUAL screenshots uploaded by day & date as mentioned above.</li>
                        <li>Confirm that there are no pending or recurring STOP items when providing the above feedback.</li>
                        <li>ATP must be color coded, self-reviewed and next month's initial targets set and submitted to LM for review by 20th October 2025.</li>
                        <li>All SEDU | WSU submissions for the entire month must be completed, with supporting screenshots shared by 20th October 2025.</li>
                        <li>ATP must be reviewed and next month's targets validated by the line manager by the 24th October 2025</li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-300 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">8. Next Month's Target</h4>
                      <p className="text-gray-700">N/A</p>
                    </div>
                  </div>
                </div>
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

