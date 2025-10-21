import React, { useEffect, useState } from 'react';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { FilterPanel } from './FilterPanel';
import { mockEvents } from '../../utils/mockDataEvents';
import { CalendarIcon, ListIcon, SearchIcon, XIcon } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: 'Internal' | 'Client' | 'Training' | 'Launches';
  description: string;
  location: string;
};
export function DQEventsCalendar() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Filter events based on search term, selected categories, and selected date
  useEffect(() => {
    let filtered = [...events];
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event => selectedCategories.includes(event.category));
    }
    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === selectedDate.getDate() && eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
      });
    }
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategories, selectedDate, events]);
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedDate(null);
  };
  // Toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  return <div className="flex flex-col min-h-screen w-full">
      <Header />
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#FB5535] via-[#1A2E6E] to-[#030F35] text-white p-6 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            DQ Events & Calendars
          </h1>
          {/* View Toggle and Filter Toggle for Mobile */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 bg-[#030F35] bg-opacity-30 rounded-lg p-1">
              <button onClick={() => setView('list')} className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${view === 'list' ? 'bg-white text-[#030F35]' : 'text-white hover:bg-white hover:bg-opacity-20'}`}>
                <ListIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">List View</span>
              </button>
              <button onClick={() => setView('calendar')} className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${view === 'calendar' ? 'bg-white text-[#030F35]' : 'text-white hover:bg-white hover:bg-opacity-20'}`}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Calendar View</span>
              </button>
            </div>
            <button onClick={toggleFilterPanel} className="md:hidden flex items-center px-3 py-2 rounded-lg bg-[#030F35] bg-opacity-30 text-white">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel - Hidden on mobile until toggled */}
          <div className={`md:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
            <FilterPanel searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategories={selectedCategories} handleCategorySelect={handleCategorySelect} clearFilters={clearFilters} toggleFilterPanel={toggleFilterPanel} />
          </div>
          {/* Main Content Area */}
          <div className="md:w-3/4 w-full">
            {view === 'list' ? <ListView events={filteredEvents} selectedDate={selectedDate} /> : <CalendarView events={events} selectedDate={selectedDate} setSelectedDate={setSelectedDate} filteredEvents={filteredEvents} />}
          </div>
        </div>
      </main>
      {/* API Integration Note */}
      <div className="bg-gray-100 p-4 text-sm text-gray-600 border-t border-gray-200">
        {/* <div className="container mx-auto">
          <p className="font-medium">API Integration Placeholder</p>
          <p>
            This component is ready to be connected to Google Calendar or
            internal DQ API.
          </p>
        </div> */}
      </div>
      <Footer />
    </div>;
}
// Helper icon component for filters
const FilterIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>;