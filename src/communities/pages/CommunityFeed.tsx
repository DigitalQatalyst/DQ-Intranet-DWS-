import React, { useEffect, useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { PageLayout, PageSection, SectionHeader, SectionContent, Breadcrumbs } from '@/communities/components/DesignSystem/PageLayout';
import { TabsFeed } from '@/communities/components/feed/TabsFeed';
import { FeedSidebar } from '@/communities/components/feed/FeedSidebar';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { StickyActionButton } from '@/communities/components/DesignSystem/Button';
import { Button } from '@/communities/components/ui/button';
import { X, Search } from 'lucide-react';
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  community_id: string;
  community_name: string;
  author_username: string;
  author_avatar?: string;
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  tags?: string[];
  post_type?: 'text' | 'media' | 'poll' | 'event' | 'article' | 'announcement';
  metadata?: any;
  event_date?: string;
  event_location?: string;
}
export default function CommunityFeed() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [globalPosts, setGlobalPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('my_communities');
  const [currentSort, setCurrentSort] = useState<string>('recent');
  const filterTag = searchParams.get('tag');
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchMyPosts(currentSort, 0);
      fetchGlobalPosts(currentSort, 0);
      fetchTrendingPosts(currentSort, 0);
    }
  }, [user, filterTag]);
  const fetchMyPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    if (!user) return;
    setMyLoading(true);
    // Build query - moderators/admins see all posts, regular users see only active
    let query = supabase.from('posts').select(`
        *,
        communities!inner(name),
        users_local!inner(username, avatar_url)
      `);
    // Regular users only see active posts
    if (user.role === 'member') {
      query = query.eq('status', 'active');
    }
    const {
      data,
      error
    } = await query.order('created_at', {
      ascending: false
    }).limit(10).range(offset, offset + 9);
    if (!error && data) {
      const formattedPosts = data.map((post: any) => ({
        ...post,
        community_name: post.communities?.name || 'Unknown',
        author_username: post.users_local?.username || 'Anonymous',
        author_avatar: post.users_local?.avatar_url,
        helpful_count: 0,
        insightful_count: 0,
        comment_count: 0
      }));
      let filteredData = formattedPosts;
      if (filterTag) {
        filteredData = formattedPosts.filter((post: Post) => post.tags?.includes(filterTag));
      }
      setMyPosts(offset === 0 ? filteredData : [...myPosts, ...filteredData]);
    }
    setMyLoading(false);
  };
  const fetchGlobalPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    if (!user) return;
    setGlobalLoading(true);
    // Build query - moderators/admins see all posts, regular users see only active
    let query = supabase.from('posts').select(`
        *,
        communities!inner(name),
        users_local!inner(username, avatar_url)
      `);
    // Regular users only see active posts
    if (user.role === 'member') {
      query = query.eq('status', 'active');
    }
    const {
      data,
      error
    } = await query.order('created_at', {
      ascending: false
    }).limit(10).range(offset, offset + 9);
    if (!error && data) {
      const formattedPosts = data.map((post: any) => ({
        ...post,
        community_name: post.communities?.name || 'Unknown',
        author_username: post.users_local?.username || 'Anonymous',
        author_avatar: post.users_local?.avatar_url,
        helpful_count: 0,
        insightful_count: 0,
        comment_count: 0
      }));
      let filteredData = formattedPosts;
      if (filterTag) {
        filteredData = formattedPosts.filter((post: Post) => post.tags?.includes(filterTag));
      }
      setGlobalPosts(offset === 0 ? filteredData : [...globalPosts, ...filteredData]);
    }
    setGlobalLoading(false);
  };
  const fetchTrendingPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    setTrendingLoading(true);
    const {
      data,
      error
    } = await supabase.rpc('get_feed', {
      feed_tab: 'trending',
      sort_by: sortBy,
      user_id_param: user?.id || null,
      limit_count: 10,
      offset_count: offset
    });
    if (!error && data) {
      let filteredData = data;
      if (filterTag) {
        filteredData = data.filter((post: Post) => post.tags?.includes(filterTag));
      }
      setTrendingPosts(offset === 0 ? filteredData : [...trendingPosts, ...filteredData]);
    }
    setTrendingLoading(false);
  };
  const handlePostCreated = () => {
    fetchMyPosts('recent', 0);
    fetchGlobalPosts('recent', 0);
    fetchTrendingPosts('recent', 0);
  };
  const handleSortChange = (sortBy: string) => {
    setCurrentSort(sortBy);
    fetchMyPosts(sortBy, 0);
    fetchGlobalPosts(sortBy, 0);
    fetchTrendingPosts(sortBy, 0);
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const handleTagFilter = (tag: string) => {
    setSearchParams({
      tag
    });
  };
  const clearTagFilter = () => {
    setSearchParams({});
  };
  const handleLoadMore = (tab: string) => {
    const offset = tab === 'my_communities' ? myPosts.length : tab === 'global' ? globalPosts.length : trendingPosts.length;
    if (tab === 'my_communities') fetchMyPosts('recent', offset);else if (tab === 'global') fetchGlobalPosts('recent', offset);else fetchTrendingPosts('recent', offset);
  };
  if (loading) {
    return <MainLayout hidePageLayout fullWidth>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>;
  }
  if (!user) {
    return null;
  }
  return <MainLayout hidePageLayout fullWidth>
      <PageLayout title="Community Feed" breadcrumbs={[{
      label: 'Home',
      href: '/'
    }, {
      label: 'Communities',
      href: '/communities'
    }, {
      label: 'Feed',
      current: true
    }]} headerSubtitle="See updates and posts from your joined communities">
        {/* Tag Filter Badge */}
        {filterTag && <PageSection className="mb-6">
            <SectionContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Filtered by:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lightBlue text-brand-blue rounded-full text-xs font-medium">
                  #{filterTag}
                  <button onClick={clearTagFilter} className="ml-1 hover:text-brand-darkBlue transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearTagFilter} className="text-gray-600 hover:text-gray-900">
                Clear filter
              </Button>
            </SectionContent>
          </PageSection>}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed Content - Takes up 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <PageSection>
              <SectionHeader title="Create a Post" description="Share your thoughts, questions, or updates with the community" />
              <SectionContent>
                <InlineComposer onPostCreated={handlePostCreated} />
              </SectionContent>
            </PageSection>
            <PageSection>
              <TabsFeed myPosts={myPosts} globalPosts={globalPosts} trendingPosts={trendingPosts} myLoading={myLoading} globalLoading={globalLoading} trendingLoading={trendingLoading} onNewPost={() => navigate('/create-post')} onSortChange={handleSortChange} onLoadMore={handleLoadMore} activeTab={activeTab} onTabChange={handleTabChange} />
            </PageSection>
          </div>
          {/* Sidebar - Shows on all screens */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Box */}
            <PageSection>
              <SectionContent className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Search posts..." />
                </div>
              </SectionContent>
            </PageSection>
            {/* Sidebar Content */}
            <FeedSidebar onTagClick={handleTagFilter} />
          </div>
        </div>
        <StickyActionButton onClick={() => navigate('/post/create')} buttonText="Create Post" description="Share your ideas with the community" />
      </PageLayout>
    </MainLayout>;
}