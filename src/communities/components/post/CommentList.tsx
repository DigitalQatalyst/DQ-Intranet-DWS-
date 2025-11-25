import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from '@/communities/utils/safeFetch';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { HiddenContentPlaceholder } from '@/communities/components/moderation/HiddenContentPlaceholder';
import { usePermissions } from '@/communities/hooks/usePermissions';
interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_username: string;
  author_avatar: string | null;
  status: string;
}
interface CommentListProps {
  postId: string;
  refreshKey?: number;
  communityId?: string;
}
export function CommentList({
  postId,
  refreshKey,
  communityId
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const permissions = usePermissions(communityId);
  useEffect(() => {
    fetchComments();
  }, [postId, refreshKey]);
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    // Fetch comments from new table
    const query = supabase
      .from('community_post_comments_new')
      .select('id, content, status, created_at, user_id')
      .eq('post_id' as any, postId)
      .order('created_at', { ascending: true });
    
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load comments');
      setLoading(false);
      return;
    }
    if (data && Array.isArray(data)) {
      // Fetch user details for each comment
      const userIds = [...new Set(data.map((c: any) => c.user_id))];
      const userDetailsMap = new Map();
      
      // Fetch user details from users_local table
      for (const userId of userIds) {
        const [userData] = await safeFetch(
          supabase
            .from('users_local')
            .select('id, username, avatar_url')
            .eq('id', userId)
            .maybeSingle()
        );
        if (userData) {
          userDetailsMap.set(userId, userData);
        }
      }
      
      const formattedComments: Comment[] = data.map((comment: any) => {
        const userDetails = userDetailsMap.get(comment.user_id);
        return {
          id: comment.id,
          content: comment.content,
          status: comment.status || 'active',
          created_at: comment.created_at,
          author_username: userDetails?.username || 'Unknown',
          author_avatar: userDetails?.avatar_url || null
        };
      });
      setComments(formattedComments);
    }
    setLoading(false);
  };
  if (loading) {
    return <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="flex items-start gap-3 py-4 border-t first:border-t-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>)}
      </div>;
  }
  if (error) {
    return <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchComments}>
          Retry
        </Button>
      </div>;
  }
  if (comments.length === 0) {
    return <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>;
  }
  return <div className="space-y-4">
      {comments.map(comment => <div key={comment.id} className="flex items-start gap-3 py-4 border-t border-border first:border-t-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={comment.author_avatar || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {comment.author_username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-semibold text-foreground">
                  {comment.author_username}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              {comment.status === 'flagged' || comment.status === 'deleted' ? <HiddenContentPlaceholder contentType="comment" canModerate={permissions.canModeratePosts}>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </HiddenContentPlaceholder> : <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>}
            </div>
        </div>)}
    </div>;
}