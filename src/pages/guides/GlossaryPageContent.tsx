import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'

const GlossaryPageContent: React.FC = () => {
  const navigate = useNavigate()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Related Frameworks data
  const relatedFrameworks = [
    {
      id: "6xd",
      title: "Agile 6×D (Products)",
      description: "DQ's six essential perspectives for designing, building, and delivering digital products.",
      image: "/images/knowledge/6xd.png",
      link: "/marketplace/guides/glossary/6xd"
    },
    {
      id: "ghc",
      title: "Golden Honeycomb of Competence (GHC)",
      description: "DQ's core competency model that enables associate growth, performance, and digital mastery.",
      image: "/images/knowledge/ghc.png",
      link: "/marketplace/guides/glossary/ghc"
    }
  ]

  const handleImageError = (itemId: string) => {
    console.warn(`Image failed to load: /images/knowledge/${itemId === '6xd' ? '6xd.png' : 'ghc.png'}`)
    setImageErrors(prev => ({ ...prev, [itemId]: true }))
  }

  return (
    <div>
      {/* Main Title - Centered */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The DQ Glossary
        </h1>
        <p className="text-base text-gray-800 max-w-3xl mx-auto leading-relaxed">
          Read our comprehensive collection of terms explaining various Digital Transformation 2.0 (DT2.0) and Internet Marketing concepts in our DQ Glossary!
        </p>
      </div>

      {/* Related Frameworks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 items-stretch">
        {relatedFrameworks.map(item => (
          <div 
            key={item.id}
            className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col"
            onClick={() => navigate(item.link)}
          >
            <div className="w-full h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center relative">
              {imageErrors[item.id] ? (
                <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{item.id === '6xd' ? '6xd.png' : 'ghc.png'}</p>
                  <p className="text-xs text-gray-400 mt-1">Image placeholder</p>
                </div>
              ) : (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain"
                  style={{ padding: '12px' }}
                  onError={() => handleImageError(item.id)}
                />
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight line-clamp-2 h-[56px]">{item.title}</h3>
              <p className="text-gray-600 text-sm flex-grow mb-4 leading-relaxed">{item.description}</p>
              <div className="mt-auto pt-2">
                <button className="w-full bg-[#0A1433] text-white py-2.5 rounded-xl text-sm hover:bg-[#0A1433]/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlossaryPageContent
