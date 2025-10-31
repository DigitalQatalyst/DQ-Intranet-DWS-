import React, { useEffect, useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CommunitiesLayout } from './CommunitiesLayout';
import { PageLayout, PageSection, SectionHeader, SectionContent, Breadcrumbs } from '@/communities/components/KF eJP Library/PageLayout';
import { TabsFeed } from '@/communities/components/feed/TabsFeed';
import { FeedSidebar } from '@/communities/components/feed/FeedSidebar';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { supabaseClient } from '../lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { StickyActionButton } from '@/communities/components/KF eJP Library/Button';
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

export function CommunityFeed() {
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
      navigate('/communities');
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
    
    try {
      // Fetch posts from communities the user is a member of
      let query = supabaseClient
        .from('posts')
        .select(`
          *,
          community:communities(id, name),
          author:users(id, username, avatar_url),
          reactions(reaction_type),
          comments(id)
        `)
        .eq('status', 'active')
        .in('community_id', 
          supabaseClient
            .from('memberships')
            .select('community_id')
            .eq('user_id', user.id)
        );

      // Apply tag filter if present
      if (filterTag) {
        query = query.contains('tags', [filterTag]);
      }

      // Apply sorting
      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'popular') {
        // Sort by reaction count (calculated client-side)
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.range(offset, offset + 9);

      if (error) throw error;

      // Transform data to match Post interface
      const posts: Post[] = (data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        created_by: post.created_by,
        community_id: post.community_id,
        community_name: post.community?.name || 'Unknown',
        author_username: post.author?.username || 'Anonymous',
        author_avatar: post.author?.avatar_url,
        helpful_count: post.reactions?.filter((r: any) => r.reaction_type === 'helpful').length || 0,
        insightful_count: post.reactions?.filter((r: any) => r.reaction_type === 'insightful').length || 0,
        comment_count: post.comments?.length || 0,
        tags: post.tags,
        post_type: post.post_type,
        metadata: post.metadata,
        event_date: post.event_date,
        event_location: post.event_location,
      }));

      setMyPosts(offset === 0 ? posts : [...myPosts, ...posts]);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setMyLoading(false);
    }
  };

  const fetchGlobalPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    if (!user) return;
    setGlobalLoading(true);
    
    try {
      // Fetch all public posts
      let query = supabaseClient
        .from('posts')
        .select(`
          *,
          community:communities!inner(id, name, isprivate),
          author:users(id, username, avatar_url),
          reactions(reaction_type),
          comments(id)
        `)
        .eq('status', 'active')
        .eq('community.isprivate', false);

      // Apply tag filter if present
      if (filterTag) {
        query = query.contains('tags', [filterTag]);
      }

      // Apply sorting
      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.range(offset, offset + 9);

      if (error) throw error;

      // Transform data to match Post interface
      const posts: Post[] = (data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        created_by: post.created_by,
        community_id: post.community_id,
        community_name: post.community?.name || 'Unknown',
        author_username: post.author?.username || 'Anonymous',
        author_avatar: post.author?.avatar_url,
        helpful_count: post.reactions?.filter((r: any) => r.reaction_type === 'helpful').length || 0,
        insightful_count: post.reactions?.filter((r: any) => r.reaction_type === 'insightful').length || 0,
        comment_count: post.comments?.length || 0,
        tags: post.tags,
        post_type: post.post_type,
        metadata: post.metadata,
        event_date: post.event_date,
        event_location: post.event_location,
      }));

      setGlobalPosts(offset === 0 ? posts : [...globalPosts, ...posts]);
    } catch (error) {
      console.error('Error fetching global posts:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchTrendingPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    setTrendingLoading(true);
    
    try {
      // Fetch trending posts (posts with most reactions in last 7 days)
      let query = supabaseClient
        .from('posts')
        .select(`
          *,
          community:communities!inner(id, name, isprivate),
          author:users(id, username, avatar_url),
          reactions(reaction_type),
          comments(id)
        `)
        .eq('status', 'active')
        .eq('community.isprivate', false)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Apply tag filter if present
      if (filterTag) {
        query = query.contains('tags', [filterTag]);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query.range(offset, offset + 9);

      if (error) throw error;

      // Transform and sort by engagement (reactions + comments)
      const posts: Post[] = (data || []).map((post: any) => {
        const helpful = post.reactions?.filter((r: any) => r.reaction_type === 'helpful').length || 0;
        const insightful = post.reactions?.filter((r: any) => r.reaction_type === 'insightful').length || 0;
        const comments = post.comments?.length || 0;
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          created_by: post.created_by,
          community_id: post.community_id,
          community_name: post.community?.name || 'Unknown',
          author_username: post.author?.username || 'Anonymous',
          author_avatar: post.author?.avatar_url,
          helpful_count: helpful,
          insightful_count: insightful,
          comment_count: comments,
          tags: post.tags,
          post_type: post.post_type,
          metadata: post.metadata,
          event_date: post.event_date,
          event_location: post.event_location,
          _engagement: helpful + insightful + comments,
        };
      }).sort((a: any, b: any) => b._engagement - a._engagement);

      setTrendingPosts(offset === 0 ? posts : [...trendingPosts, ...posts]);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    } finally {
      setTrendingLoading(false);
    }
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
    if (tab === 'my_communities') fetchMyPosts('recent', offset);
    else if (tab === 'global') fetchGlobalPosts('recent', offset);
    else fetchTrendingPosts('recent', offset);
  };

  if (loading) {
    return (
      <CommunitiesLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </CommunitiesLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <CommunitiesLayout>
      <PageLayout 
        title="Community Feed" 
        breadcrumbs={[
          { label: 'Home', href: '/communities' },
          { label: 'Communities', href: '/communities/communities' },
          { label: 'Feed', current: true }
        ]} 
        headerSubtitle="See updates and posts from your joined communities"
      >
        {/* Tag Filter Badge */}
        {filterTag && (
          <PageSection className="mb-6">
            <SectionContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Filtered by:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E6EBF5', color: '#030F35' }}>
                  #{filterTag}
                  <button onClick={clearTagFilter} className="ml-1 transition-colors" style={{ color: '#030F35' }} onMouseEnter={(e) => e.currentTarget.style.color = '#051633'} onMouseLeave={(e) => e.currentTarget.style.color = '#030F35'}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearTagFilter} className="text-gray-600 hover:text-gray-900">
                Clear filter
              </Button>
            </SectionContent>
          </PageSection>
        )}

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
              <TabsFeed 
                myPosts={myPosts} 
                globalPosts={globalPosts} 
                trendingPosts={trendingPosts} 
                myLoading={myLoading} 
                globalLoading={globalLoading} 
                trendingLoading={trendingLoading} 
                onNewPost={() => navigate('/communities/create-post')} 
                onSortChange={handleSortChange} 
                onLoadMore={handleLoadMore} 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
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
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 sm:text-sm" 
                    placeholder="Search posts..."
                    style={{ '--tw-ring-color': '#030F35' } as React.CSSProperties}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#030F35'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
              </SectionContent>
            </PageSection>
            {/* Sidebar Content */}
            <FeedSidebar onTagClick={handleTagFilter} />
          </div>
        </div>
        <StickyActionButton 
          onClick={() => navigate('/communities/post/create')} 
          buttonText="Create Post" 
          description="Share your ideas with the community" 
        />
      </PageLayout>
    </CommunitiesLayout>
  );
}