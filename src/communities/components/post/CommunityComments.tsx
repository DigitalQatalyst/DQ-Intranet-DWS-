import React, { useState, useEffect } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { Textarea } from '@/communities/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
import { ChevronDown, ChevronUp, Send, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { SignInModal } from '@/communities/components/auth/SignInModal';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  content_html?: string;
  created_at: string;
  updated_at: string;
  status: string;
  author_username?: string;
  author_avatar?: string;
}

interface CommunityCommentsProps {
  postId: string;
  communityId: string;
  isMember: boolean;
  onCommentAdded?: () => void;
}

export const CommunityComments: React.FC<CommunityCommentsProps> = ({
  postId,
  communityId,
  isMember,
  onCommentAdded
}) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Fetch all comments from new table
      const query = supabase
        .from('community_post_comments_new')
        .select('id, post_id, user_id, content, created_at, updated_at, status')
        .eq('post_id' as any, postId)
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data)) {
        // Fetch user details for each comment
        const userIds = [...new Set(data.map((c: any) => c.user_id))];
        const userDetailsMap = new Map();
        
        // Fetch user details from users_local table
        // Note: users_local.id references auth.users.id, so they should match
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
          } else {
            // Fallback: create a basic user object if not found in users_local
            // This can happen if the user was created directly in auth.users
            userDetailsMap.set(userId, {
              id: userId,
              username: 'User',
              avatar_url: null
            });
          }
        }

        // Build comment objects
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        // First pass: create comment objects
        data.forEach((item: any) => {
          const userDetails = userDetailsMap.get(item.user_id);
          const comment: Comment = {
            id: item.id,
            post_id: item.post_id,
            user_id: item.user_id,
            content: item.content,
            content_html: null, // New table doesn't have content_html
            created_at: item.created_at,
            updated_at: item.updated_at,
            status: item.status,
            author_username: userDetails?.username || 'Unknown',
            author_avatar: userDetails?.avatar_url || null
          };
          commentMap.set(comment.id, comment);
        });

        // Second pass: build tree (all comments are root-level for now)
        commentMap.forEach((comment) => {
          rootComments.push(comment);
        });

        // Sort comments by creation time
        const flattened: Comment[] = rootComments
          .sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

        setComments(flattened);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string | null = null) => {
    console.log('handleSubmitReply called:', { parentId, replyContent: replyContent.trim(), isAuthenticated, isMember });
    
    if (!replyContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('User not authenticated, showing sign in modal');
      setShowSignInModal(true);
      return;
    }

    // Check if user is a member of the community (warn but don't block - RLS will enforce)
    if (!isMember) {
      console.warn('⚠️ User may not be a member, but attempting comment anyway (RLS will enforce)');
    }

    console.log('🔄 Starting comment submission...');
    setSubmitting(true);
    try {
      // Get auth user ID directly from Supabase session (must match auth.uid() for RLS)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        console.error('❌ Session error:', sessionError);
        toast.error('Unable to verify authentication. Please sign in again.');
        setSubmitting(false);
        return;
      }
      
      const authUserId = session.user.id;
      console.log('✅ User ID from session:', authUserId);
      console.log('✅ Submitting comment:', { postId, userId: authUserId, contentLength: replyContent.trim().length });
      
      // Verify post exists in posts_v2 (required by foreign key)
      const { data: postCheck } = await supabase
        .from('posts_v2')
        .select('id')
        .eq('id' as any, postId)
        .single();
      
      if (!postCheck) {
        console.error('❌ Post not found in posts_v2 table. Post ID:', postId);
        toast.error('Post not found. Please refresh the page.');
        setSubmitting(false);
        return;
      }
      console.log('✅ Post verified in posts_v2');

      // Insert into new comments table using user_id (must match auth.uid())
      const commentData = {
        post_id: postId,
        user_id: authUserId,
        content: replyContent.trim(),
        status: 'active'
      };
      
      console.log('🔄 Attempting to insert comment...', commentData);
      console.log('🔍 Verifying user_id format:', {
        userId: authUserId,
        userIdType: typeof authUserId,
        userIdLength: authUserId?.length,
        isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(authUserId || '')
      });

      const query = supabase
        .from('community_post_comments_new')
        .insert(commentData as any)
        .select()
        .single();

      const [data, error] = await safeFetch(query);
      console.log('📥 Insert response:', { 
        data, 
        error,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      });

      if (error) {
        console.error('❌ Comment insert error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          commentData
        });
        throw error;
      }

      console.log('✅ Comment created successfully:', data);
      toast.success('Comment added');
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
      onCommentAdded?.();
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      const errorMessage = err.message || err.details || 'Unknown error occurred';
      toast.error(`Failed to add comment: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment) => {
    return (
      <div
        key={comment.id}
        className=""
      >
        <div className="flex gap-3 py-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author_avatar || undefined} />
            <AvatarFallback className="relative overflow-hidden">
              <GradientAvatar seed={comment.user_id} className="absolute inset-0" />
              <span className="relative z-10 text-white font-semibold text-xs">
                {comment.author_username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-[#030F35]">
                {comment.author_username}
              </span>
              <span className="text-xs text-[#030F35]/60">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <div className="text-sm text-[#030F35]/80 mb-2">
              {comment.content_html ? (
                <div dangerouslySetInnerHTML={{ __html: comment.content_html }} />
              ) : (
                <p>{comment.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const commentCount = comments.length;

  return (
    <div className="border-t border-[#030F35]/20 mt-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-[#030F35] hover:text-[#13285A] transition-colors"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {expanded && (
        <div className="space-y-2">
          {/* Add Comment Form - Only for authenticated users */}
          {isAuthenticated ? (
            <div className="bg-[#030F35]/5 rounded-lg p-4 mb-4 border border-[#030F35]/20">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="relative overflow-hidden">
                    <GradientAvatar seed={user?.id || 'default'} className="absolute inset-0" />
                    <span className="relative z-10 text-white font-semibold text-xs">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[100px] text-sm mb-2"
                    rows={4}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(null)}
                    disabled={submitting || !replyContent.trim()}
                    className="bg-dq-navy hover:bg-[#13285A] text-white"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#030F35]/5 rounded-lg p-4 mb-4 border border-[#030F35]/20 text-center">
              <p className="text-sm text-[#030F35]/60 mb-3">Sign in to join the conversation</p>
              <Button
                size="sm"
                onClick={() => setShowSignInModal(true)}
                className="bg-dq-navy hover:bg-[#13285A] text-white"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-8 text-[#030F35]/60 text-sm">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-[#030F35]/60 text-sm">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      )}
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSuccess={() => {
          setShowSignInModal(false);
        }}
        title="Sign In to Comment"
        description="You need to be signed in to comment on posts."
      />
    </div>
  );
};


