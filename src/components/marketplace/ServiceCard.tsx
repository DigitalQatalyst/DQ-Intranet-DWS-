import React from 'react';
import { resolveServiceImage } from '../../utils/serviceCardImages';
import { useNavigate } from 'react-router-dom';
export interface ServiceCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    provider: {
      name: string;
      logoUrl: string;
    };
    tags?: string[];
    category?: string;
    deliveryMode?: string;
    featuredImageUrl?: string;
    requestUrl?: string;
  };
  // Clean up specific duplicate tagline the user asked to remove
  const sanitizedDescription = (item.description || '')
    .replace('Purpose gives meaning to every action, and direction to every choice.', '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  type: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onQuickView: () => void;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  type,
  isBookmarked: _isBookmarked,
  onToggleBookmark: _onToggleBookmark,
  onQuickView
}) => {
  const navigate = useNavigate();
  // Generate route based on marketplace type
  const getItemRoute = () => {
    switch (type) {
      case 'courses':
        return `/courses/${item.id}`;
      case 'financial':
        return `/marketplace/financial/${item.id}`;
      case 'non-financial':
        return `/marketplace/services-center/${item.id}`;
      default:
        return `/${type}/${item.id}`;
    }
  };
  // Generate appropriate CTA text based on marketplace type
  const getPrimaryCTAText = () => {
    // Prompt Library cards should say "View Prompt"
    if (item.category === 'Prompt Library') {
      return 'View Prompt';
    }

    // AI Tools cards should say "Request Access"
    if (item.category === 'AI Tools') {
      return 'Request Access';
    }
    
    switch (type) {
      case 'courses':
        return 'Enroll Now';
      case 'financial':
        return 'Apply Now';
      case 'non-financial':
        return 'Request Service';
      default:
        return 'Get Started';
    }
  };
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For AI Tools and Digital Worker, open the request form in a new tab
    if (item.category === 'AI Tools' || item.category === 'Digital Worker') {
      const requestUrl = item.requestUrl || 'https://forms.office.com/pages/responsepage.aspx?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u&route=shorturl';
      window.open(requestUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`${getItemRoute()}?action=true`);
    }
  };
  
  // Prefer explicit featuredImageUrl, else mapped image by id/title, else default
  const imageSrc =
    item.featuredImageUrl ||
    resolveServiceImage(item.id, item.title) ||
    '/images/services/DTMP.jpg';
  
  return <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200" onClick={onQuickView}>
      {/* Featured Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a gradient if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.className = 'relative h-48 bg-gradient-to-br from-gray-400 to-gray-600';
            }
          }}
        />
      </div>
      
      {/* Card Content with fixed heights */}
      <div className="px-4 pt-3 pb-2 flex flex-col" style={{ height: '140px' }}>
        {/* Title and Provider - fixed height */}
        <div style={{ height: '60px' }}>
          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight" style={{ margin: 0, lineHeight: 1.2, fontSize: '14px' }}>
            {item.title}
          </h3>
          <p className="text-sm text-gray-500" style={{ marginTop: 4, marginBottom: 0, fontSize: '12px' }}>
            {item.provider.name}
          </p>
        </div>
        {/* Description - fixed height */}
        <div style={{ height: '60px', marginTop: '8px' }}>
          <p className="text-sm text-gray-600 line-clamp-3 leading-snug" style={{ margin: 0, fontSize: '12px', lineHeight: 1.4 }}>
            {sanitizedDescription || item.description}
          </p>
        </div>
      </div>
    
      <div className="border-t border-gray-100 px-4 py-3" style={{ height: '60px' }}>
        <div className="flex justify-between gap-2 h-full">
          <button onClick={handlePrimaryAction} className="px-4 py-2 text-sm font-bold text-white rounded-md transition-colors whitespace-nowrap flex-1 h-full" style={{ backgroundColor: '#030F35' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020a23'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030F35'}>
            {getPrimaryCTAText()}
          </button>
        </div>
      </div>
    </div>;
};
