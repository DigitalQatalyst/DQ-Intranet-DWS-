import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from './index';
import { supabaseClient } from '../../lib/supabaseClient';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  Share2,
  ChevronDown,
  UserPlus,
  Loader2,
  AlertCircle,
  User
} from 'lucide-react';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  location_filter: string | null;
  organizer_name: string | null;
  organizer_email: string | null;
  meeting_link: string | null;
  is_virtual: boolean;
  is_all_day: boolean;
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  image_url: string | null;
  tags: string[] | null;
  department: string | null;
  metadata: any | null;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details from Supabase when modal opens
  useEffect(() => {
    const fetchEventDetails = async () => {
      // Reset state when modal closes
      if (!isOpen) {
        setEventDetails(null);
        setError(null);
        setLoading(false);
        return;
      }

      // Validate event and event ID
      if (!event || !event.id) {
        console.warn('EventDetailsModal: No event or event.id provided', { event });
        setError('Error occurred fetching event details. Please try again later.');
        setEventDetails(null);
        setLoading(false);
        return;
      }

      console.log('EventDetailsModal: Starting fetch for event ID:', event.id, 'Event object:', event);
      setLoading(true);
      setError(null);
      setEventDetails(null); // Clear any previous data

      try {
        console.log('EventDetailsModal: Querying Supabase events_v2 table for event ID:', event.id);
        const query = supabaseClient
          .from('events_v2')
          .select('*')
          .eq('id', event.id as any)
          .eq('status', 'published' as any)
          .single();
        
        console.log('EventDetailsModal: Query object:', query);
        
        const { data, error: fetchError } = await query;

        console.log('EventDetailsModal: Supabase response received:', { 
          hasData: !!data, 
          dataKeys: data ? Object.keys(data) : null,
          error: fetchError,
          errorCode: fetchError?.code,
          errorMessage: fetchError?.message
        });

        if (fetchError) {
          console.error('EventDetailsModal: Supabase error:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.warn('EventDetailsModal: No data returned for event ID:', event.id);
          throw new Error('Event not found');
        }

        console.log('EventDetailsModal: Successfully fetched event details:', data);
        setEventDetails(data as unknown as EventDetails);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error('EventDetailsModal: Error fetching event details:', err);
        setError('Error occurred fetching event details. Please try again later.');
        // Do not set fallback data - only show error message
        setEventDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [isOpen, event?.id]);

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

  // Only use fetched event details from backend - no fallback data
  const displayEvent = eventDetails;

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Extract speakers from metadata if available
  const getSpeakers = (): string[] => {
    if (!displayEvent || !displayEvent.metadata) return [];
    
    // Check for speakers in various possible formats
    if (displayEvent.metadata.speakers && Array.isArray(displayEvent.metadata.speakers)) {
      return displayEvent.metadata.speakers.map((s: any) => 
        typeof s === 'string' ? s : (s.name || s.speakerName || s.full_name || '')
      ).filter(Boolean);
    }
    
    if (displayEvent.metadata.speaker) {
      return [displayEvent.metadata.speaker];
    }
    
    return [];
  };

  const speakers = displayEvent ? getSpeakers() : [];

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
    if (!displayEvent) return null;
    
    const startDate = new Date(displayEvent.start_time);
    const endDate = new Date(displayEvent.end_time);
    
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
      title: encodeURIComponent(displayEvent.title),
      description: encodeURIComponent(displayEvent.description || ''),
      location: encodeURIComponent(displayEvent.location_filter || displayEvent.location || ''),
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
    if (!displayEvent) return;
    
    const urls = getCalendarUrls();
    if (!urls) return;
    
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
    console.log(`Opening ${calendarType} calendar for event:`, displayEvent.title);
  };

  const handleShareEvent = () => {
    if (!displayEvent) return;
    
    // Handle share event logic here
    if (navigator.share) {
      navigator.share({
        title: displayEvent.title,
        text: displayEvent.description || '',
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRegister = () => {
    // Navigate to event details page where registration form is available
    // Add query parameter to auto-open registration form
    if (displayEvent?.id) {
      onClose(); // Close the modal first
      navigate(`/marketplace/events/${displayEvent.id}?register=true`);
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
            {displayEvent && (
              <>
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(displayEvent.category)}`}>
                    {displayEvent.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{displayEvent.title}</h2>
              </>
            )}
            {!displayEvent && !loading && (
              <h2 className="text-2xl font-bold mb-2">Event Details</h2>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#1A2E6E] animate-spin mb-4" />
              <p className="text-gray-600">Loading event details...</p>
            </div>
          )}

          {/* Error State */}
          {error && !eventDetails && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Unable to Load Event Details</h3>
                  <p className="text-red-700 text-sm mb-2">{error}</p>
                  {event?.id && (
                    <p className="text-red-600 text-xs mt-2">
                      Attempted to fetch event ID: <code className="bg-red-100 px-1 rounded">{event.id}</code>
                    </p>
                  )}
                  <p className="text-red-600 text-xs mt-1">
                    Please check your browser console for more details or try refreshing the page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Event Details - Only show if we have data from backend */}
          {!loading && eventDetails && displayEvent && (
            <>
              {/* Event Details */}
              <div className="space-y-4 mb-6">
                {/* Date */}
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                  <span className="font-medium">{formatDate(displayEvent.start_time)}</span>
                </div>

                {/* Time */}
                {!displayEvent.is_all_day && (
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                    <span>{formatTime(displayEvent.start_time)} - {formatTime(displayEvent.end_time)}</span>
                  </div>
                )}
                {displayEvent.is_all_day && (
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                    <span>All Day Event</span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                  <span>
                    {displayEvent.location_filter || displayEvent.location || 'Location TBA'}
                    {displayEvent.location_filter && displayEvent.location && displayEvent.location !== displayEvent.location_filter && (
                      <span className="text-gray-500 text-sm ml-2">({displayEvent.location})</span>
                    )}
                  </span>
                </div>

                {/* Virtual/Meeting Link */}
                {displayEvent.is_virtual && displayEvent.meeting_link && (
                  <div className="flex items-center text-gray-700">
                    <ExternalLink className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                    <a 
                      href={displayEvent.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Join Online Meeting
                    </a>
                  </div>
                )}

                {/* Organizer */}
                {displayEvent.organizer_name && (
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                    <div>
                      <span className="font-medium">Organized by: </span>
                      <span>{displayEvent.organizer_name}</span>
                      {displayEvent.organizer_email && (
                        <a 
                          href={`mailto:${displayEvent.organizer_email}`}
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          ({displayEvent.organizer_email})
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Department */}
                {displayEvent.department && (
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-[#1A2E6E]" />
                    <span>{displayEvent.department}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {displayEvent.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#030F35] mb-3">About this event</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{displayEvent.description}</p>
                </div>
              )}

              {/* Speakers */}
              {speakers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#030F35] mb-3">Speakers</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {speakers.map((speaker, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <User className="w-4 h-4 mr-2 text-[#1A2E6E]" />
                          <span>{speaker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#030F35] mb-3">Event Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {displayEvent.max_attendees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Capacity: {displayEvent.max_attendees} attendees</span>
                    </div>
                  )}
                  
                  {displayEvent.registration_required ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Registration required</span>
                      {displayEvent.registration_deadline && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Deadline: {new Date(displayEvent.registration_deadline).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Open to all DQ team members</span>
                    </div>
                  )}

                  {displayEvent.is_virtual && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Virtual event - Join online</span>
                    </div>
                  )}

                  {displayEvent.category === 'Training' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Training materials will be shared before the session</span>
                    </div>
                  )}

                  {displayEvent.category === 'Client' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Client attendees will receive separate invitations</span>
                    </div>
                  )}

                  {/* Tags */}
                  {displayEvent.tags && displayEvent.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                      <span className="font-medium">Tags:</span>
                      {displayEvent.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white rounded-full text-xs border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={!displayEvent}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium flex items-center justify-center shadow-md ${
                displayEvent
                  ? 'bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] text-white hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register Now
            </button>
            
            {/* Add to Calendar Dropdown */}
            <div className="flex-1 relative">
              <div className="flex">
                <button
                  onClick={() => handleAddToCalendar('teamsCalendar')}
                  disabled={!displayEvent}
                  className={`flex-1 py-3 px-4 rounded-l-lg transition-colors duration-300 font-medium flex items-center justify-center ${
                    displayEvent
                      ? 'bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] text-white hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Teams Calendar
                </button>
                <button
                  onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                  disabled={!displayEvent}
                  className={`py-3 px-2 rounded-r-lg transition-colors duration-300 border-l ${
                    displayEvent
                      ? 'bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] text-white hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A] border-[#1A2E6E]/20'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                  }`}
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
              disabled={!displayEvent}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center ${
                displayEvent
                  ? 'border border-[#1A2E6E] text-[#1A2E6E] hover:bg-[#1A2E6E] hover:text-white'
                  : 'border border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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

      <style>{`
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