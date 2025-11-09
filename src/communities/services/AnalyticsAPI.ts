import { supabase } from "@/lib/supabaseClient";
export interface AnalyticsSummary {
  totalMembers: number;
  activePosts: number;
  commentsPosted: number;
  engagementRate: number;
}
export interface GrowthDataPoint {
  date: string;
  members: number;
}
export interface TopContributor {
  id: string;
  name: string;
  avatar: string | null;
  contributions: number;
  rank: number;
}
export interface ActivityData {
  communityName: string;
  communityId: string;
  posts: number;
  comments: number;
}
export interface AnalyticsFilters {
  communityId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  limit?: number;
  range?: number; // days
}
class AnalyticsAPIService {
  /**
   * Get summary metrics for header cards
   */
  async getSummary(filters: {
    communityId?: string;
  } = {}): Promise<AnalyticsSummary | null> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get total members
      let membersQuery = supabase.from('memberships').select('id', {
        count: 'exact',
        head: true
      });
      if (filters.communityId) {
        membersQuery = membersQuery.eq('community_id', filters.communityId);
      }
      const {
        count: totalMembers
      } = await membersQuery;

      // Get active posts (last 30 days)
      let postsQuery = supabase.from('posts').select('id', {
        count: 'exact',
        head: true
      }).gte('created_at', thirtyDaysAgo.toISOString()).eq('status', 'active');
      if (filters.communityId) {
        postsQuery = postsQuery.eq('community_id', filters.communityId);
      }
      const {
        count: activePosts
      } = await postsQuery;

      // Get comments (last 30 days)
      let commentsQuery = supabase.from('comments').select('id, post_id', {
        count: 'exact',
        head: true
      }).gte('created_at', thirtyDaysAgo.toISOString()).eq('status', 'active');
      if (filters.communityId) {
        // Join with posts to filter by community
        const {
          data: posts
        } = await supabase.from('posts').select('id').eq('community_id', filters.communityId);
        const postIds = posts?.map(p => p.id) || [];
        if (postIds.length === 0) {
          commentsQuery = commentsQuery.in('post_id', ['00000000-0000-0000-0000-000000000000']); // No posts
        } else {
          commentsQuery = commentsQuery.in('post_id', postIds);
        }
      }
      const {
        count: commentsPosted
      } = await commentsQuery;

