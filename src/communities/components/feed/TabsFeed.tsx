import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/communities/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/communities/components/ui/card';
import { Button } from '@/communities/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { Home, Globe, TrendingUp, Plus, ArrowUpDown } from 'lucide-react';
import { PostCard } from '@/communities/components/posts/PostCard';
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
interface TabsFeedProps {
  myPosts: Post[];
  globalPosts: Post[];
  trendingPosts: Post[];
  myLoading: boolean;
  globalLoading: boolean;
  trendingLoading: boolean;
  onNewPost: () => void;
  onSortChange: (sortBy: string) => void;
  onLoadMore: (tab: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export function TabsFeed({
  myPosts,
  globalPosts,
  trendingPosts,
  myLoading,
  globalLoading,
  trendingLoading,
  onNewPost,
  onSortChange,
  onLoadMore,
  activeTab,
  onTabChange
}: TabsFeedProps) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recent');
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sortMap: Record<string, string> = {
      'newest': 'recent',
      'most-reacted': 'most_reacted',
      'most-commented': 'most_commented'
    };
    onSortChange(sortMap[value] || 'recent');
  };
  return <Card className="shadow-sm border border-gray-100 rounded-xl overflow-hidden bg-white">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <CardHeader className="pb-0 bg-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-gray-50 p-1 rounded-lg border-0 h-auto">
              <TabsTrigger value="my_communities" className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200">
                <Home className="h-4 w-4 mr-2" />
                My Communities
              </TabsTrigger>
              <TabsTrigger value="global" className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200">
                <Globe className="h-4 w-4 mr-2" />
                Global Feed
              </TabsTrigger>
              <TabsTrigger value="trending" className="relative data-[state=active]:bg-transparent data-[state=active]:text-[#0030E3] data-[state=active]:shadow-none transition-all duration-200 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0030E3] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-200">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-white border-gray-200 hover:border-[#0030E3] transition-colors text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="most_reacted">Most Reacted</SelectItem>
                  <SelectItem value="most_commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => navigate('/post/create')} className="bg-[#0030E3] text-white hover:bg-[#002180] transition-all duration-200 text-sm font-semibold" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </div>
          </div>
        </CardHeader>

        <TabsContent value="my_communities" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {myLoading ? <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div> : myPosts.length === 0 ? <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">No posts yet — start a discussion!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Join communities or create your first post to get started.
                </p>
                <Button onClick={() => navigate('/post/create')} className="bg-[#0030E3] hover:bg-[#002180] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div> : <>
                {myPosts.map(post => <PostCard key={post.id} post={post} />)}
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => onLoadMore('my_communities')} className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors">
                    Load More Posts
                  </Button>
                </div>
              </>}
          </CardContent>
        </TabsContent>

        <TabsContent value="global" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {globalLoading ? <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div> : globalPosts.length === 0 ? <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">No posts yet — be the first!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Share your ideas with the global community.
                </p>
                <Button onClick={() => navigate('/post/create')} className="bg-[#0030E3] hover:bg-[#002180] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Post
                </Button>
              </div> : <>
                {globalPosts.map(post => <PostCard key={post.id} post={post} />)}
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => onLoadMore('global')} className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors">
                    Load More Posts
                  </Button>
                </div>
              </>}
          </CardContent>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <CardContent className="p-4 space-y-3">
            {trendingLoading ? <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div> : trendingPosts.length === 0 ? <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-900 font-semibold mb-2">No trending posts yet</p>
                <p className="text-sm text-gray-600">
                  Check back later for popular content!
                </p>
              </div> : <>
                {trendingPosts.map(post => <PostCard key={post.id} post={post} />)}
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => onLoadMore('trending')} className="border-[#0030E3] text-[#0030E3] hover:bg-blue-50 transition-colors">
                    Load More Posts
                  </Button>
                </div>
              </>}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>;
}