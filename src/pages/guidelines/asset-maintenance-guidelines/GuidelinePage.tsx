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
  const [guideTitle, setGuideTitle] = useState<string>('DQ Asset Maintenance, Repair and Disposal Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('September 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-asset-maintenance-repair-disposal-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Asset Maintenance, Repair and Disposal Guidelines')
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
  const [keyDefinitionsModalOpen, setKeyDefinitionsModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [reportingFlowModalOpen, setReportingFlowModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const [repairModalOpen, setRepairModalOpen] = useState(false)
  const [disposalModalOpen, setDisposalModalOpen] = useState(false)
  const [complianceModalOpen, setComplianceModalOpen] = useState(false)

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
      <HeroSection title={guideTitle} date={lastUpdated} author="Version 1.3 • DQ Operations • Digital Qatalyst" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Context Section */}
              <GuidelineSection id="context" title="Context">
                <p>
                  These guidelines outline the standard approach for associates in maintaining, repairing, and disposing of company assets.
                </p>
                <p>
                  They ensure assets are properly used, maintained efficiently, and disposed of securely — minimizing loss, promoting accountability, and supporting a safe, functional, and collaborative work environment.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-4">
                  To monitor and manage the lifecycle of DQ assets, ensuring they are properly maintained, efficiently repaired, and securely disposed of in line with operational and compliance standards.
                </p>
                <p className="mb-4">The guidelines aim to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standardize asset management processes across teams.</li>
                  <li>Ensure responsible use of company resources.</li>
                  <li>Establish clear reporting, escalation, and accountability measures.</li>
                  <li>Support operational efficiency and sustainability.</li>
                </ul>
              </GuidelineSection>

              {/* Scope Section */}
              <GuidelineSection id="scope" title="Scope">
                <p className="mb-4">
                  These guidelines apply to all associates using company-provided assets, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Furniture</strong>: chairs, desks, tables, whiteboards, TV stands</li>
                  <li><strong>Appliances</strong>: fridges, microwaves, water dispensers, extension cables</li>
                  <li><strong>Utilities/Shared Resources</strong>: dustbins, ladders, crockery (cups, plates)</li>
                  <li><strong>Devices</strong>: laptops, headsets, TVs, webcams, monitors, keyboards</li>
                </ul>
              </GuidelineSection>

              {/* Key Definitions Section */}
              <GuidelineSection id="key-definitions" title="Key Definitions">
                <SummaryTable
                  title="Key Definitions"
                  columns={[
                    { header: 'Term', accessor: 'term' },
                    { header: 'Definition', accessor: 'definition' },
                  ]}
                  data={[
                    {
                      term: 'Asset',
                      definition: 'Any item provided by DQ for work purposes, including furniture, appliances, devices, and shared resources.',
                    },
                    {
                      term: 'Maintenance',
                      definition: 'Routine care and preventive actions to keep assets functional, safe, and in good condition.',
                    },
                    {
                      term: 'Repair',
                      definition: 'The process of fixing or restoring a faulty, broken, or damaged asset to its functional state.',
                    },
                    {
                      term: 'Disposal',
                      definition: 'Authorized removal of an asset from use once it is obsolete, beyond repair, or no longer required.',
                    },
                    {
                      term: 'Device',
                      definition: 'Portable or fixed electronic equipment used for work, such as laptops, monitors, webcams, or headsets.',
                    },
                  ]}
                  onViewFull={() => setKeyDefinitionsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={keyDefinitionsModalOpen}
                  onClose={() => setKeyDefinitionsModalOpen(false)}
                  title="Key Definitions"
                  columns={[
                    { header: 'Term', accessor: 'term' },
                    { header: 'Definition', accessor: 'definition' },
                  ]}
                  data={[
                    {
                      term: 'Asset',
                      definition: 'Any item provided by DQ for work purposes, including furniture, appliances, devices, and shared resources.',
                    },
                    {
                      term: 'Maintenance',
                      definition: 'Routine care and preventive actions to keep assets functional, safe, and in good condition.',
                    },
                    {
                      term: 'Repair',
                      definition: 'The process of fixing or restoring a faulty, broken, or damaged asset to its functional state.',
                    },
                    {
                      term: 'Disposal',
                      definition: 'Authorized removal of an asset from use once it is obsolete, beyond repair, or no longer required.',
                    },
                    {
                      term: 'Device',
                      definition: 'Portable or fixed electronic equipment used for work, such as laptops, monitors, webcams, or headsets.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Roles and Responsibilities Section */}
              <GuidelineSection id="roles-responsibilities" title="Roles and Responsibilities">
                <p className="mb-4">
                  All associates share responsibility for ensuring company assets are used, maintained, and handled properly. In addition to these general duties, Admin, IT, and Finance have specific roles in coordinating maintenance, facilitating repairs, approving budgets, and managing disposals.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">5.1 Associates</h3>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>Use assets responsibly and only for work purposes.</li>
                  <li>Avoid misuse (e.g., dragging chairs between floors, tampering with wiring, overloading extension cables)</li>
                  <li>Promptly report any faults, damages, or unsafe conditions through the designated channel</li>
                  <li>Do not attempt self-repair</li>
                  <li>Assets must not be carried out of the office without authorization</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.2 Admin</h3>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>Serve as the central point for asset issue reporting, maintenance coordination, repair facilitation, and disposal processing</li>
                  <li>Log reported issues in the asset tracker for visibility and follow-up</li>
                  <li>Coordinate with IT and Finance where applicable</li>
                  <li>Initiate the maintenance or repair process based on the nature of the asset</li>
                  <li>Manage disposal approvals, ensure proper documentation, and record the item as disposed with a valid reason</li>
                  <li>Provide feedback to the reporting associate once the issue is resolved</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.3 IT</h3>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>Support Admin with assessment and troubleshooting of digital devices (laptops, TVs, webcams)</li>
                  <li>Identify obsolete or unsupported devices and recommend disposal</li>
                  <li>Ensure secure data wiping before disposal of electronic assets</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">5.4 Finance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Approve budget-related aspects of repairs or replacements</li>
                  <li>Make the necessary deductions in incidences of negligence where asset damage is proven</li>
                </ul>
              </GuidelineSection>

              {/* Reporting and Escalation Flow Section */}
              <GuidelineSection id="reporting-escalation" title="Reporting and Escalation Flow">
                <p className="mb-6">
                  All asset-related issues should follow a structured reporting flow to ensure accountability and timely resolution. Admin serves as the first point of contact, coordinating with IT and Finance where necessary to resolve, replace, or dispose of affected assets.
                </p>
                <SummaryTable
                  title="Reporting and Escalation Flow"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Report',
                      action: 'The associate reports the issue to Admin — the first point of contact for all asset-related matters.',
                    },
                    {
                      step: 'Log & Coordinate',
                      action: 'Admin logs the issue in the tracker and coordinates with relevant teams (IT, Finance) for assessment and action.',
                    },
                    {
                      step: 'Act',
                      action: 'Admin arranges for the repair, maintenance, or replacement. For disposals, Admin initiates and facilitates approval and recording.',
                    },
                    {
                      step: 'Feedback',
                      action: 'Admin updates the asset tracker and provides feedback to the associate on the resolution status.',
                    },
                  ]}
                  onViewFull={() => setReportingFlowModalOpen(true)}
                />
                <FullTableModal
                  isOpen={reportingFlowModalOpen}
                  onClose={() => setReportingFlowModalOpen(false)}
                  title="Reporting and Escalation Flow"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Report',
                      action: 'The associate reports the issue to Admin — the first point of contact for all asset-related matters.',
                    },
                    {
                      step: 'Log & Coordinate',
                      action: 'Admin logs the issue in the tracker and coordinates with relevant teams (IT, Finance) for assessment and action.',
                    },
                    {
                      step: 'Act',
                      action: 'Admin arranges for the repair, maintenance, or replacement. For disposals, Admin initiates and facilitates approval and recording.',
                    },
                    {
                      step: 'Feedback',
                      action: 'Admin updates the asset tracker and provides feedback to the associate on the resolution status.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Maintenance, Repair and Disposal Process Section */}
              <GuidelineSection id="maintenance-repair-disposal" title="Maintenance, Repair and Disposal Process">
                <p className="mb-6">
                  Outlines the process for maintaining asset functionality, resolving faults promptly, and managing disposals responsibly.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">7.1 Maintenance</h3>
                <SummaryTable
                  title="Maintenance Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Keep assets in functional and safe condition through routine care.',
                    },
                    {
                      step: 'Scheduled Checks',
                      action: 'Admin may coordinate inspections (e.g., quarterly checks).',
                    },
                    {
                      step: 'Preventive Care',
                      action: 'Associates must report early signs of wear or malfunction.',
                    },
                    {
                      step: 'Documentation',
                      action: 'All maintenance actions must be logged in the asset tracker.',
                    },
                  ]}
                  onViewFull={() => setMaintenanceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={maintenanceModalOpen}
                  onClose={() => setMaintenanceModalOpen(false)}
                  title="Maintenance Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Keep assets in functional and safe condition through routine care.',
                    },
                    {
                      step: 'Scheduled Checks',
                      action: 'Admin may coordinate inspections (e.g., quarterly checks).',
                    },
                    {
                      step: 'Preventive Care',
                      action: 'Associates must report early signs of wear or malfunction.',
                    },
                    {
                      step: 'Documentation',
                      action: 'All maintenance actions must be logged in the asset tracker.',
                    },
                  ]}
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7.2 Repair</h3>
                <SummaryTable
                  title="Repair Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Restore functionality for assets that are faulty or damaged.',
                    },
                    {
                      step: 'Report',
                      action: 'Associate reports the issue to Admin.',
                    },
                    {
                      step: 'Assessment',
                      action: 'Admin and relevant team assess whether repair is viable.',
                    },
                    {
                      step: 'Action',
                      action: 'Repair to be arranged with the relevant support — internal IT team for technical issues, or external service providers for electronic appliances',
                    },
                    {
                      step: 'Follow-Up',
                      action: 'Tracker updated, asset tested, and associate informed.',
                    },
                  ]}
                  onViewFull={() => setRepairModalOpen(true)}
                />
                <FullTableModal
                  isOpen={repairModalOpen}
                  onClose={() => setRepairModalOpen(false)}
                  title="Repair Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Restore functionality for assets that are faulty or damaged.',
                    },
                    {
                      step: 'Report',
                      action: 'Associate reports the issue to Admin.',
                    },
                    {
                      step: 'Assessment',
                      action: 'Admin and relevant team assess whether repair is viable.',
                    },
                    {
                      step: 'Action',
                      action: 'Repair to be arranged with the relevant support — internal IT team for technical issues, or external service providers for electronic appliances',
                    },
                    {
                      step: 'Follow-Up',
                      action: 'Tracker updated, asset tested, and associate informed.',
                    },
                  ]}
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7.3 Disposal</h3>
                <SummaryTable
                  title="Disposal Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Properly remove unserviceable, obsolete, or unnecessary assets from circulation.',
                    },
                    {
                      step: 'Initiation',
                      action: 'Admin or IT identifies the asset as unserviceable.',
                    },
                    {
                      step: 'Approval',
                      action: 'CoE approves disposal based on condition, usage history, or obsolescence.',
                    },
                    {
                      step: 'Disposal Action',
                      action: '**Electronics**: Engage licensed e-waste recyclers or certified vendors to purchase or safely dispose of used electronic equipment.\n\n**Furniture**: Coordinate with approved resellers, recyclers, or donation partners for responsible reuse or disposal.\n\n**General Office Equipment**: Dispose of through approved service providers in compliance with organizational and environmental standards.',
                    },
                    {
                      step: 'Recordkeeping',
                      action: 'Admin records the asset as disposed in the tracker with a valid reason.',
                    },
                  ]}
                  onViewFull={() => setDisposalModalOpen(true)}
                />
                <FullTableModal
                  isOpen={disposalModalOpen}
                  onClose={() => setDisposalModalOpen(false)}
                  title="Disposal Process"
                  columns={[
                    { header: 'Step', accessor: 'step' },
                    { header: 'Action to Take', accessor: 'action' },
                  ]}
                  data={[
                    {
                      step: 'Goal',
                      action: 'Properly remove unserviceable, obsolete, or unnecessary assets from circulation.',
                    },
                    {
                      step: 'Initiation',
                      action: 'Admin or IT identifies the asset as unserviceable.',
                    },
                    {
                      step: 'Approval',
                      action: 'CoE approves disposal based on condition, usage history, or obsolescence.',
                    },
                    {
                      step: 'Disposal Action',
                      action: '**Electronics**: Engage licensed e-waste recyclers or certified vendors to purchase or safely dispose of used electronic equipment.\n\n**Furniture**: Coordinate with approved resellers, recyclers, or donation partners for responsible reuse or disposal.\n\n**General Office Equipment**: Dispose of through approved service providers in compliance with organizational and environmental standards.',
                    },
                    {
                      step: 'Recordkeeping',
                      action: 'Admin records the asset as disposed in the tracker with a valid reason.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Tools and Resources Section */}
              <GuidelineSection id="tools-resources" title="Tools and Resources">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Asset Inventory Tracker</strong> → Maintains a clear record of assets for accountability and management</li>
                  <li><strong>MS Teams</strong> → Primary channel for reporting and communication</li>
                </ul>
              </GuidelineSection>

              {/* KPIs Section */}
              <GuidelineSection id="kpis" title="Key Performance Indicators (KPIs)">
                <p className="mb-4">
                  Performance indicators track asset management efficiency and guide ongoing improvement.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Asset Logging Accuracy Rate</strong>: Percentage of assets correctly recorded in the tracker.</li>
                  <li><strong>Repair Turnaround Time</strong>: Average days taken to complete repairs or replacements.</li>
                  <li><strong>Disposal Record Compliance Rate</strong>: Percentage of disposals properly documented with approval and reason.</li>
                  <li><strong>Asset Misuse Reduction Rate</strong>: Year-on-year decrease in asset misuse or negligence incidents.</li>
                </ul>
              </GuidelineSection>

              {/* Review Schedule Section */}
              <GuidelineSection id="review-schedule" title="Review and Update Schedule">
                <p className="mb-4">
                  These guidelines will be reviewed regularly to remain current and aligned with operational needs.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quarterly Review</strong>: Guidelines reviewed every quarter by Admin in consultation with the relevant stakeholders.</li>
                  <li><strong>Ad-Hoc Updates</strong>: Adjustments made as needed based on feedback, compliance requirements, or organizational changes</li>
                </ul>
              </GuidelineSection>

              {/* Compliance Section */}
              <GuidelineSection id="compliance" title="Compliance">
                <p className="mb-6">
                  Following these guidelines promotes accountability, protects company property, and ensures fair enforcement in cases of non-compliance.
                </p>
                <SummaryTable
                  title="Compliance Principles"
                  columns={[
                    { header: 'Compliance Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      principle: 'Resource Protection',
                      description: 'Ensure responsible use of assets to protect company property and reduce costs.',
                    },
                    {
                      principle: 'Operational Compliance',
                      description: 'Following reporting, repair, and disposal processes is mandatory for all associates.',
                    },
                    {
                      principle: 'Transparency',
                      description: 'All actions must be logged in the tracker for accountability.',
                    },
                  ]}
                  onViewFull={() => setComplianceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={complianceModalOpen}
                  onClose={() => setComplianceModalOpen(false)}
                  title="Compliance Principles"
                  columns={[
                    { header: 'Compliance Principle', accessor: 'principle' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      principle: 'Resource Protection',
                      description: 'Ensure responsible use of assets to protect company property and reduce costs.',
                    },
                    {
                      principle: 'Operational Compliance',
                      description: 'Following reporting, repair, and disposal processes is mandatory for all associates.',
                    },
                    {
                      principle: 'Transparency',
                      description: 'All actions must be logged in the tracker for accountability.',
                    },
                  ]}
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">11.1 Non-Compliance</h3>
                <p className="mb-4">
                  Failure to comply with these guidelines may result in:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Corrective Measures</strong>: Formal warnings for repeated or serious cases.</li>
                  <li><strong>Financial Liability</strong>: Associates will be held financially responsible for negligence-related damage or loss.</li>
                  <li><strong>Reinforcement</strong>: Re-informing sessions may be conducted to strengthen awareness and adherence to guidelines.</li>
                </ul>
              </GuidelineSection>

              {/* Continuous Improvement Section */}
              <GuidelineSection id="continuous-improvement" title="Continuous Improvement and Feedback Loop">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Objective</strong>: Ensure asset management guidelines remain effective and up to date.</li>
                  <li><strong>Evaluation</strong>: Admin will periodically review guidelines and processes.</li>
                  <li><strong>Feedback</strong>: Associates can provide suggestions for improvement.</li>
                  <li><strong>Updates</strong>: Improvements will be communicated and incorporated promptly.</li>
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


