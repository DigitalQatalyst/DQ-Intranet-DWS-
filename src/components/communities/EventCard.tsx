import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

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

interface EventCardProps {
  event: CommunityEvent;
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
        className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
          isPast ? 'opacity-75' : ''
        }`}
      >
        {/* Date Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border-2 ${
              isUpcoming
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div
              className={`text-xs font-semibold uppercase ${
                isUpcoming ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {format(eventDate, 'MMM')}
            </div>
            <div
              className={`text-2xl font-bold ${
                isUpcoming ? 'text-blue-700' : 'text-gray-700'
              }`}
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
              className={`h-4 w-4 ${
                isUpcoming ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {event.event_time && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock
                className={`h-4 w-4 ${
                  isUpcoming ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span>{event.event_time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin
                className={`h-4 w-4 ${
                  isUpcoming ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span className="truncate" title={event.location}>
                {event.location}
              </span>
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
          <button
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isUpcoming
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={(e) => {
              e.preventDefault();
              // Navigation handled by Link
            }}
          >
            {isUpcoming ? 'View Details' : 'View Event'}
          </button>
        </div>
      </div>
    </Link>
  );
}
