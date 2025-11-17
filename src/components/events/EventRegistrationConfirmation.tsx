import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Mail, Download } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface EventRegistrationConfirmationProps {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  registrationData: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  onClose: () => void;
}

export const EventRegistrationConfirmation: React.FC<EventRegistrationConfirmationProps> = ({
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  registrationData,
  onClose,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCalendarUrls = () => {
    if (!eventDate) return null;

    const startDate = new Date(eventDate);
    const endDate = eventTime
      ? new Date(`${eventDate.split('T')[0]}T${eventTime}`)
      : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const formatDateForOutlook = (date: Date) => {
      return date.toISOString();
    };

    const startDateFormatted = formatDateForCalendar(startDate);
    const endDateFormatted = formatDateForCalendar(endDate);
    const startDateOutlook = formatDateForOutlook(startDate);
    const endDateOutlook = formatDateForOutlook(endDate);

    const eventDetails = {
      title: encodeURIComponent(eventTitle),
      description: encodeURIComponent(`Event registration confirmed for ${registrationData.fullName}`),
      location: encodeURIComponent(eventLocation || 'TBA'),
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      startDateOutlook,
      endDateOutlook,
    };

    return {
      teams: `https://teams.microsoft.com/l/meeting/new?subject=${eventDetails.title}&startTime=${eventDetails.startDateOutlook}&endTime=${eventDetails.endDateOutlook}&content=${eventDetails.description}&location=${eventDetails.location}`,
      teamsCalendar: `msteams://teams.microsoft.com/l/meeting/new?subject=${eventDetails.title}&startTime=${eventDetails.startDateOutlook}&endTime=${eventDetails.endDateOutlook}&content=${eventDetails.description}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventDetails.title}&startdt=${eventDetails.startDateOutlook}&enddt=${eventDetails.endDateOutlook}&body=${eventDetails.description}&location=${eventDetails.location}`,
      outlookDesktop: `ms-outlook://calendar/new?subject=${eventDetails.title}&startdt=${eventDetails.startDateOutlook}&enddt=${eventDetails.endDateOutlook}&body=${eventDetails.description}&location=${eventDetails.location}`,
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventDetails.title}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${eventDetails.description}&location=${eventDetails.location}`,
    };
  };

  const handleAddToCalendar = (calendarType: 'teams' | 'teamsCalendar' | 'outlook' | 'outlookDesktop' | 'google') => {
    const urls = getCalendarUrls();
    if (!urls) return;

    if (calendarType === 'teamsCalendar') {
      window.location.href = urls.teamsCalendar;
      setTimeout(() => {
        window.open(urls.teams, '_blank');
      }, 1000);
    } else if (calendarType === 'outlookDesktop') {
      window.location.href = urls.outlookDesktop;
      setTimeout(() => {
        window.open(urls.outlook, '_blank');
      }, 1000);
    } else {
      window.open(urls[calendarType], '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <CheckCircle size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Registration Confirmed!</h2>
              <p className="text-green-50 mt-1">Thank you for registering</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              <strong>Thank you for registering!</strong> We'll send you an email with your registration details at{' '}
              <strong>{registrationData.email}</strong>.
            </p>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#030F35] mb-4">Event Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Calendar size={20} className="text-[#1A2E6E]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-[#030F35]">{formatDate(eventDate)}</p>
                </div>
              </div>

              {eventTime && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Clock size={20} className="text-[#1A2E6E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-[#030F35]">{formatTime(eventTime)}</p>
                  </div>
                </div>
              )}

              {eventLocation && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin size={20} className="text-[#1A2E6E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-[#030F35]">{eventLocation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Mail size={20} className="text-[#1A2E6E]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event</p>
                  <p className="font-medium text-[#030F35]">{eventTitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-[#030F35] mb-2">Your Registration</h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {registrationData.fullName}
              </p>
              <p>
                <strong>Email:</strong> {registrationData.email}
              </p>
              {registrationData.phoneNumber && (
                <p>
                  <strong>Phone:</strong> {registrationData.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Add to Calendar */}
          {eventDate && (
            <div>
              <h3 className="text-lg font-semibold text-[#030F35] mb-3">Add to Calendar</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleAddToCalendar('teamsCalendar')}
                  className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#6264A7] rounded"></div>
                  <span className="text-xs font-medium text-gray-700">Teams</span>
                </button>
                <button
                  onClick={() => handleAddToCalendar('outlookDesktop')}
                  className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#0078D4] rounded"></div>
                  <span className="text-xs font-medium text-gray-700">Outlook</span>
                </button>
                <button
                  onClick={() => handleAddToCalendar('google')}
                  className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#4285F4] rounded"></div>
                  <span className="text-xs font-medium text-gray-700">Google</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] text-white rounded-lg hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A] transition-all font-medium shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

