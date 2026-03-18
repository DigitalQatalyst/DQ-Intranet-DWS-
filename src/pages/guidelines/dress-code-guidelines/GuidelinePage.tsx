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
  const [guideTitle, setGuideTitle] = useState<string>('DQ Dress Code Guideline')
  const [lastUpdated, setLastUpdated] = useState<string>('September 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-dress-code-guideline')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Dress Code Guideline')
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
  const [keyCharacteristicsModalOpen, setKeyCharacteristicsModalOpen] = useState(false)
  const [dressCodeDetailsModalOpen, setDressCodeDetailsModalOpen] = useState(false)
  const [preparationModalOpen, setPreparationModalOpen] = useState(false)
  const [guidelinesDuringWorkdaysModalOpen, setGuidelinesDuringWorkdaysModalOpen] = useState(false)
  const [postImplementationModalOpen, setPostImplementationModalOpen] = useState(false)

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
      <HeroSection title={guideTitle} date={lastUpdated} author="Version 1.0 • DQ Operations • Digital Qatalyst" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Context Section */}
              <GuidelineSection id="context" title="Context">
                <p>
                  At DigitalQatalyst (DQ), we believe that professional appearance contributes to the positive representation of our brand, boosts individual confidence, and fosters an environment where associates feel comfortable and productive. This dress code guideline outlines expectations for associates' attire to maintain a balance between professionalism and comfort.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p>
                  The purpose of these dress code guidelines is to ensure that associates align with DQ's culture of professionalism while allowing flexibility for creativity and comfort. These guidelines balance formal business attire with more relaxed options for Fridays to accommodate the diverse nature of DQ's work environment.
                </p>
              </GuidelineSection>

              {/* Key Characteristics Section */}
              <GuidelineSection id="key-characteristics" title="Key Characteristics">
                <p className="mb-6">
                  The following key characteristics define our dress code at DQ:
                </p>
                <SummaryTable
                  title="Key Characteristics"
                  columns={[
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      item: 'Professional Appearance',
                      description: 'All associates are expected to dress in a professional, decent, and clean way. Clothing should enhance the professional image of DQ.',
                    },
                    {
                      item: 'Cultural Sensitivity',
                      description: 'Associates should be mindful of cultural and religious sensitivities when choosing their attire.',
                    },
                    {
                      item: 'Personal Grooming',
                      description: 'Hair, nails, and personal hygiene should be maintained to a high standard. Fragrances, jewelry, and accessories should not distract from the professional setting.',
                    },
                  ]}
                  onViewFull={() => setKeyCharacteristicsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={keyCharacteristicsModalOpen}
                  onClose={() => setKeyCharacteristicsModalOpen(false)}
                  title="Key Characteristics"
                  columns={[
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      item: 'Professional Appearance',
                      description: 'All associates are expected to dress in a professional, decent, and clean way. Clothing should enhance the professional image of DQ.',
                    },
                    {
                      item: 'Cultural Sensitivity',
                      description: 'Associates should be mindful of cultural and religious sensitivities when choosing their attire.',
                    },
                    {
                      item: 'Personal Grooming',
                      description: 'Hair, nails, and personal hygiene should be maintained to a high standard. Fragrances, jewelry, and accessories should not distract from the professional setting.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Dress Code Details Section */}
              <GuidelineSection id="dress-code-details" title="Dress Code Details">
                <SummaryTable
                  title="Dress Code Details"
                  columns={[
                    { header: 'Day', accessor: 'day' },
                    { header: 'Dress Code', accessor: 'dressCode' },
                    { header: 'Examples', accessor: 'examples' },
                  ]}
                  data={[
                    {
                      day: 'Monday to Thursday',
                      dressCode: 'Business Casual',
                      examples: '**For men**: A well-fitted button-down shirt or polo shirt, tailored trousers, Khakis, or chinos. Closed-toe shoes, such as loafers or official shoes.\n\n**For women**: A blouse or sweater paired with tailored pants or skirt, knee-length professional skirt or dress, and closed-toe shoes (flats or heels).',
                    },
                    {
                      day: 'Friday',
                      dressCode: 'Casual',
                      examples: '**For men**: Polo shirts or casual button-down shirts, clean, well-fitted jeans, casual shoes, sneakers, or loafers.\n\n**For women**: Casual blouses or t-shirts with jeans, casual skirt or dress, and comfortable, casual shoes or sneakers. Strictly closed shoes.',
                    },
                  ]}
                  onViewFull={() => setDressCodeDetailsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={dressCodeDetailsModalOpen}
                  onClose={() => setDressCodeDetailsModalOpen(false)}
                  title="Dress Code Details"
                  columns={[
                    { header: 'Day', accessor: 'day' },
                    { header: 'Dress Code', accessor: 'dressCode' },
                    { header: 'Examples', accessor: 'examples' },
                  ]}
                  data={[
                    {
                      day: 'Monday to Thursday',
                      dressCode: 'Business Casual',
                      examples: '**For men**: A well-fitted button-down shirt or polo shirt, tailored trousers, Khakis, or chinos. Closed-toe shoes, such as loafers or official shoes.\n\n**For women**: A blouse or sweater paired with tailored pants or skirt, knee-length professional skirt or dress, and closed-toe shoes (flats or heels).',
                    },
                    {
                      day: 'Friday',
                      dressCode: 'Casual',
                      examples: '**For men**: Polo shirts or casual button-down shirts, clean, well-fitted jeans, casual shoes, sneakers, or loafers.\n\n**For women**: Casual blouses or t-shirts with jeans, casual skirt or dress, and comfortable, casual shoes or sneakers. Strictly closed shoes.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Preparation Before Implementation Section */}
              <GuidelineSection id="preparation" title="Preparation Before Implementation">
                <p className="mb-6">
                  Ensure that all associates are aware of the dress code and have access to resources for clarity, such as visual guides. The following steps should be taken before the dress code is implemented:
                </p>
                <SummaryTable
                  title="Preparation Before Implementation"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Communicate Dress Code',
                      action: 'Send a formal communication to all associates via Teams, detailing the new dress code.',
                    },
                    {
                      guideline: 'Provide Visuals',
                      action: 'Include sample images of acceptable business casual attire, showing examples for both Monday-Thursday and Casual Friday. These visuals will help associates understand the specific expectations.',
                    },
                    {
                      guideline: 'Clarify on Exceptions',
                      action: 'Outline special considerations, such as health issues.',
                    },
                  ]}
                  onViewFull={() => setPreparationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={preparationModalOpen}
                  onClose={() => setPreparationModalOpen(false)}
                  title="Preparation Before Implementation"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Communicate Dress Code',
                      action: 'Send a formal communication to all associates via Teams, detailing the new dress code.',
                    },
                    {
                      guideline: 'Provide Visuals',
                      action: 'Include sample images of acceptable business casual attire, showing examples for both Monday-Thursday and Casual Friday. These visuals will help associates understand the specific expectations.',
                    },
                    {
                      guideline: 'Clarify on Exceptions',
                      action: 'Outline special considerations, such as health issues.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Guidelines During Workdays Section */}
              <GuidelineSection id="guidelines-during-workdays" title="Guidelines During Workdays">
                <p className="mb-6">
                  To ensure consistency in applying the dress code:
                </p>
                <SummaryTable
                  title="Guidelines During Workdays"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Observe Dress Code Daily',
                      action: 'Associates are required to adhere to the dress code from Monday to Thursday, with a more relaxed dress-down policy on Fridays.\n\nTeam leads are responsible for overseeing compliance within their respective departments and ensuring that every associate follows the dress code guidelines.\n\nThe Human Resources and Administration (HRA) department will have the overall responsibility for monitoring and enforcing these guidelines.\n\n**Failure to comply with the dress code will result in the following consequences:**\n\n- **Verbal Warning**: A verbal warning will be issued to the associates via DM.\n- **Written Warning**: A formal written warning will be placed on the associate\'s HR channel.\n- **Third warning**: Further disciplinary action may be taken, including suspension or other actions as deemed appropriate.\n\nIt is essential that all team leaders proactively follow up with their teams to ensure full adherence to the dress code and address any non-compliance promptly.',
                    },
                    {
                      guideline: 'Be Mindful of Cultural Context',
                      action: 'Encourage associates to choose clothing that is both professional and considerate of cultural norms.',
                    },
                  ]}
                  onViewFull={() => setGuidelinesDuringWorkdaysModalOpen(true)}
                />
                <FullTableModal
                  isOpen={guidelinesDuringWorkdaysModalOpen}
                  onClose={() => setGuidelinesDuringWorkdaysModalOpen(false)}
                  title="Guidelines During Workdays"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Observe Dress Code Daily',
                      action: 'Associates are required to adhere to the dress code from Monday to Thursday, with a more relaxed dress-down policy on Fridays.\n\nTeam leads are responsible for overseeing compliance within their respective departments and ensuring that every associate follows the dress code guidelines.\n\nThe Human Resources and Administration (HRA) department will have the overall responsibility for monitoring and enforcing these guidelines.\n\n**Failure to comply with the dress code will result in the following consequences:**\n\n- **Verbal Warning**: A verbal warning will be issued to the associates via DM.\n- **Written Warning**: A formal written warning will be placed on the associate\'s HR channel.\n- **Third warning**: Further disciplinary action may be taken, including suspension or other actions as deemed appropriate.\n\nIt is essential that all team leaders proactively follow up with their teams to ensure full adherence to the dress code and address any non-compliance promptly.',
                    },
                    {
                      guideline: 'Be Mindful of Cultural Context',
                      action: 'Encourage associates to choose clothing that is both professional and considerate of cultural norms.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Special Considerations Section */}
              <GuidelineSection id="special-considerations" title="Special Considerations">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Client-Facing Meetings</strong>: For client-facing meetings, associates should wear more formal attire, which will be communicated in advance.</li>
                  <li><strong>Company Events or Presentations</strong>: Formal business attire is required for company events or presentations.</li>
                  <li><strong>Extreme Weather</strong>: During extreme weather, associates may adjust their attire for comfort while adhering to the general guidelines.</li>
                  <li><strong>Medical Exceptions</strong>: Exceptions are accepted for medical reasons, which should be discussed confidentially with HR, who will work with you to ensure compliance while respecting your health needs.</li>
                </ul>
              </GuidelineSection>

              {/* Prohibited Attire Section */}
              <GuidelineSection id="prohibited-attire" title="Prohibited Attire">
                <p className="mb-4">
                  Inappropriate Attire: Ripped jeans, graphic t-shirts, beachwear, sweatpants, flip flops, sandals, gym wear and shorts are STRICTLY prohibited during working days.
                </p>
              </GuidelineSection>

              {/* Post-Implementation Review Section */}
              <GuidelineSection id="post-implementation" title="Post-Implementation Review">
                <p className="mb-6">
                  After the dress code has been implemented, ensure that feedback is collected for continuous improvement.
                </p>
                <SummaryTable
                  title="Post-Implementation Review"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Monitor Compliance',
                      action: 'Conduct occasional reviews to ensure the dress code is being followed.',
                    },
                    {
                      guideline: 'Recognition and Rewards Program',
                      action: 'This would involve recognizing associates for their adherence to the dress code in a positive and motivating way. You could implement a weekly or monthly system where associates are nominated and rewarded for their dress code compliance.\n\n**Best Dressed Award**: Recognize associates who consistently adhere to the dress code standards. This can be done publicly in team meetings or through internal communication.\n\n**Most Improved Award**: Identify and appreciate those who have shown noticeable improvement in their adherence to the dress code.',
                    },
                    {
                      guideline: 'Adjust Guidelines as Necessary',
                      action: 'Make adjustments based on feedback, especially if certain aspects are found to be unclear or impractical.',
                    },
                  ]}
                  onViewFull={() => setPostImplementationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={postImplementationModalOpen}
                  onClose={() => setPostImplementationModalOpen(false)}
                  title="Post-Implementation Review"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Monitor Compliance',
                      action: 'Conduct occasional reviews to ensure the dress code is being followed.',
                    },
                    {
                      guideline: 'Recognition and Rewards Program',
                      action: 'This would involve recognizing associates for their adherence to the dress code in a positive and motivating way. You could implement a weekly or monthly system where associates are nominated and rewarded for their dress code compliance.\n\n**Best Dressed Award**: Recognize associates who consistently adhere to the dress code standards. This can be done publicly in team meetings or through internal communication.\n\n**Most Improved Award**: Identify and appreciate those who have shown noticeable improvement in their adherence to the dress code.',
                    },
                    {
                      guideline: 'Adjust Guidelines as Necessary',
                      action: 'Make adjustments based on feedback, especially if certain aspects are found to be unclear or impractical.',
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


