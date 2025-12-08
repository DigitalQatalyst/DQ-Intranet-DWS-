import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { SearchBar } from '@/communities/components/communities/SearchBar';
import { FilterSidebar, FilterConfig } from '@/communities/components/communities/FilterSidebar';
import { MarketplaceEventCard } from '@/components/events/MarketplaceEventCard';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/communities/components/ui/button';
import { HomeIcon, ChevronRightIcon, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/communities/components/ui/sheet';

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: string;
  location: string;
  image_url?: string | null;
  department?: string | null;
  registration_count?: number;
  capacity?: number | null;
}

export default function EventsMarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Fetch filter options
  useEffect(() => {
    setFilterConfig([
      {
        id: 'department',
        title: 'Department',
        options: [
          { id: 'hra-people', name: 'HRA (People)' },
          { id: 'finance', name: 'Finance' },
          { id: 'deals', name: 'Deals' },
          { id: 'stories', name: 'Stories' },
          { id: 'intelligence', name: 'Intelligence' },
          { id: 'solutions', name: 'Solutions' },
          { id: 'secdevops', name: 'SecDevOps' },
          { id: 'products', name: 'Products' },
          { id: 'delivery-deploys', name: 'Delivery — Deploys' },
          { id: 'delivery-designs', name: 'Delivery — Designs' },
          { id: 'dco-operations', name: 'DCO Operations' },
          { id: 'dbp-platform', name: 'DBP Platform' },
          { id: 'dbp-delivery', name: 'DBP Delivery' }
        ]
      },
      {
        id: 'location',
        title: 'Location',
        options: [
          { id: 'dubai', name: 'Dubai' },
          { id: 'nairobi', name: 'Nairobi' },
          { id: 'riyadh', name: 'Riyadh' },
          { id: 'remote', name: 'Remote' }
        ]
      },
      {
        id: 'category',
        title: 'Event Type',
        options: [
          { id: 'internal', name: 'Internal' },
          { id: 'client', name: 'Client' },
          { id: 'training', name: 'Training' },
          { id: 'launches', name: 'Launches' },
          { id: 'community', name: 'Community Event' }
        ]
      },
      {
        id: 'timeRange',
        title: 'Time Range',
        options: [
          { id: 'today', name: 'Today' },
          { id: 'this-week', name: 'This Week' },
          { id: 'this-month', name: 'This Month' },
          { id: 'next-month', name: 'Next Month' },
          { id: 'upcoming', name: 'Upcoming' }
        ]
      },
      {
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: [
          { id: 'in-person', name: 'In-Person' },
          { id: 'virtual', name: 'Virtual' },
          { id: 'hybrid', name: 'Hybrid' }
        ]
      },
      {
        id: 'duration',
        title: 'Duration Band',
        options: [
          { id: 'short', name: 'Short (< 2 hours)' },
          { id: 'medium', name: 'Medium (2-4 hours)' },
          { id: 'long', name: 'Long (4+ hours)' },
          { id: 'multi-day', name: 'Multi-day' }
        ]
      }
    ]);
  }, []);

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, filters]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch events ONLY from events_v2 table
      // Start with base query - only filter by status, allow past events too for now
      let eventsQuery = supabase
        .from('events_v2')
        .select('*')
        .order('start_time', { ascending: true });
      
      // Only filter by published status if we want to be strict
      // For debugging, let's see all events first
      eventsQuery = eventsQuery.eq('status', 'published');
      
      // Apply time range filter if specified
      if (filters.timeRange) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const monthEnd = new Date(today);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        const nextMonthEnd = new Date(today);
        nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 2);
        
        switch (filters.timeRange) {
          case 'today':
            eventsQuery = eventsQuery.gte('start_time', today.toISOString())
              .lt('start_time', tomorrow.toISOString());
            break;
          case 'this-week':
            eventsQuery = eventsQuery.gte('start_time', today.toISOString())
              .lt('start_time', weekEnd.toISOString());
            break;
          case 'this-month':
            eventsQuery = eventsQuery.gte('start_time', today.toISOString())
              .lt('start_time', monthEnd.toISOString());
            break;
          case 'next-month':
            eventsQuery = eventsQuery.gte('start_time', monthEnd.toISOString())
              .lt('start_time', nextMonthEnd.toISOString());
            break;
          case 'upcoming':
            // Show all future events
            eventsQuery = eventsQuery.gte('start_time', now.toISOString());
            break;
        }
      } else {
        // Default: show upcoming events (start_time >= now)
        // But also include events from the last 7 days in case of timezone issues
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        eventsQuery = eventsQuery.gte('start_time', sevenDaysAgo.toISOString());
      }

      // Apply search filter (search in title, description, category, and location)
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        eventsQuery = eventsQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      // Apply category filter
      if (filters.category) {
        eventsQuery = eventsQuery.eq('category', filters.category);
      }

      // Apply department filter
      if (filters.department) {
        eventsQuery = eventsQuery.eq('department', filters.department);
      }

      // Apply location filter
      if (filters.location) {
        eventsQuery = eventsQuery.eq('location_filter', filters.location);
      }

      // Apply delivery mode filter
      if (filters.deliveryMode) {
        if (filters.deliveryMode === 'virtual') {
          eventsQuery = eventsQuery.eq('is_virtual', true);
        } else if (filters.deliveryMode === 'in-person') {
          eventsQuery = eventsQuery.eq('is_virtual', false);
        }
        // Hybrid would need additional logic or metadata field
      }

      const { data: eventsData, error: eventsError } = await eventsQuery.limit(100);

      if (eventsError) {
        console.error('Supabase query error:', eventsError);
        throw eventsError;
      }

      console.log('Fetched events from events_v2:', eventsData?.length || 0, eventsData);

      // Transform events_v2 data only
      const transformedEvents: Event[] = [];

      if (eventsData && eventsData.length > 0) {
        eventsData.forEach((event) => {
          transformedEvents.push({
            id: event.id,
            title: event.title,
            description: event.description || '',
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            category: event.category || 'General',
            location: event.location || 'TBA',
            image_url: event.image_url,
            department: event.department,
            registration_count: event.registration_count || 0,
            capacity: event.max_attendees,
          });
        });
      } else {
        console.warn('No events found in events_v2 table with current filters');
      }

      // Events are already sorted by start_time from the query
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      setError(error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterType] === value) {
        delete newFilters[filterType];
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleEventClick = (event: Event) => {
    navigate(`/marketplace/events/detailsPage?id=${event.id}`);
  };

  const handleEventRegister = (event: Event) => {
    navigate(`/marketplace/events/detailsPage?id=${event.id}`);
  };

  if (authLoading) {
    return (
      <MainLayout hidePageLayout fullWidth>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="DQ Work Communities"
      subtitle="Find and join communities to connect with other associates within the organization."
      fullWidth={false}
      hidePageLayout={true}
    >
      <div className="max-w-7xl mx-auto pl-0 pr-1 sm:pl-0 sm:pr-2 lg:pl-0 lg:pr-3 pt-2 pb-6">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 min-h-[24px]" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                aria-label="Navigate to Home"
              >
                <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                <Link 
                  to="/dq-comms?tab=events" 
                  className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors"
                  aria-label="Navigate to DQ Work Communities"
                >
                  DQ Work Communities
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center min-w-[80px]">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">Events</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            DQ Work Communities
          </h1>
          <p className="text-gray-600 mb-6">
            Find and join communities to connect with other associates within the organization.
          </p>
          
          {/* Current Focus Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 min-h-[140px]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase text-gray-500 font-medium mb-2">CURRENT FOCUS</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Events</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Stay up to date with upcoming events, workshops, and team gatherings. Explore activities within DQ that encourage collaboration, growth, and innovation.
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0">
                Tab overview
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => navigate('/dq-comms?tab=discussion')}
                className="py-4 px-4 text-sm transition-colors border-b border-transparent text-gray-500 hover:text-gray-700 font-normal"
              >
                Discussion
              </button>
              <button
                onClick={() => navigate('/dq-comms?tab=pulse')}
                className="py-4 px-4 text-sm transition-colors border-b border-transparent text-gray-500 hover:text-gray-700 font-normal"
              >
                Pulse
              </button>
              <button
                onClick={() => navigate('/dq-comms?tab=events')}
                className="py-4 px-4 text-sm transition-colors border-b border-blue-600 text-gray-900 font-medium"
              >
                Events
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 -ml-0 -mr-1 sm:-mr-2 lg:-mr-3">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search events by title, description, category, or location..." 
          />
        </div>

        {/* Main Content Area with Filters and Cards */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                )}
              </div>
              <FilterSidebar
                filters={filters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <div className="lg:hidden mb-4">
            <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {Object.keys(filters).length > 0 && (
                    <span className="ml-2 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  filterConfig={filterConfig}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  isResponsive={true}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Content Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                {error.message}
                <Button variant="secondary" size="sm" onClick={fetchEvents} className="ml-4">
                  Retry
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 mb-4">No events found</p>
                <Button onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Available Items Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                    Available Items ({events.length})
                  </h2>
                  <div className="text-sm text-gray-500 hidden sm:block">
                    Showing {events.length} of {events.length} items
                  </div>
                  {/* Mobile-friendly header */}
                  <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                    {events.length} Items Available
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <MarketplaceEventCard
                      key={event.id}
                      item={event}
                      onViewDetails={() => handleEventClick(event)}
                      onRegister={() => handleEventRegister(event)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

