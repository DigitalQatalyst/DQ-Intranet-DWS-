import React from 'react';
import { Event } from './index';
import { EventCard } from './EventCard';
import { CalendarIcon } from 'lucide-react';
type ListViewProps = {
  events: Event[];
  selectedDate: Date | null;
};
export function ListView({
  events,
  selectedDate
}: ListViewProps) {
  // Format the selected date for display
  const formatSelectedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  return <div>
      {/* Selected Date Header (if any) */}
      {selectedDate && <div className="flex items-center mb-6 p-3 bg-[#030F35]/5 rounded-lg">
          <CalendarIcon className="w-5 h-5 mr-2 text-[#1A2E6E]" />
          <h2 className="text-lg font-medium text-[#030F35]">
            Events for {formatSelectedDate(selectedDate)}
          </h2>
        </div>}
      {/* No Events Message */}
      {events.length === 0 && <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No events found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or selecting a different date
          </p>
        </div>}
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>;
}