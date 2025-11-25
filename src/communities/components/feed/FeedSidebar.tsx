import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/communities/components/ui/card';
import { Badge } from '@/communities/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { Users, Sparkles } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
interface TrendingTopic {
  tag: string;
  post_count: number;
}
interface Community {
  id: string;
  name: string;
  membercount: number;
  imageurl?: string;
}
interface FeedSidebarProps {
  onTagClick: (tag: string) => void;
}
interface CommunityMembership {
  community_id: string;
  joined: boolean;
}
export function FeedSidebar({
  onTagClick
}: FeedSidebarProps) {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [topCommunities, setTopCommunities] = useState<Community[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [memberships, setMemberships] = useState<CommunityMembership[]>([]);
  useEffect(() => {
    fetchTopCommunities();
    fetchTrendingTopics();
    if (user) {
      fetchMemberships();
    }
  }, [user]);
  const fetchTopCommunities = async () => {
    try {
      // Use communities_with_counts view which includes member_count
      // Top communities are determined by: highest member count (most popular communities)
      const {
        data,
        error
      } = await supabase.from('communities_with_counts').select('id, name, member_count, imageurl').order('member_count', {
        ascending: false
      }).limit(4);
      if (error) {
        console.error('Error fetching top communities:', error);
        setTopCommunities([]);
        return;
      }
      if (data && Array.isArray(data)) {
        // Map member_count to membercount for compatibility with interface
        setTopCommunities(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          membercount: c.member_count || 0,
          imageurl: c.imageurl
        })) as any as Community[]);
      } else {
        setTopCommunities([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching top communities:', err);
      setTopCommunities([]);
    }
  };
  const fetchTrendingTopics = async () => {
    try {
      const {
        data,
        error
      } = await supabase.rpc('get_trending_topics', {
        limit_count: 5
      });
      if (error) {
        console.error('Error fetching trending topics:', error);
        setTrendingTopics([]);
        return;
      }
      if (data && Array.isArray(data)) {
        setTrendingTopics(data as unknown as TrendingTopic[]);
      } else {
        setTrendingTopics([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching trending topics:', err);
      setTrendingTopics([]);
    }
  };
  const fetchMemberships = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('memberships').select('community_id').eq('user_id' as any, user.id as any);
    if (data && Array.isArray(data)) {
      setMemberships(data.map((m: any) => ({
        community_id: m.community_id,
        joined: true
      })));
    }
  };
  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      // Show toast and navigate to community page where sign-in modal will be shown
      // The Community page will handle showing the sign-in modal
      navigate(`/community/${communityId}`);
      return;
    }
    
    // Use centralized membership service (optimized - single table operation)
    const { joinCommunity } = await import('@/communities/services/membershipService');
    await joinCommunity(communityId, user, {
      refreshData: async () => {
        // Update local memberships state
        setMemberships([...memberships, {
          community_id: communityId,
          joined: true
        }]);
      },
    });
  };
  const isJoined = (communityId: string) => {
    return memberships.some(m => m.community_id === communityId && m.joined);
  };
  return <div className="space-y-4 lg:sticky lg:top-4">
      {/* Trending Topics */}
      <Card className="shadow-sm rounded-xl bg-white border border-gray-100 overflow-hidden">
        <CardHeader className="p-4 pb-3 bg-dq-navy/10">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
            <Sparkles className="h-4 w-4 text-dq-navy" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 min-h-[60px] items-center justify-center">
            {trendingTopics.length > 0 ? trendingTopics.map(topic => <Badge key={topic.tag} variant="secondary" onClick={() => onTagClick(topic.tag)} className="cursor-pointer bg-gray-100 hover:bg-[#0030E3] hover:text-white transition-all duration-200 border-0 text-sm px-3 py-1.5 font-medium">
                  #{topic.tag}
                  <span className="ml-1.5 text-xs opacity-70">({topic.post_count})</span>
                </Badge>) : <p className="text-xs text-gray-500 text-center w-full py-4">No trending topics yet</p>}
          </div>
        </CardContent>
      </Card>

      {/* Top Communities */}
      <Card className="shadow-sm rounded-xl bg-white border border-gray-100">
        <CardHeader className="p-4 pb-3 bg-dq-navy/10">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
            <Users className="h-4 w-4 text-dq-navy" />
            Top Communities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {topCommunities.length > 0 ? (
            <div className="space-y-3">
              {topCommunities.map(community => {
                const joined = isJoined(community.id);
                return <div key={community.id} className="flex items-center justify-between hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-all duration-200 cursor-pointer group" onClick={() => navigate(`/community/${community.id}`)}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={community.imageurl} />
                          <AvatarFallback className="bg-dq-navy text-white text-xs font-semibold">
                            {community.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {community.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {community.membercount?.toLocaleString() || 0} members
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={e => {
                    e.stopPropagation();
                    if (!joined) handleJoinCommunity(community.id);
                  }} disabled={joined} className={`h-8 text-xs px-3 ${joined ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-dq-navy text-white hover:bg-[#13285A]'} transition-all duration-200`}>
                        {joined ? 'Joined' : 'Join'}
                      </Button>
                    </div>;
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[120px]">
              <p className="text-xs text-gray-500 text-center">No top communities yet</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>;
}