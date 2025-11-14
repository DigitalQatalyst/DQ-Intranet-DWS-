import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { PostCard } from '@/communities/components/posts/PostCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'poll' | 'survey' | 'event';
  title: string;
  content?: string;
  created_at: string;
  created_by: string;
  author_username?: string;
  author_avatar?: string;
  community_id: string;
  community_name?: string;
  metadata?: any;
}

interface ActivityFeedProps {
  communityId: string;
  onItemClick?: (item: ActivityItem) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  communityId,
  onItemClick
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [communityId]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch posts
      const postsQuery = supabase
        .from('community_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          created_by,
          community_id,
          post_type,
          communities!inner(name),
          users_local!community_posts_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('community_id', communityId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      const [postsData, postsError] = await safeFetch(postsQuery);

      if (postsError) {
        throw postsError;
      }

      // Fetch polls/surveys from pulse_items that are linked to this community
      const pulseQuery = supabase
        .from('pulse_items')
        .select('id, title, description, type, created_at, created_by, created_by_name')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      const [pulseData, pulseError] = await safeFetch(pulseQuery);

      // Fetch events linked to this community
      const eventsQuery = supabase
        .from('events_v2')
        .select('id, title, description, start_time, created_by')
        .eq('community_id', communityId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10);

      const [eventsData, eventsError] = await safeFetch(eventsQuery);

      // Transform and combine all activities
      const allActivities: ActivityItem[] = [];

      // Add posts
      if (postsData) {
        postsData.forEach((post: any) => {
          allActivities.push({
            id: post.id,
            type: 'post',
            title: post.title,
            content: post.content,
            created_at: post.created_at,
            created_by: post.created_by,
            author_username: post.users_local?.username,
            author_avatar: post.users_local?.avatar_url,
            community_id: post.community_id,
            community_name: post.communities?.name,
            metadata: { post_type: post.post_type }
          });
        });
      }

      // Add polls/surveys
      if (pulseData && !pulseError) {
        pulseData.forEach((item: any) => {
          allActivities.push({
            id: item.id,
            type: item.type === 'poll' ? 'poll' : 'survey',
            title: item.title,
            content: item.description,
            created_at: item.created_at,
            created_by: item.created_by || '',
            author_username: item.created_by_name,
            community_id: communityId,
            metadata: { pulse_type: item.type }
          });
        });
      }

      // Add events
      if (eventsData && !eventsError) {
        eventsData.forEach((event: any) => {
          allActivities.push({
            id: event.id,
            type: 'event',
            title: event.title,
            content: event.description,
            created_at: event.start_time,
            created_by: event.created_by || '',
            community_id: communityId,
            metadata: { event_date: event.start_time }
          });
        });
      }

      // Sort by created_at DESC
      allActivities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(allActivities);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-[#030F35]/60">No recent activity in this community</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        // Render posts using PostCard
        if (activity.type === 'post') {
          return (
            <PostCard
              key={activity.id}
              post={{
                id: activity.id,
                title: activity.title,
                content: activity.content || '',
                created_at: activity.created_at,
                created_by: activity.created_by,
                community_id: activity.community_id,
                community_name: activity.community_name || '',
                author_username: activity.author_username || 'Unknown',
                author_avatar: activity.author_avatar,
                post_type: activity.metadata?.post_type || 'text'
              }}
            />
          );
        }

        // Render other activity types as cards
        return (
          <div
            key={activity.id}
            className="bg-white rounded-lg border border-[#030F35]/20 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
            onClick={() => onItemClick?.(activity)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'poll' ? 'bg-[#030F35]/10 text-[#030F35]' :
                    activity.type === 'survey' ? 'bg-[#1A2E6E]/10 text-[#1A2E6E]' :
                    activity.type === 'event' ? 'bg-[#FB5535]/10 text-[#FB5535]' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.type}
                  </span>
                  <span className="text-xs text-[#030F35]/60">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#030F35] mb-1">
                  {activity.title}
                </h3>
                {activity.content && (
                  <p className="text-[#030F35]/80 text-sm line-clamp-2">
                    {activity.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

