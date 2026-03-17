import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { SearchBar } from '@/communities/components/communities/SearchBar';
import { FilterSidebar, FilterConfig } from '@/communities/components/communities/FilterSidebar';
import { CreateCommunityModal } from '@/communities/components/communities/CreateCommunityModal';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { Card } from '@/communities/components/ui/card';
import { PlusCircle, Filter, X, Home, ChevronRight } from 'lucide-react';
import { CommunityCard } from '@/communities/components/Cards';
import { Sheet, SheetContent, SheetTrigger } from '@/communities/components/ui/sheet';
import { StickyActionButton } from '@/communities/components/Button';
interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  imageurl?: string;
  category?: string;
}
export default function Communities() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();

  // State for communities data
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter configuration
  const [filterConfig] = useState<FilterConfig[]>([{
    id: 'memberCount',
    title: 'Member Count',
    options: [{
      id: 'small',
      name: '0-10 members'
    }, {
      id: 'medium',
      name: '11-50 members'
    }, {
      id: 'large',
      name: '51+ members'
    }]
  }, {
    id: 'activityLevel',
    title: 'Activity Level',
    options: [{
      id: 'high',
      name: 'High'
    }, {
      id: 'medium',
      name: 'Medium'
    }, {
      id: 'low',
      name: 'Low'
    }]
  }, {
    id: 'category',
    title: 'Category',
    options: [{
      id: 'tech',
      name: 'Technology'
    }, {
      id: 'business',
      name: 'Business'
    }, {
      id: 'creative',
      name: 'Creative'
    }, {
      id: 'social',
      name: 'Social'
    }, {
      id: 'education',
      name: 'Education'
    }]
  }]);
  useEffect(() => {
    fetchCommunities();
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  // Apply filters and search
  useEffect(() => {
    if (!communities.length) return;
    let result = [...communities];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(community => community.name.toLowerCase().includes(query) || community.description && community.description.toLowerCase().includes(query));
    }

    // Apply member count filter
    if (filters.memberCount) {
      result = result.filter(community => {
        const count = community.member_count || 0;
        if (filters.memberCount === '0-10 members') return count < 11;
        if (filters.memberCount === '11-50 members') return count >= 11 && count <= 50;
        if (filters.memberCount === '51+ members') return count > 50;
        return true;
      });
    }

    // For demo purposes, randomly assign activity levels based on member count
    if (filters.activityLevel) {
      result = result.filter(community => {
        const count = community.member_count || 0;
        let activityLevel = 'Low';
        if (count > 50) activityLevel = 'High';else if (count > 10) activityLevel = 'Medium';
        return activityLevel === filters.activityLevel;
      });
    }

    // For demo purposes, randomly filter by category
    if (filters.category) {
      result = result.filter((_, index) => {
        const categories = ['Technology', 'Business', 'Creative', 'Social', 'Education'];
        const randomCategory = categories[index % categories.length];
        return randomCategory === filters.category;
      });
    }
    setFilteredCommunities(result);
  }, [communities, searchQuery, filters]);
  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    const query = supabase.from('communities_with_counts').select('*').order('member_count', {
      ascending: false
    });
    const [data, error] = await safeFetch<Community[]>(query);
    if (error) {
      setError(new Error('Failed to load communities'));
    } else if (data) {
      setCommunities(data);
      setFilteredCommunities(data);
    }
    setLoading(false);
  };
  const fetchUserMemberships = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('memberships').select('community_id').eq('user_id', user.id);
    if (!error && data) {
      setUserMemberships(new Set(data.map(m => m.community_id)));
    }
  };
  const handleJoinLeave = () => {
    fetchCommunities();
    if (user) {
      fetchUserMemberships();
    }
  };
  const handleCommunityCreated = () => {
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
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  const handleViewCommunity = useCallback((communityId: string) => {
    navigate(`/community/${communityId}`);
  }, [navigate]);
  const handleJoinCommunity = useCallback((communityId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/community/${communityId}`);
  }, [user, navigate]);
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-subtle)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>;
  }

  // Unified layout for both logged in and logged out users
  return <MainLayout title="Communities Directory" fullWidth={false}>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search communities by name or description..." />
            </div>
            <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
              <SheetTrigger asChild>
                <Button className="bg-brand-blue hover:bg-brand-darkBlue text-white flex items-center gap-2 transition-all duration-200 ease-in-out">
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
            {/* Only show Create Community button for logged-in users */}
            {user && <Button onClick={() => setCreateModalOpen(true)} className="bg-brand-blue hover:bg-brand-darkBlue text-white gap-2 transition-all duration-200 ease-in-out">
                <PlusCircle className="h-4 w-4" />
                Create Community
              </Button>}
          </div>
        </div>

        {/* Active filters display */}
        {Object.keys(filters).length > 0 && <div className="flex flex-wrap gap-2">
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

        {/* Communities Grid */}
        <div>
          {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, idx) => <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between mt-auto pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>)}
            </div> : error ? <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
              {error.message}
              <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                Retry
              </Button>
            </div> : searchQuery.trim() && filteredCommunities.length === 0 ? <div className="text-center py-8">
              <p className="text-muted-foreground">
                No communities match your search for "{searchQuery}"
              </p>
            </div> : filteredCommunities.length === 0 ? <div className="text-center py-8 space-y-4">
              <p className="text-lg font-medium">No communities yet</p>
              <p className="text-muted-foreground">
                {user ? 'Be the first to create a community!' : 'Sign in to create and join communities!'}
              </p>
              {user && <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="Create Your First Community" />}
            </div> : <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredCommunities.map(community => {
              const count = community.member_count || 0;
              let activityLevel = 'low';
              if (count > 50) activityLevel = 'high';else if (count > 10) activityLevel = 'medium';
              const activeMembers = Math.floor(count * (0.6 + Math.random() * 0.3));
              const categories = ['Technology', 'Business', 'Creative', 'Social', 'Education'];
              const randomCategory = categories[Math.floor(Math.random() * categories.length)];
              const tags = ['Abu Dhabi', randomCategory, activityLevel === 'high' ? 'Popular' : 'Growing'];
              const isPrivate = Math.random() > 0.7;
              return <CommunityCard key={community.id} item={{
                id: community.id,
                name: community.name || 'Unnamed Community',
                description: community.description || 'No description available',
                memberCount: community.member_count || 0,
                activeMembers: activeMembers,
                category: randomCategory,
                tags: tags,
                imageUrl: community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                isPrivate: isPrivate,
                activityLevel: activityLevel as 'low' | 'medium' | 'high',
                recentActivity: `New discussion started in ${community.name}`
              }} isMember={userMemberships.has(community.id)} onJoin={() => handleJoinCommunity(community.id)} onViewDetails={() => handleViewCommunity(community.id)} />;
            })}
              </div>
              {filteredCommunities.length > 0 && <p className="text-sm text-muted-foreground text-center mt-6">
                  Showing {filteredCommunities.length} of {communities.length} communities
                </p>}
            </>}
        </div>

        {/* Floating Create Button (mobile) - Only for logged-in users */}
        {user && <div className="sm:hidden">
            <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="" />
          </div>}

        <CreateCommunityModal open={createModalOpen} onOpenChange={setCreateModalOpen} onCommunityCreated={handleCommunityCreated} />
      </div>
    </MainLayout>;
}