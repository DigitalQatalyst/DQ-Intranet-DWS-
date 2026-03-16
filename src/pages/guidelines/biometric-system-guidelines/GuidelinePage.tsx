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
  const [guideTitle, setGuideTitle] = useState<string>('DQ Biometric System Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('December 19, 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-biometric-system-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Biometric System Guidelines')
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
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [principlesModalOpen, setPrinciplesModalOpen] = useState(false)
  const [processesModalOpen, setProcessesModalOpen] = useState(false)

  // Roles and Responsibilities data
  const rolesData = [
    {
      number: '01',
      role: 'Associates',
      responsibilities: '**Clocking In/Out:** Use the biometric system at entry/exit points.\n**Remote Associates:** Use the Shifts app for clocking in/out and shift management.\n**Issue Reporting:** Report any issues directly to Admin, including failed scans or access problems.\n**Security Compliance:** Ensure doors remain closed and use the biometric system for authorized access.',
    },
    {
      number: '02',
      role: 'IT Support',
      responsibilities: '**System Maintenance:** Responsible for configuration, updates, and security.\n**Issue Resolution:** Troubleshoot and resolve biometric system issues.\n**Backup and Recovery:** Ensure system data is backed up and recoverable.',
    },
    {
      number: '03',
      role: 'Admin',
      responsibilities: '**First Point of Contact:** Admin serves as the first point of contact for any issues related to the biometric system.\n**Attendance Reporting:** Admin is responsible for reporting attendance, including tracking associates\' clock-ins and clock-outs.\n**Escalation to IT:** Admin will escalate issues to IT Support if they cannot be resolved.',
    },
  ]

  // Guiding Principles data
  const principlesData = [
    {
      number: '01',
      principle: 'Clocking In/Out:',
      description: 'Associates must clock in at the start and clock out at the end of their shifts.\n\nRemote associates use the Shifts app for clocking in/out.\n\nFailure to Clock: Missing clock-ins/outs will be marked as absent and reported to Finance.',
    },
    {
      number: '02',
      principle: 'Access Control:',
      description: '**Biometric Access:** Access is granted only through successful biometric scans.\n**Failed Access:** If a scan fails, retry the scan. If issues persist, report to Admin.\n**Security:** Always ensure the door is securely closed after entry or exit.',
    },
  ]

  // Processes data
  const processesData = [
    {
      number: '01',
      process: 'Clocking In/Out:',
      description: 'Use the biometric system to clock in/out.\n\nFailure to Clock: Missing clock-ins/outs result in absence marking.\n\nRemote Associates: Use the Shifts app to clock in/out.',
    },
    {
      number: '02',
      process: 'Access Control:',
      description: '**Biometric System:** Grants access based on the registered biometric data.\n**Failed Access:** If the scan fails, retry. Persistent issues should be reported to Admin.\n**Door Security:** Ensure the door is closed at all times to prevent unauthorized access.',
    },
    {
      number: '03',
      process: 'Support:',
      description: '**Admin:** Report issues directly to Admin, who will escalate to IT if necessary.',
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
      <HeroSection title={guideTitle} date={lastUpdated} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Overview Section */}
              <GuidelineSection id="overview" title="Overview">
                <p>
                  These guidelines define the procedures for using the biometric system for clocking in/out and accessing restricted office areas, ensuring operational efficiency and security. The system facilitates accurate time tracking and secure access to the premises while offering support for any issues.
                </p>
              </GuidelineSection>

              {/* Purpose and Scope Section */}
              <GuidelineSection id="purpose-scope" title="Purpose and Scope">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Purpose</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Enable accurate time tracking through the biometric system for clocking in/out.</li>
                      <li>Ensure only authorized personnel can access office areas.</li>
                      <li>Provide troubleshooting support for any biometric system issues.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Scope</h3>
                    <p className="mb-3">
                      Applies to all associates using the biometric system for time tracking and access.
                    </p>
                    <p className="mb-2 font-semibold">Focuses on:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Clocking In/Out:</strong> Time tracking using the system.</li>
                      <li><strong>Access Control:</strong> Securing office areas.</li>
                      <li><strong>Remote Associates:</strong> Guidelines for remote associates using the Shifts app.</li>
                      <li><strong>Security:</strong> Ensuring doors remain closed when not in use.</li>
                      <li><strong>Support Channels:</strong> Directly forwarding issues to Admin and escalating to IT.</li>
                    </ul>
                  </div>
                </div>
              </GuidelineSection>

              {/* Roles and Responsibilities Section */}
              <GuidelineSection id="roles-responsibilities" title="Roles and Responsibilities">
                <p className="mb-6">
                  To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:
                </p>
                <SummaryTable
                  title="Roles and Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={rolesData}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles and Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={rolesData}
                />
              </GuidelineSection>

              {/* Guiding Principles and Controls Section */}
              <GuidelineSection id="guiding-principles" title="Guiding Principles and Controls">
                <p className="mb-6">
                  Highlights the essential principles for the system's use, including clocking in/out, access control, and security, with specific rules for failed access and security compliance:
                </p>
                <SummaryTable
                  title="Guiding Principles and Controls"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={principlesData}
                  onViewFull={() => setPrinciplesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={principlesModalOpen}
                  onClose={() => setPrinciplesModalOpen(false)}
                  title="Guiding Principles and Controls"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={principlesData}
                />
              </GuidelineSection>

              {/* Processes Section */}
              <GuidelineSection id="processes" title="Processes">
                <p className="mb-6">
                  Describes the step-by-step processes for clocking in/out, managing access, and handling support issues, ensuring consistency and clarity in daily operations:
                </p>
                <SummaryTable
                  title="Processes"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Process', accessor: 'process' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={processesData}
                  onViewFull={() => setProcessesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={processesModalOpen}
                  onClose={() => setProcessesModalOpen(false)}
                  title="Processes"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Process', accessor: 'process' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={processesData}
                />
              </GuidelineSection>

              {/* Tools and Resources Section */}
              <GuidelineSection id="tools-resources" title="Tools and Resources">
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Biometric System:</strong> Used for access control and time tracking.</li>
                  <li><strong>Shifts App:</strong> Used by remote associates to clock in/out, manage their shifts, and track attendance. The app also helps with shift follow-up and ensures associates' time is accurately recorded.</li>
                  <li><strong>Log Management System:</strong> Tracks access logs and failed attempts.</li>
                  <li><strong>Teams Chats and Calls:</strong> Primary communication channel for reporting issues.</li>
                </ul>
              </GuidelineSection>

              {/* KPIs Section */}
              <GuidelineSection id="kpis" title="Key Performance Indicators (KPIs)">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Clocking Accuracy Rate:</strong> Percentage of successful clock-ins/outs without issues.</li>
                  <li><strong>Access Denial Rate:</strong> Percentage of failed biometric access attempts.</li>
                  <li><strong>Issue Resolution Time:</strong> Average time taken to resolve biometric system issues.</li>
                  <li><strong>Security Compliance Rate:</strong> Percentage of associates ensuring doors remain securely closed after use.</li>
                </ul>
              </GuidelineSection>

              {/* Review and Update Schedule Section */}
              <GuidelineSection id="review-schedule" title="Review and Update Schedule">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quarterly Review:</strong> Guidelines will be reviewed to align with operational needs and legal requirements.</li>
                  <li><strong>Ad-Hoc Updates:</strong> Adjustments based on feedback, system changes, or operational needs.</li>
                </ul>
              </GuidelineSection>

              {/* Compliance and Governance Section */}
              <GuidelineSection id="compliance" title="Compliance and Governance">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Legal Compliance:</strong> Ensure compliance with data protection laws regarding biometric data.</li>
                  <li><strong>Operational Compliance:</strong> The system must be used as per the guidelines for time tracking and access control.</li>
                  <li><strong>Security:</strong> Biometric data is encrypted and accessible only by Admin and IT support.</li>
                </ul>
              </GuidelineSection>

              {/* Consequences for non-compliance Section */}
              <GuidelineSection id="consequences" title="Consequences for non-compliance">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Failure to Clock In/Out:</strong> Associates will be marked absent, and details will be forwarded to Finance for payroll processing.</li>
                  <li><strong>Misuse of the Biometric System:</strong> Attempts to bypass or misuse the system will result in disciplinary action.</li>
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


