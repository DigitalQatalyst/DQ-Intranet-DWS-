import React, { useEffect, useState } from 'react';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { FilterPanel } from './FilterPanel';
import { useEventsData } from './useEventsData';
import { CalendarIcon, ListIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: 'Internal' | 'Client' | 'Training' | 'Launches' | 'General' | 'Community';
  description: string;
  location: string;
};

// Interface for Supabase event data
interface SupabaseEventView {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
}

interface EventsTableRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  community_id: string | null;
  created_by: string | null;
  created_at: string;
}

interface PostEventRow {
  id: string;
  title: string;
  content: string | null;
  description?: string | null;
  event_date: string | null;
  event_location: string | null;
  post_type: string;
  community_id: string | null;
  created_by: string | null;
  created_at: string;
  tags?: string[] | null;
}

type SupabaseEvent = SupabaseEventView | EventsTableRow | PostEventRow;

export function DQEventsCalendar() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const { events, loading, error, refetch } = useEventsData();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter events based on search term, selected categories, and selected date
  useEffect(() => {
    let filtered = [...events];
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }
    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategories, selectedDate, events]);
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDate(null);
  };
  // Toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#FB5535] via-[#1A2E6E] to-[#030F35] text-white p-6 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              DQ Events & Calendars
            </h1>
            {/* Refresh button */}
            {!loading && (
              <button
                onClick={refetch}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Refresh events"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
          {/* View Toggle and Filter Toggle for Mobile */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 bg-[#030F35] bg-opacity-30 rounded-lg p-1">
              <button
                onClick={() => setView("list")}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                  view === "list"
                    ? "bg-white text-[#030F35]"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <ListIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">List View</span>
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                  view === "calendar"
                    ? "bg-white text-[#030F35]"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Calendar View</span>
              </button>
            </div>
            <button
              onClick={toggleFilterPanel}
              className="md:hidden flex items-center px-3 py-2 rounded-lg bg-[#030F35] bg-opacity-30 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-[#1A2E6E] animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 font-semibold mb-2">
                  Failed to load events
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Panel - Hidden on mobile until toggled */}
            <div
              className={`md:w-1/4 ${
                isFilterOpen ? "block" : "hidden"
              } md:block`}
            >
              <FilterPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategories={selectedCategories}
                handleCategorySelect={handleCategorySelect}
                clearFilters={clearFilters}
                toggleFilterPanel={toggleFilterPanel}
              />
            </div>
            {/* Main Content Area */}
            <div className="md:w-3/4 w-full">
              {view === "list" ? (
                <ListView events={filteredEvents} selectedDate={selectedDate} />
              ) : (
                <CalendarView
                  events={events}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  filteredEvents={filteredEvents}
                />
              )}
            </div>
          </div>
        )}
      </main>
      {/* Connection Status */}
      <div className="bg-gray-100 p-4 text-sm text-gray-600 border-t border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <p>
            {loading && "Connecting to database..."}
            {error && !loading && "Connection error"}
            {!loading && !error && `${events.length} events loaded from Supabase`}
          </p>
          {!loading && !error && events.length === 0 && (
            <p className="text-orange-600">No upcoming events found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
// Helper icon component for filters
const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
