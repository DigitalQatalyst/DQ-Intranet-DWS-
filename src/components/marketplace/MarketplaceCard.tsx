import React, { useMemo } from 'react';
import { BookmarkIcon, ScaleIcon, Calendar, MapPin, Building } from 'lucide-react';
import {
  CARD_ICON_BY_ID,
  DEFAULT_COURSE_ICON,
  resolveChipIcon
} from '../../utils/lmsIcons';
import { LOCATION_ALLOW } from '@/lms/config';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
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
    [key: string]: any;
  };
  marketplaceType: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAddToComparison: () => void;
  onQuickView: () => void;
}
export const MarketplaceCard: React.FC<MarketplaceItemProps> = ({
  item,
  marketplaceType,
  isBookmarked,
  onToggleBookmark,
  onAddToComparison,
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
  const IconComponent = CARD_ICON_BY_ID[item.id] || DEFAULT_COURSE_ICON;
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
      return baseTags.map((label, index) => ({ key: `generic-${index}`, label }));
    }
    const chips: Array<{ key: string; label: string; iconValue?: string }> = [];
    
    // 1. courseCategory
    const category = Array.isArray(item.courseCategory)
      ? item.courseCategory[0]
      : item.courseCategory || (Array.isArray(item.category) ? item.category[0] : item.category);
    if (category) {
      chips.push({ key: 'courseCategory', label: category });
    }
    
    // 2. deliveryMode
    const delivery = Array.isArray(item.deliveryMode)
      ? item.deliveryMode[0]
      : Array.isArray(item.delivery)
      ? item.delivery[0]
      : item.deliveryMode || item.delivery;
    if (delivery) {
      chips.push({ key: 'deliveryMode', label: delivery, iconValue: delivery });
    }
    
    // 3. duration
    const durationValue = item.duration || item.durationBucket || item.durationLabel;
    const durationLabel = item.durationLabel || durationValue;
    if (durationLabel) {
      chips.push({ key: 'duration', label: durationLabel, iconValue: durationValue });
    }
    
    // 4. levelCode (as "Lx")
    if (item.levelCode) {
      const levelLabel = item.levelShortLabel || item.levelLabel || item.levelCode;
      chips.push({ key: 'level', label: levelLabel, iconValue: item.levelCode });
    }
    
    // 5. location (if not Global)
    const locations = Array.isArray(item.locations)
      ? item.locations
      : Array.isArray(item.location)
      ? item.location
      : item.location
      ? [item.location]
      : [];
    const allowedLocations = new Set<string>(LOCATION_ALLOW as readonly string[]);
    const specificLocation = locations.find(
      (loc: string) => loc !== 'Global' && allowedLocations.has(loc)
    );
    if (specificLocation) {
      chips.push({ key: 'location', label: specificLocation });
    }
    
    // 6. audience (if Lead only)
    const audience = Array.isArray(item.audience)
      ? item.audience
      : Array.isArray(item.raw?.audience)
      ? item.raw.audience
      : [];
    if (audience.length === 1 && audience[0].toLowerCase() === 'lead') {
      chips.push({ key: 'audience', label: 'Lead-only', iconValue: audience[0] });
    }
    
    return chips;
  }, [item, marketplaceType]);

  // Render event card layout for events marketplace
  if (marketplaceType === 'events') {
    return (
      <div
        className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={onQuickView}
      >
        {/* Event Image with Date Badge */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
            }}
          />
          {item.date && (
            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md shadow-md">
              <span className="text-xs font-semibold text-gray-700">{item.date}</span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Event Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
            {item.title}
          </h3>

          {/* Event Type and Location */}
          {(item.eventType || item.type || item.category) && item.location && (
            <p className="text-sm text-gray-600 mb-4">
              {item.eventType || item.type || item.category} at {item.location}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {item.date && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-2 flex-shrink-0" />
                <span>{item.date}</span>
              </div>
            )}
            {(item.organizer || item.provider?.name) && (
              <div className="flex items-center text-sm text-gray-500">
                <Building size={14} className="mr-2 flex-shrink-0" />
                <span>{item.organizer || item.provider?.name}</span>
              </div>
            )}
            {item.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <span>{item.location}</span>
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(e);
            }}
            className="w-full mt-auto px-4 py-2.5 text-sm font-semibold text-white bg-dq-navy hover:bg-[#13285A] rounded-md transition-colors"
          >
            {config.primaryCTA || 'Register Now'}
          </button>
        </div>
      </div>
    );
  }

  return <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200" onClick={onQuickView}>
      {/* Card Header with fixed height for title and provider */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <div className="flex items-center gap-2 min-h-[48px]">
              <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {item.provider.name}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 clamp-2 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {chipData.map((chip, index) => {
            const Icon = resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
            return <span key={`${chip.key}-${chip.label}-${index}`} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate ${index === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {Icon ? <Icon className="h-3.5 w-3.5 mr-1" /> : null}
                {chip.label}
              </span>;
          })}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button onClick={e => {
            e.stopPropagation();
            onToggleBookmark();
          }} className={`p-1.5 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <BookmarkIcon size={16} className={isBookmarked ? 'fill-yellow-600' : ''} />
            </button>
            <button onClick={e => {
            e.stopPropagation();
            onAddToComparison();
          }} className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200" aria-label="Add to comparison" title="Add to comparison">
              <ScaleIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button onClick={handleViewDetails} className={`px-4 py-2 text-sm font-medium bg-white border rounded-md transition-colors whitespace-nowrap min-w-[120px] flex-1 ${
            marketplaceType === 'events' 
              ? 'text-dq-navy border-dq-navy hover:bg-dq-navy/10' 
              : 'text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}>
            {config.secondaryCTA}
          </button>
          <button onClick={handlePrimaryAction} className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors whitespace-nowrap flex-1 ${
            marketplaceType === 'events'
              ? 'bg-dq-navy hover:bg-[#13285A]'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}>
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>;
};
