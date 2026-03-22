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
  const [guideTitle, setGuideTitle] = useState<string>('DQ Working Room Attendance & Punctuality Policy')
  const [lastUpdated, setLastUpdated] = useState<string>('December 19, 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-wr-attendance-punctuality-policy')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Working Room Attendance & Punctuality Policy')
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
  
  // Modal state management for tables
  const [loginTimesModalOpen, setLoginTimesModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [salaryDeductionsModalOpen, setSalaryDeductionsModalOpen] = useState(false)

  // Mandatory Working Room Login Times data
  const loginTimesData = [
    {
      location: 'Nairobi',
      startTime: '08:00 AM',
    },
    {
      location: 'Dubai',
      startTime: '09:00 AM',
    },
  ]

  // Roles & Responsibilities data
  const rolesData = [
    {
      role: 'Associates',
      responsibilities: '**Ensure WR login before start time**\n**Maintain readiness daily**\n**Secure HR approval for late physical arrival**',
    },
    {
      role: 'Scrum Masters',
      responsibilities: '**Take WR attendance at start time**\n**Record lateness objectively**\n**Apply penalties consistently**\n**Escalate breaches immediately**',
    },
    {
      role: 'Human Resources (HRA Lead)',
      responsibilities: '**Govern approvals**\n**Apply payroll deductions**\n**Trigger disciplinary reviews**',
    },
  ]

  // Salary Deductions data
  const salaryDeductionsData = [
    {
      location: 'Nairobi-Based Associates',
      deduction: 'USD 50 after 9:05 am (dxb time)',
      maximum: 'Maximum deduction per session: USD 50',
    },
    {
      location: 'Dubai-Based Associates',
      deduction: 'USD 100 after 9:05 am (dxb time)',
      maximum: 'Maximum deduction per session: USD 100',
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
                  <span className="ml-1 text-gray-500 md:ml-2">{guideTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection title={guideTitle} date={lastUpdated} tag="Policy" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Document Control Section */}
              <GuidelineSection id="document-control" title="Document Control">
                <div className="space-y-3">
                  <p><strong>Policy Owner:</strong> Human Resources (HRA Lead)</p>
                  <p><strong>Enforcement Authority:</strong> Scrum Masters, HR, Line Leadership</p>
                  <p><strong>Effective Date:</strong> Immediate</p>
                  <p><strong>Applicability:</strong> All DQ Associates (Permanent, Contract, Remote, Hybrid)</p>
                  <p><strong>Review Cycle:</strong> Quarterly</p>
                </div>
              </GuidelineSection>

              {/* Policy Objective Section */}
              <GuidelineSection id="policy-objective" title="1. Policy Objective">
                <p>
                  This policy establishes mandatory attendance and punctuality requirements for Daily Online Working Room (WR) sessions and physical office attendance. The objective is to eliminate productivity losses caused by late arrivals and reinforce execution discipline across all DQ operations.
                </p>
              </GuidelineSection>

              {/* Scope Section */}
              <GuidelineSection id="scope" title="2. Scope">
                <p className="mb-3">This policy applies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daily Online Working Room (WR) sessions</li>
                  <li>Physical office attendance</li>
                  <li>All associates, regardless of role, seniority, or working model</li>
                </ul>
              </GuidelineSection>

              {/* Definitions Section */}
              <GuidelineSection id="definitions" title="3. Definitions">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Working Room (WR):</strong> Mandatory daily online working session.</li>
                  <li><strong>Late WR Login:</strong> Logging into the WR at or after the official start time.</li>
                  <li><strong>Late Physical Arrival:</strong> Physical office arrival after official start time without HR approval.</li>
                  <li><strong>HRA Lead:</strong> Authorized HR authority governing attendance discipline.</li>
                </ul>
              </GuidelineSection>

              {/* Mandatory Working Room Login Times Section */}
              <GuidelineSection id="mandatory-login-times" title="4. Mandatory Working Room Login Times">
                <p className="mb-6">
                  Logging in at or after start time is recorded as late.
                </p>
                <SummaryTable
                  title="Mandatory Working Room Login Times"
                  columns={[
                    { header: 'Location', accessor: 'location' },
                    { header: 'WR Start Time', accessor: 'startTime' },
                  ]}
                  data={loginTimesData}
                  onViewFull={() => setLoginTimesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={loginTimesModalOpen}
                  onClose={() => setLoginTimesModalOpen(false)}
                  title="Mandatory Working Room Login Times"
                  columns={[
                    { header: 'Location', accessor: 'location' },
                    { header: 'WR Start Time', accessor: 'startTime' },
                  ]}
                  data={loginTimesData}
                />
              </GuidelineSection>

              {/* WR Attendance Requirements Section */}
              <GuidelineSection id="wr-attendance" title="5. WR Attendance Requirements">
                <ul className="list-disc pl-6 space-y-2">
                  <li>WR attendance is mandatory and non-negotiable.</li>
                  <li>All associates must log in on time regardless of physical location.</li>
                  <li>Late physical arrival does not excuse late WR login.</li>
                  <li>Associates are personally responsible for:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Adequate data credit</li>
                      <li>Stable internet connectivity</li>
                      <li>Functional equipment</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-4 font-semibold">
                  Connectivity or data issues do not constitute valid excuses.
                </p>
              </GuidelineSection>

              {/* Physical Office Late Arrival Governance Section */}
              <GuidelineSection id="physical-office" title="6. Physical Office Late Arrival Governance">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any late physical arrival must be pre-approved by the HRA Lead.</li>
                  <li>Arrival without HR approval is a policy violation.</li>
                  <li>Scrum Masters cannot approve late physical arrivals.</li>
                </ul>
              </GuidelineSection>

              {/* Roles & Responsibilities Section */}
              <GuidelineSection id="roles-responsibilities" title="7. Roles & Responsibilities">
                <SummaryTable
                  title="Roles & Responsibilities"
                  columns={[
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={rolesData}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles & Responsibilities"
                  columns={[
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={rolesData}
                />
              </GuidelineSection>

              {/* Salary Deductions Section */}
              <GuidelineSection id="salary-deductions" title="8. Salary Deductions – Late WR Login">
                <p className="mb-4">
                  Salary deductions apply after the associate joins 5 mins late into the morning scrum.
                </p>
                <SummaryTable
                  title="Salary Deductions – Late WR Login"
                  columns={[
                    { header: 'Location', accessor: 'location' },
                    { header: 'Deduction', accessor: 'deduction' },
                    { header: 'Maximum', accessor: 'maximum' },
                  ]}
                  data={salaryDeductionsData}
                  onViewFull={() => setSalaryDeductionsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={salaryDeductionsModalOpen}
                  onClose={() => setSalaryDeductionsModalOpen(false)}
                  title="Salary Deductions – Late WR Login"
                  columns={[
                    { header: 'Location', accessor: 'location' },
                    { header: 'Deduction', accessor: 'deduction' },
                    { header: 'Maximum', accessor: 'maximum' },
                  ]}
                  data={salaryDeductionsData}
                />
              </GuidelineSection>

              {/* Late Beyond 30 Minutes Section */}
              <GuidelineSection id="late-30-minutes" title="9. Late Beyond 30 Minutes – Immediate Disciplinary Review">
                <p className="mb-4">
                  Logging into the WR 30 minutes or more late triggers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Immediate Disciplinary Review</li>
                  <li>Escalation to HR and Line Leadership</li>
                  <li>Potential suspension of work privileges for the day</li>
                  <li>Further payroll or contractual action as determined by HR</li>
                </ul>
                <p className="mt-4 font-semibold">
                  No salary deduction replaces disciplinary action beyond 30 minutes.
                </p>
              </GuidelineSection>

              {/* Late Physical Arrival Section */}
              <GuidelineSection id="late-physical-arrival" title="10. Late Physical Arrival (Without HR Approval)">
                <p className="mb-3">In addition to WR penalties:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Immediate salary deduction</li>
                  <li>Formal disciplinary notice</li>
                  <li>Impact on performance review</li>
                  <li>Potential removal of flexible or remote work privileges</li>
                </ul>
              </GuidelineSection>

              {/* No-Exception Clause Section */}
              <GuidelineSection id="no-exception" title="11. No-Exception Clause">
                <ul className="list-disc pl-6 space-y-2">
                  <li>No discretionary exceptions are permitted outside documented HR approval.</li>
                  <li>Repeated breaches will be treated as willful non-compliance.</li>
                </ul>
              </GuidelineSection>

              {/* Cultural Alignment Section */}
              <GuidelineSection id="cultural-alignment" title="12. Cultural Alignment">
                <ul className="list-disc pl-6 space-y-2">
                  <li>DQ operates as a task-based, execution-first Digital Cognitive Organization.</li>
                  <li>Punctuality is a professional obligation and a baseline expectation.</li>
                </ul>
              </GuidelineSection>

              {/* Policy Acknowledgment Section */}
              <GuidelineSection id="policy-acknowledgment" title="13. Policy Acknowledgment">
                <p>
                  All associates must formally acknowledge this policy. Non-acknowledgment does not exempt compliance.
                </p>
              </GuidelineSection>

              {/* Policy Review & Amendments Section */}
              <GuidelineSection id="policy-review" title="14. Policy Review & Amendments">
                <p>
                  HR reserves the right to revise this policy to maintain organizational effectiveness.
                </p>
              </GuidelineSection>

              {/* Approved By Section */}
              <GuidelineSection id="approved-by" title="Approved By">
                <p>
                  <strong>Human Resources Authority (HRA Lead)</strong><br />
                  Digital Qatalyst
                </p>
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


