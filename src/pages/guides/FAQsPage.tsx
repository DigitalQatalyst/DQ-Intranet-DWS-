import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { HomeIcon, ChevronRightIcon, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../components/Header/context/AuthContext'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const FAQS_DATA: FAQ[] = [
  {
    id: 'what-is-digital-transformation',
    question: 'What Is Digital Transformation?',
    answer: 'Digital transformation refers to organizational change efforts that aim to improve an organization\'s technology and tools, enhance employees\' digital skills, adopt new, modern business models, and inculcate new cultural ideas, among other things. The technical definition may differ slightly depending on who you ask, but most definitions revolve around these core concepts.',
    category: 'General'
  },
  {
    id: 'why-does-digital-transformation-matter',
    question: 'Why Does Digital Transformation Matter?',
    answer: 'Today, the entire economy is digital. Businesses are regularly engaged in digital adoption, transformation, and change efforts, leading to a global digitization of the economy. Digital transformation helps businesses stay competitive in this environment. Companies that transform effectively will survive, thrive, and succeed, while those that are too slow to adapt will lose their edge in the marketplace.',
    category: 'General'
  },
  {
    id: 'which-industries-are-undergoing-transformation',
    question: 'Which Industries Are Undergoing Digital Transformation?',
    answer: 'Digital transformation is affecting every industry, from retail to marketing to healthcare. The impact varies depending on how reliant an industry is on technology, the type of technology used, and the general advancements in that technology for the specific industry. Regardless of the scale, every company is undergoing some degree of transformation.',
    category: 'General'
  },
  {
    id: 'when-should-company-transform',
    question: 'When Should a Company Transform?',
    answer: 'The timing of transformation depends on factors such as the industry, budget constraints, and a company\'s long-term strategy. However, as a general rule, the sooner a company begins its transformation, the better. Companies should aim to stay ahead of the curve rather than try to catch up.',
    category: 'General'
  },
  {
    id: 'what-do-transformation-processes-look-like',
    question: 'What Do Digital Transformation Processes Look Like?',
    answer: 'A digital transformation project involves steps such as adopting new technology, tools, software, and platforms, modernizing IT infrastructure, implementing digital-first business strategies, and refocusing on customer experience. These efforts prioritize customers and technology, contrasting with traditional business models that follow more rigid approaches.',
    category: 'Process'
  },
  {
    id: 'benefits-of-digital-transformation',
    question: 'What are the Benefits of Digital Transformation?',
    answer: 'The benefits of digital transformation include gaining a competitive advantage, improving technology capabilities, creating more cost-effective and streamlined business models, and fostering innovative, adaptable corporate cultures. The sooner a company adopts digital technology and transforms, the greater the rewards it will reap.',
    category: 'General'
  },
  {
    id: 'drawbacks-of-digital-transformation',
    question: 'What are the Drawbacks of Digital Transformation?',
    answer: 'Digital transformation can have drawbacks such as requiring significant planning and effort, encountering resistance from employees and managers, facing unpredictable outcomes, and demanding large investments. Despite these challenges, digital transformation is seen as necessary in today\'s economy, and with the right planning, the benefits often outweigh the costs.',
    category: 'General'
  },
  {
    id: 'is-digital-transformation-a-must',
    question: 'Is Digital Transformation a Must?',
    answer: 'Not necessarily. A local brick-and-mortar business may be less impacted by technology than others. However, businesses that implement software, technology, or machinery will be affected by technology trends and should consider the impact of not transforming. Planning accordingly is essential for those businesses.',
    category: 'General'
  },
  {
    id: 'what-is-dt2-0',
    question: 'What is Digital Transformation 2.0 (DT2.0)?',
    answer: 'DT2.0 is an advanced phase of digital transformation that deeply integrates digital technologies into all aspects of an organization. It involves a comprehensive overhaul of processes, business models, and organizational culture, leveraging technologies like AI, cloud computing, and IoT to optimize operations and enhance decision-making.',
    category: 'DT2.0'
  },
  {
    id: 'key-components-dt2-0-framework',
    question: 'What are the key components of the DT2.0 framework?',
    answer: 'The DT2.0 framework includes various components such as the Digital Business Platform (DBP), Digital Transformation Management Platform (DTMP), and Digital Transformation Management Framework (DTMF). It also encompasses methodologies for Envisioning, Targeting, Baseline setting, and road mapping, along with transformation services like TMaaS Design and TMaaS Deploy.',
    category: 'DT2.0'
  },
  {
    id: 'what-is-dbp',
    question: 'What is a Digital Business Platform (DBP)?',
    answer: 'A DBP is the end product of digital transformations, comprising an integrated set of digital tools and technologies that support an organization\'s core operations, data management, and service delivery. It is central to enabling organizations to operate efficiently and deliver value in a digital-first world.',
    category: 'DT2.0'
  },
  {
    id: 'how-does-dtmp-support',
    question: 'How does the Digital Transformation Management Platform (DTMP) support organizations?',
    answer: 'DTMP integrates tools, processes, and analytics to support the management and execution of digital transformation initiatives. It provides a unified platform for planning, executing, and monitoring digital transformation projects, ensuring alignment with strategic goals and facilitating decision-making.',
    category: 'DT2.0'
  },
  {
    id: 'purpose-of-dtmf',
    question: 'What is the purpose of the Digital Transformation Management Framework (DTMF)?',
    answer: 'DTMF provides a structured approach to managing digital transformation initiatives. It includes best practices, methodologies, and tools to guide organizations through the transformation process, from initial visioning to implementation and optimization.',
    category: 'DT2.0'
  },
  {
    id: 'who-is-digital-workforce',
    question: 'Who is the Digital Workforce?',
    answer: 'The Digital Workforce refers to employees within an organization who utilize digital tools and technologies to perform their roles. This workforce is characterized by its flexibility, ability to work remotely, and enhanced productivity through the use of digital means.',
    category: 'General'
  },
  {
    id: 'role-of-ai-in-dt2-0',
    question: 'What role does AI play in DT2.0?',
    answer: 'AI is a critical component of DT2.0, enabling organizations to leverage data-driven insights, automate processes, and enhance decision-making. It supports various applications, from cognitive computing to predictive analytics, helping organizations optimize operations and improve customer experiences.',
    category: 'DT2.0'
  },
  {
    id: 'tmaas-design-vs-deploy',
    question: 'How do TMaaS Design and TMaaS Deploy differ?',
    answer: 'TMaaS Design focuses on the strategic design of digital transformation solutions, including planning and blueprinting. TMaaS Deploy, on the other hand, involves the implementation and execution of these solutions, ensuring they are effectively integrated into the organization\'s operations.',
    category: 'DT2.0'
  },
  {
    id: 'what-is-tmo',
    question: 'What is the Transformation Management Office (TMO)?',
    answer: 'The TMO is a specialized unit within an organization responsible for overseeing and coordinating digital transformation efforts. It ensures that transformation initiatives align with strategic objectives and are successfully implemented across the organization.',
    category: 'DT2.0'
  },
  {
    id: 'what-is-digital-customer',
    question: 'What is the Digital Customer?',
    answer: 'The Digital Customer refers to individuals or entities that interact with an organization\'s products or services through digital channels. These customers often prefer online interactions and expect seamless, personalized experiences.',
    category: 'General'
  },
  {
    id: 'resources-for-learning-dt2-0',
    question: 'What resources are available for learning about DT2.0?',
    answer: 'Digital Qatalyst offers various resources, including the Digital Transformation Management Academy (DTMA), Digital Transformation Management Books (DTMB), and Digital Transformation Management Podcast (DTMC). These resources provide in-depth knowledge and practical insights into digital transformation strategies and tools.',
    category: 'Resources'
  },
  {
    id: 'how-to-start-dt2-0-journey',
    question: 'How can an organization start its DT2.0 journey?',
    answer: 'Organizations can begin their DT2.0 journey by conducting an assessment of their current digital maturity, setting clear strategic objectives, and developing a comprehensive roadmap. Engaging with experts, utilizing frameworks like DTMF, and leveraging platforms like DTMP can also support successful transformation efforts.',
    category: 'Process'
  }
]

