import React from 'react';
import { EventCard } from './EventCard';
import { Calendar, AlertCircle } from 'lucide-react';

interface CommunityEvent {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface EventListProps {
  events: CommunityEvent[];
  loading?: boolean;
  emptyMessage?: string;
  onCreateEvent?: () => void;
  showCreateButton?: boolean;
}

export function EventList({
  events,
  loading = false,
  emptyMessage = 'No events yet',
  onCreateEvent,
  showCreateButton = false,
}: EventListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          {showCreateButton && onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors mt-4"
            >
              Create Event
            </button>
          )}
        </div>
      </div>
    );
  }

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    if (event.event_time) {
      const [hours, minutes] = event.event_time.split(':').map(Number);
      eventDate.setHours(hours || 0, minutes || 0, 0, 0);
    }
    return eventDate >= now;
  });
  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    if (event.event_time) {
      const [hours, minutes] = event.event_time.split(':').map(Number);
      eventDate.setHours(hours || 0, minutes || 0, 0, 0);
    }
    return eventDate < now;
  });

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Past Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}

      {/* No events message if both are empty */}
      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            {showCreateButton && onCreateEvent && (
              <button
                onClick={onCreateEvent}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors mt-4"
              >
                Create Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
