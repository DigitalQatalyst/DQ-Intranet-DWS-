import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/communities/components/ui/button';
import { cn } from '@/communities/lib/utils';

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

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export function EventCard({ event, isPast = false }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const isUpcoming = !isPast && eventDate >= new Date();

  return (
    <Link
      to={`/community/${event.community_id}/events/${event.id}`}
      className="block"
    >
      <div
        className={cn(
          'bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200',
          isPast && 'opacity-75'
        )}
      >
        {/* Date Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border-2',
              isUpcoming
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            )}
          >
            <div
              className={cn(
                'text-xs font-semibold uppercase',
                isUpcoming ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              {format(eventDate, 'MMM')}
            </div>
            <div
              className={cn(
                'text-2xl font-bold',
                isUpcoming ? 'text-blue-700' : 'text-gray-700'
              )}
            >
              {format(eventDate, 'd')}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar
              className={cn('h-4 w-4', isUpcoming ? 'text-blue-600' : 'text-gray-400')}
            />
            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {event.event_time && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock
                className={cn('h-4 w-4', isUpcoming ? 'text-blue-600' : 'text-gray-400')}
              />
              <span>{event.event_time}</span>
            </div>
          )}

          {isUpcoming && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mt-2">
              <span>
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant={isUpcoming ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'w-full',
              isUpcoming && 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
            onClick={(e) => {
              e.preventDefault();
              // Handle RSVP or view details
            }}
          >
            {isUpcoming ? 'View Details' : 'View Event'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
