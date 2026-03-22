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
  const [bdTemplatesModalOpen, setBdTemplatesModalOpen] = useState(false)
  const [bidOrchestrationModalOpen, setBidOrchestrationModalOpen] = useState(false)
  const [bidControlModalOpen, setBidControlModalOpen] = useState(false)
  const [proposalAccelerationModalOpen, setProposalAccelerationModalOpen] = useState(false)
  const [skunkProjectsModalOpen, setSkunkProjectsModalOpen] = useState(false)

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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Deals | BD Guidelines</span>
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
                  The Deals Factory spans from Market to Lead, Lead to opportunity, Opportunity to Order, and delivery. The MarCom Tower handles Market to Lead, while the Business Development (BD) Tower focuses on Lead to Opportunity and Opportunity to Order, driving lead qualification, opportunity shaping, and deal progression.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p>
                  These guidelines define the BD Tower's roles and activities from Lead to Opportunity and Opportunity to Order. They ensure clear lead qualification, structured opportunity development, and predictable deal progression. The goal is to enable disciplined execution, accountability, and consistent outcomes across BD activities.
                </p>
              </GuidelineSection>

              {/* Focus Area 01 – BD Templates Section */}
              <GuidelineSection id="focus-area-01" title="Focus Area 01 – BD Templates">
                <SummaryTable
                  title="BD Templates"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '1',
                      item: 'Template Repository',
                      description: 'A single, approved folder structure for all BD templates, including documents, trackers, and reference material.',
                    },
                    {
                      number: '2',
                      item: 'Standard Links',
                      description: 'All active deals must reference the official template links to avoid duplication and version drift.',
                    },
                    {
                      number: '3',
                      item: 'Template Instantiation',
                      description: 'Each deal must start by instantiating the required BD templates using the approved naming and structure.',
                    },
                    {
                      number: '4',
                      item: 'Deal Tracker',
                      description: 'A standard BD tracker must be maintained per deal to track status, progress, and key decisions.',
                    },
                    {
                      number: '5',
                      item: 'Update Discipline',
                      description: 'Templates and trackers must be kept current and reflect the latest deal position at all times.',
                    },
                    {
                      number: '6',
                      item: 'Reuse & Learning',
                      description: 'Completed deal artefacts should be retained to support reuse and continuous improvement.',
                    },
                  ]}
                  onViewFull={() => setBdTemplatesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={bdTemplatesModalOpen}
                  onClose={() => setBdTemplatesModalOpen(false)}
                  title="Focus Area 01 – BD Templates"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '1',
                      item: 'Template Repository',
                      description: 'A single, approved folder structure for all BD templates, including documents, trackers, and reference material.',
                    },
                    {
                      number: '2',
                      item: 'Standard Links',
                      description: 'All active deals must reference the official template links to avoid duplication and version drift.',
                    },
                    {
                      number: '3',
                      item: 'Template Instantiation',
                      description: 'Each deal must start by instantiating the required BD templates using the approved naming and structure.',
                    },
                    {
                      number: '4',
                      item: 'Deal Tracker',
                      description: 'A standard BD tracker must be maintained per deal to track status, progress, and key decisions.',
                    },
                    {
                      number: '5',
                      item: 'Update Discipline',
                      description: 'Templates and trackers must be kept current and reflect the latest deal position at all times.',
                    },
                    {
                      number: '6',
                      item: 'Reuse & Learning',
                      description: 'Completed deal artefacts should be retained to support reuse and continuous improvement.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Focus Area 02: Bid Orchestration Section */}
              <GuidelineSection id="focus-area-02" title="Focus Area 02: Bid Orchestration">
                <p className="mb-6">
                  Bid orchestration focuses on the strategic management and execution of the bid process, ensuring that all elements of the business development (BD) lifecycle are effectively coordinated. This includes lead qualification, the creation of tailored bid strategies, stakeholder alignment, and seamless execution of bid-related tasks. By optimizing these processes, bid orchestration helps maximize the chances of winning by delivering a well-organized, strategic, and client-focused proposal.
                </p>
                <SummaryTable
                  title="Bid Orchestration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Win Themes & Strategy Development',
                      description: 'Identify and align win themes that differentiate the bid, then refine the win strategy based on client needs, competitive landscape, and internal capabilities to ensure successful outcomes.',
                    },
                    {
                      number: '02',
                      item: 'Day 0X - Win Strategy Development',
                      description: 'Define and refine win strategies based on competitive landscape, client needs, and internal capabilities.',
                    },
                    {
                      number: '03',
                      item: 'Stakeholder Engagement',
                      description: 'Ensure early alignment and involvement of all key stakeholders to optimize decision-making and resource allocation.',
                    },
                  ]}
                  onViewFull={() => setBidOrchestrationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={bidOrchestrationModalOpen}
                  onClose={() => setBidOrchestrationModalOpen(false)}
                  title="Focus Area 02: Bid Orchestration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Win Themes & Strategy Development',
                      description: 'Identify and align win themes that differentiate the bid, then refine the win strategy based on client needs, competitive landscape, and internal capabilities to ensure successful outcomes.',
                    },
                    {
                      number: '02',
                      item: 'Day 0X - Win Strategy Development',
                      description: 'Define and refine win strategies based on competitive landscape, client needs, and internal capabilities.',
                    },
                    {
                      number: '03',
                      item: 'Stakeholder Engagement',
                      description: 'Ensure early alignment and involvement of all key stakeholders to optimize decision-making and resource allocation.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Focus Area 03: Bid Control Section */}
              <GuidelineSection id="focus-area-03" title="Focus Area 03: Bid Control">
                <p className="mb-6">
                  Bid control ensures consistency and alignment across bids, focusing on risk management, compliance, and structured decision-making. Below are its key elements:
                </p>
                <SummaryTable
                  title="Bid Control"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '02',
                      item: 'Win Themes Alignment',
                      description: 'Establish win themes to align teams on value propositions.',
                    },
                    {
                      number: '03',
                      item: 'Product Sync',
                      description: 'Synchronize product teams with bid requirements to align solutions with expectations.',
                    },
                    {
                      number: '04',
                      item: 'Master Initiatives Sync',
                      description: 'Ensure consistency across all initiatives involved in the bid.',
                    },
                    {
                      number: '05',
                      item: 'Risk Management',
                      description: 'Identify and mitigate risks early in the bid process.',
                    },
                  ]}
                  onViewFull={() => setBidControlModalOpen(true)}
                />
                <FullTableModal
                  isOpen={bidControlModalOpen}
                  onClose={() => setBidControlModalOpen(false)}
                  title="Focus Area 03: Bid Control"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '02',
                      item: 'Win Themes Alignment',
                      description: 'Establish win themes to align teams on value propositions.',
                    },
                    {
                      number: '03',
                      item: 'Product Sync',
                      description: 'Synchronize product teams with bid requirements to align solutions with expectations.',
                    },
                    {
                      number: '04',
                      item: 'Master Initiatives Sync',
                      description: 'Ensure consistency across all initiatives involved in the bid.',
                    },
                    {
                      number: '05',
                      item: 'Risk Management',
                      description: 'Identify and mitigate risks early in the bid process.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Focus Area 04: Proposal Acceleration Section */}
              <GuidelineSection id="focus-area-04" title="Focus Area 04: Proposal Acceleration">
                <p className="mb-6">
                  Proposal acceleration speeds up proposal generation using AI, templates, and efficient review processes, ensuring quicker, high-quality submissions. Below are its core components to ensure proposal acceleration:
                </p>
                <SummaryTable
                  title="Proposal Acceleration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'References',
                      description: 'Ensure access to a comprehensive library of previous proposals, case studies, and client references to speed up proposal generation.',
                    },
                    {
                      number: '02',
                      item: 'AI tools for proposal generation',
                      description: 'Leverage AI tools like GPT for faster and higher-quality proposal creation.',
                    },
                    {
                      number: '03',
                      item: 'Proposal Review Process',
                      description: 'Implement an efficient, multi-tiered review process to ensure quality control and alignment before submission.',
                    },
                    {
                      number: '04',
                      item: 'Collaboration Tools',
                      description: 'Utilize collaborative tools to allow real-time updates and feedback, enhancing the speed and quality of proposal development.',
                    },
                  ]}
                  onViewFull={() => setProposalAccelerationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={proposalAccelerationModalOpen}
                  onClose={() => setProposalAccelerationModalOpen(false)}
                  title="Focus Area 04: Proposal Acceleration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'References',
                      description: 'Ensure access to a comprehensive library of previous proposals, case studies, and client references to speed up proposal generation.',
                    },
                    {
                      number: '02',
                      item: 'AI tools for proposal generation',
                      description: 'Leverage AI tools like GPT for faster and higher-quality proposal creation.',
                    },
                    {
                      number: '03',
                      item: 'Proposal Review Process',
                      description: 'Implement an efficient, multi-tiered review process to ensure quality control and alignment before submission.',
                    },
                    {
                      number: '04',
                      item: 'Collaboration Tools',
                      description: 'Utilize collaborative tools to allow real-time updates and feedback, enhancing the speed and quality of proposal development.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Focus Area 05: Skunk Projects Delivery Acceleration Section */}
              <GuidelineSection id="focus-area-05" title="Focus Area 05: Skunk Projects Delivery Acceleration">
                <p className="mb-6">
                  Bid to delivery acceleration ensures a smooth transition from winning a bid to delivering the project, with pre-prepared resources to speed up execution. The following are its key components:
                </p>
                <SummaryTable
                  title="Skunk Projects Delivery Acceleration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Skunk Works Teams',
                      description: 'Form specialized teams to focus on high-priority, fast-tracked projects to ensure rapid delivery.',
                    },
                    {
                      number: '02',
                      item: 'Ready Reports',
                      description: 'Ensure the development and maintenance of pre-defined, ready-to-use reports for quick access during project execution.',
                    },
                    {
                      number: '03',
                      item: 'Ready Specs',
                      description: 'Maintain a repository of ready specifications that can be quickly referenced and applied to projects post-bid.',
                    },
                    {
                      number: '04',
                      item: 'Ready Info',
                      description: 'Standardize and centralize all project-related information to be easily accessible when transitioning from bid to delivery.',
                    },
                    {
                      number: '05',
                      item: 'Ready Prototypes',
                      description: 'Ensure prototype templates and resources are pre-defined and available to accelerate the product development phase.',
                    },
                  ]}
                  onViewFull={() => setSkunkProjectsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={skunkProjectsModalOpen}
                  onClose={() => setSkunkProjectsModalOpen(false)}
                  title="Focus Area 05: Skunk Projects Delivery Acceleration"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Items', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Skunk Works Teams',
                      description: 'Form specialized teams to focus on high-priority, fast-tracked projects to ensure rapid delivery.',
                    },
                    {
                      number: '02',
                      item: 'Ready Reports',
                      description: 'Ensure the development and maintenance of pre-defined, ready-to-use reports for quick access during project execution.',
                    },
                    {
                      number: '03',
                      item: 'Ready Specs',
                      description: 'Maintain a repository of ready specifications that can be quickly referenced and applied to projects post-bid.',
                    },
                    {
                      number: '04',
                      item: 'Ready Info',
                      description: 'Standardize and centralize all project-related information to be easily accessible when transitioning from bid to delivery.',
                    },
                    {
                      number: '05',
                      item: 'Ready Prototypes',
                      description: 'Ensure prototype templates and resources are pre-defined and available to accelerate the product development phase.',
                    },
                  ]}
                />
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


