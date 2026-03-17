import React from 'react';
export interface ServiceHeroSectionProps {
  item: {
    title: string;
    category?: string;
    serviceType?: string;
    deliveryMode?: string;
    provider?: {
      name: string;
    };
    tags?: string[];
    featuredImageUrl?: string;
    lastUpdated?: string;
  };
}

export function ServiceHeroSection({ 
  item
}: ServiceHeroSectionProps) {
  // Use featured image or default workplace image
  const backgroundImage = item.featuredImageUrl || '/images/services/IT-support.jpg';
  
  // Handle image load error with gradient fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.backgroundImage = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
  };

  return (
    <div 
      className="w-full relative overflow-hidden lg:min-h-[400px]"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onError={handleImageError}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(135deg, rgba(3, 15, 53, 0.75) 0%, rgba(3, 15, 53, 0.65) 100%)',
        }}
      />
      
      {/* Content - fixed 96px (6rem) left margin on desktop, 117px gap above title on desktop */}
      <div className="relative z-10 px-4 md:px-6 lg:px-24 pt-10 md:pt-12 lg:pt-[117px] pb-10 md:pb-12 lg:pb-16 flex flex-col items-start text-left h-full">
        {/* Category pill */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {item.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-white/15 text-white border border-white/30">
              {item.category}
            </span>
          )}
        </div>

        {/* Date / secondary line */}
        {item.lastUpdated && (
          <p className="text-xs md:text-sm text-white/80 mb-2">
            {item.lastUpdated}
          </p>
        )}

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-inter text-white max-w-4xl">
          {item.title}
        </h1>

        {/* Meta line with tags, separated by dot (no provider name) */}
        {item.tags && item.tags.length > 0 && (
          <p className="text-sm md:text-base text-white/85">
            {item.tags.join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}

