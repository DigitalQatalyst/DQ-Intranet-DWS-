import React from 'react';
import { EventCard } from '@/components/events/EventCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';

interface CommunityEvent {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  created_by: string | null;
  created_at: string;
}

interface CommunityEventsListProps {
  events: CommunityEvent[];
  loading?: boolean;
  emptyMessage?: string;
  onCreateEvent?: () => void;
  showCreateButton?: boolean;
}

// Transform community event to EventCard format
function transformEventForCard(event: CommunityEvent) {
  const eventDate = new Date(event.event_date);
  
  // Parse time if available (format: HH:MM:SS or HH:MM)
  let startDate = new Date(eventDate);
  let endDate = new Date(eventDate);
  
  if (event.event_time) {
    const [hours, minutes] = event.event_time.split(':').map(Number);
    startDate.setHours(hours || 0, minutes || 0, 0, 0);
    // Default to 1 hour duration if no end time specified
    endDate.setHours((hours || 0) + 1, minutes || 0, 0, 0);
  } else {
    // Default to 9 AM - 5 PM if no time specified
    startDate.setHours(9, 0, 0, 0);
    endDate.setHours(17, 0, 0, 0);
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    start: startDate,
    end: endDate,
    category: 'Internal' as const, // Default category for community events
    location: '', // Community events don't have location in the schema
  };
}

export function CommunityEventsList({
  events,
  loading = false,
  emptyMessage = 'No events yet',
  onCreateEvent,
  showCreateButton = false,
}: CommunityEventsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-10 w-full" />
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
              className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Filter to only show future events
  const now = new Date();
  const futureEvents = events.filter(
    (event) => {
      const eventDate = new Date(event.event_date);
      // If event has a time, use it; otherwise compare just the date
      if (event.event_time) {
        const [hours, minutes] = event.event_time.split(':').map(Number);
        eventDate.setHours(hours || 0, minutes || 0, 0, 0);
      }
      return eventDate >= now;
    }
  );

  // Sort by date (ascending)
  futureEvents.sort((a, b) => {
    const dateA = new Date(a.event_date);
    const dateB = new Date(b.event_date);
    if (a.event_time) {
      const [hours, minutes] = a.event_time.split(':').map(Number);
      dateA.setHours(hours || 0, minutes || 0, 0, 0);
    }
    if (b.event_time) {
      const [hours, minutes] = b.event_time.split(':').map(Number);
      dateB.setHours(hours || 0, minutes || 0, 0, 0);
    }
    return dateA.getTime() - dateB.getTime();
  });

  if (futureEvents.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No upcoming events
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            There are no upcoming events scheduled for this community.
          </p>
          {showCreateButton && onCreateEvent && (
            <Button
              onClick={onCreateEvent}
              className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {futureEvents.map((event) => (
        <EventCard
          key={event.id}
          event={transformEventForCard(event)}
        />
      ))}
    </div>
  );
}
