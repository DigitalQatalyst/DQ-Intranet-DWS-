import React, { useEffect, useRef, useState } from 'react';
import { Event } from './index';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  Download,
  Share2,
  ChevronDown
} from 'lucide-react';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        setShowCalendarOptions(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showCalendarOptions) {
          setShowCalendarOptions(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showCalendarOptions]);

  if (!isOpen || !event) return null;

  // Format date and time
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Internal':
        return 'bg-[#1A2E6E] text-white';
      case 'Client':
        return 'bg-[#FB5535] text-white';
      case 'Training':
        return 'bg-green-500 text-white';
      case 'Launches':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCalendarUrls = () => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    
    // Format dates for calendar URLs (YYYYMMDDTHHMMSSZ format)
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Format dates for Outlook (different format)
    const formatDateForOutlook = (date: Date) => {
      return date.toISOString();
    };

    const startDateFormatted = formatDateForCalendar(startDate);
    const endDateFormatted = formatDateForCalendar(endDate);
    const startDateOutlook = formatDateForOutlook(startDate);
    const endDateOutlook = formatDateForOutlook(endDate);
    
    // Create event details
    const eventDetails = {
      title: encodeURIComponent(event.title),
      description: encodeURIComponent(event.description),
      location: encodeURIComponent(event.location),
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      startDateOutlook,
      endDateOutlook
    };

    return {
      teams: `https://teams.microsoft.com/l/meeting/new?subject=${eventDetails.title}&startTime=${eventDetails.startDateOutlook}&endTime=${eventDetails.endDateOutlook}&content=${eventDetails.description}&location=${eventDetails.location}`,
      teamsCalendar: `msteams://teams.microsoft.com/l/meeting/new?subject=${eventDetails.title}&startTime=${eventDetails.startDateOutlook}&endTime=${eventDetails.endDateOutlook}&content=${eventDetails.description}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventDetails.title}&startdt=${eventDetails.startDateOutlook}&enddt=${eventDetails.endDateOutlook}&body=${eventDetails.description}&location=${eventDetails.location}`,
      outlookDesktop: `ms-outlook://calendar/new?subject=${eventDetails.title}&startdt=${eventDetails.startDateOutlook}&enddt=${eventDetails.endDateOutlook}&body=${eventDetails.description}&location=${eventDetails.location}`,
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventDetails.title}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${eventDetails.description}&location=${eventDetails.location}`
    };
  };

  const handleAddToCalendar = (calendarType: 'teams' | 'teamsCalendar' | 'outlook' | 'outlookDesktop' | 'google' = 'teams') => {
    const urls = getCalendarUrls();
    
    // For Teams app and Outlook desktop, try the app protocol first, then fallback to web
    if (calendarType === 'teamsCalendar') {
      // Try to open Teams app first
      window.location.href = urls.teamsCalendar;
      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(urls.teams, '_blank');
      }, 1000);
    } else if (calendarType === 'outlookDesktop') {
      // Try to open Outlook desktop app first
      window.location.href = urls.outlookDesktop;
      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(urls.outlook, '_blank');
      }, 1000);
    } else {
      window.open(urls[calendarType], '_blank');
    }
    
    setShowCalendarOptions(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Optional: Analytics
    console.log(`Opening ${calendarType} calendar for event:`, event.title);
  };

  const handleShareEvent = () => {
    // Handle share event logic here
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div 
        ref={modalRef} 
        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] shadow-2xl transform transition-all duration-300 animate-fadeIn mx-4"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#FB5535] via-[#1A2E6E] to-[#030F35] text-white p-6">
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          <div className="pr-12">
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Event Details */}
          <div className="space-y-4 mb-6">
            {/* Date */}
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-[#1A2E6E]" />
              <span className="font-medium">{formatDate(event.start)}</span>
            </div>

            {/* Time */}
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-3 text-[#1A2E6E]" />
              <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
            </div>

            {/* Location */}
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-[#1A2E6E]" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#030F35] mb-3">About this event</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#030F35] mb-3">Event Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>Open to all DQ team members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                <span>Teams meeting link will be generated automatically</span>
              </div>
              {event.category === 'Training' && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Training materials will be shared before the session</span>
                </div>
              )}
              {event.category === 'Client' && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Client attendees will receive separate invitations</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Add to Calendar Dropdown */}
            <div className="flex-1 relative">
              <div className="flex">
                <button
                  onClick={() => handleAddToCalendar('teamsCalendar')}
                  className="flex-1 bg-[#FB5535] text-white py-3 px-4 rounded-l-lg hover:bg-[#FB5535]/90 transition-colors duration-300 font-medium flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Teams Calendar
                </button>
                <button
                  onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                  className="bg-[#FB5535] text-white py-3 px-2 rounded-r-lg hover:bg-[#FB5535]/90 transition-colors duration-300 border-l border-[#FB5535]/20"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCalendarOptions ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Calendar Options Dropdown */}
              {showCalendarOptions && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                  <button
                    onClick={() => handleAddToCalendar('teamsCalendar')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors"
                  >
                    <div className="w-4 h-4 mr-3 bg-[#6264A7] rounded"></div>
                    <div>
                      <div className="font-medium">Teams App</div>
                      <div className="text-xs text-gray-500">Open in Teams desktop app</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddToCalendar('teams')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
                  >
                    <div className="w-4 h-4 mr-3 bg-[#6264A7] rounded"></div>
                    <div>
                      <div className="font-medium">Teams Web</div>
                      <div className="text-xs text-gray-500">Open in web browser</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddToCalendar('outlookDesktop')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
                  >
                    <div className="w-4 h-4 mr-3 bg-[#0078D4] rounded"></div>
                    <div>
                      <div className="font-medium">Outlook App</div>
                      <div className="text-xs text-gray-500">Open in Outlook desktop app</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddToCalendar('outlook')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
                  >
                    <div className="w-4 h-4 mr-3 bg-[#0078D4] rounded"></div>
                    <div>
                      <div className="font-medium">Outlook Web</div>
                      <div className="text-xs text-gray-500">Open in web browser</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddToCalendar('google')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
                  >
                    <div className="w-4 h-4 mr-3 bg-[#4285F4] rounded"></div>
                    <div>
                      <div className="font-medium">Google Calendar</div>
                      <div className="text-xs text-gray-500">Open in web browser</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={handleShareEvent}
              className="flex-1 border border-[#1A2E6E] text-[#1A2E6E] py-3 px-4 rounded-lg hover:bg-[#1A2E6E] hover:text-white transition-colors duration-300 font-medium flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Calendar event created successfully!</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}