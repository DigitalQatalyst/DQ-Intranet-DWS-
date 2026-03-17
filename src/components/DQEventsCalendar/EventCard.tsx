import React, { useState } from 'react';
import { Event } from './index';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { EventDetailsModal } from './EventDetailsModal';

type EventCardProps = {
  event: Event;
};

export function EventCard({
  event
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Format date and time
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  return <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] border-b-2 border-transparent hover:border-[#FB5535] group">
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#FB5535] text-white">
            {event.category}
          </span>
        </div>
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#030F35] mb-2 group-hover:text-[#FB5535] transition-colors">
          {event.title}
        </h3>
        {/* Date & Time */}
        <div className="flex items-center text-gray-600 mb-2">
          <CalendarIcon className="w-4 h-4 mr-2 text-[#1A2E6E]" />
          <span className="text-sm">{formatDate(event.start)}</span>
        </div>
        {/* Time */}
        <div className="flex items-center text-gray-600 mb-2">
          <ClockIcon className="w-4 h-4 mr-2 text-[#1A2E6E]" />
          <span className="text-sm">
            {formatTime(event.start)} - {formatTime(event.end)}
          </span>
        </div>
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 mr-2 text-[#1A2E6E]" />
          <span className="text-sm">{event.location}</span>
        </div>
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        {/* Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-2 border border-[#1A2E6E] text-[#1A2E6E] rounded-lg hover:bg-[#1A2E6E] hover:text-white transition-colors duration-300 text-sm font-medium"
          >
            View Details
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-2 bg-[#FB5535] text-white rounded-lg hover:bg-[#FB5535]/90 transition-colors duration-300 text-sm font-medium"
          >
            Join
          </button>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal 
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>;
}