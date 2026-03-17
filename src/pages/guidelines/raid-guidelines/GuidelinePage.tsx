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
  const currentSlug = 'raid-guidelines'
  
  // Modal state management for each table
  const [valueStreamModalOpen, setValueStreamModalOpen] = useState(false)
  const [leanGovernanceModalOpen, setLeanGovernanceModalOpen] = useState(false)
  const [riskWorkflowModalOpen, setRiskWorkflowModalOpen] = useState(false)
  const [riskIdentificationModalOpen, setRiskIdentificationModalOpen] = useState(false)
  const [riskMitigationModalOpen, setRiskMitigationModalOpen] = useState(false)
  const [riskEscalationModalOpen, setRiskEscalationModalOpen] = useState(false)
  const [riskTypesModalOpen, setRiskTypesModalOpen] = useState(false)
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false)
  const [assumptionsGuidelinesModalOpen, setAssumptionsGuidelinesModalOpen] = useState(false)
  const [exampleAssumptionsModalOpen, setExampleAssumptionsModalOpen] = useState(false)
  const [issuesModalOpen, setIssuesModalOpen] = useState(false)
  const [issuesGuidelinesModalOpen, setIssuesGuidelinesModalOpen] = useState(false)
  const [exampleIssuesModalOpen, setExampleIssuesModalOpen] = useState(false)
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false)
  const [dependencyGuidelinesModalOpen, setDependencyGuidelinesModalOpen] = useState(false)
  const [exampleDependenciesModalOpen, setExampleDependenciesModalOpen] = useState(false)
  const [riskRegisterModalOpen, setRiskRegisterModalOpen] = useState(false)

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
                  <span className="ml-1 text-gray-500 md:ml-2">RAID Guidelines</span>
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
                  The Across DQ projects, whether in the design or deploy, delivery is often seen as the finish line—the tangible output of months of effort. But what if I told you that delivery is just a fraction of the broader value stream?
                </p>
                <p className="mt-4">
                  Imagine a relay race. The final runner crosses the finish line and gets the applause, but the race was only won because of smooth baton passes, coordinated pacing, and clear communication among the team. Similarly, in digital transformation projects, designing and deploying are visible milestones, but real success hinges on what happens behind the scenes: how well we manage risk, clarify assumptions, resolve issues, and track dependencies.
                </p>
                <p className="mt-4">
                  To understand this better, we need to look at the overall value stream that guides each step of the process. By doing so, we can better appreciate the interconnections and how each phase contributes to the overall success, beyond just delivery.
                </p>
              </GuidelineSection>

              {/* Value Stream Section */}
              <GuidelineSection id="value-stream" title="Value Stream – Heartbeat of DQ Projects">
                <p className="mb-6">
                  To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn&apos;t just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.
                </p>
                <SummaryTable
                  title="Value Streams"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Value Streams', accessor: 'stream' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      stream: 'Client Acquisition',
                      type: 'Operational Value Stream',
                      description: 'Attract and onboard clients, resulting in signed contracts and clear needs',
                    },
                    {
                      number: '02',
                      stream: 'Solution Design & Proposal',
                      type: 'Development Value Stream',
                      description: 'Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals.',
                    },
                    {
                      number: '03',
                      stream: 'Agile Delivery',
                      type: 'Development Value Stream',
                      description: 'Develop and deploy solutions in agile increments, achieving working software and PI objectives.',
                    },
                    {
                      number: '04',
                      stream: 'Client Success',
                      type: 'Operational Value Stream',
                      description: 'Drive adoption and support, ensuring client satisfaction and meeting KPIs.',
                    },
                    {
                      number: '05',
                      stream: 'Continuous Integration & Deployment',
                      type: 'Development Value Stream',
                      description: 'Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases.',
                    },
                    {
                      number: '06',
                      stream: 'Client Retention',
                      type: 'Operational Value Stream',
                      description: 'Strengthen relationships and upsell, increasing lifetime value and revenue.',
                    },
                    {
                      number: '07',
                      stream: 'Capability Development',
                      type: 'Development Value Stream',
                      description: 'Build agile teams and practices, leading to certified teams and faster delivery.',
                    },
                    {
                      number: '08',
                      stream: 'Governance & Risk',
                      type: 'Operational Value Stream',
                      description: 'Ensure alignment, compliance, and risk control, reducing risks.',
                    },
                    {
                      number: '09',
                      stream: 'Value Measurement',
                      type: 'Development Value Stream',
                      description: 'Measure value, gather feedback, and improve deliver and increasing innovation.',
                    },
                  ]}
                  onViewFull={() => setValueStreamModalOpen(true)}
                />
                <FullTableModal
                  isOpen={valueStreamModalOpen}
                  onClose={() => setValueStreamModalOpen(false)}
                  title="Value Streams"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Value Streams', accessor: 'stream' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      stream: 'Client Acquisition',
                      type: 'Operational Value Stream',
                      description: 'Attract and onboard clients, resulting in signed contracts and clear needs',
                    },
                    {
                      number: '02',
                      stream: 'Solution Design & Proposal',
                      type: 'Development Value Stream',
                      description: 'Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals.',
                    },
                    {
                      number: '03',
                      stream: 'Agile Delivery',
                      type: 'Development Value Stream',
                      description: 'Develop and deploy solutions in agile increments, achieving working software and PI objectives.',
                    },
                    {
                      number: '04',
                      stream: 'Client Success',
                      type: 'Operational Value Stream',
                      description: 'Drive adoption and support, ensuring client satisfaction and meeting KPIs.',
                    },
                    {
                      number: '05',
                      stream: 'Continuous Integration & Deployment',
                      type: 'Development Value Stream',
                      description: 'Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases.',
                    },
                    {
                      number: '06',
                      stream: 'Client Retention',
                      type: 'Operational Value Stream',
                      description: 'Strengthen relationships and upsell, increasing lifetime value and revenue.',
                    },
                    {
                      number: '07',
                      stream: 'Capability Development',
                      type: 'Development Value Stream',
                      description: 'Build agile teams and practices, leading to certified teams and faster delivery.',
                    },
                    {
                      number: '08',
                      stream: 'Governance & Risk',
                      type: 'Operational Value Stream',
                      description: 'Ensure alignment, compliance, and risk control, reducing risks.',
                    },
                    {
                      number: '09',
                      stream: 'Value Measurement',
                      type: 'Development Value Stream',
                      description: 'Measure value, gather feedback, and improve deliver and increasing innovation.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Lean Governance Section */}
              <GuidelineSection id="lean-governance" title="Lean Governance and Risk Management">
                <p className="mb-6">
                  From the value stream, we focus on Lean Governance & Risk Management. This operational value stream ensures digital initiatives are aligned with strategic objectives, comply with regulations, and manage risks in a lean, agile manner, supporting effective and efficient delivery.
                </p>
                <SummaryTable
                  title="Lean Governance and Risk Management"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Value Stream Name',
                      detail: 'Governance and Risk',
                    },
                    {
                      number: '02',
                      element: 'Type',
                      detail: 'Operational Value Stream',
                    },
                    {
                      number: '03',
                      element: 'Purpose',
                      detail: 'To ensure that digital initiatives are aligned with strategic objectives, comply with regulatory requirements, and manage risk in a lean, agile manner.',
                    },
                    {
                      number: '04',
                      element: 'Primary Stakeholders',
                      detail: 'Portfolio Managers, Risk & Compliance Officers, Enterprise Architects, Delivery Leaders, Finance, Legal',
                    },
                    {
                      number: '05',
                      element: 'Key Activities',
                      detail: '- Strategic alignment of digital initiatives with business goals\n- Lean budgeting & investment guardrails\n- Agile contract management\n- Risk identification, mitigation & escalation workflows\n- Regulatory & security compliance monitoring\n- Audit trail and traceability enablement',
                    },
                  ]}
                  onViewFull={() => setLeanGovernanceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={leanGovernanceModalOpen}
                  onClose={() => setLeanGovernanceModalOpen(false)}
                  title="Lean Governance and Risk Management"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Value Stream Name',
                      detail: 'Governance and Risk',
                    },
                    {
                      number: '02',
                      element: 'Type',
                      detail: 'Operational Value Stream',
                    },
                    {
                      number: '03',
                      element: 'Purpose',
                      detail: 'To ensure that digital initiatives are aligned with strategic objectives, comply with regulatory requirements, and manage risk in a lean, agile manner.',
                    },
                    {
                      number: '04',
                      element: 'Primary Stakeholders',
                      detail: 'Portfolio Managers, Risk & Compliance Officers, Enterprise Architects, Delivery Leaders, Finance, Legal',
                    },
                    {
                      number: '05',
                      element: 'Key Activities',
                      detail: '- Strategic alignment of digital initiatives with business goals\n- Lean budgeting & investment guardrails\n- Agile contract management\n- Risk identification, mitigation & escalation workflows\n- Regulatory & security compliance monitoring\n- Audit trail and traceability enablement',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Identification, Mitigation and Escalation Section */}
              <GuidelineSection id="risk-identification" title="Risk Identification, Mitigation and Escalation">
                <p className="mb-6">
                  A huge part of governance and successfully delivering a project is risk identification, mitigation, and escalation. Managing risks proactively ensures that potential obstacles are addressed before they impact the project&apos;s success, client satisfaction, or compliance.
                </p>
                <SummaryTable
                  title="Risk Identification, Mitigation and Escalation"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Objective',
                      detail: 'Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation.',
                    },
                    {
                      number: '02',
                      element: 'Trigger Points',
                      detail: 'PI Planning\nBacklog grooming\nSolution Demos\nRegulatory Updates\nClient Escalations',
                    },
                    {
                      number: '03',
                      element: 'Workflows stages: Risk Identification',
                      detail: 'Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues.',
                    },
                    {
                      number: '04',
                      element: 'Workflows stages: Risk Assessment',
                      detail: 'Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation.',
                    },
                    {
                      number: '05',
                      element: 'Workflows stages: Mitigation Planning',
                      detail: 'Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates.',
                    },
                    {
                      number: '06',
                      element: 'Workflows stages: Execution & Monitoring',
                      detail: 'Track mitigation actions, integrate with team boards or dashboards, and update status regularly.',
                    },
                    {
                      number: '07',
                      element: 'Workflows stages: Escalation Protocols',
                      detail: 'Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope.',
                    },
                    {
                      number: '08',
                      element: 'Workflows stages: Closure & Lesson Learned',
                      detail: 'Review mitigated risks, update risk registers, and capture lessons for future planning.',
                    },
                    {
                      number: '09',
                      element: 'Enablers',
                      detail: 'Use Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions.',
                    },
                    {
                      number: '10',
                      element: 'Common Risk Types',
                      detail: 'Common risks include scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability.',
                    },
                    {
                      number: '11',
                      element: 'KPIs / Metrics',
                      detail: 'KPIs include % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends.',
                    },
                  ]}
                  onViewFull={() => setRiskWorkflowModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskWorkflowModalOpen}
                  onClose={() => setRiskWorkflowModalOpen(false)}
                  title="Risk Identification, Mitigation and Escalation"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Objective',
                      detail: 'Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation.',
                    },
                    {
                      number: '02',
                      element: 'Trigger Points',
                      detail: 'PI Planning\nBacklog grooming\nSolution Demos\nRegulatory Updates\nClient Escalations',
                    },
                    {
                      number: '03',
                      element: 'Workflows stages: Risk Identification',
                      detail: 'Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues.',
                    },
                    {
                      number: '04',
                      element: 'Workflows stages: Risk Assessment',
                      detail: 'Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation.',
                    },
                    {
                      number: '05',
                      element: 'Workflows stages: Mitigation Planning',
                      detail: 'Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates.',
                    },
                    {
                      number: '06',
                      element: 'Workflows stages: Execution & Monitoring',
                      detail: 'Track mitigation actions, integrate with team boards or dashboards, and update status regularly.',
                    },
                    {
                      number: '07',
                      element: 'Workflows stages: Escalation Protocols',
                      detail: 'Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope.',
                    },
                    {
                      number: '08',
                      element: 'Workflows stages: Closure & Lesson Learned',
                      detail: 'Review mitigated risks, update risk registers, and capture lessons for future planning.',
                    },
                    {
                      number: '09',
                      element: 'Enablers',
                      detail: 'Use Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions.',
                    },
                    {
                      number: '10',
                      element: 'Common Risk Types',
                      detail: 'Common risks include scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability.',
                    },
                    {
                      number: '11',
                      element: 'KPIs / Metrics',
                      detail: 'KPIs include % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Identification Guidelines Section */}
              <GuidelineSection id="risk-identification-guidelines" title="Risk Identification Guidelines">
                <p className="mb-6">
                  Effective risk identification is crucial for proactively addressing potential issues throughout the project lifecycle. By embedding risk identification in all phases, from scoping to closure, teams can anticipate and mitigate risks early, ensuring smoother project delivery.
                </p>
                <SummaryTable
                  title="Risk Identification Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Embed risk identification in all delivery phases',
                      action: 'Assess risks during project scoping, planning, execution, and closure.',
                    },
                    {
                      number: '02',
                      guideline: 'Use structured formats and workshops',
                      action: 'Conduct risk discovery sessions in PI planning, daily stand-ups and retros',
                    },
                    {
                      number: '03',
                      guideline: 'Categorize risks by type',
                      action: 'Classify risks as Delivery, Technical, Compliance, Resourcing, Financial, or Reputational.',
                    },
                    {
                      number: '04',
                      guideline: 'Leverage past project lessons',
                      action: 'Review previous DQ project risks and integrate common risks into current planning.',
                    },
                    {
                      number: '05',
                      guideline: 'Maintain a shared risk register',
                      action: 'Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated.',
                    },
                    {
                      number: '06',
                      guideline: 'Empower all team members to raise risks',
                      action: 'Foster a no-blame culture that encourages surfacing issues early and without hesitation.',
                    },
                  ]}
                  onViewFull={() => setRiskIdentificationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskIdentificationModalOpen}
                  onClose={() => setRiskIdentificationModalOpen(false)}
                  title="Risk Identification Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Embed risk identification in all delivery phases',
                      action: 'Assess risks during project scoping, planning, execution, and closure.',
                    },
                    {
                      number: '02',
                      guideline: 'Use structured formats and workshops',
                      action: 'Conduct risk discovery sessions in PI planning, daily stand-ups and retros',
                    },
                    {
                      number: '03',
                      guideline: 'Categorize risks by type',
                      action: 'Classify risks as Delivery, Technical, Compliance, Resourcing, Financial, or Reputational.',
                    },
                    {
                      number: '04',
                      guideline: 'Leverage past project lessons',
                      action: 'Review previous DQ project risks and integrate common risks into current planning.',
                    },
                    {
                      number: '05',
                      guideline: 'Maintain a shared risk register',
                      action: 'Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated.',
                    },
                    {
                      number: '06',
                      guideline: 'Empower all team members to raise risks',
                      action: 'Foster a no-blame culture that encourages surfacing issues early and without hesitation.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Mitigation Guidelines Section */}
              <GuidelineSection id="risk-mitigation-guidelines" title="Risk Mitigation Guidelines">
                <p className="mb-6">
                  Risk mitigation involves taking proactive steps to reduce the impact of identified risks. By assigning ownership, defining clear actions, and continuously monitoring progress, risks can be effectively managed to avoid disruption in project delivery.
                </p>
                <SummaryTable
                  title="Risk Mitigation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Assign risk owners',
                      action: 'Every open risk must have a person responsible for its mitigation.',
                    },
                    {
                      number: '02',
                      guideline: 'Define mitigation actions clearly',
                      action: 'Include specific action steps, timelines, and measurable checkpoints to track progress.',
                    },
                    {
                      number: '03',
                      guideline: 'Prioritize risks by impact and probability',
                      action: 'Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks.',
                    },
                    {
                      number: '04',
                      guideline: 'Integrate risk plans into work streams',
                      action: 'Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline.',
                    },
                    {
                      number: '05',
                      guideline: 'Monitor mitigation progress continuously',
                      action: 'Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly.',
                    },
                    {
                      number: '06',
                      guideline: 'Maintain contingency/back-up plans',
                      action: 'Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss).',
                    },
                  ]}
                  onViewFull={() => setRiskMitigationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskMitigationModalOpen}
                  onClose={() => setRiskMitigationModalOpen(false)}
                  title="Risk Mitigation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Assign risk owners',
                      action: 'Every open risk must have a person responsible for its mitigation.',
                    },
                    {
                      number: '02',
                      guideline: 'Define mitigation actions clearly',
                      action: 'Include specific action steps, timelines, and measurable checkpoints to track progress.',
                    },
                    {
                      number: '03',
                      guideline: 'Prioritize risks by impact and probability',
                      action: 'Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks.',
                    },
                    {
                      number: '04',
                      guideline: 'Integrate risk plans into work streams',
                      action: 'Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline.',
                    },
                    {
                      number: '05',
                      guideline: 'Monitor mitigation progress continuously',
                      action: 'Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly.',
                    },
                    {
                      number: '06',
                      guideline: 'Maintain contingency/back-up plans',
                      action: 'Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss).',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Escalation Guidelines Section */}
              <GuidelineSection id="risk-escalation-guidelines" title="Risk Escalation Guidelines">
                <p className="mb-6">
                  Effective risk escalation ensures that high-priority risks are addressed at the right levels of governance. Escalating risks early, with clear documentation and structured communication, helps to avoid major disruptions and keeps projects on track.
                </p>
                <SummaryTable
                  title="Risk Escalation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Define escalation thresholds',
                      action: 'Such as high business impact, legal/compliance implications, or delivery timelines delay',
                    },
                    {
                      number: '02',
                      guideline: 'Use an escalation matrix',
                      action: 'Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly.',
                    },
                    {
                      number: '03',
                      guideline: 'Escalate early, not late',
                      action: 'Don\'t wait until a risk materializes; escalate when mitigation looks unlikely or weak.',
                    },
                    {
                      number: '04',
                      guideline: 'Document escalated risks formally',
                      action: 'Log escalation details, communications, decisions, and actions taken to ensure transparency and traceability.',
                    },
                    {
                      number: '05',
                      guideline: 'Escalate via appropriate channels',
                      action: 'Use structured channels such as Governance CWS, Project Boards, Email with a clear Subject Line',
                    },
                    {
                      number: '06',
                      guideline: 'Conduct escalation reviews post-resolution',
                      action: 'Hold retros to assess what triggered the escalation and how to avoid similar situations in the future.',
                    },
                  ]}
                  onViewFull={() => setRiskEscalationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskEscalationModalOpen}
                  onClose={() => setRiskEscalationModalOpen(false)}
                  title="Risk Escalation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Define escalation thresholds',
                      action: 'Such as high business impact, legal/compliance implications, or delivery timelines delay',
                    },
                    {
                      number: '02',
                      guideline: 'Use an escalation matrix',
                      action: 'Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly.',
                    },
                    {
                      number: '03',
                      guideline: 'Escalate early, not late',
                      action: 'Don\'t wait until a risk materializes; escalate when mitigation looks unlikely or weak.',
                    },
                    {
                      number: '04',
                      guideline: 'Document escalated risks formally',
                      action: 'Log escalation details, communications, decisions, and actions taken to ensure transparency and traceability.',
                    },
                    {
                      number: '05',
                      guideline: 'Escalate via appropriate channels',
                      action: 'Use structured channels such as Governance CWS, Project Boards, Email with a clear Subject Line',
                    },
                    {
                      number: '06',
                      guideline: 'Conduct escalation reviews post-resolution',
                      action: 'Hold retros to assess what triggered the escalation and how to avoid similar situations in the future.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Types Section */}
              <GuidelineSection id="risk-types" title="Risk Types">
                <p className="mb-6">
                  Understanding different risk types is essential for effectively managing and mitigating them. Below are common categories of risks that may arise during project delivery.
                </p>
                <SummaryTable
                  title="Risk Types"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Delivery Risk',
                      example: 'Missed milestones, incomplete stories, client dissatisfaction',
                    },
                    {
                      number: '02',
                      type: 'Technical Risk',
                      example: 'Integration failure, security vulnerability, system incompatibility',
                    },
                    {
                      number: '03',
                      type: 'Compliance Risk',
                      example: 'Data residency issues, breach of NDAs, GDPR violations',
                    },
                    {
                      number: '04',
                      type: 'Resource Risk',
                      example: 'Key team member resignation, overutilization, delayed onboarding',
                    },
                    {
                      number: '05',
                      type: 'Reputational Risk',
                      example: 'Failure to deliver on commitment, loss of client account',
                    },
                    {
                      number: '06',
                      type: 'Conduct escalation reviews post-resolution',
                      example: 'Hold retros to assess what triggered the escalation and how to avoid similar situations in the future.',
                    },
                  ]}
                  onViewFull={() => setRiskTypesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskTypesModalOpen}
                  onClose={() => setRiskTypesModalOpen(false)}
                  title="Risk Types"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Delivery Risk',
                      example: 'Missed milestones, incomplete stories, client dissatisfaction',
                    },
                    {
                      number: '02',
                      type: 'Technical Risk',
                      example: 'Integration failure, security vulnerability, system incompatibility',
                    },
                    {
                      number: '03',
                      type: 'Compliance Risk',
                      example: 'Data residency issues, breach of NDAs, GDPR violations',
                    },
                    {
                      number: '04',
                      type: 'Resource Risk',
                      example: 'Key team member resignation, overutilization, delayed onboarding',
                    },
                    {
                      number: '05',
                      type: 'Reputational Risk',
                      example: 'Failure to deliver on commitment, loss of client account',
                    },
                    {
                      number: '06',
                      type: 'Conduct escalation reviews post-resolution',
                      example: 'Hold retros to assess what triggered the escalation and how to avoid similar situations in the future.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Assumptions Section */}
              <GuidelineSection id="assumptions" title="Assumptions">
                <p className="mb-6">
                  In Lean Governance & Risk Management, assumptions play a critical but often overlooked role. They form the foundation of early decisions, plans, and value hypotheses in digital delivery. When left unchallenged, they become hidden risks. Here&apos;s how assumptions fit in and how Lean Governance addresses them:
                </p>
                <SummaryTable
                  title="Assumptions"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Area', accessor: 'area' },
                    { header: 'How Assumption Influence it', accessor: 'influence' },
                  ]}
                  data={[
                    {
                      number: '01',
                      area: 'Risk Identification',
                      influence: 'Many risks originate from invalid or untested assumptions.',
                    },
                    {
                      number: '02',
                      area: 'Risk Mitigation',
                      influence: 'Mitigation plans often rely on assumptions (e.g., resource availability, vendor delivery).',
                    },
                    {
                      number: '03',
                      area: 'Decision Governance',
                      influence: 'Lean governance encourages hypothesis-driven decisions that explicitly state key assumptions.',
                    },
                    {
                      number: '04',
                      area: 'PI Planning & Road mapping',
                      influence: 'Assumptions around velocity, dependencies, or tech readiness affect timelines and planning.',
                    },
                  ]}
                  onViewFull={() => setAssumptionsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={assumptionsModalOpen}
                  onClose={() => setAssumptionsModalOpen(false)}
                  title="Assumptions"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Area', accessor: 'area' },
                    { header: 'How Assumption Influence it', accessor: 'influence' },
                  ]}
                  data={[
                    {
                      number: '01',
                      area: 'Risk Identification',
                      influence: 'Many risks originate from invalid or untested assumptions.',
                    },
                    {
                      number: '02',
                      area: 'Risk Mitigation',
                      influence: 'Mitigation plans often rely on assumptions (e.g., resource availability, vendor delivery).',
                    },
                    {
                      number: '03',
                      area: 'Decision Governance',
                      influence: 'Lean governance encourages hypothesis-driven decisions that explicitly state key assumptions.',
                    },
                    {
                      number: '04',
                      area: 'PI Planning & Road mapping',
                      influence: 'Assumptions around velocity, dependencies, or tech readiness affect timelines and planning.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Assumptions Guidelines Section */}
              <GuidelineSection id="assumptions-guidelines" title="Assumptions Guidelines">
                <p className="mb-6">
                  Assumptions are an inherent part of project planning, but they must be managed carefully to prevent surprises. In lean governance, assumptions need to be clearly documented, validated early, and treated as potential risks.
                </p>
                <SummaryTable
                  title="Assumptions Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Make assumptions explicit',
                      example: 'Always document assumptions in Epics, Features, and Risk Logs',
                    },
                    {
                      number: '02',
                      guideline: 'Treat assumptions as conditional risks',
                      example: 'If an assumption proves false, assess the impact and create a linked risk entry to manage the potential fallout.',
                    },
                    {
                      number: '03',
                      guideline: 'Validate assumptions early',
                      example: 'Use MVPs, PoCs, or rapid prototyping to test assumptions and learn quickly.',
                    },
                    {
                      number: '04',
                      guideline: 'Tie governance gates to assumption validation',
                      example: 'Example: Only fund MVP 2 if MVP 1 proves assumption X is valid.',
                    },
                    {
                      number: '05',
                      guideline: 'Use assumption logs',
                      example: 'Maintain a separate section in your Risk Register for tracked assumptions with "validation status."',
                    },
                    {
                      number: '06',
                      guideline: 'Escalate if assumption invalidation has impact',
                      example: 'If a core assumption breaks and jeopardizes delivery, escalate it just like a critical risk.',
                    },
                  ]}
                  onViewFull={() => setAssumptionsGuidelinesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={assumptionsGuidelinesModalOpen}
                  onClose={() => setAssumptionsGuidelinesModalOpen(false)}
                  title="Assumptions Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Make assumptions explicit',
                      example: 'Always document assumptions in Epics, Features, and Risk Logs',
                    },
                    {
                      number: '02',
                      guideline: 'Treat assumptions as conditional risks',
                      example: 'If an assumption proves false, assess the impact and create a linked risk entry to manage the potential fallout.',
                    },
                    {
                      number: '03',
                      guideline: 'Validate assumptions early',
                      example: 'Use MVPs, PoCs, or rapid prototyping to test assumptions and learn quickly.',
                    },
                    {
                      number: '04',
                      guideline: 'Tie governance gates to assumption validation',
                      example: 'Example: Only fund MVP 2 if MVP 1 proves assumption X is valid.',
                    },
                    {
                      number: '05',
                      guideline: 'Use assumption logs',
                      example: 'Maintain a separate section in your Risk Register for tracked assumptions with "validation status."',
                    },
                    {
                      number: '06',
                      guideline: 'Escalate if assumption invalidation has impact',
                      example: 'If a core assumption breaks and jeopardizes delivery, escalate it just like a critical risk.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Example Assumptions That Often Lead to Risk Section */}
              <GuidelineSection id="example-assumptions" title="Example Assumptions That Often Lead to Risk">
                <p className="mb-6">
                  Assumptions are often made at the start of a project, but if they prove false, they can lead to significant risks. Below are some common assumptions and their potential risks if they turn out to be incorrect.
                </p>
                <SummaryTable
                  title="Example Assumptions That Often Lead to Risk"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Assumption', accessor: 'assumption' },
                    { header: 'Potential Risk if False', accessor: 'risk' },
                  ]}
                  data={[
                    {
                      number: '01',
                      assumption: 'Stakeholders will be available for weekly reviews',
                      risk: 'Decision delays, unvalidated work, rework',
                    },
                    {
                      number: '02',
                      assumption: 'Tech component X can integrate smoothly with legacy system Y',
                      risk: 'Technical blockers, project delays',
                    },
                    {
                      number: '03',
                      assumption: 'Regulatory body will approve feature before go-live',
                      risk: 'Compliance violations, delivery disruption',
                    },
                    {
                      number: '04',
                      assumption: 'Client team understands Agile ways of working',
                      risk: 'Misalignment, miscommunication, delivery friction',
                    },
                  ]}
                  onViewFull={() => setExampleAssumptionsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={exampleAssumptionsModalOpen}
                  onClose={() => setExampleAssumptionsModalOpen(false)}
                  title="Example Assumptions That Often Lead to Risk"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Assumption', accessor: 'assumption' },
                    { header: 'Potential Risk if False', accessor: 'risk' },
                  ]}
                  data={[
                    {
                      number: '01',
                      assumption: 'Stakeholders will be available for weekly reviews',
                      risk: 'Decision delays, unvalidated work, rework',
                    },
                    {
                      number: '02',
                      assumption: 'Tech component X can integrate smoothly with legacy system Y',
                      risk: 'Technical blockers, project delays',
                    },
                    {
                      number: '03',
                      assumption: 'Regulatory body will approve feature before go-live',
                      risk: 'Compliance violations, delivery disruption',
                    },
                    {
                      number: '04',
                      assumption: 'Client team understands Agile ways of working',
                      risk: 'Misalignment, miscommunication, delivery friction',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Issues Section */}
              <GuidelineSection id="issues" title="Issues">
                <p className="mb-6">
                  In Lean Governance & Risk Management, issues are the realized version of risks — they are events that have already occurred and are actively impacting delivery. Managing them is essential for ensuring transparency, and delivery outcomes.
                </p>
                <SummaryTable
                  title="Issues"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Aspect', accessor: 'aspect' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      aspect: 'Definition',
                      description: 'An issue is a problem or obstacle that has already occurred and is affecting delivery, scope, budget, or compliance.',
                    },
                    {
                      number: '02',
                      aspect: 'Relationship to Risk',
                      description: 'Issues often originate from unmitigated risks or invalidated assumptions.',
                    },
                    {
                      number: '03',
                      aspect: 'Governance Relevance',
                      description: 'Issues expose weaknesses in planning, controls, or decision-making. Their resolution must be tracked and governed.',
                    },
                    {
                      number: '04',
                      aspect: 'Agile Principle Tie-in',
                      description: 'Agile promotes fast recovery from failure; Lean Governance ensures the process for resolution is structured and visible.',
                    },
                  ]}
                  onViewFull={() => setIssuesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={issuesModalOpen}
                  onClose={() => setIssuesModalOpen(false)}
                  title="Issues"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Aspect', accessor: 'aspect' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      aspect: 'Definition',
                      description: 'An issue is a problem or obstacle that has already occurred and is affecting delivery, scope, budget, or compliance.',
                    },
                    {
                      number: '02',
                      aspect: 'Relationship to Risk',
                      description: 'Issues often originate from unmitigated risks or invalidated assumptions.',
                    },
                    {
                      number: '03',
                      aspect: 'Governance Relevance',
                      description: 'Issues expose weaknesses in planning, controls, or decision-making. Their resolution must be tracked and governed.',
                    },
                    {
                      number: '04',
                      aspect: 'Agile Principle Tie-in',
                      description: 'Agile promotes fast recovery from failure; Lean Governance ensures the process for resolution is structured and visible.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Issues Guidelines Section */}
              <GuidelineSection id="issues-guidelines" title="Issues Guidelines">
                <p className="mb-6">
                  Effective issue management is crucial in lean governance to ensure that obstacles are addressed quickly and do not derail the project. The following guidelines help teams manage issues efficiently and keep projects on track.
                </p>
                <SummaryTable
                  title="Issues Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Log Issues Early',
                      example: 'Capture issues as they happen in RAID with clear details to ensure visibility and accountability.',
                    },
                    {
                      number: '02',
                      guideline: 'Assess Impact Fast',
                      example: 'Rate severity and define what\'s affected (scope, time, cost, etc.) to prioritize resolution efforts.',
                    },
                    {
                      number: '03',
                      guideline: 'Assign Owner & Action',
                      example: 'Assign each issue to an owner and track progress to ensure timely resolution and accountability.',
                    },
                    {
                      number: '04',
                      guideline: 'Escalate When Needed',
                      example: 'Use set thresholds to escalate unresolved or high-impact issues to the right level of governance.',
                    },
                    {
                      number: '05',
                      guideline: 'Close with RCA',
                      example: 'Perform a root cause analysis (RCA), document the fix, and update project documentation for future reference.',
                    },
                    {
                      number: '06',
                      guideline: 'Track & Report Weekly',
                      example: 'Review issues in governance syncs and track resolution trends to monitor ongoing progress.',
                    },
                  ]}
                  onViewFull={() => setIssuesGuidelinesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={issuesGuidelinesModalOpen}
                  onClose={() => setIssuesGuidelinesModalOpen(false)}
                  title="Issues Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Log Issues Early',
                      example: 'Capture issues as they happen in RAID with clear details to ensure visibility and accountability.',
                    },
                    {
                      number: '02',
                      guideline: 'Assess Impact Fast',
                      example: 'Rate severity and define what\'s affected (scope, time, cost, etc.) to prioritize resolution efforts.',
                    },
                    {
                      number: '03',
                      guideline: 'Assign Owner & Action',
                      example: 'Assign each issue to an owner and track progress to ensure timely resolution and accountability.',
                    },
                    {
                      number: '04',
                      guideline: 'Escalate When Needed',
                      example: 'Use set thresholds to escalate unresolved or high-impact issues to the right level of governance.',
                    },
                    {
                      number: '05',
                      guideline: 'Close with RCA',
                      example: 'Perform a root cause analysis (RCA), document the fix, and update project documentation for future reference.',
                    },
                    {
                      number: '06',
                      guideline: 'Track & Report Weekly',
                      example: 'Review issues in governance syncs and track resolution trends to monitor ongoing progress.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Example Issues Impact Section */}
              <GuidelineSection id="example-issues" title="Example Assumptions That Often Lead to Risk">
                <p className="mb-6">
                  Understanding the impact of issues is essential for effective management and timely resolution. Below are some common project issues and their potential impacts if not addressed promptly.
                </p>
                <SummaryTable
                  title="Example Assumptions That Often Lead to Risk"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Example', accessor: 'example' },
                    { header: 'Impact', accessor: 'impact' },
                  ]}
                  data={[
                    {
                      number: '01',
                      example: 'API access not granted by external vendor',
                      impact: 'Blocks development and integration; delays sprint deliverables',
                    },
                    {
                      number: '02',
                      example: 'Key resource unavailable due to illness or attrition',
                      impact: 'Affects velocity; causes knowledge gaps and slows progress',
                    },
                    {
                      number: '03',
                      example: 'Data privacy violation identified during QA',
                      impact: 'Triggers compliance escalation and reputational risk, potentially leading to legal implications',
                    },
                    {
                      number: '04',
                      example: 'Client-side testing delayed beyond planned window',
                      impact: 'Pushes go-live date; impacts subsequent project timelines and deliverables',
                    },
                  ]}
                  onViewFull={() => setExampleIssuesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={exampleIssuesModalOpen}
                  onClose={() => setExampleIssuesModalOpen(false)}
                  title="Example Assumptions That Often Lead to Risk"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Example', accessor: 'example' },
                    { header: 'Impact', accessor: 'impact' },
                  ]}
                  data={[
                    {
                      number: '01',
                      example: 'API access not granted by external vendor',
                      impact: 'Blocks development and integration; delays sprint deliverables',
                    },
                    {
                      number: '02',
                      example: 'Key resource unavailable due to illness or attrition',
                      impact: 'Affects velocity; causes knowledge gaps and slows progress',
                    },
                    {
                      number: '03',
                      example: 'Data privacy violation identified during QA',
                      impact: 'Triggers compliance escalation and reputational risk, potentially leading to legal implications',
                    },
                    {
                      number: '04',
                      example: 'Client-side testing delayed beyond planned window',
                      impact: 'Pushes go-live date; impacts subsequent project timelines and deliverables',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Dependency Section */}
              <GuidelineSection id="dependency" title="Dependency">
                <p className="mb-6">
                  In Lean Governance & Risk Management, dependencies are critical elements that directly affect flow, alignment, risk exposure, and delivery outcomes. Poorly managed dependencies are one of the biggest hidden risks in agile delivery
                </p>
                <SummaryTable
                  title="Dependency"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Aspect', accessor: 'aspect' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      aspect: 'Planning',
                      description: 'Dependencies must be identified and planned into project timelines and sprints to ensure smooth delivery flow.',
                    },
                    {
                      number: '02',
                      aspect: 'Flow Disruption',
                      description: 'Unmanaged dependencies can block work streams, delay deliverables, and disrupt the overall project flow.',
                    },
                    {
                      number: '03',
                      aspect: 'Risk Source',
                      description: 'Uncertain or unmanaged dependencies often become risks that can impact project timelines and deliverables.',
                    },
                    {
                      number: '04',
                      aspect: 'Escalation Trigger',
                      description: 'When dependencies are blocked or delayed beyond acceptable thresholds, they trigger escalation protocols.',
                    },
                    {
                      number: '05',
                      aspect: 'Governance Focus',
                      description: 'Lean Governance ensures that dependencies are visible, owned, sequenced, and unblocked quickly.',
                    },
                    {
                      number: '06',
                      aspect: 'Compliance & Integration',
                      description: 'Dependencies involving data, systems, or external vendors may introduce security, integration, or legal risks.',
                    },
                  ]}
                  onViewFull={() => setDependencyModalOpen(true)}
                />
                <FullTableModal
                  isOpen={dependencyModalOpen}
                  onClose={() => setDependencyModalOpen(false)}
                  title="Dependency"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Aspect', accessor: 'aspect' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      aspect: 'Planning',
                      description: 'Dependencies must be identified and planned into project timelines and sprints to ensure smooth delivery flow.',
                    },
                    {
                      number: '02',
                      aspect: 'Flow Disruption',
                      description: 'Unmanaged dependencies can block work streams, delay deliverables, and disrupt the overall project flow.',
                    },
                    {
                      number: '03',
                      aspect: 'Risk Source',
                      description: 'Uncertain or unmanaged dependencies often become risks that can impact project timelines and deliverables.',
                    },
                    {
                      number: '04',
                      aspect: 'Escalation Trigger',
                      description: 'When dependencies are blocked or delayed beyond acceptable thresholds, they trigger escalation protocols.',
                    },
                    {
                      number: '05',
                      aspect: 'Governance Focus',
                      description: 'Lean Governance ensures that dependencies are visible, owned, sequenced, and unblocked quickly.',
                    },
                    {
                      number: '06',
                      aspect: 'Compliance & Integration',
                      description: 'Dependencies involving data, systems, or external vendors may introduce security, integration, or legal risks.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Dependency Guidelines Section */}
              <GuidelineSection id="dependency-guidelines" title="Dependency Guidelines">
                <p className="mb-6">
                  Managing dependencies efficiently is critical to ensure smooth project delivery. By making dependencies visible, assigning ownership, and tracking teams can mitigate risks and avoid bottlenecks that could delay the project.
                </p>
                <SummaryTable
                  title="Dependency Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Make Dependencies Visible',
                      example: 'Use RAID to log all internal/external dependencies clearly, ensuring transparency',
                    },
                    {
                      number: '02',
                      guideline: 'Assign Clear Ownership',
                      example: 'Every dependency must have an accountable owner on both ends to ensure responsibility and resolution.',
                    },
                    {
                      number: '03',
                      guideline: 'Sequence & Time Dependencies',
                      example: 'Plan dependencies into timelines and sprints—no vague "TBDs"',
                    },
                    {
                      number: '04',
                      guideline: 'Track & Review Weekly',
                      example: 'Monitor the status of dependencies in governance syncs and escalate blockers',
                    },
                    {
                      number: '05',
                      guideline: 'Treat Uncertain Dependencies as Risks',
                      example: 'Add uncertain dependencies to the risk register and develop mitigation plans to minimize potential disruptions.',
                    },
                  ]}
                  onViewFull={() => setDependencyGuidelinesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={dependencyGuidelinesModalOpen}
                  onClose={() => setDependencyGuidelinesModalOpen(false)}
                  title="Dependency Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guidelines', accessor: 'guideline' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Make Dependencies Visible',
                      example: 'Use RAID to log all internal/external dependencies clearly, ensuring transparency',
                    },
                    {
                      number: '02',
                      guideline: 'Assign Clear Ownership',
                      example: 'Every dependency must have an accountable owner on both ends to ensure responsibility and resolution.',
                    },
                    {
                      number: '03',
                      guideline: 'Sequence & Time Dependencies',
                      example: 'Plan dependencies into timelines and sprints—no vague "TBDs"',
                    },
                    {
                      number: '04',
                      guideline: 'Track & Review Weekly',
                      example: 'Monitor the status of dependencies in governance syncs and escalate blockers',
                    },
                    {
                      number: '05',
                      guideline: 'Treat Uncertain Dependencies as Risks',
                      example: 'Add uncertain dependencies to the risk register and develop mitigation plans to minimize potential disruptions.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Example Dependencies that becomes Risks Section */}
              <GuidelineSection id="example-dependencies" title="Example of Dependencies that becomes Risks">
                <p className="mb-6">
                  When dependencies are not managed effectively, they can evolve into risks that impact project timelines, deliverables, and compliance. Below are some common dependencies and their potential risks if mismanaged.
                </p>
                <SummaryTable
                  title="Example of Dependencies that becomes Risks"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Dependency', accessor: 'dependency' },
                    { header: 'Potential Risk if Mismanaged', accessor: 'risk' },
                  ]}
                  data={[
                    {
                      number: '01',
                      dependency: 'API from vendor not delivered on time',
                      risk: 'Delays integration, affects sprint commitment, and impacts delivery timeline',
                    },
                    {
                      number: '02',
                      dependency: 'Client data access delayed',
                      risk: 'Blocks testing, validation, or go-live, leading to significant project delays',
                    },
                    {
                      number: '03',
                      dependency: 'External team not available for UAT',
                      risk: 'Pushes timeline, affects delivery milestone, and delays overall project completion',
                    },
                    {
                      number: '04',
                      dependency: 'Regulatory approval from legal not secured',
                      risk: 'Compliance risk, potential regulatory violations, and go-live blocked',
                    },
                  ]}
                  onViewFull={() => setExampleDependenciesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={exampleDependenciesModalOpen}
                  onClose={() => setExampleDependenciesModalOpen(false)}
                  title="Example of Dependencies that becomes Risks"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Dependency', accessor: 'dependency' },
                    { header: 'Potential Risk if Mismanaged', accessor: 'risk' },
                  ]}
                  data={[
                    {
                      number: '01',
                      dependency: 'API from vendor not delivered on time',
                      risk: 'Delays integration, affects sprint commitment, and impacts delivery timeline',
                    },
                    {
                      number: '02',
                      dependency: 'Client data access delayed',
                      risk: 'Blocks testing, validation, or go-live, leading to significant project delays',
                    },
                    {
                      number: '03',
                      dependency: 'External team not available for UAT',
                      risk: 'Pushes timeline, affects delivery milestone, and delays overall project completion',
                    },
                    {
                      number: '04',
                      dependency: 'Regulatory approval from legal not secured',
                      risk: 'Compliance risk, potential regulatory violations, and go-live blocked',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Register Section */}
              <GuidelineSection id="risk-register" title="Risk Register">
                <p className="mb-6">
                  A Risk Register is essential for tracking and managing risks, assumptions, issues, and dependencies (RAID). At DQ, Azure DevOps is utilized to track RAID, ensuring visibility, accountability, and proactive management.
                </p>
                <SummaryTable
                  title="Risk Register"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Feature', accessor: 'feature' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      feature: 'Log Risks, Assumptions, Issues, and Dependencies',
                      description: 'Use Azure DevOps Boards to document each RAID element, ensuring clear definitions, assignments, and tracking.',
                    },
                    {
                      number: '02',
                      feature: 'Assign Ownership',
                      description: 'Assign each RAID item to a responsible person to track progress and ensure timely resolution.',
                    },
                    {
                      number: '03',
                      feature: 'Prioritize and Track Status',
                      description: 'Categorize and prioritize RAID elements based on their impact, ensuring high-priority items are managed effectively.',
                    },
                    {
                      number: '04',
                      feature: 'Monitor Progress',
                      description: 'Use Azure DevOps dashboards and reports to monitor RAID status in real-time and escalate blockers.',
                    },
                  ]}
                  onViewFull={() => setRiskRegisterModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskRegisterModalOpen}
                  onClose={() => setRiskRegisterModalOpen(false)}
                  title="Risk Register"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Feature', accessor: 'feature' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      feature: 'Log Risks, Assumptions, Issues, and Dependencies',
                      description: 'Use Azure DevOps Boards to document each RAID element, ensuring clear definitions, assignments, and tracking.',
                    },
                    {
                      number: '02',
                      feature: 'Assign Ownership',
                      description: 'Assign each RAID item to a responsible person to track progress and ensure timely resolution.',
                    },
                    {
                      number: '03',
                      feature: 'Prioritize and Track Status',
                      description: 'Categorize and prioritize RAID elements based on their impact, ensuring high-priority items are managed effectively.',
                    },
                    {
                      number: '04',
                      feature: 'Monitor Progress',
                      description: 'Use Azure DevOps dashboards and reports to monitor RAID status in real-time and escalate blockers.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* RAID Item Name Section */}
              <GuidelineSection id="raid-item-name" title="RAID Item Name">
                <p className="mb-6">
                  Clear and consistent naming of RAID items is essential for easy identification and tracking. Below are the guidelines for writing RAID item names:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Be Specific:</p>
                    <p className="text-gray-700">Clearly identify the RAID item</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Follow Consistency:</p>
                    <p className="text-gray-700">Use a standard format</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Keep It Brief:</p>
                    <p className="text-gray-700">Make it short but descriptive</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Assign RAID Owner Section */}
              <GuidelineSection id="assign-raid-owner" title="Assign RAID Owner">
                <p className="mb-6">
                  Assigning clear ownership of RAID items ensures accountability and timely resolution. Here are the guidelines for assigning owners:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Designate a Single Owner:</p>
                    <p className="text-gray-700">Each RAID item must have one person accountable for its resolution.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Choose the Right Role:</p>
                    <p className="text-gray-700">Assign ownership based on the item&apos;s impact—e.g., technical risks to developers, compliance issues to legal teams.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Ensure Timely Updates:</p>
                    <p className="text-gray-700">The owner should regularly update the RAID item&apos;s status, ensuring progress is tracked and blockers are escalated.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID State Section */}
              <GuidelineSection id="raid-state" title="RAID State">
                <p className="mb-6">
                  Assigning the correct RAID state helps track the progress and status of each item. Below are the guidelines for assigning RAID states:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">New:</p>
                    <p className="text-gray-700">Assigned to a RAID item when it is first identified and logged but has not yet been assessed or acted upon.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Active:</p>
                    <p className="text-gray-700">Used when the RAID item is being actively worked on, with mitigation actions or resolutions being pursued.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Blocked:</p>
                    <p className="text-gray-700">Applied when a RAID item cannot proceed due to external factors, such as dependencies or lack of resources.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Resolved:</p>
                    <p className="text-gray-700">Assigned when a RAID item has been addressed and is no longer an issue, risk, or dependency. Mitigation actions have been implemented.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Closed:</p>
                    <p className="text-gray-700">Used when a RAID item is fully resolved, validated, and no further action is required.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID Description Section */}
              <GuidelineSection id="raid-description" title="RAID Description">
                <p className="mb-6">
                  A clear and concise description is essential for understanding the context of each RAID item. Here are the guidelines for writing a RAID description:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Be Clear and Specific:</p>
                    <p className="text-gray-700">Describe the RAID item with enough detail so it is easily understood by any team member, ensuring clarity on what the item pertains to.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Provide Context:</p>
                    <p className="text-gray-700">Include any relevant background information, such as dependencies, assumptions, or conditions that triggered the item.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Keep It Brief:</p>
                    <p className="text-gray-700">Avoid unnecessary details, but make sure the description provides sufficient information for anyone reading it to understand the issue, risk, assumption, or dependency.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID Items or Impact Section */}
              <GuidelineSection id="raid-impact" title="RAID Items or Impact">
                <p className="mb-6">
                  The Impact of a RAID item should clearly outline the potential consequences it may have on the project. Here are the guidelines for describing the impact of RAID items:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">State the Potential Outcome:</p>
                    <p className="text-gray-700">Describe what could happen if the RAID item is not addressed—such as delays, cost overruns, or loss of functionality.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Quantify the Impact:</p>
                    <p className="text-gray-700">Where possible, include measurable details like how much delay it could cause (e.g., "2-week delay"), or how it could affect costs or resources.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Relate to Project Objectives:</p>
                    <p className="text-gray-700">Connect the impact to the key project deliverables, timelines, or client requirements, showing how it could directly influence the project&apos;s success.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID Action needed Section */}
              <GuidelineSection id="raid-action-needed" title="RAID Action needed">
                <p className="mb-6">
                  The Action Needed section outlines the steps required to address a RAID item. This section ensures that clear and actionable tasks are defined for resolution. Below are the guidelines for writing the Action Needed:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Be Specific and Actionable:</p>
                    <p className="text-gray-700">Clearly state what actions need to be taken, who is responsible, and by when, ensuring all tasks are actionable.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Define Mitigation Steps for Risks and Issues:</p>
                    <p className="text-gray-700">For risks and issues, include steps to reduce their impact or resolve them, such as "implement security patch" or "schedule additional testing."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Include Dependencies or Resources:</p>
                    <p className="text-gray-700">If the action depends on another task, resource, or team member, make that clear to avoid delays and confusion.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID Analysis Section */}
              <GuidelineSection id="raid-analysis" title="RAID Analysis">
                <p className="mb-6">
                  The RAID Analysis section helps categorize and evaluate the importance of each RAID item to ensure proper prioritization and response. Below are the guidelines for performing RAID analysis:
                </p>
                <div className="space-y-6">
                  <div>
                    <p className="font-semibold text-gray-900 mb-3">Type: Classify the RAID item based on its nature:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Issue: A current problem affecting the project.</li>
                      <li>Risk: A potential issue that could impact the project in the future.</li>
                      <li>Dependency: An external or internal factor the project relies on.</li>
                      <li>Assumption: A condition that must hold true for the project to proceed smoothly.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-3">Impact: Determine the impact of the RAID item based on its effect on the project:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>External (Client): The issue, risk, or dependency impacts the client, project deliverables to the client, or client satisfaction.</li>
                      <li>Internal (DQ): The issue, risk, or dependency impacts internal teams, processes, or organizational goals (i.e., Digital Qatalyst&apos;s operations).</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-3">Severity: Evaluate the severity of the RAID item using the following scale:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>1 - Critical: Requires immediate attention; has a major impact on project delivery.</li>
                      <li>2 - High: Significant impact, needs resolution soon to avoid delays.</li>
                      <li>3 - Medium: Moderate impact; manageable within the project&apos;s timelines.</li>
                      <li>4 - Low: Minor impact; can be addressed later without affecting project progress.</li>
                    </ul>
                  </div>
                </div>
              </GuidelineSection>

              {/* RAID Timeline Section */}
              <GuidelineSection id="raid-timeline" title="RAID Timeline">
                <p className="mb-6">
                  The RAID Timeline section helps track the timing of RAID items, ensuring that actions and resolutions are managed within project deadlines. Below are the guidelines for defining and tracking RAID timelines:
                </p>
                <div className="space-y-6">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Start Date:</p>
                    <p className="text-gray-700 mb-2"><strong>Definition:</strong> The date when a RAID item is first identified or logged.</p>
                    <p className="text-gray-700"><strong>Guideline:</strong> The start date should be the point at which the issue, risk, assumption, or dependency is acknowledged and documented. This marks the beginning of its lifecycle.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Target Date:</p>
                    <p className="text-gray-700 mb-2"><strong>Definition:</strong> The date by which the RAID item is expected to be resolved.</p>
                    <p className="text-gray-700"><strong>Guideline:</strong> Set realistic target dates for mitigation or resolution actions, based on project priorities and available resources. Ensure the target date aligns with project milestones.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Finish Date:</p>
                    <p className="text-gray-700 mb-2"><strong>Definition:</strong> The date when the RAID item is fully resolved or closed.</p>
                    <p className="text-gray-700"><strong>Guideline:</strong> The finish date represents the completion of the resolution or mitigation actions. This marks the point when the RAID item no longer needs active monitoring or intervention.</p>
                  </div>
                </div>
              </GuidelineSection>
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

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

