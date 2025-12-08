import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { CommunityCard } from '@/communities/components/Cards/CommunityCard';
import { SearchBar } from '@/communities/components/communities/SearchBar';
import { FilterSidebar, FilterConfig } from '@/communities/components/communities/FilterSidebar';
import { CreateCommunityModal } from '@/communities/components/communities/CreateCommunityModal';
import { supabase } from '@/lib/supabaseClient';
import { joinCommunity, leaveCommunity } from '@/communities/services/membershipService';
import { toast } from 'sonner';
import { Button } from '@/communities/components/ui/button';
import { HomeIcon, ChevronRightIcon, PlusCircle, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/communities/components/ui/sheet';

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  imageurl?: string;
  category?: string;
  isprivate?: boolean;
  activitylevel?: string;
}

export default function DQCommsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL params, default to 'discussion'
  const tabFromUrl = searchParams.get('tab') || 'discussion';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Communities state
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Note: Pulse and Events now have dedicated marketplace pages
  // Navigation to those pages happens in handleTabChange

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Sync activeTab with URL params on mount and when URL changes externally
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'discussion';
    if (tabFromUrl !== activeTab && ['discussion', 'pulse', 'events'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value }, { replace: true });
    
    // Navigate to dedicated marketplace pages
    if (value === 'pulse') {
      navigate('/marketplace/pulse');
    } else if (value === 'events') {
      navigate('/marketplace/events');
    }
    // Discussion stays on current page
  };

  // Fetch user memberships
  useEffect(() => {
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

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
          { id: 'riyadh', name: 'Riyadh' }
        ]
      },
      {
        id: 'category',
        title: 'Category',
        options: [
          { id: 'dq-agile', name: 'GHC - DQ Agile' },
          { id: 'dq-culture', name: 'GHC - DQ Culture' },
          { id: 'dq-dtmf', name: 'GHC - DQ DTMF' },
          { id: 'dq-persona', name: 'GHC - DQ Persona' },
          { id: 'dq-tech', name: 'GHC - DQ Tech' },
          { id: 'dq-vision', name: 'GHC - DQ Vision' }
        ]
      },
      {
        id: 'memberCount',
        title: 'Member Count',
        options: [
          { id: '0-10', name: '0-10 members' },
          { id: '11-50', name: '11-50 members' },
          { id: '51+', name: '51+ members' }
        ]
      }
    ]);
  }, []);

  // Fetch communities for Discussion tab
  useEffect(() => {
    if (activeTab === 'discussion') {
      fetchCommunities();
    }
  }, [activeTab, user, searchQuery, filters]);

  // Pulse and Events tabs navigate to dedicated marketplace pages
  // No need to fetch data here

  const fetchUserMemberships = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('community_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserMemberships(new Set(data?.map((m) => m.community_id) || []));
    } catch (error) {
      console.error('Error fetching memberships:', error);
    }
  };

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('communities_with_counts').select('*');

      // Apply search filter
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply member count filter
      if (filters.memberCount) {
        if (filters.memberCount === '0-10 members') {
          query = query.lt('member_count', 11);
        } else if (filters.memberCount === '11-50 members') {
          query = query.gte('member_count', 11).lte('member_count', 50);
        } else if (filters.memberCount === '51+ members') {
          query = query.gt('member_count', 50);
        }
      }

      // Apply activity level filter
      if (filters.activityLevel) {
        query = query.ilike('activitylevel', filters.activityLevel);
      }

      // Apply category filter
      if (filters.category) {
        query = (query as any).eq('category', filters.category);
      }

      const { data, error: fetchError } = await query.order('member_count', { ascending: false }).limit(50);

      if (fetchError) throw fetchError;
      setFilteredCommunities(data || []);
    } catch (error: any) {
      console.error('Error fetching communities:', error);
      setError(error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  // Pulse and Events data fetching moved to dedicated marketplace pages:
  // - PulseMarketplacePage.tsx (fetches from pulse_items table)
  // - EventsMarketplacePage.tsx (fetches from events_v2 and posts tables)

  const handleJoinLeave = async (communityId: string, isMember: boolean) => {
    if (!user) {
      toast.error('Please sign in to join communities');
      return;
    }

    try {
      if (isMember) {
        await leaveCommunity(communityId, user.id);
        setUserMemberships((prev) => {
          const newSet = new Set(prev);
          newSet.delete(communityId);
          return newSet;
        });
        toast.success('Left community successfully');
        // Refresh data
        if (activeTab === 'discussion') fetchCommunities();
      } else {
        await joinCommunity(communityId, user.id);
        setUserMemberships((prev) => new Set(prev).add(communityId));
        toast.success('Joined community successfully');
        // Refresh data
        if (activeTab === 'discussion') fetchCommunities();
      }
    } catch (error: any) {
      console.error('Error joining/leaving community:', error);
      toast.error(error.message || 'Failed to update membership');
    }
  };

  const handleViewCommunity = (communityId: string) => {
    navigate(`/community/${communityId}`, { 
      state: { returnTo: `/dq-comms?tab=${activeTab}` }
    });
  };

  // Event click handler removed - events now handled in EventsMarketplacePage

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

  const handleCommunityCreated = () => {
    setCreateModalOpen(false);
    if (activeTab === 'discussion') {
      fetchCommunities();
    }
  };

  // Determine current page label for breadcrumbs
  const getCurrentPageLabel = () => {
    if (activeTab === 'pulse') return 'Pulse';
    if (activeTab === 'events') return 'Events';
    return 'Discussions';
  };

  // Get focus content based on active tab
  const getFocusContent = () => {
    if (activeTab === 'pulse') {
      return {
        title: 'Pulse',
        text: 'Share your thoughts and feedback through surveys, polls, and quick feedback sessions. Pulse is your platform for participating in organizational insights and shaping the future of DQ through direct engagement.'
      };
    } else if (activeTab === 'events') {
      return {
        title: 'Events',
        text: 'Stay up to date with upcoming events, workshops, and team gatherings. Explore activities within DQ that encourage collaboration, growth, and innovation.'
      };
    }
    return {
      title: 'Discussion',
      text: 'Engage in thoughtful conversations, share ideas, and discuss topics that matter most to DQ. Collaborate with colleagues across the company to drive innovation and foster a vibrant, connected community.'
    };
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

  const focusContent = getFocusContent();

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
                  to="/dq-comms" 
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
                <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">{getCurrentPageLabel()}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header - Title and Subtitle */}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{focusContent.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-2">{focusContent.text}</p>
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
                onClick={() => handleTabChange('discussion')}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  activeTab === 'discussion'
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Discussion
              </button>
              <button
                onClick={() => handleTabChange('pulse')}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  activeTab === 'pulse'
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Pulse
              </button>
              <button
                onClick={() => handleTabChange('events')}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  activeTab === 'events'
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Events
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar (only show for Discussion tab) */}
        {activeTab === 'discussion' && (
          <div className="mb-6 -ml-0 -mr-1 sm:-mr-2 lg:-mr-3">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search communities by name or description..." 
            />
          </div>
        )}
        
        {/* Action Buttons (only show for Discussion tab) */}
        {activeTab === 'discussion' && (
          <div className="mb-6 flex items-center gap-4 pr-1 sm:pr-2 lg:pr-3">
            {user && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Community
              </Button>
            )}
          </div>
        )}

        {/* Main Content Area with Filters and Cards */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop (only show for Discussion tab) */}
          {activeTab === 'discussion' && (
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
          )}

          {/* Mobile Filter Drawer (only show for Discussion tab) */}
          {activeTab === 'discussion' && (
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
          )}

          {/* Content Grid */}
          <div className="flex-1">
            {/* Discussion Tab */}
            {activeTab === 'discussion' && (
              <>
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
                    <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                      Retry
                    </Button>
                  </div>
                ) : filteredCommunities.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500">No communities found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.map((community) => {
                      const count = community.member_count || 0;
                      let activityLevel: 'low' | 'medium' | 'high' = 'low';
                      if (community.activitylevel) {
                        const dbLevel = community.activitylevel.toLowerCase();
                        if (dbLevel === 'high') activityLevel = 'high';
                        else if (dbLevel === 'medium') activityLevel = 'medium';
                        else if (dbLevel === 'low') activityLevel = 'low';
                      } else {
                        if (count > 50) activityLevel = 'high';
                        else if (count > 10) activityLevel = 'medium';
                      }

                      const activeMembers = Math.floor(count * (0.6 + Math.random() * 0.3));
                      const category = community.category || 'General';
                      const tags = [category, activityLevel === 'high' ? 'Popular' : 'Growing'];

                      return (
                        <CommunityCard
                          key={community.id}
                          item={{
                            id: community.id,
                            name: community.name || 'Unnamed Community',
                            description: community.description || 'No description available',
                            memberCount: count,
                            activeMembers: activeMembers,
                            category: category,
                            tags: tags,
                            imageUrl:
                              community.imageurl ||
                              'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                            isPrivate: community.isprivate || false,
                            activityLevel: activityLevel,
                            recentActivity: `New discussion started in ${community.name}`,
                          }}
                          isMember={userMemberships.has(community.id)}
                          onJoin={() => handleJoinLeave(community.id, userMemberships.has(community.id))}
                          onViewDetails={() => handleViewCommunity(community.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Pulse and Events tabs navigate to dedicated marketplace pages */}
            {/* Content is handled in PulseMarketplacePage and EventsMarketplacePage */}
          </div>
        </div>

        <CreateCommunityModal 
          open={createModalOpen} 
          onOpenChange={setCreateModalOpen} 
          onCommunityCreated={handleCommunityCreated} 
        />
      </div>
    </MainLayout>
  );
}
