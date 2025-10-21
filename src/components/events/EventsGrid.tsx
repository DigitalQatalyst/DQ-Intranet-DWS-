import React from 'react';
import EventCard from './EventCard';

interface Props {
  items: any[];
  onClickEvent: (event: any) => void;
}

export const EventsGrid: React.FC<Props> = ({ items, onClickEvent }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((event, i) => (
        <EventCard key={event.id || i} event={event} onClick={() => onClickEvent(event)} />
      ))}
    </div>
  );
};

export default EventsGrid;
