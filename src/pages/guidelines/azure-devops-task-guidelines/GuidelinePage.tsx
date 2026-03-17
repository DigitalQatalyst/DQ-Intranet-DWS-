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
  
  // Modal state management for tables
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false)
  const [taskStatesModalOpen, setTaskStatesModalOpen] = useState(false)
  const [taskTimelineModalOpen, setTaskTimelineModalOpen] = useState(false)
  const [taskContextModalOpen, setTaskContextModalOpen] = useState(false)
  const [taskInputsModalOpen, setTaskInputsModalOpen] = useState(false)
  const [taskOutputsModalOpen, setTaskOutputsModalOpen] = useState(false)
  const [taskResourcesModalOpen, setTaskResourcesModalOpen] = useState(false)

  // Guidelines data
  const guidelinesData = [
    {
      principle: 'Consistency',
      description: 'Ensure that each section of the task is filled out following the DQ standards.',
    },
    {
      principle: 'Clarity',
      description: 'Make the task details as clear and concise as possible, focusing on key objectives and outcomes.',
    },
    {
      principle: 'Collaboration',
      description: 'Use the specified communication channels to collaborate and gather input from relevant stakeholders.',
    },
    {
      principle: 'Tracking Progress',
      description: 'Regularly update task status, progress, and any dependencies or blockers. Follow the established milestones and timelines.',
    },
    {
      principle: 'Review & Validation',
      description: 'Ensure that the task meets the agreed-upon deliverables and is reviewed by stakeholders for approval before marking it as complete.',
    },
  ]

  // Task States data
  const taskStatesData = [
    {
      state: 'Active',
      description: 'The task is currently in progress and being worked on.',
    },
    {
      state: 'Active (Today)',
      description: 'The task is actively being worked on today.',
    },
    {
      state: 'Blocked',
      description: 'The task is blocked and cannot proceed due to dependencies or blockers.',
    },
    {
      state: 'Resolved',
      description: 'The task has been completed and resolved.',
    },
  ]

  // Task Timeline data
  const taskTimelineData = [
    {
      dateType: 'Start date',
      description: 'The date in which the task has commenced.',
    },
    {
      dateType: 'Target date',
      description: 'The contracted date in which the task needs to close.',
    },
    {
      dateType: 'Finish date',
      description: 'The date in which the task is completed and closed.',
    },
  ]

  // Task Context data
  const taskContextData = [
    {
      element: 'Goal',
      description: 'Briefly state the broader objective of the project or initiative.\n\ne.g: Align with DFSA\'s digital transformation by capturing business needs to support strategic goals.',
    },
    {
      element: 'Scope',
      description: 'Describe what this specific task is responsible for delivering.\n\ne.g: This task involves developing the Requirement Specification Report (RSR), including user stories....',
    },
    {
      element: 'Value',
      description: 'Explain why this task is important and how it contributes to successful delivery.\n\ne.g: The RSR ensures business needs are clearly understood, documented, and aligned with technical implementation.',
    },
  ]

  // Task Inputs data
  const taskInputsData = [
    {
      category: 'Documents',
      description: 'Templates, diagrams, or reports\ne.g., RSR template, HLAD, LLAD',
    },
    {
      category: 'Sources',
      description: 'Systems, teams, or stakeholders providing input\ne.g., DFSA Stage 03 & 04 documentation',
    },
  ]

  // Task Outputs data
  const taskOutputsData = [
    {
      characteristic: 'Tangible',
      description: 'Documents, reports, or models produced',
    },
    {
      characteristic: 'Validated',
      description: 'Reviewed and approved by stakeholders',
    },
    {
      characteristic: 'Aligned',
      description: 'Match business needs and technical direction',
    },
  ]

  // Task Related Resources data
  const taskResourcesData = [
    {
      category: 'Trackers',
      description: 'Any linked task or delivery tracking sheets (if available)',
    },
    {
      category: 'MS Teams Channels',
      description: 'Communication channels used for collaboration',
    },
    {
      category: 'ChatGPT Threads',
      description: 'Links to relevant ChatGPT conversations for knowledge continuity',
    },
    {
      category: 'Reports (Specs)',
      description: 'Drafts or final versions of the Requirement Specification Report or other documents',
    },
    {
      category: 'Creatives (UI/UX)',
      description: 'Links to design flows, or Figma files used in the solution design',
    },
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
                  <span className="ml-1 text-gray-500 md:ml-2">Azure DevOps Task | Step by Step Guidelines</span>
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
              {/* Introduction Section */}
              <GuidelineSection id="introduction" title="Introduction">
                <p className="mb-4">
                  As reference, below is a sample task for DFSA | INC02 | ERP Integration task.
                </p>
                <p>
                  These guidelines will showcase how an associate should update their relevant task with DQ standard guidelines.
                </p>
              </GuidelineSection>

              {/* Guidelines Section */}
              <GuidelineSection id="guidelines" title="Guidelines">
                <p className="mb-6">
                  The following principles guide task management and ensure consistency across all Azure DevOps tasks:
                </p>
                <SummaryTable
                  title="Guidelines"
                  columns={[
                    { header: 'Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={guidelinesData}
                  onViewFull={() => setGuidelinesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={guidelinesModalOpen}
                  onClose={() => setGuidelinesModalOpen(false)}
                  title="Guidelines"
                  columns={[
                    { header: 'Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={guidelinesData}
                />
              </GuidelineSection>

              {/* Traceability Section */}
              <GuidelineSection id="traceability" title="Traceability">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">CIMD Item</h3>
                    <p>
                      All scope items are clearly established in the CIMD along with their respective timelines.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Task Item</h3>
                    <p>
                      Each task is linked to its relevant scope item in the CIMD to ensure consistency and alignment with overall objectives.
                    </p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Data Management Ownership Section */}
              <GuidelineSection id="data-management" title="Data Management Ownership">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Task Owner</h3>
                    <p>
                      The designated task owner is responsible for updating, tracking progress, and ensuring the task is completed according to the specified guidelines.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Governance</h3>
                    <p>
                      The governing body that monitors the progress of tasks, ensuring they meet the required standards and are delivered on time. According to the process of the task it is traced back to the delivery tracker and CIMD.
                    </p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Work Items Section */}
              <GuidelineSection id="work-items" title="Work Items">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Task</h3>
                    <p>
                      Clearly define the task name, purpose, and expected outcomes based on the task's context and objectives.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">MS Teams</h3>
                    <p>
                      Update the MS Teams channels for communication and collaboration. Share task progress and relevant updates with team members using the designated channels for transparency and trace it back to azure devOps task.
                    </p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Task Name Section */}
              <GuidelineSection id="task-name" title="Task Name">
                <p className="mb-4">
                  The task name is the primary item used to understand purpose, and outcome from the task. As such a consistent and concise naming structure is required.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Format:</h3>
                    <p className="font-mono bg-gray-100 p-3 rounded-lg">
                      &lt;Action&gt; – &lt;Type&gt; | &lt;Scope&gt;
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Structure:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The task name should immediately communicate the intent or objective.</li>
                      <li>Use a dash for clarity (–) and a pipe (|) to separate the module</li>
                      <li>Keep it short, meaningful, and consistent.</li>
                    </ul>
                  </div>
                </div>
              </GuidelineSection>

              {/* Task State Section */}
              <GuidelineSection id="task-state" title="Task State">
                <p className="mb-6">
                  The task state indicates the current status of a task and helps track its progress throughout its lifecycle. It provides clarity on whether a task is in progress, blocked, or has been resolved.
                </p>
                <p className="mb-6 font-semibold">
                  The task state should be as follows:
                </p>
                <SummaryTable
                  title="Task States"
                  columns={[
                    { header: 'State', accessor: 'state' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskStatesData}
                  onViewFull={() => setTaskStatesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskStatesModalOpen}
                  onClose={() => setTaskStatesModalOpen(false)}
                  title="Task States"
                  columns={[
                    { header: 'State', accessor: 'state' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskStatesData}
                />
              </GuidelineSection>

              {/* Task Progress Section */}
              <GuidelineSection id="task-progress" title="Task Progress">
                <p className="mb-4">
                  Task progress visually represents how much of the task has been completed, providing a clear view of its status. It helps track milestones and identify if the task is at risk, allowing for timely interventions when necessary.
                </p>
                <p>
                  The task progress needs to be showcased as a tag depending on the progressed achieved. You can also indicate if the task is at risk as shown.
                </p>
              </GuidelineSection>

              {/* Task Timeline Section */}
              <GuidelineSection id="task-timeline" title="Task Timeline">
                <p className="mb-6">
                  The task timeline provides a clear overview of the task's duration and critical deadlines. It helps ensure that tasks are started, tracked, and completed on time by defining key dates and milestones.
                </p>
                <p className="mb-6 font-semibold">
                  The timeline should be updated as follows:
                </p>
                <SummaryTable
                  title="Task Timeline"
                  columns={[
                    { header: 'Date Type', accessor: 'dateType' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskTimelineData}
                  onViewFull={() => setTaskTimelineModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskTimelineModalOpen}
                  onClose={() => setTaskTimelineModalOpen(false)}
                  title="Task Timeline"
                  columns={[
                    { header: 'Date Type', accessor: 'dateType' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskTimelineData}
                />
              </GuidelineSection>

              {/* Task Context Section */}
              <GuidelineSection id="task-context" title="Task Context">
                <p className="mb-6">
                  The task context provides a high-level overview of the task within the broader project or initiative. It outlines the task's goal, scope, and value, offering clarity on its contribution to successful project delivery.
                </p>
                <p className="mb-6 font-semibold">
                  The context should cover the below elements:
                </p>
                <SummaryTable
                  title="Task Context Elements"
                  columns={[
                    { header: 'Element', accessor: 'element' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskContextData}
                  onViewFull={() => setTaskContextModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskContextModalOpen}
                  onClose={() => setTaskContextModalOpen(false)}
                  title="Task Context Elements"
                  columns={[
                    { header: 'Element', accessor: 'element' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskContextData}
                />
              </GuidelineSection>

              {/* Task Purpose Section */}
              <GuidelineSection id="task-purpose" title="Task Purpose">
                <p className="mb-4">
                  The task purpose defines the clear objective of what the task aims to achieve. It outlines the deliverable and intended outcome, ensuring alignment with project goals and desired results.
                </p>
                <p className="mb-4 font-semibold">
                  For purpose, state clearly what the task aims to accomplish. Focus on:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deliverable:</h3>
                    <p className="text-gray-700">What is being created</p>
                    <p className="text-sm text-gray-600 italic mt-1">e.g., A technical document outlining business requirements.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Intended Outcome:</h3>
                    <p className="text-gray-700">Why it matters</p>
                    <p className="text-sm text-gray-600 italic mt-1">e.g., Helps developers understand and implement business needs accurately.</p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Task Inputs Section */}
              <GuidelineSection id="task-inputs" title="Task Inputs">
                <p className="mb-6">
                  Task inputs outline the key resources and references required to complete the task effectively. It highlights essential documents, systems, teams, or stakeholder's inputs.
                </p>
                <p className="mb-6">
                  List the key resources or references needed to perform the task effectively. Focus on:
                </p>
                <SummaryTable
                  title="Task Inputs"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskInputsData}
                  onViewFull={() => setTaskInputsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskInputsModalOpen}
                  onClose={() => setTaskInputsModalOpen(false)}
                  title="Task Inputs"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskInputsData}
                />
              </GuidelineSection>

              {/* Task Outputs Section */}
              <GuidelineSection id="task-outputs" title="Task Outputs">
                <p className="mb-6">
                  Task outputs define the deliverables expected at the completion of a task. These outputs should be tangible, validated, and aligned with business needs and technical direction to ensure their effectiveness and relevance.
                </p>
                <p className="mb-6">
                  Clearly define the deliverables expected at task completion. Ensure outputs are:
                </p>
                <SummaryTable
                  title="Task Outputs"
                  columns={[
                    { header: 'Characteristic', accessor: 'characteristic' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskOutputsData}
                  onViewFull={() => setTaskOutputsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskOutputsModalOpen}
                  onClose={() => setTaskOutputsModalOpen(false)}
                  title="Task Outputs"
                  columns={[
                    { header: 'Characteristic', accessor: 'characteristic' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskOutputsData}
                />
              </GuidelineSection>

              {/* Task Approach Section */}
              <GuidelineSection id="task-approach" title="Task Approach">
                <p className="mb-4">
                  The task approach outlines the execution strategy, breaking the task into manageable stages. Each MVP (Minimum Viable Product) milestone should have a clear timeline to ensure structured progress and timely completion. The MVP timelines needs to trace back to the actual scope timeline.
                </p>
                <p className="mb-4 font-semibold">
                  Outline how the task will be executed in stages to ensure clarity and progress. Include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>MVP Milestones:</strong> Break the task into clear draft stages</li>
                  <li><strong>Documentation Focus:</strong> Capture all relevant specs: user stories, process & service improvements, change management</li>
                  <li><strong>Review & Validation:</strong> Collaborate with stakeholders for feedback and final approval</li>
                </ul>
              </GuidelineSection>

              {/* Task Related Resources Section */}
              <GuidelineSection id="task-resources" title="Task Related Resources">
                <p className="mb-6">
                  Task related resources include all supporting materials and references that inform or contribute to the task. These resources are crucial for maintaining continuity, collaboration, and alignment throughout the task execution.
                </p>
                <p className="mb-6">
                  List all supporting materials and references that inform or contribute to the task. Categories to include:
                </p>
                <SummaryTable
                  title="Task Related Resources"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskResourcesData}
                  onViewFull={() => setTaskResourcesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskResourcesModalOpen}
                  onClose={() => setTaskResourcesModalOpen(false)}
                  title="Task Related Resources"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={taskResourcesData}
                />
              </GuidelineSection>

              {/* Efforts Section */}
              <GuidelineSection id="efforts" title="Efforts (Count of Checklist)">
                <p className="mb-4">
                  The effort section tracks the progress of the task by measuring the completed and remaining effort. This aligns with the progress tag and provides a clear understanding of how much work has been completed and what remains.
                </p>
                <div className="space-y-3">
                  <div>
                    <p><strong>Total Effort (100%):</strong> The overall effort required to complete the task, measured as 100%.</p>
                  </div>
                  <div>
                    <p><strong>Completed Effort:</strong> The percentage of the task that has been completed so far.</p>
                  </div>
                  <div>
                    <p><strong>Remaining Effort:</strong> The percentage of the task that is still pending and needs to be completed.</p>
                  </div>
                </div>
                <p className="mt-4">
                  This progress update helps in monitoring the task's status and ensures alignment with the planned timelines. It directly correlates with the progress tag to provide a clear picture of the task's current standing.
                </p>
              </GuidelineSection>

              {/* Task Check-list Items Section */}
              <GuidelineSection id="task-checklist" title="Task Check-list Items">
                <p className="mb-4">
                  Task check-list items break down the task into clear, trackable steps that help monitor progress and ensure all critical components are completed on time. Each MVP needs to translate back to the check-list items.
                </p>
                <p>
                  Check-list items need to be broken down into clear, trackable steps to monitor progress.
                </p>
              </GuidelineSection>

              {/* Sync between Channel and Task Section */}
              <GuidelineSection id="sync-channel-task" title="Sync between Channel and Task">
                <p>
                  Associate needs to ensure that the relevant updates need to be posted in the relevant channels after which needs to trace back to azure devops task in the discussion area as shown below.
                </p>
              </GuidelineSection>

              {/* Link between CIMD and Task Section */}
              <GuidelineSection id="link-cimd-task" title="Link between CIMD and Task">
                <p className="mb-4">
                  All tasks in Azure DevOps must be linked to their corresponding CIMD scope item, and vice versa, to ensure alignment and transparency.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Linking Tasks and CIMD:</h3>
                    <p>Each task will be connected to its respective CIMD scope item, allowing easy navigation between both.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Closure Date:</h3>
                    <p>The closure date in the CIMD is the final date (forecasted date), and it must be reflected in the task's timeline.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Final MVP:</h3>
                    <p>The last MVP in the task should be completed one week before the final delivery date in the CIMD to allow for validation and review.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Updates:</h3>
                    <p>Any changes in the task or CIMD should be updated in both systems to maintain consistency.</p>
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


