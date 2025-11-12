import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";
import { MainLayout } from "../components/layout/MainLayout";
import { SearchBar } from "../components/communities/SearchBar";
import { FilterSidebar, FilterConfig } from "../components/communities/FilterSidebar";
import { CreateCommunityModal } from "../components/communities/CreateCommunityModal";
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from "../utils/safeFetch";
import { Button } from "../components/ui/button";
import { PlusCircle, Filter, X, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CommunityCard } from "../components/Cards/CommunityCard";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { StickyActionButton } from "../components/Button/StickyActionButton";

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
export default function Communities() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for communities data
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Dynamic filter options from backend
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  
  // Fetch filter options from backend
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  const fetchFilterOptions = async () => {
    try {
      // Fetch distinct categories from backend
      const categoriesQuery = supabase
        .from('communities_with_counts')
        .select('category')
        .not('category', 'is', null);
      
      // Fetch distinct activity levels from backend
      const activityLevelsQuery = supabase
        .from('communities_with_counts')
        .select('activitylevel')
        .not('activitylevel', 'is', null);

      const [categoriesResult, activityLevelsResult] = await Promise.all([
        safeFetch<Array<{ category: string }>>(categoriesQuery),
        safeFetch<Array<{ activitylevel: string }>>(activityLevelsQuery)
      ]);

      // Extract unique values
      const uniqueCategories = Array.from(
        new Set(
          (categoriesResult[0] || []).map(c => c.category).filter(Boolean) as string[]
        )
      ).sort();

      const uniqueActivityLevels = Array.from(
        new Set(
          (activityLevelsResult[0] || []).map(a => a.activitylevel).filter(Boolean) as string[]
        )
      ).sort();

      // Build filter configuration dynamically
      const config: FilterConfig[] = [
        {
          id: 'memberCount',
          title: 'Member Count',
          options: [
            { id: 'small', name: '0-10 members' },
            { id: 'medium', name: '11-50 members' },
            { id: 'large', name: '51+ members' }
          ]
        },
        {
          id: 'activityLevel',
          title: 'Activity Level',
          options: uniqueActivityLevels.map((level) => ({
            id: level.toLowerCase().replace(/\s+/g, '-'),
            name: level
          }))
        },
        {
          id: 'category',
          title: 'Category',
          options: uniqueCategories.map((cat) => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            name: cat
          }))
        }
      ];

      setFilterConfig(config);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Fallback to member count only if fetch fails
      setFilterConfig([
        {
          id: 'memberCount',
          title: 'Member Count',
          options: [
            { id: 'small', name: '0-10 members' },
            { id: 'medium', name: '11-50 members' },
            { id: 'large', name: '51+ members' }
          ]
        }
      ]);
    }
  };

  // Fetch communities with filters from backend
  useEffect(() => {
    fetchCommunities();
  }, [searchQuery, filters, user]);

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('communities_with_counts').select('*');

      // Apply search filter (backend) - search in name or description
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        // Use PostgREST OR syntax: field.operator.value,field.operator.value
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply member count filter (backend)
      if (filters.memberCount) {
        if (filters.memberCount === '0-10 members') {
          query = query.lt('member_count', 11);
        } else if (filters.memberCount === '11-50 members') {
          query = query.gte('member_count', 11).lte('member_count', 50);
        } else if (filters.memberCount === '51+ members') {
          query = query.gt('member_count', 50);
        }
      }

      // Apply activity level filter (backend) - case-insensitive match
      if (filters.activityLevel) {
        // Use ilike for case-insensitive matching (matches any case variant)
        query = query.ilike('activitylevel', filters.activityLevel);
      }

      // Apply category filter (backend) - exact match
      if (filters.category) {
        query = (query as any).eq('category', filters.category);
      }

      // Order by member count (descending)
      query = query.order('member_count', { ascending: false });

      const [data, error] = await safeFetch<Community[]>(query);
      
      if (error) {
        console.error('Error fetching communities:', error);
        setError(new Error('Failed to load communities'));
        setFilteredCommunities([]);
      } else if (data) {
        setFilteredCommunities(data);
      }
    } catch (err) {
      console.error('Exception fetching communities:', err);
      setError(err instanceof Error ? err : new Error('Failed to load communities'));
      setFilteredCommunities([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserMemberships = async () => {
    if (!user) return;
    const query = supabase
      .from('memberships')
      .select('community_id');
    const finalQuery = (query as any).eq('user_id', user.id);
    const [data, error] = await safeFetch<Array<{ community_id: string }>>(finalQuery);
    if (!error && data) {
      setUserMemberships(new Set(data.map(m => m.community_id)));
    }
  };
  const handleCommunityCreated = () => {
    // Refetch communities to show the new community
    fetchCommunities();
    if (user) {
      fetchUserMemberships();
    }
  };
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);
  const handleViewCommunity = useCallback((communityId: string) => {
    navigate(`/community/${communityId}`);
  }, [navigate]);
  const handleJoinCommunity = useCallback((communityId: string) => {
    // Allow both authenticated and anonymous users to navigate to community detail page
    // The join action will happen on the detail page
    navigate(`/community/${communityId}`);
  }, [navigate]);
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-subtle)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>;
  }

  // Unified layout for both logged in and logged out users
  // Using hidePageLayout to avoid white container wrapper
  return <MainLayout 
      title="DQ Work Communities" 
      subtitle="Find and join communities to connect with other associates within the organization."
      fullWidth={false}
      hidePageLayout={true}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
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
                <span className="ml-1 text-gray-700 md:ml-2">DQ Work Communities</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header - Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 my-4">
            DQ Work Communities
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Find and join communities to connect with other associates within the organization.
          </p>
          
          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => {
                  // Discussion tab - stays on current page (Communities Marketplace)
                  navigate('/communities');
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  location.pathname === '/communities' || location.pathname.startsWith('/community/')
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Discussion
              </button>
              <button
                onClick={() => {
                  // Pulse tab - placeholder (no routing yet)
                  // Could show a message or do nothing for now
                }}
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors cursor-not-allowed opacity-60"
                disabled
                title="Coming soon"
              >
                Pulse
              </button>
              <button
                onClick={() => {
                  // Events tab - routes to Events Marketplace
                  navigate('/marketplace/events');
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/')
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar - Separate component, no container */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 w-full">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search communities by name or description..." />
            </div>
            <div className="flex items-center gap-4">
              {/* Filter Button - Mobile/Tablet */}
              <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
                <SheetTrigger asChild>
                  <Button className="lg:hidden bg-brand-blue hover:bg-brand-darkBlue text-white flex items-center gap-2 transition-all duration-200 ease-in-out">
                    <Filter size={18} />
                    <span className="hidden sm:inline">Filters</span>
                    {Object.keys(filters).length > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-brand-blue font-medium">
                        {Object.keys(filters).length}
                      </span>}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] bg-white">
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      {Object.keys(filters).length > 0 && <Button variant="ghost" size="sm" onClick={resetFilters} className="text-brand-blue text-sm font-medium hover:text-brand-darkBlue">
                          Reset All
                        </Button>}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <FilterSidebar filters={filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />
                    </div>
                    <div className="pt-4 border-t mt-auto">
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setFilterDrawerOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setFilterDrawerOpen(false)} className="bg-brand-blue hover:bg-brand-darkBlue text-white transition-all duration-200 ease-in-out">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              {/* Create Community button */}
              {user && <Button onClick={() => setCreateModalOpen(true)} className="bg-brand-blue hover:bg-brand-darkBlue text-white gap-2 transition-all duration-200 ease-in-out">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Community</span>
                  <span className="sm:hidden">Create</span>
                </Button>}
            </div>
          </div>
        </div>

        {/* Active filters display - Mobile */}
        {Object.keys(filters).length > 0 && <div className="lg:hidden mb-6 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => value && <div key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm">
                  <span>{value}</span>
                  <button onClick={() => handleFilterChange(key, value)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>)}
            {Object.keys(filters).length > 0 && <button onClick={resetFilters} className="text-sm text-brand-blue hover:text-brand-darkBlue font-medium transition-colors duration-150 ease-in-out">
                Clear All
              </button>}
          </div>}

        {/* Desktop Layout with Sidebar - Separate components */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filters Sidebar - Desktop - Separate component with white background */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit sticky top-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                {Object.keys(filters).length > 0 && <Button variant="ghost" size="sm" onClick={resetFilters} className="text-brand-blue text-sm font-medium hover:text-brand-darkBlue">
                    Reset All
                  </Button>}
              </div>
              <FilterSidebar filters={filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />
            </div>
          </div>

          {/* Main Content Area - Desktop - Community Cards Grid */}
          <div>
            {/* Active filters display - Desktop */}
            {Object.keys(filters).length > 0 && <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => value && <div key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm">
                      <span>{value}</span>
                      <button onClick={() => handleFilterChange(key, value)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>)}
                {Object.keys(filters).length > 0 && <button onClick={resetFilters} className="text-sm text-brand-blue hover:text-brand-darkBlue font-medium transition-colors duration-150 ease-in-out">
                    Clear All
                  </button>}
              </div>}

            {/* Communities Grid - Separate component */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="flex justify-between mt-auto pt-4">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
                {error.message}
                <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                  Retry
                </Button>
              </div>
            ) : searchQuery.trim() && filteredCommunities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No communities match your search for "{searchQuery}"
                </p>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-lg font-medium">No communities yet</p>
                <p className="text-muted-foreground">
                  {user ? 'Be the first to create a community!' : 'Sign in to create and join communities!'}
                </p>
                {user && <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="Create Your First Community" />}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredCommunities.map(community => {
                    const count = community.member_count || 0;
                    // Use activitylevel from database, or calculate based on member count as fallback
                    let activityLevel: 'low' | 'medium' | 'high' = 'low';
                    if (community.activitylevel) {
                      const dbLevel = community.activitylevel.toLowerCase();
                      if (dbLevel === 'high') activityLevel = 'high';
                      else if (dbLevel === 'medium') activityLevel = 'medium';
                      else if (dbLevel === 'low') activityLevel = 'low';
                    } else {
                      // Fallback: calculate based on member count
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
                          memberCount: community.member_count || 0,
                          activeMembers: activeMembers,
                          category: category,
                          tags: tags,
                          imageUrl: community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                          isPrivate: community.isprivate || false,
                          activityLevel: activityLevel,
                          recentActivity: `New discussion started in ${community.name}`
                        }}
                        isMember={userMemberships.has(community.id)}
                        onJoin={() => handleJoinCommunity(community.id)}
                        onViewDetails={() => handleViewCommunity(community.id)}
                      />
                    );
                  })}
                </div>
                {filteredCommunities.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-6">
                    Showing {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
                    {Object.keys(filters).length > 0 || searchQuery.trim() ? ' (filtered)' : ''}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Communities Grid - Separate from desktop layout */}
        <div className="lg:hidden">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between mt-auto pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
              {error.message}
              <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                Retry
              </Button>
            </div>
          ) : searchQuery.trim() && filteredCommunities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No communities match your search for "{searchQuery}"
              </p>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-lg font-medium">No communities yet</p>
              <p className="text-muted-foreground">
                {user ? 'Be the first to create a community!' : 'Sign in to create and join communities!'}
              </p>
              {user && <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="Create Your First Community" />}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {filteredCommunities.map(community => {
                  const count = community.member_count || 0;
                  // Use activitylevel from database, or calculate based on member count as fallback
                  let activityLevel: 'low' | 'medium' | 'high' = 'low';
                  if (community.activitylevel) {
                    const dbLevel = community.activitylevel.toLowerCase();
                    if (dbLevel === 'high') activityLevel = 'high';
                    else if (dbLevel === 'medium') activityLevel = 'medium';
                    else if (dbLevel === 'low') activityLevel = 'low';
                  } else {
                    // Fallback: calculate based on member count
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
                        memberCount: community.member_count || 0,
                        activeMembers: activeMembers,
                        category: category,
                        tags: tags,
                        imageUrl: community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                        isPrivate: community.isprivate || false,
                        activityLevel: activityLevel,
                        recentActivity: `New discussion started in ${community.name}`
                      }}
                      isMember={userMemberships.has(community.id)}
                      onJoin={() => handleJoinCommunity(community.id)}
                      onViewDetails={() => handleViewCommunity(community.id)}
                    />
                  );
                })}
              </div>
              {filteredCommunities.length > 0 && (
                <p className="text-sm text-muted-foreground text-center mt-6">
                  Showing {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
                  {Object.keys(filters).length > 0 || searchQuery.trim() ? ' (filtered)' : ''}
                </p>
              )}
            </>
          )}
        </div>

        {/* Floating Create Button (mobile) - Only for logged-in users */}
        {user && <div className="sm:hidden">
            <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="" />
          </div>}

        <CreateCommunityModal open={createModalOpen} onOpenChange={setCreateModalOpen} onCommunityCreated={handleCommunityCreated} />
      </div>
    </MainLayout>;
}
