import React from 'react';
import { resolveServiceImage } from '../../utils/serviceCardImages';
import { BookmarkIcon } from 'lucide-react';
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
  type: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onQuickView: () => void;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  type,
  isBookmarked,
  onToggleBookmark,
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
    // Check if it's an AI Tool
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
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(getItemRoute());
  };
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // For AI Tools and Digital Worker, open the request form in a new tab
    if (item.category === 'AI Tools' || item.category === 'Digital Worker') {
      const requestUrl = item.requestUrl || 'https://forms.office.com/pages/responsepage.aspx?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u&route=shorturl';
      window.open(requestUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`${getItemRoute()}?action=true`);
    }
  };
  // Display tags if available, otherwise use category and deliveryMode
  const displayTags = item.tags || [item.category, item.deliveryMode].filter(Boolean);
  
  // Prefer explicit featuredImageUrl, else mapped image by id/title, else default
  const imageSrc =
    item.featuredImageUrl ||
    resolveServiceImage(item.id, item.title) ||
    '/images/services/DTMP.jpg';
  
  return <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200" onClick={onQuickView}>
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
      
      {/* Card Header with fixed height for title and provider */}
      <div className="px-4 pt-3 pb-2 flex-grow flex flex-col">
        <div className="flex items-start mb-1">
          <div className="flex-grow flex flex-col">
            <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight" style={{ margin: 0, lineHeight: 1.15 }}>
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5" style={{ marginTop: 2, marginBottom: 0 }}>
              {item.provider.name}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-2" style={{ marginTop: 4 }}>
          <p className="text-sm text-gray-600 line-clamp-2 leading-snug" style={{ margin: 0 }}>
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {displayTags.map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate bg-gray-50 text-gray-700 border border-gray-200">
                {tag}
              </span>)}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button onClick={e => {
            e.stopPropagation();
            onToggleBookmark();
          }} className={`p-1.5 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <BookmarkIcon size={16} className={isBookmarked ? 'fill-yellow-600' : ''} />
            </button>
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 px-4 py-2.5">
        <div className="flex justify-between gap-2">
          <button onClick={handleViewDetails} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap min-w-[120px] flex-1 ${type === 'non-financial' ? 'bg-white border' : 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50'}`} style={type === 'non-financial' ? { color: '#030F35', borderColor: '#030F35' } : {}} onMouseEnter={(e) => { if (type === 'non-financial') e.currentTarget.style.backgroundColor = '#f0f4f8'; }} onMouseLeave={(e) => { if (type === 'non-financial') e.currentTarget.style.backgroundColor = 'white'; }}>
            View Details
          </button>
          <button onClick={handlePrimaryAction} className="px-4 py-2 text-sm font-bold text-white rounded-md transition-colors whitespace-nowrap flex-1" style={{ backgroundColor: '#030F35' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020a23'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030F35'}>
            {getPrimaryCTAText()}
          </button>
        </div>
      </div>
    </div>;
};
