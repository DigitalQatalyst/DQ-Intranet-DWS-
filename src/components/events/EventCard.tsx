import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventDetailsModal } from '../DQEventsCalendar/EventDetailsModal';

export interface EventCardProps {
  event: any;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Internal':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'Client':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Training':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Launches':
        return 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" 
      onClick={handleCardClick}
    >
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[40px]" title={event.title}>
        {event.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-3">
        {event.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {event.category && (
          <span className={`px-2 py-0.5 text-xs rounded-full flex items-center ${getCategoryStyles(event.category)}`}>
            <Tag size={12} className="mr-1" />
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-xs text-gray-500 mb-3">
        <span className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {formatDate(event.start)}
        </span>
        <span className="flex items-center">
          <Clock size={14} className="mr-1" />
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
        {event.location && (
          <span className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span className="truncate" title={event.location}>{event.location}</span>
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="w-full inline-flex items-center justify-center rounded-full bg-[#030f35] text-white text-sm font-semibold px-4 py-2 transition-all hover:bg-[#05154d] focus:outline-none focus:ring-2 focus:ring-[#1e2a78]"
        >
          View Details
        </button>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal 
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EventCard;
