import React from 'react';
import { format } from 'date-fns';
import { Building, Calendar, Clock, Users, MessageSquare } from 'lucide-react';

export interface PulseCardItem {
  id: string;
  title: string;
  description: string | null;
  category?: string | null;
  feedback_type?: string | null;
  department: string | null;
  image_url: string | null;
  published_at: string | null;
  closes_at: string | null;
  total_responses?: number;
  response_count?: number;
  total_views?: number;
  type: 'poll' | 'survey' | 'feedback';
}

interface PulseCardProps {
  item: PulseCardItem;
  onViewDetails?: () => void;
  onGiveFeedback?: () => void;
}

export const PulseCard: React.FC<PulseCardProps> = ({
  item,
  onViewDetails,
  onGiveFeedback,
}) => {
  // Calculate progress percentage
  // Use response_count if available (from view), otherwise use total_responses
  const responseCount = (item as any).response_count || item.total_responses || 0;
  const progressPercentage = Math.min(100, responseCount);
  
  // Format dates
  const launchDate = item.published_at || item.closes_at || new Date().toISOString();
  const deadline = item.closes_at || '';
  
  // Get category label
  const categoryLabel = item.category || item.feedback_type || 'General Feedback';
  
  // Get action button text based on type
  const getActionButtonText = () => {
    if (item.type === 'poll') return 'Take Poll';
    if (item.type === 'survey') return 'Take Survey';
    if (item.type === 'feedback') return 'Give Feedback';
    return 'Participate';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGiveFeedback) {
      onGiveFeedback();
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
            <MessageSquare size={48} className="text-white opacity-75" />
          </div>
        )}
        {/* Date Overlay */}
        {launchDate && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-900">
              {format(new Date(launchDate), 'MMM d, yyyy')}
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

          {/* Launch Date */}
          {launchDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-2 flex-shrink-0" />
              <span>Launched: {format(new Date(launchDate), 'MMM d, yyyy')}</span>
            </div>
          )}

          {/* Deadline */}
          {deadline && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-2 flex-shrink-0" />
              <span>Deadline: {format(new Date(deadline), 'MMM d, yyyy')}</span>
            </div>
          )}

          {/* Participants Count */}
          <div className="flex items-center text-sm text-gray-500">
            <Users size={14} className="mr-2 flex-shrink-0" />
            <span>{responseCount} participants</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%`, backgroundColor: '#FB5535' }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleFeedbackClick}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-dq-navy hover:bg-[#13285A] rounded-md transition-colors"
        >
          {getActionButtonText()}
        </button>
      </div>
    </div>
  );
};

