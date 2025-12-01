import React, { useMemo } from 'react';
import { BookmarkIcon, Clock, Layers } from 'lucide-react';
import {
  resolveChipIcon
} from '../../utils/lmsIcons';
import { LOCATION_ALLOW } from '@/lms/config';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
import { resolveServiceImage } from '../../utils/serviceCardImages';
export interface MarketplaceItemProps {
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
    imageUrl?: string;
    [key: string]: any;
  };
  marketplaceType: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAddToComparison?: () => void;
  onQuickView: () => void;
}
export const MarketplaceCard: React.FC<MarketplaceItemProps> = ({
  item,
  marketplaceType,
  isBookmarked,
  onToggleBookmark,
  onQuickView
}) => {
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);
  // Generate route based on marketplace type
  const getItemRoute = () => {
    return `${config.route}/${item.id}`;
  };
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marketplaceType === 'courses') {
      // Use slug if available, otherwise fall back to id
      const slug = item.slug || item.id;
      navigate(`/lms/${slug}`);
      return;
    }
    onQuickView();
  };
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.lmsUrl) {
      window.open(item.lmsUrl, '_blank', 'noopener');
      return;
    }
    if (marketplaceType === 'courses') {
      // Use slug if available, otherwise fall back to id
      const slug = item.slug || item.id;
      navigate(`/lms/${slug}`);
      return;
    }
    if (item.slug) {
      navigate(`/lms/${item.slug}`);
      return;
    }
    navigate(`${getItemRoute()}?action=true`);
  };
  // Display tags if available, otherwise use category and deliveryMode
  
  // Calculate lessons/modules count for courses
  const courseStats = useMemo(() => {
    if (marketplaceType !== 'courses') return null;
    
    const curriculum = item.curriculum || item.raw?.curriculum;
    if (!curriculum || !Array.isArray(curriculum)) return null;
    
    let totalLessons = 0;
    let totalModules = 0;
    
    curriculum.forEach((item: any) => {
      if (item.topics && Array.isArray(item.topics)) {
        totalModules += item.topics.length;
        item.topics.forEach((topic: any) => {
          if (topic.lessons && Array.isArray(topic.lessons)) {
            totalLessons += topic.lessons.length;
          }
        });
      } else if (item.lessons && Array.isArray(item.lessons)) {
        totalModules += 1;
        totalLessons += item.lessons.length;
      }
    });
    
    return { totalLessons, totalModules };
  }, [item, marketplaceType]);
  
  const chipData = useMemo(() => {
    if (marketplaceType !== 'courses') {
      const typeLabel =
        typeof item.type === 'string'
          ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
          : null;
      const rawCategory = Array.isArray(item.category) ? item.category[0] : item.category;
      const rawDelivery = Array.isArray(item.delivery) ? item.delivery[0] : item.delivery;
      const hasCustomTags = Array.isArray(item.tags) && item.tags.length > 0;
      let baseTags: string[] = hasCustomTags
        ? (item.tags as string[])
        : [rawCategory, rawDelivery].filter(Boolean);
      if (!hasCustomTags && typeLabel) {
        const lowerType = typeLabel.toLowerCase();
        const hasType = baseTags.some(
          tag => typeof tag === 'string' && tag.toLowerCase() === lowerType
        );
        baseTags = hasType
          ? [
              typeLabel,
              ...baseTags.filter(
                tag => !(typeof tag === 'string' && tag.toLowerCase() === lowerType)
              )
            ]
          : [typeLabel, ...baseTags];
      }
      return baseTags.map((label, index) => ({ key: `generic-${index}`, label, iconValue: label }));
    }
    
    // For courses: only show duration and modules count with separator
    const chips: Array<{ key: string; label: string; iconValue?: string }> = [];
    
    // 1. duration
    const durationValue = item.duration || item.durationBucket || item.durationLabel;
    const durationLabel = item.durationLabel || durationValue;
    if (durationLabel) {
      chips.push({ key: 'duration', label: durationLabel, iconValue: durationValue });
    }
    
    // 2. modules count (only modules, not lessons)
    if (courseStats && courseStats.totalModules > 0) {
      chips.push({ 
        key: 'modules', 
        label: `${courseStats.totalModules} ${courseStats.totalModules === 1 ? 'module' : 'modules'}` 
      });
    }
    
    return chips;
  }, [item, marketplaceType]);
  
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
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[72px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%] items-center">
            {marketplaceType === 'courses' && chipData.length > 0 ? (
              <>
                {chipData.map((chip, index) => {
                  const Icon = chip.key === 'duration' ? Clock : chip.key === 'modules' ? Layers : resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
                  return (
                    <React.Fragment key={`${chip.key}-${chip.label}-${index}`}>
                      {index > 0 && <span className="text-gray-400">.</span>}
                      <span 
                        className="inline-flex items-center text-xs font-medium truncate text-gray-700"
                      >
                        {Icon ? <Icon className="h-3.5 w-3.5 mr-1" /> : null}
                        {chip.label}
                      </span>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              chipData.map((chip, index) => {
                const Icon = resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
                return <span 
                  key={`${chip.key}-${chip.label}-${index}`} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate"
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#000000'
                  }}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5 mr-1" style={{ color: '#000000' }} /> : null}
                  {chip.label}
                </span>;
              })
            )}
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
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button 
            onClick={handleViewDetails} 
            className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:opacity-90 transition-colors whitespace-nowrap min-w-[120px] flex-1"
            style={{ 
              color: '#030F35',
              borderColor: '#030F35'
            }}
          >
            {config.secondaryCTA}
          </button>
          <button 
            onClick={handlePrimaryAction} 
            className="px-4 py-2 text-sm font-bold text-white rounded-md hover:opacity-90 transition-colors whitespace-nowrap flex-1"
            style={{ backgroundColor: '#030F35' }}
          >
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>;
};
