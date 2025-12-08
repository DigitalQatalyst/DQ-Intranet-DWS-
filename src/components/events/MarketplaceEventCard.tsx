import React from 'react';
import { format } from 'date-fns';
import { Building, Calendar, Clock, MapPin, Users } from 'lucide-react';

export interface MarketplaceEventCardItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start: Date;
  end: Date;
  image_url?: string | null;
  department?: string | null;
  registration_count?: number;
  capacity?: number | null;
}

interface MarketplaceEventCardProps {
  item: MarketplaceEventCardItem;
  onViewDetails?: () => void;
  onRegister?: () => void;
}

export const MarketplaceEventCard: React.FC<MarketplaceEventCardProps> = ({
  item,
  onViewDetails,
  onRegister,
}) => {
  // Calculate registration progress if capacity is available
  const registrationCount = item.registration_count || 0;
  const capacity = item.capacity || 0;
  const progressPercentage = capacity > 0 
    ? Math.min(100, Math.round((registrationCount / capacity) * 100))
    : 0;
  
  // Format dates
  const eventDate = item.start;
  const startTime = format(item.start, 'h:mm a');
  const endTime = format(item.end, 'h:mm a');
  
  // Get category label
  const categoryLabel = item.category || 'Event';
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegister) {
      onRegister();
    } else if (onViewDetails) {
      onViewDetails();
    }
  };

  return (
    <div
      className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
    >
      {/* Image Section with Date Overlay */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dq-navy to-[#1A2E6E] flex items-center justify-center">
            <Calendar size={48} className="text-white opacity-75" />
          </div>
        )}
        {/* Date Overlay */}
        {eventDate && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-900">
              {format(eventDate, 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1 leading-snug">
          {item.title}
        </h3>
        
        {/* Category/Subtitle */}
        <p className="text-sm text-gray-500 mb-3">{categoryLabel}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed min-h-[60px]">
          {item.description || 'No description available'}
        </p>

        {/* Details Section */}
        <div className="space-y-2 mb-4">
          {/* Department */}
          {item.department && (
            <div className="flex items-center text-sm text-gray-500">
              <Building size={14} className="mr-2 flex-shrink-0" />
              <span>{item.department}</span>
            </div>
          )}

          {/* Event Date */}
          {eventDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-2 flex-shrink-0" />
              <span>{format(eventDate, 'MMM d, yyyy')}</span>
            </div>
          )}

          {/* Event Time */}
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-2 flex-shrink-0" />
            <span>{startTime} - {endTime}</span>
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          )}

          {/* Registration Count */}
          {capacity > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Users size={14} className="mr-2 flex-shrink-0" />
              <span>{registrationCount} registered / {capacity} capacity</span>
            </div>
          )}
        </div>

        {/* Progress Bar (only if capacity is set) */}
        {capacity > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Registration</span>
              <span className="font-semibold">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%`, backgroundColor: '#FB5535' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleRegisterClick}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-dq-navy hover:bg-[#13285A] rounded-md transition-colors"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

