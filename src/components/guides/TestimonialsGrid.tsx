import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { parseCsv } from "../../utils/guides"

interface Props {
  items: any[]
  onClickGuide?: (guide: any) => void
}

const TestimonialsGrid: React.FC<Props> = ({ items, onClickGuide }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const disclaimer = '(not approved for external publication)'
  // Get hero images for testimonials
  const clientTestimonialsImage = "/images/client-testimonials.png"
  const associateTestimonialsImage = "/images/associate-testimonials.jpeg"
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Service cards always show regardless of filter selection

  // Filter items to exclude "Client Feedback" entries
  const filteredItems = (items || []).filter((item) => {
    const title = (item.title || "").toLowerCase()
    return !title.includes("client feedback")
  })

  return (
    <div className="space-y-6">
      {/* Service cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Client Feedback Service Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-3 hover:shadow-md transition-shadow flex flex-col h-[400px]">
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden mb-2 bg-slate-50 flex-shrink-0" style={{ height: '160px', minHeight: '160px', maxHeight: '160px' }}>
            <img 
              src={clientTestimonialsImage} 
              alt="The Client Perspective" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Content */}
          <div className="flex flex-col flex-1">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-1.5 flex-shrink-0" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '44px',
              maxHeight: '44px',
              lineHeight: '1.375rem'
            }}>The Client Perspective</h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-2 flex-shrink-0" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '36px',
              maxHeight: '36px',
              lineHeight: '1.125rem'
            }}>
              Client feedback on driving strategic transformation outcomes.
            </p>
            
            {/* Tag */}
            <div className="flex flex-wrap gap-2 mb-1.5 flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                Clients
              </span>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center text-xs text-gray-500 gap-3 mb-2 flex-shrink-0">
              <span>{formatDate()}</span>
            </div>
            
            {/* Button at bottom */}
            <div className="pt-2.5 mt-auto border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/marketplace/guides/testimonials')}
                className="w-full inline-flex items-center justify-center rounded-full text-sm font-semibold px-4 py-2 transition-all focus:outline-none focus:ring-2 bg-[var(--guidelines-primary-solid)] text-white hover:bg-[var(--guidelines-primary-solid-hover)] focus:ring-[var(--guidelines-ring-color)]"
                aria-label="View details"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Associate Testimonials Service Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-3 hover:shadow-md transition-shadow flex flex-col h-[400px]">
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden mb-2 bg-slate-50 flex-shrink-0" style={{ height: '160px', minHeight: '160px', maxHeight: '160px' }}>
            <img 
              src={associateTestimonialsImage} 
              alt="The Associate Perspective" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Content */}
          <div className="flex flex-col flex-1">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-1.5 flex-shrink-0" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '44px',
              maxHeight: '44px',
              lineHeight: '1.375rem'
            }}>The Associate Perspective</h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-2 flex-shrink-0" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '36px',
              maxHeight: '36px',
              lineHeight: '1.125rem'
            }}>
              Associate feedback on professional growth and DQ culture.
            </p>
            
            {/* Tag */}
            <div className="flex flex-wrap gap-2 mb-1.5 flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: 'var(--dws-chip-bg)', color: 'var(--dws-chip-text)', borderColor: 'var(--dws-card-border)' }}>
                Associates
              </span>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center text-xs text-gray-500 gap-3 mb-2 flex-shrink-0">
              <span>{formatDate()}</span>
            </div>
            
            {/* Button at bottom */}
            <div className="pt-2.5 mt-auto border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/marketplace/guides/associate-testimonials')}
                className="w-full inline-flex items-center justify-center rounded-full text-sm font-semibold px-4 py-2 transition-all focus:outline-none focus:ring-2 bg-[var(--guidelines-primary-solid)] text-white hover:bg-[var(--guidelines-primary-solid-hover)] focus:ring-[var(--guidelines-ring-color)]"
                aria-label="View details"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Associate testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredItems.map((item) => {
          const name = item.author_name || item.title || "Unnamed Testimonial"
          const organization = item.author_org || item.domain || ""
          const quote = (item.summary || item.body || "").trim()

          return (
            <div
              key={item.id || item.slug}
              className="h-full min-h-[340px] rounded-2xl border border-gray-200 bg-white text-left p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onClickGuide && onClickGuide(item)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {/* Generic user icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                    <path d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-gray-900">{name}</p>
                  {organization && (
                    <p className="text-xs text-gray-500 whitespace-pre-line">{organization}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                "{quote}"
                <span className="block text-xs text-gray-500 italic mt-2">{disclaimer}</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestimonialsGrid
