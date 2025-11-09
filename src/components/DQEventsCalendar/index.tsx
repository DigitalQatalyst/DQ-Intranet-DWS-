import React, { useEffect, useState } from 'react';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { FilterPanel } from './FilterPanel';
import { mockEvents } from '../../utils/mockDataEvents';
import { CalendarIcon, ListIcon, SearchIcon, XIcon } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { supabaseClient } from '../../lib/supabaseClient';

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
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let data: SupabaseEvent[] | null = null;
        let error: any = null;

        // Strategy 1: Try to fetch from upcoming_events view first
        try {
          const viewQuery = await supabaseClient
            .from("upcoming_events")
            .select("*")
            .order("start_time", { ascending: true });

          if (!viewQuery.error && viewQuery.data && viewQuery.data.length > 0) {
            data = viewQuery.data;
            console.log("Fetched events from upcoming_events view");
          } else {
            throw new Error("View not available or empty");
          }
        } catch (viewError) {
          // Strategy 2: Try events table
          try {
            const today = new Date().toISOString().split('T')[0];
            const tableQuery = await supabaseClient
              .from("events")
              .select("*")
              .gte("event_date", today)
              .order("event_date", { ascending: true })
              .order("event_time", { ascending: true });

            if (!tableQuery.error && tableQuery.data) {
              data = tableQuery.data;
              console.log("Fetched events from events table");
            } else {
              throw tableQuery.error || new Error("Events table query failed");
            }
          } catch (tableError) {
            // Strategy 3: Try posts table with simple query for RLS compatibility
            error = tableError;
            try {
              const now = new Date().toISOString();
              // Simple query without joins to work with RLS policy
              const postsQuery = await supabaseClient
                .from("posts")
                .select("id, title, content, event_date, event_location, post_type, community_id, created_by, created_at, tags, status")
                .eq("post_type", "event")
                .eq("status", "active") // Required for RLS policy
                .not("event_date", "is", null)
                .gte("event_date", now)
                .order("event_date", { ascending: true });

              if (!postsQuery.error && postsQuery.data) {
                data = postsQuery.data.map((post: any) => ({
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  description: post.content,
                  event_date: post.event_date,
                  event_location: post.event_location,
                  post_type: post.post_type,
                  community_id: post.community_id,
                  created_by: post.created_by,
                  created_at: post.created_at,
                  tags: post.tags,
                })) as PostEventRow[];
                error = null;
                console.log("Fetched events from posts table");
              } else {
                throw postsQuery.error || new Error("Posts table query failed");
              }
            } catch (postsError: any) {
              if (postsError?.code === '42501') {
                console.warn("Permission denied accessing posts table. Using mock data as fallback.");
                // Don't set error for permission issues - allow mock data fallback
                error = null;
                data = null;
              } else {
                error = postsError;
                console.error("Error fetching events from posts table:", postsError);
              }
            }
          }
        }

        if (data && data.length > 0) {
          const transformedEvents: Event[] = data.map((event) => {
            const isViewEvent = 'start_time' in event && 'end_time' in event;
            const isPostEvent = 'post_type' in event && event.post_type === 'event';
            
            let startDate: Date;
            let endDate: Date;
            let category: string;
            let location: string;
            let description: string;

            if (isViewEvent) {
              startDate = new Date((event as SupabaseEventView).start_time);
              endDate = new Date((event as SupabaseEventView).end_time);
              category = (event as SupabaseEventView).category || "General";
              location = (event as SupabaseEventView).location || "TBA";
              description = (event as SupabaseEventView).description || "";
            } else if (isPostEvent) {
              const postEvent = event as PostEventRow;
              if (postEvent.event_date) {
                startDate = new Date(postEvent.event_date);
              } else {
                startDate = new Date(postEvent.created_at);
              }
              endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
              category = postEvent.community_id ? "Community" : "General";
              location = postEvent.event_location || "TBA";
              description = postEvent.content || postEvent.description || "";
            } else {
              const tableEvent = event as EventsTableRow;
              const eventDate = tableEvent.event_date;
              const eventTime = tableEvent.event_time || "00:00:00";
              const dateTimeString = `${eventDate}T${eventTime}`;
              startDate = new Date(dateTimeString);
              endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
              category = tableEvent.community_id ? "Community" : "General";
              location = "TBA";
              description = tableEvent.description || "";
            }

            return {
              id: event.id,
              title: event.title,
              description,
              start: startDate,
              end: endDate,
              category: category as Event['category'],
              location,
            };
          });

          setEvents(transformedEvents);
          setFilteredEvents(transformedEvents);
        } else {
          // Fallback to mock data if no events found
          console.log("No events found, using mock data");
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to mock data on error
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-600">Loading events...</div>
              </div>
            ) : (
              view === 'list' ? (
                <ListView events={filteredEvents} selectedDate={selectedDate} />
              ) : (
                <CalendarView events={events} selectedDate={selectedDate} setSelectedDate={setSelectedDate} filteredEvents={filteredEvents} />
              )
            )}
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