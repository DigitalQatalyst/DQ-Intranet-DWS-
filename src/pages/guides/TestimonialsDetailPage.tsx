import React, { useState } from "react"
import { Link } from "react-router-dom"
import { HomeIcon, ChevronRightIcon } from "lucide-react"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"

// Hardcoded featured testimonials to match the exact design
const featuredTestimonialsData = [
  {
    id: "khalifa-fund",
    name: "Ali Al Jasmi",
    organization: "Head of Technology • Khalifa Fund",
    quote: "DQ designed and implemented a multi-sided marketplace concept that revitalises SME growth and links vision to delivery through one integrated strategy."
  },
  {
    id: "adib",
    name: "Kamran Sheikh",
    organization: "Head of Enterprise Architecture & Analytics • ADIB",
    quote: "DQ re-centered the ADIB EA function within technology decision making, bringing pragmatic, EA-driven transformation approaches."
  },
  {
    id: "dfsa",
    name: "Waleed Saeed Al Awadhi",
    organization: "Chief Operating Officer • DFSA",
    quote: "DQ established a practical transformation design and delivered it through agile implementation, laying the foundation for intuitive, data-driven services."
  }
]

const TestimonialsDetailPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const disclaimer = '(not approved for external publication)'

  // Hero image for testimonials - office collaboration scene
  const heroImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/guides?tab=testimonials" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Testimonials
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Client Feedback</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Hero Image */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <img 
            src={heroImage} 
            alt="Client Feedback" 
            className="w-full h-64 md:h-80 object-cover"
            loading="lazy"
          />
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Client Feedback</h1>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => setActiveFilter("uae")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "uae"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              UAE
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600">
            Highlights from DFSA, ADIB, and Khalifa Fund showcasing how Digital Qatalyst engagements accelerate transformation outcomes.
          </p>
        </div>

        {/* Featured Clients Section */}
        <div className="mb-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">FEATURED CLIENTS</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why organizations choose DQ</h2>
            <p className="text-gray-600">
              Stories from DFSA, ADIB, and Khalifa Fund demonstrate how DQ engagements translate into measurable outcomes.
            </p>
          </div>

          {/* Featured Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTestimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                      <path d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 text-center">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{testimonial.organization}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{testimonial.quote}"
                  <span className="block text-xs text-gray-500 italic mt-2">{disclaimer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  )
}

export default TestimonialsDetailPage
