import { useState } from 'react'
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
  const [structureModalOpen, setStructureModalOpen] = useState(false)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [daySprintModalOpen, setDaySprintModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [governanceModalOpen, setGovernanceModalOpen] = useState(false)
  const [escalationModalOpen, setEscalationModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
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
                <p className="mb-4">
                  The DQ L24 Working Room (WR) initiative has been introduced as part of DQ&apos;s effort to enhance collaboration, accountability, and real-time productivity across all units.
                </p>
                <p className="mb-4">
                  The concept of virtual Working Rooms represents a new way of working—shifting from meetings and discussions to active daily execution.
                </p>
                <p>
                  These guidelines are created to standardize how all DQ associates, moderators, and teams engage within the L24 Working Rooms, ensuring clarity, discipline, and consistent delivery outcomes across factories and towers.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-4">
                  The purpose of these guidelines is to establish a unified standard for the operation of DQ&apos;s virtual L24 Working Rooms.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Enabling associates to focus on executing concrete, day-to-day tasks rather than attending passive meetings.</li>
                  <li>Fostering a culture of practical action, peer accountability, and delivery momentum.</li>
                  <li>Ensuring structured use of Microsoft Teams as an effective collaboration environment.</li>
                </ul>
                <p>
                  The ultimate value lies in promoting alignment, focus, and consistent progress across DQ&apos;s operational ecosystem.
                </p>
              </GuidelineSection>

              {/* Structure Overview Section */}
              <GuidelineSection id="structure-overview" title="Structure Overview">
                <p className="mb-6">
                  The L24 Working Room (WR) operates under a two-tier structure to ensure efficient collaboration and task ownership:
                </p>
                <SummaryTable
                  title="Structure Overview"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Level', accessor: 'level' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      level: 'Unit-Level Working Room',
                      description: 'The main collaborative space for each DQ Factory or Unit (e.g., Stories Factory). Serves as the central session hub for coordination and team updates.',
                    },
                    {
                      number: '02',
                      level: 'Tower / Squad-Level / Project Breakout Room',
                      description: 'Created within the main Working Room using Microsoft Teams breakout features. Each breakout represents a specific functional or operational area (e.g., Blueprints, Collaterals & LMS | STC & DFSA Projects).',
                    },
                  ]}
                  onViewFull={() => setStructureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={structureModalOpen}
                  onClose={() => setStructureModalOpen(false)}
                  title="Structure Overview"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Level', accessor: 'level' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      level: 'Unit–Level Working Room',
                      description: 'The main collaborative space for each DQ Factory or Unit (e.g., Stories Factory). Serves as the central session hub for coordination and team updates.',
                    },
                    {
                      number: '02',
                      level: 'Tower / Squad-Level / Project Breakout Room',
                      description: 'Created within the main Working Room using Microsoft Teams breakout features. Each breakout represents a specific functional or operational area (e.g., Blueprints, Collaterals & LMS | STC & DFSA Projects).',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Session Composition & Conduct Section */}
              <GuidelineSection id="session-composition" title="Session Composition & Conduct">
                <p className="mb-6">
                  This section defines the key elements that shape the flow, engagement, and discipline of each session.
                </p>
                <SummaryTable
                  title="Session Composition & Conduct"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Session Kickoff',
                      action: 'All associates must join their designated Working Room by 9:00 AM (DXB time).',
                    },
                    {
                      number: '02',
                      guideline: 'Collaboration Format',
                      action: 'The day is spent in active collaboration, working within unit-level rooms or tower/squad-level/project breakout rooms aligned to task assignments.',
                    },
                  ]}
                  onViewFull={() => setSessionModalOpen(true)}
                />
                <FullTableModal
                  isOpen={sessionModalOpen}
                  onClose={() => setSessionModalOpen(false)}
                  title="Session Composition & Conduct"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Session Kickoff',
                      action: 'All associates must join their designated Working Room by 9:00 AM (DXB time).',
                    },
                    {
                      number: '02',
                      guideline: 'Collaboration Format',
                      action: 'The day is spent in active collaboration, working within unit-level rooms or tower/squad-level/project breakout rooms aligned to task assignments. Collaboration should be extended through channel engagements.',
                    },
                    {
                      number: '03',
                      guideline: 'Work Item Specification Requirement',
                      action: 'All work items assigned to associates must include quantifiable specifications and a defined date of completion, as these form the basis for deriving daily and weekly sprint plans.',
                    },
                    {
                      number: '04',
                      guideline: 'Reflection of Specifications in Trackers',
                      action: 'All defined specifications and completion dates must be accurately reflected in the associate\'s tasks and functional trackers, ensuring alignment between planned work and operational visibility.',
                    },
                    {
                      number: '05',
                      guideline: 'CWS & Retros',
                      action: 'All Sprint Plan Reviews (CWS) and Retrospectives are conducted in the main room at the times indicated in the meeting agenda.',
                    },
                    {
                      number: '06',
                      guideline: 'Availability Protocol',
                      action: 'Associates stepping out must provide a clear reason and estimated return time (ETA) in the chatbot.\nExample: "Stepping out for client call – back by 12:15 PM."\n❌ "BRB" alone is not acceptable.',
                    },
                    {
                      number: '07',
                      guideline: 'Lunch Break',
                      action: 'A fixed break for all associates from 2:00 PM to 3:00 PM (DXB time).',
                    },
                    {
                      number: '08',
                      guideline: 'Session Continuity',
                      action: 'Associates are expected to stay online and actively collaborate until the end of the working day.',
                    },
                    {
                      number: '09',
                      guideline: 'Sessions Placement Requirement',
                      action: 'All CWS/UWS/BWS sessions related to factories or project streams under a specific factory must take place within their relevant breakout rooms.\nThe sessions can be booked in the respective calendar to book slots for associates outside the WR but the meeting link needs to be optimized to reflect the WR meeting link.',
                    },
                    {
                      number: '10',
                      guideline: 'Functional & Specialized Trackers',
                      action: 'Functional Tracker needs to be used to identify high risk and low progress tasks to ensure accelerated momentum.\nSpecialized trackers are used to track and gain clarity on specs.\nBoth trackers are used as health dashboards.',
                    },
                    {
                      number: '11',
                      guideline: 'Connectivity & Logistics Requirement',
                      action: 'All associates are mandatorily required to join the Working Rooms at 9:00 AM DXB time. If facing logistical or connectivity issues, associates must prepare beforehand by ensuring mobile data is available.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Day Sprint Section */}
              <GuidelineSection id="day-sprint" title="Day Sprint in L24 Working Rooms">
                <p className="mb-6">
                  This section outlines the standard daily sprint rhythm followed inside the L24 Working Rooms to ensure structure, visibility, and continuous progress.
                </p>
                <SummaryTable
                  title="Day Sprint Rhythm"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Time Slot', accessor: 'time' },
                    { header: 'Activity', accessor: 'activity' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      time: '8:45 AM – 9:00 AM',
                      activity: 'Arrival & Greetings',
                      description: 'Associates join early, test audio, ensure stable connectivity, and set up their workspace before the day begins.',
                    },
                    {
                      number: '02',
                      time: '9:00 AM – 9:30 AM',
                      activity: 'Kick-Off Check-In (Morning Scrum)',
                      description: 'Align on priorities and daily targets. Associates post their focus areas on the channel for visibility.',
                    },
                  ]}
                  onViewFull={() => setDaySprintModalOpen(true)}
                />
                <FullTableModal
                  isOpen={daySprintModalOpen}
                  onClose={() => setDaySprintModalOpen(false)}
                  title="Day Sprint Rhythm"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Time Slot', accessor: 'time' },
                    { header: 'Activity', accessor: 'activity' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      time: '8:45 AM – 9:00 AM',
                      activity: 'Arrival & Greetings',
                      description: 'Associates join early, test audio, ensure stable connectivity, and set up their workspace before the day begins.',
                    },
                    {
                      number: '02',
                      time: '9:00 AM – 9:30 AM',
                      activity: 'Kick-Off Check-In (Morning Scrum)',
                      description: 'Align on priorities and daily targets.\nAssociates post their focus areas on the channel for visibility.\nAny pending carry-overs from the previous day are highlighted and assigned.\nThe team needs to focus on high risk/high priority items as targets.',
                    },
                    {
                      number: '03',
                      time: '9:30 AM – 12:30 PM',
                      activity: 'Deep Work Sprint 1',
                      description: 'Quiet, focused execution period. Optional co-working for clarification, resolving gaps, and aligning approaches in breakout rooms. Associates also close pending items from the previous day.',
                    },
                    {
                      number: '04',
                      time: '12:30 PM – 1:00 PM',
                      activity: 'Mid-Day Check-In',
                      description: 'Progress updates are shared on the channel. Associates briefly outline next steps required to close tasks. Blockers are raised and resolved in real time.',
                    },
                    {
                      number: '05',
                      time: '1:00 PM – 2:00 PM',
                      activity: 'LnD / Practices / Prod Streams & Clinic',
                      description: 'Dedicated time for associates to activate their Learning & Development streams, upskill, or work on practice/prod streams. Join Break-out room clinic to have collaboration focused on immediate task closure.',
                    },
                    {
                      number: '06',
                      time: '2:00 PM – 3:00 PM',
                      activity: 'Lunch Break',
                      description: 'Fixed break for all associates across the WR.',
                    },
                    {
                      number: '07',
                      time: '3:00 PM – 5:00 PM',
                      activity: 'Deep Work Sprint 2',
                      description: 'Continued focused execution. Associates post progress updates and NBAs on the channel before the end of the sprint.',
                    },
                    {
                      number: '08',
                      time: '5:00 PM – 6:00 PM',
                      activity: 'End-of-Day (EoD) Check-In',
                      description: 'Associates confirm overall progress, demonstrate outputs where applicable, and identify pending actions. NBAs for the following day are aligned and noted on the channel.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Roles & Responsibilities Section */}
              <GuidelineSection id="roles" title="Roles & Responsibilities">
                <p className="mb-6">
                  This section defines the responsibilities of all roles involved to ensure accountability and effective governance.
                </p>
                
                {/* 3-Column Summary Table - First 2 bullet points only */}
                <div className="my-8">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border" style={{ borderColor: '#E5E7EB' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0A1A3B' }}>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white border" style={{ borderColor: '#E5E7EB' }}>
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white border" style={{ borderColor: '#E5E7EB' }}>
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white border" style={{ borderColor: '#E5E7EB' }}>
                            Key Responsibilities
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900 border" style={{ borderColor: '#E5E7EB' }}>
                            01
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border" style={{ borderColor: '#E5E7EB' }}>
                            Associates
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border whitespace-pre-line" style={{ borderColor: '#E5E7EB' }}>
                            - Join the Working Room at 9 AM (DXB time).{'\n'}- Actively work on assigned tasks throughout the day.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900 border" style={{ borderColor: '#E5E7EB' }}>
                            02
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border" style={{ borderColor: '#E5E7EB' }}>
                            Scrum Master / Moderator
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border whitespace-pre-line" style={{ borderColor: '#E5E7EB' }}>
                            - Lead and facilitate the daily Working Room session.{'\n'}- Ensure sessions remain focused on execution and measurable progress.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* View Full Table Button */}
                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setRolesModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                      style={{ backgroundColor: '#030E31' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020A28'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030E31'}
                    >
                      View Full Table
                    </button>
                  </div>
                </div>

                {/* Full Table Modal */}
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles & Responsibilities"
                  description="This section defines the responsibilities of all roles involved to ensure accountability and effective governance."
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Key Responsibilities', accessor: 'responsibilities' },
                    { header: '', accessor: 'empty' },
                  ]}
                  data={[
                    {
                      number: '01',
                      role: 'Associates',
                      responsibilities: `- Join the Working Room at 9 AM (DXB time).
- Actively work on assigned tasks throughout the day.
- Engage on relevant Teams channels to provide visibility of progress, updates, and blockers.
- Collaborate effectively within breakout rooms and maintain focus on delivery.
- Log stepping-out reason and ETA in the chatbot (no "BRB" alone).
- Observe the fixed lunch break from 2:00 PM to 3:00 PM (DXB time).`,
                      empty: '',
                    },
                    {
                      number: '02',
                      role: 'Scrum Master / Moderator',
                      responsibilities: `- Lead and facilitate the daily Working Room session.
- Ensure sessions remain focused on execution and measurable progress.
- Scrum master observes the WR to understand the pulse of the unit to ensure pain points are addressed as priority.
- Monitor attendance, engagement, and task completion across associates.
- Actively pull in necessary resources or support to resolve blockers in real time, not just report them.
- Conduct CWS and Retros in the main room per the weekly agenda.
- Uphold DQ's culture of accountability, collaboration, and delivery momentum.
- Report daily progress and unresolved issues to the relevant channel.`,
                      empty: '',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Governance & Review Cycle Section */}
              <GuidelineSection id="governance" title="Governance & Review Cycle">
                <p className="mb-6">
                  This section outlines the governance rhythm and review cadence to ensure continuous alignment and accountability.
                </p>
                <SummaryTable
                  title="Governance & Review Cycle"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Activity', accessor: 'activity' },
                    { header: 'Frequency', accessor: 'frequency' },
                    { header: 'Led By', accessor: 'ledBy' },
                    { header: 'Purpose', accessor: 'purpose' },
                  ]}
                  data={[
                    {
                      number: '01',
                      activity: 'Daily Working Room Session',
                      frequency: 'Daily, 9 AM–EOD',
                      ledBy: 'Moderator',
                      purpose: 'Enable active execution, collaboration, and focus.',
                    },
                    {
                      number: '02',
                      activity: 'Sprint Plan Review (CWS)',
                      frequency: 'Weekly',
                      ledBy: 'Factory Lead / Tower Lead',
                      purpose: 'Review sprint plan for the week and blockers in the starting of the week.',
                    },
                  ]}
                  onViewFull={() => setGovernanceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={governanceModalOpen}
                  onClose={() => setGovernanceModalOpen(false)}
                  title="Governance & Review Cycle"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Activity', accessor: 'activity' },
                    { header: 'Frequency', accessor: 'frequency' },
                    { header: 'Led By', accessor: 'ledBy' },
                    { header: 'Purpose', accessor: 'purpose' },
                  ]}
                  data={[
                    {
                      number: '01',
                      activity: 'Daily Working Room Session',
                      frequency: 'Daily, 9 AM–EOD',
                      ledBy: 'Moderator',
                      purpose: 'Enable active execution, collaboration, and focus.',
                    },
                    {
                      number: '02',
                      activity: 'Sprint Plan Review (CWS)',
                      frequency: 'Weekly',
                      ledBy: 'Factory Lead / Tower Lead',
                      purpose: 'Review sprint plan for the week and blockers in the starting of the week.',
                    },
                    {
                      number: '03',
                      activity: 'Retrospective',
                      frequency: 'Weekly',
                      ledBy: 'Factory Lead / Tower Lead',
                      purpose: 'Review plan vs action and reflect on performance at the end of the week.',
                    },
                    {
                      number: '04',
                      activity: 'Compliance Check',
                      frequency: 'Weekly',
                      ledBy: 'EVMO Unit',
                      purpose: 'Verify adherence to WR guidelines.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Escalation & Payroll Protocol Section */}
              <GuidelineSection id="escalation" title="Escalation & Payroll Protocol">
                <p className="mb-6">
                  This section defines the escalation process and accountability measures to ensure timely resolution of issues.
                </p>
                <SummaryTable
                  title="Escalation & Payroll Protocol"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Condition', accessor: 'condition' },
                    { header: 'Action Required', accessor: 'action' },
                    { header: 'Owner', accessor: 'owner' },
                  ]}
                  data={[
                    {
                      number: '01',
                      condition: 'Associate repeatedly absent or inactive during WR sessions',
                      action: 'Issue verbal reminder and report to Line Manager',
                      owner: 'Scrum Master',
                    },
                    {
                      number: '02',
                      condition: 'Associate leaves the Working Room without notifying reason and ETA after repeated reminders',
                      action: 'Team accounts will be suspended, and associates must contact HR to request reactivation.',
                      owner: 'Scrum Master & HR',
                    },
                  ]}
                  onViewFull={() => setEscalationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={escalationModalOpen}
                  onClose={() => setEscalationModalOpen(false)}
                  title="Escalation & Payroll Protocol"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Condition', accessor: 'condition' },
                    { header: 'Action Required', accessor: 'action' },
                    { header: 'Owner', accessor: 'owner' },
                  ]}
                  data={[
                    {
                      number: '01',
                      condition: 'Associate repeatedly absent or inactive during WR sessions',
                      action: 'Issue verbal reminder and report to Line Manager',
                      owner: 'Scrum Master',
                    },
                    {
                      number: '02',
                      condition: 'Associate leaves the Working Room without notifying reason and ETA after repeated reminders',
                      action: 'Team accounts will be suspended, and associates must contact HR to request reactivation.',
                      owner: 'Scrum Master & HR',
                    },
                    {
                      number: '03',
                      condition: 'Non-compliance persists beyond two working days',
                      action: 'Escalate to Line Manager for review and disciplinary action.',
                      owner: 'Scrum Master',
                    },
                    {
                      number: '04',
                      condition: 'Continuous non-participation or lack of progress for one week',
                      action: 'Subject to formal performance review and potential payroll impact.',
                      owner: 'HR & Line Manager',
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

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage
