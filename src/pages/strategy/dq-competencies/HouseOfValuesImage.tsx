import React from 'react'

interface HouseOfValuesImageProps {
  imageSrc?: string
}

export function HouseOfValuesImage({ imageSrc }: HouseOfValuesImageProps) {
  // Image path - place your image file at: public/images/house-of-values.png
  // Or provide the imageSrc prop with the path/URL to your image
  const defaultImageSrc = imageSrc || '/images/house-of-values.png'
  
  return (
    <div className="my-6 w-full">
      <div className="bg-white rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--guidelines-primary)' }}>
        {/* House of Values Image - Direct image insertion */}
        <div className="w-full max-w-3xl mx-auto">
          <img 
            src={defaultImageSrc}
            alt="DQ House of Values (HoV) diagram showing the 12 core values and competencies"
            className="w-full h-auto mx-auto"
            style={{ maxHeight: '500px', objectFit: 'contain', display: 'block' }}
            loading="lazy"
            onError={(e) => {
              // Fallback if image is not found
              console.warn('House of Values image not found at:', defaultImageSrc)
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}

