import React, { useState, Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from './index';
import { EventCard } from './EventCard';
type CalendarViewProps = {
  events: Event[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  filteredEvents: Event[];
};
export function CalendarView({
  events,
  selectedDate,
  setSelectedDate,
  filteredEvents
}: CalendarViewProps) {
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');
  // Handle date click in calendar
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
  };
  // Format events for FullCalendar
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: getCategoryColor(event.category),
    borderColor: getCategoryColor(event.category),
    textColor: '#FFFFFF',
    extendedProps: {
      category: event.category,
      description: event.description,
      location: event.location
    }
  }));
  // Get color based on category
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'Internal':
        return '#1A2E6E';
      case 'Client':
        return '#FB5535';
      case 'Training':
        return '#4CAF50';
      case 'Launches':
        return '#9C27B0';
      default:
        return '#1A2E6E';
    }
  }
  // Filter events for selected date
  const selectedDateEvents = selectedDate ? filteredEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() === selectedDate.getDate() && eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
  }) : [];
  return <div>
      {/* Calendar View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setCalendarView('dayGridMonth')} className={`px-3 py-1 text-sm rounded-md ${calendarView === 'dayGridMonth' ? 'bg-white text-[#030F35] shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
            Month
          </button>
          <button onClick={() => setCalendarView('timeGridWeek')} className={`px-3 py-1 text-sm rounded-md ${calendarView === 'timeGridWeek' ? 'bg-white text-[#030F35] shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
            Week
          </button>
        </div>
      </div>
      {/* Calendar Component */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView={calendarView} headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: ''
      }} events={formattedEvents} dateClick={handleDateClick} eventClick={info => {
        setSelectedDate(info.event.start || null);
      }} height="auto" aspectRatio={1.8} dayMaxEvents={3} eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      }}
      // Custom styling
      eventClassNames="rounded-md overflow-hidden" dayCellClassNames="hover:bg-gray-50"
      // Highlight today
      dayCellDidMount={info => {
        if (info.isToday) {
          info.el.classList.add('bg-[#FB5535]/5');
        }
      }} />
      </div>
      {/* Selected Date Events */}
      {selectedDate && <div>
          <h3 className="text-xl font-semibold text-[#030F35] mb-4">
            Events for{' '}
            {selectedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
          </h3>
          {selectedDateEvents.length === 0 ? <p className="text-gray-500 bg-white p-4 rounded-lg">
              No events scheduled for this date.
            </p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDateEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>}
        </div>}
    </div>;
}