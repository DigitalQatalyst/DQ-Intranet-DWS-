import React from "react"

interface Props {
  items: any[]
  onClickGuide?: (guide: any) => void
}

const avatarOverrides: Record<string, string> = {
  "khalifa-fund-client-testimonial": "https://randomuser.me/api/portraits/men/52.jpg",
  "adib-client-testimonial": "https://randomuser.me/api/portraits/men/50.jpg",
  "dfsa-client-testimonial": "https://randomuser.me/api/portraits/men/40.jpg"
}

const getAvatarUrl = (item: any): string => {
  if (item.hero_image_url) return item.hero_image_url
  const slug = (item.slug || "").toLowerCase()
  if (slug && avatarOverrides[slug]) return avatarOverrides[slug]
  const name = encodeURIComponent(item.author_name || item.title || "DQ")
  return `https://ui-avatars.com/api/?name=${name}&size=80&background=003049&color=ffffff&bold=true`
}

const getDisplayName = (item: any) => {
  if (item.slug === "khalifa-fund-client-testimonial") return "Ali Al Jasmi"
  if (item.slug === "adib-client-testimonial") return "Kamran Sheikh"
  if (item.slug === "dfsa-client-testimonial") return "Waleed Saeed Al Awadhi"
  return item.author_name || item.title || "Unnamed Testimonial"
}

const getDisplayOrg = (item: any) => {
  if (item.slug === "khalifa-fund-client-testimonial") return "Head of Technology • Khalifa Fund"
  if (item.slug === "adib-client-testimonial") return "Head of Enterprise Architecture & Analytics • ADIB"
  if (item.slug === "dfsa-client-testimonial") return "Chief Operating Officer • DFSA"
  return item.author_org || item.domain || ""
}

const TestimonialsGrid: React.FC<Props> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No testimonials found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item) => {
        const name = getDisplayName(item)
        const organization = getDisplayOrg(item)
        const quote = (item.summary || item.body || "").trim()

        return (
          <div
            key={item.id || item.slug}
            className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                <img
                  src={getAvatarUrl(item)}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-gray-900 text-[15px]">{name}</p>
                {organization && <p className="text-xs text-gray-500 whitespace-pre-line">{organization}</p>}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">“{quote}”</p>
          </div>
        )
      })}
    </div>
  )
}

export default TestimonialsGrid
