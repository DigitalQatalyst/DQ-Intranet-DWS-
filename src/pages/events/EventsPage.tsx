import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CourseCardSkeleton } from '../../components/SkeletonLoader';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import EventsFilters, { EventsFacets } from '../../components/events/EventsFilters';
import EventsGrid from '../../components/events/EventsGrid';
import { mockEvents } from '../../utils/mockDataEvents';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();

  // Items & filters state
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [facets, setFacets] = useState<EventsFacets>({});
  const [queryParams, setQueryParams] = useState(() => 
    new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  );

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load events data
  useEffect(() => {
    setLoading(true);
    
    // Using mock data directly
    const eventsData = mockEvents;
    
    // Apply filters based on query params
    let filtered = [...eventsData];
    
    // Filter by search query
    const searchQuery = queryParams.get('q') || '';
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    const categories = (queryParams.get('category') || '').split(',').filter(Boolean);
    if (categories.length > 0) {
      filtered = filtered.filter(event => categories.includes(event.category));
    }

    // Filter by month
    const months = (queryParams.get('month') || '').split(',').filter(Boolean);
    if (months.length > 0) {
      filtered = filtered.filter(event => {
        const eventMonth = new Date(event.start).toLocaleString('en-US', { month: 'long' });
        return months.includes(eventMonth);
      });
    }

    // Filter by location type
    const locationTypes = (queryParams.get('location') || '').split(',').filter(Boolean);
    if (locationTypes.length > 0) {
      filtered = filtered.filter(event => {
        const location = event.location.toLowerCase();
        return locationTypes.some(type => {
          if (type === 'virtual') return location.includes('zoom') || location.includes('teams') || location.includes('virtual');
          if (type === 'hybrid') return location.includes('+');
          if (type === 'in-person') return !location.includes('zoom') && !location.includes('teams') && !location.includes('virtual') && !location.includes('+');
          return false;
        });
      });
    }

    // Sort by date
    const sort = queryParams.get('sort') || 'date';
    if (sort === 'date') {
      filtered.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setItems(eventsData);
    setFilteredItems(filtered);

    // Compute facets from all events (not just filtered)
    const categoryMap = new Map<string, number>();
    const monthMap = new Map<string, number>();
    const locationMap = new Map<string, number>();

    eventsData.forEach(event => {
      // Category facets
      if (event.category) {
        categoryMap.set(event.category, (categoryMap.get(event.category) || 0) + 1);
      }

      // Month facets
      const month = new Date(event.start).toLocaleString('en-US', { month: 'long' });
      monthMap.set(month, (monthMap.get(month) || 0) + 1);

      // Location type facets
      const location = event.location.toLowerCase();
      if (location.includes('zoom') || location.includes('teams') || location.includes('virtual')) {
        locationMap.set('virtual', (locationMap.get('virtual') || 0) + 1);
      }
      if (location.includes('+')) {
        locationMap.set('hybrid', (locationMap.get('hybrid') || 0) + 1);
      }
      if (!location.includes('zoom') && !location.includes('teams') && !location.includes('virtual') && !location.includes('+')) {
        locationMap.set('in-person', (locationMap.get('in-person') || 0) + 1);
      }
    });

    setFacets({
      category: Array.from(categoryMap.entries()).map(([id, count]) => ({ id, name: id, count })).sort((a, b) => a.name.localeCompare(b.name)),
      month: Array.from(monthMap.entries()).map(([id, count]) => ({ id, name: id, count })),
      location: Array.from(locationMap.entries()).map(([id, count]) => ({ 
        id, 
        name: id.charAt(0).toUpperCase() + id.slice(1), 
        count 
      })).sort((a, b) => a.name.localeCompare(b.name)),
    });
    
    setLoading(false);
  }, [queryParams]);

  // UI helpers
  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);

  const handleEventClick = (event: any) => {
    // Navigate to event detail page (to be implemented)
    console.log('Event clicked:', event);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Events</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">DQ Events & Calendar</h1>
        <p className="text-gray-600 mb-6">
          Discover upcoming events, training sessions, client meetings, and product launches
        </p>

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={queryParams.get('q') || ''}
              setSearchQuery={(q: string) => {
                const next = new URLSearchParams(queryParams.toString());
                if (q) next.set('q', q); 
                else next.delete('q');
                const qs = next.toString();
                window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                setQueryParams(new URLSearchParams(next.toString()));
              }}
            />
          </div>
          <select
            className="border rounded px-2 py-2"
            aria-label="Sort events"
            value={queryParams.get('sort') || 'date'}
            onChange={(e) => {
              const next = new URLSearchParams(queryParams.toString());
              next.set('sort', e.target.value);
              const qs = next.toString();
              window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
              setQueryParams(new URLSearchParams(next.toString()));
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={toggleFilters} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <EventsFilters 
                    facets={facets} 
                    query={queryParams} 
                    onChange={(next) => {
                      const qs = next.toString();
                      window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                      setQueryParams(new URLSearchParams(next.toString()));
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            <EventsFilters 
              facets={facets} 
              query={queryParams} 
              onChange={(next) => {
                const qs = next.toString();
                window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                setQueryParams(new URLSearchParams(next.toString()));
              }} 
            />
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
              </div>
            ) : (
              <EventsGrid
                items={filteredItems}
                onClickEvent={handleEventClick}
              />
            )}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default EventsPage;