      // Calculate engagement rate
      const engagementRate = activePosts && activePosts > 0 ? (commentsPosted || 0) / activePosts * 100 : 0;
      return {
        totalMembers: totalMembers || 0,
        activePosts: activePosts || 0,
        commentsPosted: commentsPosted || 0,
        engagementRate: Math.round(engagementRate * 10) / 10 // Round to 1 decimal
      };
    } catch (error) {
      console.error('Failed to fetch analytics summary:', error);
      return null;
    }
  }

  /**
   * Get growth series data for charts
   */
  async getGrowthSeries(filters: AnalyticsFilters = {}): Promise<GrowthDataPoint[]> {
    try {
      const {
        communityId,
        period = 'monthly'
      } = filters;

      // Get memberships with dates
      let query = supabase.from('memberships').select('joined_at, community_id').order('joined_at', {
        ascending: true
      });
      if (communityId) {
        query = query.eq('community_id', communityId);
      }
      const {
        data: memberships,
        error
      } = await query;
      if (error) throw error;
      if (!memberships) return [];

      // Group by period
      const groupedData = new Map<string, number>();
      memberships.forEach(membership => {
        const date = new Date(membership.joined_at);
        let key: string;
        switch (period) {
          case 'daily':
            key = date.toISOString().split('T')[0];
            break;
          case 'weekly':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split('T')[0];
            break;
          case 'monthly':
          default:
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
        }
        groupedData.set(key, (groupedData.get(key) || 0) + 1);
      });

      // Convert to cumulative series
      const sortedKeys = Array.from(groupedData.keys()).sort();
      let cumulative = 0;
      return sortedKeys.map(date => {
        cumulative += groupedData.get(date) || 0;
        return {
          date,
          members: cumulative
        };
      });
    } catch (error) {
      console.error('Failed to fetch growth series:', error);
      return [];
    }
  }

  /**
   * Get top contributors
   */
  async getTopContributors(filters: AnalyticsFilters = {}): Promise<TopContributor[]> {
    try {
      const {
        communityId,
        limit = 10
      } = filters;

      // Get posts count per user
      let postsQuery = supabase.from('posts').select('id, created_by, community_id').eq('status', 'active');
      if (communityId) {
        postsQuery = postsQuery.eq('community_id', communityId);
      }
      const {
        data: posts
      } = await postsQuery;

      // Get comments count per user
      let commentsQuery = supabase.from('comments').select('created_by, post_id').eq('status', 'active');
      if (communityId && posts) {
        const postIds = posts.map(p => p.id);
        if (postIds.length > 0) {
          commentsQuery = commentsQuery.in('post_id', postIds);
        }
      }
      const {
        data: comments
      } = await commentsQuery;

      // Aggregate contributions
      const contributionsMap = new Map<string, number>();
      posts?.forEach(post => {
        if (post.created_by) {
          contributionsMap.set(post.created_by, (contributionsMap.get(post.created_by) || 0) + 1);
        }
      });
      comments?.forEach(comment => {
        if (comment.created_by) {
          contributionsMap.set(comment.created_by, (contributionsMap.get(comment.created_by) || 0) + 1);
        }
      });

      // Get user details
      const userIds = Array.from(contributionsMap.keys());
      if (userIds.length === 0) return [];
      const {
        data: users
      } = await supabase.from('users_local').select('id, username, avatar_url').in('id', userIds);
      if (!users) return [];

      // Build result
      const contributors = users.map(user => ({
        id: user.id,
        name: user.username || 'Unknown User',
        avatar: user.avatar_url,
        contributions: contributionsMap.get(user.id) || 0,
        rank: 0
      })).sort((a, b) => b.contributions - a.contributions).slice(0, limit).map((contributor, index) => ({
        ...contributor,
        rank: index + 1
      }));
      return contributors;
    } catch (error) {
      console.error('Failed to fetch top contributors:', error);
      return [];
    }
  }

  /**
   * Get activity breakdown by community
   */
  async getActivityBreakdown(filters: AnalyticsFilters = {}): Promise<ActivityData[]> {
    try {
      const {
        communityId,
        range = 30
      } = filters;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - range);

      // Get communities
      let communitiesQuery = supabase.from('communities').select('id, name');
      if (communityId) {
        communitiesQuery = communitiesQuery.eq('id', communityId);
      }
      const {
        data: communities
      } = await communitiesQuery;
      if (!communities) return [];

      // Get posts count per community
      const {
        data: posts
      } = await supabase.from('posts').select('id, community_id').gte('created_at', startDate.toISOString()).eq('status', 'active');

      // Get comments count per community (via posts)
      const postsData = await supabase.from('posts').select('id, community_id').gte('created_at', startDate.toISOString());
      const postIds = postsData.data?.map(p => p.id) || [];
      let commentsData = null;
      if (postIds.length > 0) {
        commentsData = await supabase.from('comments').select('post_id').in('post_id', postIds).eq('status', 'active');
      }

      // Build result
      return communities.map(community => {
        const communityPosts = posts?.filter(p => p.community_id === community.id) || [];
        const communityPostIds = postsData.data?.filter(p => p.community_id === community.id).map(p => p.id) || [];
        const communityComments = commentsData?.data?.filter(c => communityPostIds.includes(c.post_id)) || [];
        return {
          communityId: community.id,
          communityName: community.name,
          posts: communityPosts.length,
          comments: communityComments.length
        };
      });
    } catch (error) {
      console.error('Failed to fetch activity breakdown:', error);
      return [];
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(filters: AnalyticsFilters & {
    format: 'csv' | 'xlsx';
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const {
        format,
        ...analyticsFilters
      } = filters;

      // Gather all data
      const [summary, growth, contributors, activity] = await Promise.all([this.getSummary(analyticsFilters), this.getGrowthSeries(analyticsFilters), this.getTopContributors(analyticsFilters), this.getActivityBreakdown(analyticsFilters)]);

      // Build CSV content
      let csvContent = 'Analytics Export\n\n';

      // Summary section
      csvContent += 'Summary\n';
      csvContent += `Total Members,${summary?.totalMembers || 0}\n`;
      csvContent += `Active Posts,${summary?.activePosts || 0}\n`;
      csvContent += `Comments Posted,${summary?.commentsPosted || 0}\n`;
      csvContent += `Engagement Rate,${summary?.engagementRate || 0}%\n\n`;

      // Growth section
      csvContent += 'Growth Over Time\n';
      csvContent += 'Date,Members\n';
      growth.forEach(point => {
        csvContent += `${point.date},${point.members}\n`;
      });
      csvContent += '\n';

      // Contributors section
      csvContent += 'Top Contributors\n';
      csvContent += 'Rank,Name,Contributions\n';
      contributors.forEach(contributor => {
        csvContent += `${contributor.rank},${contributor.name},${contributor.contributions}\n`;
      });
      csvContent += '\n';

      // Activity section
      csvContent += 'Activity Breakdown\n';
      csvContent += 'Community,Posts,Comments\n';
      activity.forEach(item => {
        csvContent += `${item.communityName},${item.posts},${item.comments}\n`;
      });

      // Create download
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-export-${new Date().toISOString().split('T')[0]}.${format}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to export analytics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Subscribe to real-time analytics updates
   */
  subscribe(communityIds: string[], onUpdate: () => void): () => void {
    const channels: any[] = [];

    // Subscribe to posts changes
    const postsChannel = supabase.channel('analytics-posts').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'posts',
      filter: communityIds.length > 0 ? `community_id=in.(${communityIds.join(',')})` : undefined
    }, onUpdate).subscribe();
    channels.push(postsChannel);

    // Subscribe to comments changes
    const commentsChannel = supabase.channel('analytics-comments').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'comments'
    }, onUpdate).subscribe();
    channels.push(commentsChannel);

    // Subscribe to memberships changes
    const membershipsChannel = supabase.channel('analytics-memberships').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'memberships',
      filter: communityIds.length > 0 ? `community_id=in.(${communityIds.join(',')})` : undefined
    }, onUpdate).subscribe();
    channels.push(membershipsChannel);

    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }
}
export const AnalyticsAPI = new AnalyticsAPIService();