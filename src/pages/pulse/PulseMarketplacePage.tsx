import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { SearchBar } from '@/communities/components/communities/SearchBar';
import { FilterSidebar, FilterConfig } from '@/communities/components/communities/FilterSidebar';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/communities/components/ui/button';
import { HomeIcon, ChevronRightIcon, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/communities/components/ui/sheet';
import { MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { PulseCard } from '@/components/pulse/PulseCard';

interface PulseItem {
  id: string;
  title: string;
  description: string | null;
  type: 'poll' | 'survey' | 'feedback';
  status: string;
  department: string | null;
  location_filter: string | null;
  total_responses?: number;
  response_count?: number;
  total_views?: number;
  total_likes?: number;
  image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  closes_at: string | null;
  created_at: string;
  feedback_type?: string | null;
  category?: string | null;
}

export default function PulseMarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State
  const [filteredItems, setFilteredItems] = useState<PulseItem[]>([]);
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
        id: 'type',
        title: 'Type',
        options: [
          { id: 'poll', name: 'Poll' },
          { id: 'survey', name: 'Survey' },
          { id: 'feedback', name: 'Feedback' }
        ]
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { id: 'published', name: 'Active' },
          { id: 'closed', name: 'Closed' }
        ]
      }
    ]);
  }, []);

  // Fetch pulse items
  useEffect(() => {
    fetchPulseItems();
  }, [searchQuery, filters]);

  const fetchPulseItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('pulse_items_with_stats')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      // Apply search filter
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply department filter
      if (filters.department) {
        query = query.eq('department', filters.department);
      }

      // Apply location filter
      if (filters.location) {
        query = query.eq('location_filter', filters.location);
      }

      // Apply type filter
      if (filters.type) {
        query = query.eq('type', filters.type.toLowerCase());
      }

      // Apply status filter
      if (filters.status) {
        if (filters.status === 'Active') {
          query = query.eq('status', 'published');
        } else if (filters.status === 'Closed') {
          query = query.eq('status', 'closed');
        }
      }

      const { data, error: fetchError } = await query.limit(50);

      if (fetchError) throw fetchError;
      setFilteredItems(data || []);
    } catch (error: any) {
      console.error('Error fetching pulse items:', error);
      setError(error);
      toast.error('Failed to load pulse items');
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

  const handleViewPulseItem = (itemId: string) => {
    navigate(`/marketplace/pulse/detailsPage?id=${itemId}`);
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
                  to="/dq-comms?tab=pulse" 
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
                <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">Pulse</span>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Pulse</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Share your thoughts and feedback through surveys, polls, and quick feedback sessions. Pulse is your platform for participating in organizational insights and shaping the future of DQ through direct engagement.
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
                className="py-4 px-4 text-sm transition-colors border-b border-blue-600 text-gray-900 font-medium"
              >
                Pulse
              </button>
              <button
                onClick={() => navigate('/dq-comms?tab=events')}
                className="py-4 px-4 text-sm transition-colors border-b border-transparent text-gray-500 hover:text-gray-700 font-normal"
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
            placeholder="Search pulse items by title or description..." 
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
                <Button variant="secondary" size="sm" onClick={fetchPulseItems} className="ml-4">
                  Retry
                </Button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No pulse items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <PulseCard
                    key={item.id}
                    item={item}
                    onViewDetails={() => handleViewPulseItem(item.id)}
                    onGiveFeedback={() => handleViewPulseItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

