import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, CheckCircle, MapPin, Building } from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useAuth } from '../../components/Header/context/AuthContext'
import { supabaseClient } from '../../lib/supabaseClient'
import { GUIDE_CONTENT, GuideContent } from '../../constants/guideContent'

interface ServiceDetail {
  id: string
  title: string
  description: string
  category: string
  service_type: string
  delivery_mode: string
  provider: string
  location?: string
  response_time?: string
  highlights?: string[]
  request_process?: any
  faqs?: any[]
  contact_info?: any
  sla_details?: any
}

// GHC service IDs that should use GUIDE_CONTENT instead of Supabase data
const GHC_SERVICE_IDS = [
  'ghc',
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
]

// Helper function to detect if serviceId is a GHC service
const isGHCService = (serviceId: string): boolean => {
  return GHC_SERVICE_IDS.includes(serviceId)
}

// Helper function to map GHC serviceId to GUIDE_CONTENT key
const getGHCContentKey = (serviceId: string): string => {
  return serviceId
}

/* ── Extracted tab content components to reduce cognitive complexity ── */

function GHCTabContent({ ghcContent, activeTab }: { readonly ghcContent: GuideContent; readonly activeTab: string }) {
  if (activeTab === 'overview') {
    return (
      <div>
        <p className="text-gray-700 leading-relaxed mb-6">{ghcContent.shortOverview}</p>
        {ghcContent.highlights && ghcContent.highlights.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h3>
            <div className="space-y-3">
              {ghcContent.highlights.map((highlight, index) => (
                <div key={highlight.slice(0, 40) || index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (activeTab === 'understand') {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding This Competency</h3>
        <p className="text-gray-700 leading-relaxed mb-6">{ghcContent.storybookIntro}</p>
        {ghcContent.whatYouWillLearn && ghcContent.whatYouWillLearn.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">What You Will Learn</h4>
            <div className="space-y-3">
              {ghcContent.whatYouWillLearn.map((item, index) => (
                <div key={item.slice(0, 40) || index} className="flex items-start gap-3">
                  <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (activeTab === 'practice') {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Learn & Practice</h3>
        {ghcContent.courseIntro && (
          <p className="text-gray-700 leading-relaxed mb-6">{ghcContent.courseIntro}</p>
        )}
        {ghcContent.whatYouWillPractice && ghcContent.whatYouWillPractice.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">What You Will Practice</h4>
            <div className="space-y-3">
              {ghcContent.whatYouWillPractice.map((item, index) => (
                <div key={item.slice(0, 40) || index} className="flex items-start gap-3">
                  <CheckCircle className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Other Materials</h3>
      <p className="text-gray-600">Additional resources and materials for this competency will be available here soon.</p>
    </div>
  )
}

function ServiceTabContent({ service, activeTab }: { readonly service: ServiceDetail; readonly activeTab: string }) {
  if (activeTab === 'details') {
    return (
      <div>
        <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
        {service.highlights && service.highlights.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Highlights</h3>
            <div className="space-y-3">
              {service.highlights.map((highlight, index) => (
                <div key={highlight.slice(0, 40) || index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (activeTab === 'request') {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Process</h3>
        <p className="text-gray-700 mb-6">Follow these steps to request this service:</p>
        {service.request_process?.steps ? (
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {service.request_process.steps.map((step: string, index: number) => (
              <li key={step.slice(0, 40) || index}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-600">Click the "Request Service" button to submit your request. Our team will get back to you shortly.</p>
        )}
      </div>
    )
  }
  if (activeTab === 'faq') {
    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
        {service.faqs && service.faqs.length > 0 ? (
          <div className="space-y-6">
            {service.faqs.map((faq: any, index: number) => (
              <div key={faq.question?.slice(0, 40) || index}>
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No FAQs available for this service yet. Please contact the service provider for more information.</p>
        )}
      </div>
    )
  }
  // contact tab
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
          <p className="text-gray-900">{service.provider}</p>
        </div>
        {service.contact_info?.email && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <p className="text-gray-900">{service.contact_info.email}</p>
          </div>
        )}
        {service.response_time && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Response Time</p>
            <p className="text-gray-900">{service.response_time}</p>
          </div>
        )}
      </div>
      {service.sla_details && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Level Agreement</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {service.sla_details.responseTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-medium text-gray-900">{service.sla_details.responseTime}</span>
              </div>
            )}
            {service.sla_details.resolutionTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Time:</span>
                <span className="font-medium text-gray-900">{service.sla_details.resolutionTime}</span>
              </div>
            )}
            {service.sla_details.availability && (
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className="font-medium text-gray-900">{service.sla_details.availability}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [ghcContent, setGhcContent] = useState<GuideContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'request' | 'faq' | 'contact' | 'overview' | 'understand' | 'practice' | 'materials'>('details')

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return

      try {
        // Check if this is a GHC service
        if (isGHCService(serviceId)) {
          const contentKey = getGHCContentKey(serviceId)
          const content = GUIDE_CONTENT[contentKey]
          
          if (content) {
            setGhcContent(content)
            // Set default tab for GHC services
            setActiveTab('overview')
          } else {
            console.error('GHC content not found for serviceId:', serviceId)
          }
        } else {
          // For non-GHC services, fetch from Supabase as before
          const { data, error } = await (supabaseClient
            .from('services')
            .select('*') as any)
            .eq('id', serviceId)
            .single()

          if (error) throw error
          setService(data as ServiceDetail)
        }
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (!service && !ghcContent) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace/services-center')}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Services Center
            </button>
          </div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  // Determine if we're displaying a GHC service
  const isGHC = ghcContent !== null
  const displayTitle = isGHC ? ghcContent!.title : service!.title
  const displayDescription = isGHC ? ghcContent!.subtitle : service!.description

  const getCategoryBadge = () => {
    if (isGHC) {
      return 'GHC COMPETENCY'
    }
    
    const categoryMap: Record<string, string> = {
      technology: 'TECHNOLOGY SERVICE',
      business: 'BUSINESS SERVICE',
      digital_worker: 'DIGITAL WORKER SERVICE',
      prompt_library: 'PROMPT LIBRARY',
      ai_tools: 'AI TOOLS'
    }
    return categoryMap[service!.category] || 'SERVICE'
  }

  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      query: 'Query',
      support: 'Support',
      requisition: 'Requisition',
      'self-service': 'Self-Service'
    }
    return typeMap[type] || type
  }

  const getDeliveryModeLabel = (mode: string) => {
    const modeMap: Record<string, string> = {
      online: 'Online',
      inperson: 'In Person',
      hybrid: 'Hybrid'
    }
    return modeMap[mode] || mode
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />

      {/* Hero Section */}
      <div 
        className="relative w-full min-h-[200px] bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white"
        style={{
          background: 'linear-gradient(135deg, #4A1D6E 0%, #1A2B5E 100%)'
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <HomeIcon size={16} className="mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-white/60" />
                  <Link 
                    to="/marketplace/services-center" 
                    className="ml-2 text-white/80 hover:text-white text-sm"
                  >
                    Services Center
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-white/60" />
                  <span className="ml-2 text-white/90 text-sm">{displayTitle}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Service Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white/20 rounded-full">
              {getCategoryBadge()}
            </span>
          </div>

          {/* Service Title */}
          <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>

          {/* Service Description */}
          <p className="text-lg text-white/90 max-w-3xl mb-6">
            {displayDescription}
          </p>

          {/* Service Metadata Tags */}
          <div className="flex flex-wrap gap-4 text-sm">
            {!isGHC && service!.service_type && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-white/70">Type:</span>
                <span className="font-medium">{getServiceTypeLabel(service!.service_type)}</span>
              </div>
            )}
            {!isGHC && service!.delivery_mode && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-white/70">Mode:</span>
                <span className="font-medium">{getDeliveryModeLabel(service!.delivery_mode)}</span>
              </div>
            )}
            {!isGHC && service!.provider && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <Building size={16} />
                <span className="font-medium">{service!.provider}</span>
              </div>
            )}
            {!isGHC && service!.location && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <MapPin size={16} />
                <span className="font-medium">{service!.location}</span>
              </div>
            )}
            {isGHC && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-white/70">Competency:</span>
                <span className="font-medium">Golden Honeycomb</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {isGHC ? (
                      // GHC service tabs
                      <>
                        <button
                          onClick={() => setActiveTab('overview')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'overview'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Overview
                        </button>
                        <button
                          onClick={() => setActiveTab('understand')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'understand'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Understand
                        </button>
                        <button
                          onClick={() => setActiveTab('practice')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'practice'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Learn & Practice
                        </button>
                        <button
                          onClick={() => setActiveTab('materials')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'materials'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Other Materials
                        </button>
                      </>
                    ) : (
                      // Non-GHC service tabs
                      <>
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'details'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Service Details
                        </button>
                        <button
                          onClick={() => setActiveTab('request')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'request'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          How to Request
                        </button>
                        <button
                          onClick={() => setActiveTab('faq')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'faq'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          FAQ
                        </button>
                        <button
                          onClick={() => setActiveTab('contact')}
                          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'contact'
                              ? 'border-pink-600 text-pink-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Contact & SLA
                        </button>
                      </>
                    )}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {isGHC
                    ? <GHCTabContent ghcContent={ghcContent!} activeTab={activeTab} />
                    : <ServiceTabContent service={service!} activeTab={activeTab} />
                  }
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isGHC ? `${displayTitle.replace('The ', '').replace(' (Purpose)', '').replace(' (Culture)', '').replace(' (Identity)', '').replace(' (Tasks)', '').replace(' (Governance)', '').replace(' (Value Streams)', '').replace(' (Products)', '')} Summary` : 'Service Summary'}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {isGHC ? (
                      // GHC service summary
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Competency Type</p>
                        <p className="text-gray-900 font-medium">Golden Honeycomb</p>
                      </div>
                    ) : (
                      // Non-GHC service summary
                      <>
                        {service!.service_type && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Service Type</p>
                            <p className="text-gray-900 font-medium">{getServiceTypeLabel(service!.service_type)}</p>
                          </div>
                        )}
                        {service!.delivery_mode && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Delivery Mode</p>
                            <p className="text-gray-900 font-medium">{getDeliveryModeLabel(service!.delivery_mode)}</p>
                          </div>
                        )}
                        {service!.response_time && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Response Time</p>
                            <p className="text-gray-900 font-medium">{service!.response_time}</p>
                          </div>
                        )}
                        {service!.provider && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Department</p>
                            <p className="text-gray-900 font-medium">{service!.provider}</p>
                          </div>
                        )}
                        {service!.location && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Location</p>
                            <p className="text-gray-900 font-medium">{service!.location}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {isGHC ? (
                    // GHC service buttons
                    <>
                      <button
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
                        onClick={() => {
                          // Explore competency functionality to be implemented
                          alert('Explore competency functionality to be implemented')
                        }}
                      >
                        Explore Competency →
                      </button>

                      <button
                        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        onClick={() => {
                          // Save for later functionality to be implemented
                          alert('Save for later functionality to be implemented')
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save for Later
                      </button>
                    </>
                  ) : (
                    // Non-GHC service buttons
                    <>
                      <button
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
                        onClick={() => {
                          // Request service functionality to be implemented
                          alert('Request service functionality to be implemented')
                        }}
                      >
                        Request Service →
                      </button>

                      <button
                        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        onClick={() => {
                          // Save for later functionality to be implemented
                          alert('Save for later functionality to be implemented')
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save for Later
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Services Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isGHC ? 'Related Competencies' : 'Related Services'}
              </h2>
              <Link 
                to="/marketplace/services-center" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {isGHC ? 'Browse all competencies →' : 'Browse all services →'}
              </Link>
            </div>
            <div className="text-gray-600">
              {isGHC 
                ? 'Related GHC competencies will be displayed here based on the Golden Honeycomb framework.'
                : 'Related services will be displayed here based on category and department.'
              }
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}
