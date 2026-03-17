import React from "react"
import { Link } from "react-router-dom"
import { HomeIcon, ChevronRightIcon } from "lucide-react"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"

// Associate testimonials data
const associateTestimonialsData = [
  {
    id: "jerry-ashie",
    name: "Jerry Ashie",
    organization: "Accounts Manager & Scrum Master",
    quote: "At DQ, our values have pushed me to meet every challenge with curiosity instead of hesitation. I've learned to see feedback as my best tool for growth, which has made me a much more resilient and confident communicator. This environment has truly empowered me to step outside my comfort zone and take real ownership of my journey."
  },
  {
    id: "vishnu-chandran",
    name: "Vishnu Chandran",
    organization: "CoE Analyst",
    quote: "Our culture has shifted my focus from just 'finishing tasks' to creating a real, lasting impact. By embracing accountability and continuous learning, I've grown not just as an analyst, but as an individual. I now feel more confident and responsible, always thinking clearly about the best outcomes for our team."
  },
  {
    id: "sharon-adhiambo",
    name: "Sharon Adhiambo",
    organization: "HR Analyst",
    quote: "Collaboration is at the heart of my growth here. I've discovered the power of leaning on my teammates' strengths and sharing our progress and challenges openly. By involving the right people early and seeking feedback, my work has become more efficient, aligned, and—most importantly—more impactful."
  },
  {
    id: "fadil-alli",
    name: "Fadil Alli",
    organization: "CoE Analyst",
    quote: "Ownership is a value I practice every single day. Whether I am acting as a Scrum Master or tackling a new project, taking full responsibility has made our team processes smoother and more transparent. This sense of accountability has naturally led to better collaboration and clearer results for everyone."
  }
]

const AssociateTestimonialsDetailPage: React.FC = () => {
  const disclaimer = '(not approved for external publication)'

  // Keep testimonials-specific hero image but style like guidelines hero
  const heroImage = "/images/testimonials-hero.png"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
                <span className="ml-1 text-gray-500 md:ml-2">Associate Testimonials</span>
              </div>
            </li>
          </ol>
        </nav>

      </div>

      {/* Hero full-bleed like guidelines */}
      <div className="w-full bg-gray-900">
        <div className="relative w-full h-80 md:h-[420px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-[#030E31] bg-opacity-75" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-6 lg:px-8 text-white max-w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Associate Testimonials
            </h1>
            <p className="text-white/85 max-w-2xl">
              Team stories showcasing how DQ culture supports personal growth and potential.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Featured Associates Section */}
        <div className="mb-8">
          {/* Associate Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {associateTestimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
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
                <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <p className="text-xs text-gray-500 italic mt-4">{disclaimer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  )
}

export default AssociateTestimonialsDetailPage
