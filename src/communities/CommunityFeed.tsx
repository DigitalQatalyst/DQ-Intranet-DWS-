import React, { useEffect, useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CommunitiesLayout } from './CommunitiesLayout';
import { PageLayout, PageSection, SectionHeader, SectionContent, Breadcrumbs } from '@/communities/components/KF eJP Library/PageLayout';
import { TabsFeed } from '@/communities/components/feed/TabsFeed';
import { FeedSidebar } from '@/communities/components/feed/FeedSidebar';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { supabase } from '@/communities/integrations/supabase/client';
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
    
    // Mock data - in real app this would use Supabase
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Welcome to the Digital Transformation Hub!',
        content: 'Excited to share insights about the latest trends in digital transformation across Abu Dhabi. What technologies are you most excited about?',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_by: user.id,
        community_id: '2',
        community_name: 'Digital Transformation Hub',
        author_username: 'sarah_tech',
        helpful_count: 24,
        insightful_count: 8,
        comment_count: 12,
        post_type: 'text'
      },
      {
        id: '2',
        title: 'Startup Funding Opportunities in UAE',
        content: 'Just attended an amazing session on startup funding. Here are the key takeaways for early-stage companies looking for investment...',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        created_by: user.id,
        community_id: '3',
        community_name: 'Startup Ecosystem UAE',
        author_username: 'ahmed_founder',
        helpful_count: 42,
        insightful_count: 15,
        comment_count: 28,
        post_type: 'text'
      }
    ];

    let filteredData = mockPosts;
    if (filterTag) {
      filteredData = mockPosts.filter((post: Post) => post.tags?.includes(filterTag));
    }
    setMyPosts(offset === 0 ? filteredData : [...myPosts, ...filteredData]);
    setMyLoading(false);
  };

  const fetchGlobalPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    if (!user) return;
    setGlobalLoading(true);
    
    // Mock data - in real app this would use Supabase
    const mockPosts: Post[] = [
      {
        id: '3',
        title: 'Tech Meetup: AI in Healthcare',
        content: 'Join us next week for an exciting discussion on AI applications in healthcare. We\'ll have industry experts sharing their experiences.',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        created_by: 'user3',
        community_id: '1',
        community_name: 'Tech Innovators Abu Dhabi',
        author_username: 'dr_innovation',
        helpful_count: 18,
        insightful_count: 5,
        comment_count: 9,
        post_type: 'event',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event_location: 'Abu Dhabi Tech Hub'
      }
    ];

    let filteredData = mockPosts;
    if (filterTag) {
      filteredData = mockPosts.filter((post: Post) => post.tags?.includes(filterTag));
    }
    setGlobalPosts(offset === 0 ? filteredData : [...globalPosts, ...filteredData]);
    setGlobalLoading(false);
  };

  const fetchTrendingPosts = async (sortBy: string = 'recent', offset: number = 0) => {
    setTrendingLoading(true);
    
    // Mock trending posts - in real app this would use Supabase RPC
    const mockTrendingPosts: Post[] = [
      {
        id: '4',
        title: 'The Future of Blockchain in UAE',
        content: 'Exploring how blockchain technology is transforming various sectors in the UAE...',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        created_by: 'user4',
        community_id: '1',
        community_name: 'Tech Innovators Abu Dhabi',
        author_username: 'blockchain_expert',
        helpful_count: 67,
        insightful_count: 23,
        comment_count: 45,
        post_type: 'article'
      }
    ];

    let filteredData = mockTrendingPosts;
    if (filterTag) {
      filteredData = mockTrendingPosts.filter((post: Post) => post.tags?.includes(filterTag));
    }
    setTrendingPosts(offset === 0 ? filteredData : [...trendingPosts, ...filteredData]);
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                    placeholder="Search posts..." 
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