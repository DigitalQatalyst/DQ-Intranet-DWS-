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
  const [guideTitle, setGuideTitle] = useState<string>('DQ AVR Awards Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('December 19, 2025')
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at')
          .eq('slug', 'dq-avr-awards-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ AVR Awards Guidelines')
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
  const [awardCategoriesModalOpen, setAwardCategoriesModalOpen] = useState(false)
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false)
  const [evaluationCriteriaModalOpen, setEvaluationCriteriaModalOpen] = useState(false)

  // Award Categories data
  const awardCategoriesData = [
    {
      category: 'Value Co-Creation',
      description: 'This award honors associates who with empathy, remain open and teachable, and collaborate seamlessly across teams. They take responsibility for their actions and build trust through honesty, clarity, and consistency.',
    },
    {
      category: 'Lean Working',
      description: 'This award recognizes associates who demonstrate purposeful, perceptive, and proactive approaches to their work. They persevere through challenges with focus and bring precision to the details that drive high performance.',
    },
    {
      category: 'Self-Development',
      description: 'This award celebrates associates who embody emotional intelligence and a growth mindset. They remain calm and accountable under pressure while embracing feedback, learning from failures, and evolving quickly.',
    },
    {
      category: 'ADP: Most Improved Associate',
      description: 'For associates in the Associate Development & Performance (ADP) program who have shown the greatest progress and improvement.',
    },
    {
      category: 'Technical Impact',
      description: 'For associates who have proposed or implemented technical solutions that drive strategic impact, whether by reducing time, improving efficiency, or introducing innovative approaches that elevate how DQ works and strengthens our long-term capabilities.',
    },
    {
      category: 'The Qatalyst',
      description: 'This award recognizes the "Most Well-Rounded" associate who consistently demonstrates DQ\'s core values in their work and collaboration.',
    },
  ]

  // Eligibility data
  const eligibilityData = [
    {
      requirement: 'Active Employment',
      description: 'Associates must be active employees at DQ during the award cycle.',
    },
    {
      requirement: 'Consistent Performance',
      description: 'Associates with consistent performance and contribution across the quarter are eligible.',
    },
    {
      requirement: 'No Disciplinary Action',
      description: 'Associates under probation or disciplinary action may not be considered.',
    },
    {
      requirement: 'ADP Program Enrollment',
      description: 'For the ADP award, only associates enrolled in the ADP program are eligible.',
    },
  ]

  // Evaluation Criteria data
  const evaluationCriteriaData = [
    {
      criterion: 'Values Alignment',
      description: 'Demonstrating DQ\'s principles in daily work.',
    },
    {
      criterion: 'Impact',
      description: 'Measurable contribution to projects, products, or team outcomes.',
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
              <GuidelineSection id="context" title="Context">
                <p>
                  Every quarter, DQ (Digital Qatalyst) holds a QBR (Quarterly Business Review), a strategic forum where associates and team leads reflect on progress against quarterly objectives, assess performance, and align on priorities moving forward. The QBR serves as a key mechanism to ensure that teams remain on track with DQ's broader strategy and long-term vision. As part of this session, the AVR Awards (Associates Value and Recognition Awards) are presented to recognize and celebrate associates whose contributions exemplify DQ's values and drive its strategy forward.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p>
                  The AVR Awards are established to recognize and celebrate associates who demonstrate outstanding performance, innovation, and alignment with DQ's values. These awards aim to create a culture of appreciation, motivate associates across all offices, and ensure fairness and transparency in how excellence is acknowledged.
                </p>
              </GuidelineSection>

              {/* Scope Section */}
              <GuidelineSection id="scope" title="Scope">
                <p>
                  These guidelines apply to all associates across DQ Studios. They cover the entire awards process, including categories, eligibility, voting, and announcement of winners.
                </p>
              </GuidelineSection>

              {/* Award Categories Section */}
              <GuidelineSection id="award-categories" title="Award Categories">
                <p className="mb-6">
                  The following award categories recognize excellence across different dimensions of performance and contribution:
                </p>
                <SummaryTable
                  title="Award Categories"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={awardCategoriesData}
                  onViewFull={() => setAwardCategoriesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={awardCategoriesModalOpen}
                  onClose={() => setAwardCategoriesModalOpen(false)}
                  title="Award Categories"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={awardCategoriesData}
                />
              </GuidelineSection>

              {/* Eligibility Section */}
              <GuidelineSection id="eligibility" title="Eligibility">
                <p className="mb-6">
                  To be eligible for AVR Awards, associates must meet the following requirements:
                </p>
                <SummaryTable
                  title="Eligibility Requirements"
                  columns={[
                    { header: 'Requirement', accessor: 'requirement' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={eligibilityData}
                  onViewFull={() => setEligibilityModalOpen(true)}
                />
                <FullTableModal
                  isOpen={eligibilityModalOpen}
                  onClose={() => setEligibilityModalOpen(false)}
                  title="Eligibility Requirements"
                  columns={[
                    { header: 'Requirement', accessor: 'requirement' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={eligibilityData}
                />
              </GuidelineSection>

              {/* Choosing Nominees & Winners Section */}
              <GuidelineSection id="choosing-nominees" title="Choosing Nominees & Winners">
                <p className="mb-4">
                  Nominees are chosen based on their performance in the ATP (Associate Timesheet Performance).
                </p>
                <p>
                  A committee will gather to analyze everyone's performance during the quarter and determine which award they deserve to win.
                </p>
              </GuidelineSection>

              {/* Evaluation Criteria Section */}
              <GuidelineSection id="evaluation-criteria" title="Evaluation Criteria">
                <p className="mb-6">
                  The following criteria are used to evaluate nominees for AVR Awards:
                </p>
                <SummaryTable
                  title="Evaluation Criteria"
                  columns={[
                    { header: 'Criterion', accessor: 'criterion' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={evaluationCriteriaData}
                  onViewFull={() => setEvaluationCriteriaModalOpen(true)}
                />
                <FullTableModal
                  isOpen={evaluationCriteriaModalOpen}
                  onClose={() => setEvaluationCriteriaModalOpen(false)}
                  title="Evaluation Criteria"
                  columns={[
                    { header: 'Criterion', accessor: 'criterion' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={evaluationCriteriaData}
                />
              </GuidelineSection>

              {/* Communication Plan Section */}
              <GuidelineSection id="communication-plan" title="Communication Plan">
                <p>
                  Nominees & Winners will be announced in the QBR (Quarterly Business Review).
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


