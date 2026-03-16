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
  const [guideTitle, setGuideTitle] = useState<string>('DQ Associate Owned Asset Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('Version 1.8 • December 19, 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-associate-owned-asset-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Associate Owned Asset Guidelines')
          if (data.last_updated_at) {
            const date = new Date(data.last_updated_at)
            setLastUpdated(`Version 1.8 • ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
          }
        }
      } catch (error) {
        console.error('Error fetching guide title:', error)
      }
    })()
    return () => { cancelled = true }
  }, [])
  
  // Modal state management for tables
  const [coreComponentsModalOpen, setCoreComponentsModalOpen] = useState(false)
  const [byodProcedureModalOpen, setByodProcedureModalOpen] = useState(false)
  const [byodResponsibilitiesModalOpen, setByodResponsibilitiesModalOpen] = useState(false)
  const [fyodProcedureModalOpen, setFyodProcedureModalOpen] = useState(false)
  const [fyodResponsibilitiesModalOpen, setFyodResponsibilitiesModalOpen] = useState(false)
  const [hyodProcedureModalOpen, setHyodProcedureModalOpen] = useState(false)
  const [hyodResponsibilitiesModalOpen, setHyodResponsibilitiesModalOpen] = useState(false)

  // Core Components data
  const coreComponentsData = [
    {
      number: '01',
      program: 'BYOD (Bring Your Own Device)',
      description: 'Associates are required to bring their personal devices, including headsets, to work. The devices must meet the minimum technical specifications set by DQ.',
    },
    {
      number: '02',
      program: 'FYOD (Finance Your Own Device)',
      description: 'Associates can apply for the FYOD program to purchase a company\'s device, with the cost deducted from their monthly salary. The purchase is subject to approval by the company',
    },
    {
      number: '03',
      program: 'HYOD (Hold Your Own Device)',
      description: 'In emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device.',
    },
  ]

  // BYOD Procedure data
  const byodProcedureData = [
    {
      number: '01',
      step: 'Device Specifications',
      description: 'Associates must ensure their personal devices meet the minimum technical specifications set by DQ, as outlined by the IT team.',
    },
    {
      number: '02',
      step: 'Device maintenance',
      description: 'Associates are responsible for ongoing maintenance of their personal devices.',
    },
    {
      number: '03',
      step: 'Reporting Issues',
      description: 'Associates must report any laptop malfunctions, damage or loss to Admin and IT within 24hours. This is crucial for preventing work disruptions and ensuring a temporary laptop can be issued under the HYOD program.',
    },
  ]

  // BYOD Responsibilities data
  const byodResponsibilitiesData = [
    {
      number: '01',
      role: 'Associate',
      description: '**Responsible for the acquisition, maintenance, and repair of personal devices used for work.** Associates must ensure that their personal laptops devices meet the minimum technical specifications set by DQ.\n\n**Strictly adhere to all aspects of the guidelines.**\n\n**Promptly report any laptop malfunction, damage, or loss to the Admin and IT departments within 24 hours** to ensure continued productivity through the issuance of a temporary DQ device under the HYOD program.\n\n**Associates must delete all company data from their devices during off-boarding.**',
    },
    {
      number: '02',
      role: 'Admin',
      description: '**Monitor and enforce compliance with the guidelines**, ensuring associates adhere to the guidelines for personal device usage.\n\n**Act as the first point of contact for any issues or disputes** related to the BYOD program.\n\n**Maintain accurate records** for associates under the BYOD program.',
    },
    {
      number: '03',
      role: 'IT',
      description: 'Support will only be limited to troubleshooting devices.',
    },
    {
      number: '04',
      role: 'HR',
      description: '**Inform new joiners during the on-boarding process** on the two device programs available at DQ: BYOD and FYOD. Ensure that they also communicate the minimum specifications that all BYOD devices must meet.',
    },
  ]

  // FYOD Procedure data
  const fyodProcedureData = [
    {
      number: '01',
      step: 'Application Submission',
      description: 'Associates must complete and submit a Commitment Form to the Admin. This form must be completed once issued with a device.',
    },
    {
      number: '02',
      step: 'Approval Process',
      description: 'Admin will review and approve requests within 48 hours. This will then be communicated to Finance. Upon approval by Finance, Admin will communicate the approval to the associate.',
    },
    {
      number: '03',
      step: 'Device Selection',
      description: 'An associate will select a maximum of one device.',
    },
    {
      number: '04',
      step: 'Salary Deductions',
      description: 'The original cost of the device will be deducted from an associate\'s salary through agreed upon monthly installments over a maximum period of three months.',
    },
    {
      number: '05',
      step: 'Ownership Transfer',
      description: 'Until payments and deductions are completed, the device remains the property of DQ and must be left at the office on a daily basis by 5:00PM.',
    },
  ]

  // FYOD Responsibilities data
  const fyodResponsibilitiesData = [
    {
      number: '01',
      role: 'Associate',
      description: '**Associates must complete and submit a Commitment Form to Admin.**\n\n**Once approved, an associate will pick a device of their choosing** and ensure they sign the Commitment Form.\n\n**Associates are responsible for company devices**, and DQ will not be liable for any damage caused by negligence. Maintenance will only cover system malfunctions, and a temporary device will be provided to the associate during that time.\n\n**Associates must return the devices to Admin daily by 5PM** until all final deductions have been completed.\n\n**Associates must delete all company data from their devices during off-boarding.**',
    },
    {
      number: '02',
      role: 'Admin',
      description: '**Review and approve FYOD applications** based on their compliance with DQ standards.\n\n**Assist associates with completing the FYOD process** and ensure they are informed about the program.\n\n**Ensure associates fill in and sign the Commitment Form** upon issuance of the device.\n\n**Ensure DQ owned devices are locked daily after 5:00PM.**\n\n**Ensure associates return company devices daily by 5.00PM** until all payments are complete.',
    },
    {
      number: '03',
      role: 'IT',
      description: '**Diagnose device issues** and only provide support for troubleshooting and system malfunctions.',
    },
    {
      number: '04',
      role: 'Finance',
      description: '**Manage the financial aspects of the program** by processing monthly salary deductions.',
    },
  ]

  // HYOD Procedure data
  const hyodProcedureData = [
    {
      number: '01',
      step: 'Emergency Reporting',
      description: 'Associates must report any laptop malfunctions, damage or loss to Admin and IT within 24hours. This is crucial to avoid work disruptions and for the issuance of a temporary laptop under the HYOD program.',
    },
    {
      number: '02',
      step: 'Assessment and Approval',
      description: 'IT will assess the emergency and approve the issuance of a company device.',
    },
    {
      number: '03',
      step: 'Device Issuance',
      description: 'Associates must sign a Commitment Form for the issued company device.',
    },
    {
      number: '04',
      step: 'Device Usage',
      description: 'Associates will receive a company device for temporary use while their personal device is being repaired or replaced. The company device will be available for a maximum of five days and must be returned to the Admin department by 5:00 PM each day.',
    },
    {
      number: '05',
      step: 'Device Return',
      description: 'The company device must be returned to Admin, who will then hand it over to the IT team for inspection to ensure it is in good working condition. If the device is returned with damage, the associate will be responsible for the repair costs, which will be automatically deducted from their salary.',
    },
  ]

  // HYOD Responsibilities data
  const hyodResponsibilitiesData = [
    {
      number: '01',
      role: 'Associate',
      description: '**Immediately report device failure or loss to Admin within 24hours** to ensure continued productivity by issuance of a temporary company device.\n\n**Sign a Commitment Form for the company device.**\n\n**Return the company device by 5.00 PM and confirm its return with Admin.** All company devices must be returned in good working condition',
    },
    {
      number: '02',
      role: 'Admin',
      description: '**Maintain records of company devices issued** and ensure compliance with the HYOD program.\n\n**Coordinate with IT** to ensure associates are issued company devices and that associates return the devices in good working condition',
    },
    {
      number: '03',
      role: 'IT',
      description: '**Assess the emergency and approve the issuance of a company laptop** if necessary.\n\n**Diagnose device issues**, assist with troubleshooting and system malfunctions only.\n\n**Inspect the company device upon return.**',
    },
    {
      number: '04',
      role: 'Finance',
      description: '**Process salary deductions for damaged company devices.**',
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
              {/* Context Section */}
              <GuidelineSection id="context" title="1. Context">
                <p>
                  The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.
                </p>
                <p className="mt-4">
                  In this context, the `Company` refers to DQ whereas `Devices` refers to laptops.
                </p>
              </GuidelineSection>

              {/* Overview Section */}
              <GuidelineSection id="overview" title="2. Overview">
                <p className="mb-4">
                  The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Mitigate Asset Theft.</li>
                  <li>Promote Accountability.</li>
                  <li>Support Seamless Transitions.</li>
                  <li>Optimize Operational Efficiency.</li>
                </ul>
              </GuidelineSection>

              {/* Purpose and Scope Section */}
              <GuidelineSection id="purpose-scope" title="3. Purpose and Scope">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Purpose</h3>
                    <p>
                      The purpose of the Associate Owned Asset Guidelines is to transition to an associate-owned device model at DQ, aimed at mitigating asset theft by departing associates while ensuring accountability, and proper maintenance of devices used for work. These guidelines empower associates with flexible options to use and manage their personal work devices.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Scope</h3>
                    <p className="mb-3">
                      These guidelines apply to all DQ Associates. They cover the use of personal devices for all company-related work and include procedures for the BYOD, FYOD and HYOD programs.
                    </p>
                    <p>
                      The scope also involves clear responsibilities for device acquisition, maintenance, and reporting.
                    </p>
                  </div>
                </div>
              </GuidelineSection>

              {/* Core Components Section */}
              <GuidelineSection id="core-components" title="4. Core Components">
                <p className="mb-6">
                  The Guidelines comprises of three core programs designed to assist associates during the transition:
                </p>
                <SummaryTable
                  title="Core Components"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Program', accessor: 'program' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={coreComponentsData}
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
                  data={coreComponentsData}
                />
              </GuidelineSection>

              {/* Roles and Responsibilities Section */}
              <GuidelineSection id="roles-responsibilities" title="5. Roles and Responsibilities">
                <p className="mb-6">
                  To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:
                </p>
              </GuidelineSection>

              {/* BYOD Section */}
              <GuidelineSection id="byod" title="5.1 BYOD (Bring Your Own Device)">
                <p>
                  Associates in the Bring Your Own Device (BYOD) program are required to use their personal devices, including headsets, for work. These devices must meet the minimum technical standards set by the company.
                </p>
              </GuidelineSection>

              {/* BYOD Procedure Section */}
              <GuidelineSection id="byod-procedure" title="5.1.1 Procedure:">
                <p className="mb-6">
                  This procedure outlines key steps associates must follow when using their own devices at work under the BYOD program.
                </p>
                <SummaryTable
                  title="BYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={byodProcedureData}
                  onViewFull={() => setByodProcedureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={byodProcedureModalOpen}
                  onClose={() => setByodProcedureModalOpen(false)}
                  title="BYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={byodProcedureData}
                />
              </GuidelineSection>

              {/* BYOD Responsibilities Section */}
              <GuidelineSection id="byod-responsibilities" title="5.1.2 Responsibilities:">
                <p className="mb-6">
                  Outlined below are shared responsibilities for various departments in DQ to ensure the BYOD program runs smoothly and securely.
                </p>
                <SummaryTable
                  title="BYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={byodResponsibilitiesData}
                  onViewFull={() => setByodResponsibilitiesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={byodResponsibilitiesModalOpen}
                  onClose={() => setByodResponsibilitiesModalOpen(false)}
                  title="BYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={byodResponsibilitiesData}
                />
              </GuidelineSection>

              {/* FYOD Section */}
              <GuidelineSection id="fyod" title="5.2 FYOD (Finance Your Own Device)">
                <p>
                  The Finance Your Own Device (FYOD) program allows associates to buy a company device, with the cost being deducted from their salary through agreed upon monthly installments over a maximum period of three months.
                </p>
              </GuidelineSection>

              {/* FYOD Procedure Section */}
              <GuidelineSection id="fyod-procedure" title="5.2.1 Procedure:">
                <p className="mb-6">
                  This procedure outlines key steps that associates must follow when acquiring and maintaining devices under the FYOD program.
                </p>
                <SummaryTable
                  title="FYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={fyodProcedureData}
                  onViewFull={() => setFyodProcedureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={fyodProcedureModalOpen}
                  onClose={() => setFyodProcedureModalOpen(false)}
                  title="FYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={fyodProcedureData}
                />
              </GuidelineSection>

              {/* FYOD Responsibilities Section */}
              <GuidelineSection id="fyod-responsibilities" title="5.2.2 Responsibilities:">
                <p className="mb-6">
                  Outlined below are shared responsibilities for various departments in DQ to ensure the FYOD program runs smoothly and securely.
                </p>
                <SummaryTable
                  title="FYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={fyodResponsibilitiesData}
                  onViewFull={() => setFyodResponsibilitiesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={fyodResponsibilitiesModalOpen}
                  onClose={() => setFyodResponsibilitiesModalOpen(false)}
                  title="FYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={fyodResponsibilitiesData}
                />
              </GuidelineSection>

              {/* HYOD Section */}
              <GuidelineSection id="hyod" title="5.2.3 HYOD (Hold Your Own Device)">
                <p>
                  The "Hold Your Own Device" (HYOD) program allows associates to temporarily borrow a company device in emergency situations when their personal device is unavailable.
                </p>
              </GuidelineSection>

              {/* HYOD Procedure Section */}
              <GuidelineSection id="hyod-procedure" title="5.2.4 Procedure:">
                <p className="mb-6">
                  This procedure outlines key steps for associates to follow while using company devices for work under the HYOD program
                </p>
                <SummaryTable
                  title="HYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={hyodProcedureData}
                  onViewFull={() => setHyodProcedureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={hyodProcedureModalOpen}
                  onClose={() => setHyodProcedureModalOpen(false)}
                  title="HYOD Procedure"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Key Steps', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={hyodProcedureData}
                />
              </GuidelineSection>

              {/* HYOD Responsibilities Section */}
              <GuidelineSection id="hyod-responsibilities" title="5.2.5 Responsibilities">
                <p className="mb-6">
                  Outlined below are shared responsibilities for various departments in DQ to ensure the HYOD program runs smoothly and securely.
                </p>
                <SummaryTable
                  title="HYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={hyodResponsibilitiesData}
                  onViewFull={() => setHyodResponsibilitiesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={hyodResponsibilitiesModalOpen}
                  onClose={() => setHyodResponsibilitiesModalOpen(false)}
                  title="HYOD Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={hyodResponsibilitiesData}
                />
              </GuidelineSection>

              {/* Guiding Principles and Controls Section */}
              <GuidelineSection id="guiding-principles" title="6. Guiding Principles and Controls">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Transparency:</strong> The process is designed to be transparent, auditable, and continuously improving to avoid errors and ensure adherence to best practices.</li>
                  <li><strong>Ownership:</strong> Devices acquired through the FYOD program become the property of the associate once payments are completed.</li>
                  <li><strong>Compliance:</strong> Failure to comply with the device guidelines will result in financial penalties via salary deductions.</li>
                </ul>
              </GuidelineSection>

              {/* Tools and Resources Section */}
              <GuidelineSection id="tools-resources" title="7. Tools and Resources">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Asset Management System (Tracker):</strong> To track the status and condition of all laptop devices under the BYOD, FYOD, and HYOD programs.</li>
                  <li><strong>Commitment Form:</strong> For FYOD and HYOD programs.</li>
                  <li><strong>Minimum Devices Specifications.</strong></li>
                </ul>
              </GuidelineSection>

              {/* KPIs Section */}
              <GuidelineSection id="kpis" title="8. Key Performance Indicators (KPIs)">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Number of FYOD applications submitted and approved.</li>
                  <li>Number of HYOD company devices issued and returned.</li>
                  <li>Percentage of associates' personal devices meeting the minimum technical specifications.</li>
                  <li>Number of security incidents related to personal devices.</li>
                  <li>Number of reduced theft cases.</li>
                </ul>
              </GuidelineSection>

              {/* Review and Update Schedule Section */}
              <GuidelineSection id="review-schedule" title="9. Review and Update Schedule">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quarterly:</strong> The guidelines will be reviewed every three months to ensure they remain aligned with operational needs.</li>
                  <li><strong>Ad-Hoc Optimization:</strong> The guidelines can be optimized at any time if a need for optimization is identified.</li>
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