const FAQsPage: React.FC = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set())

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter FAQs based on search query and category
  const filteredFAQs = FAQS_DATA.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === null || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get all available categories
  const categories = Array.from(new Set(FAQS_DATA.map(faq => faq.category))).sort()

  // Group FAQs by category
  const faqsByCategory = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <div className="min-h-screen flex flex-col bg-white guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
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
                <Link to="/marketplace/guides?tab=resources" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">FAQs</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Title - Centered */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The DQ FAQs
          </h1>
          <p className="text-base text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Frequently asked questions about DQ processes, tools, workflows, and best practices with detailed answers and guidance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)]"
            />
          </div>
        </div>

        {/* Category Navigation - Theme colors */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedCategory === null
                ? 'bg-[var(--guidelines-primary-surface)] border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                selectedCategory === category
                  ? 'bg-[var(--guidelines-primary-surface)] border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs Content - Card sections */}
        <div className="bg-white">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => {
                const isOpen = openFAQs.has(faq.id)
                return (
                  <div 
                    key={faq.id} 
                    className="bg-slate-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                  >
                    {/* Question - Clickable header */}
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left p-6 flex items-start justify-between hover:bg-slate-100 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-lg font-bold text-[var(--guidelines-primary)] pr-4 flex-1">
                        {faq.question}
                      </h3>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[var(--guidelines-primary)] flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      )}
                    </button>
                    {/* Answer - Expandable content */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-base text-gray-800 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default FAQsPage
