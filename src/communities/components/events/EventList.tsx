import React from 'react';
import { EventCard } from './EventCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';

interface Event {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  created_by: string | null;
  created_at: string;
}

interface EventListProps {
  events: Event[];
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
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
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
            <Button
              onClick={onCreateEvent}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= now
  );
  const pastEvents = events.filter(
    (event) => new Date(event.event_date) < now
  );

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
    </div>
  );
}
