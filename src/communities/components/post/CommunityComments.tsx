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

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  content_html?: string;
  created_at: string;
  updated_at: string;
  status: string;
  author_username?: string;
  author_avatar?: string;
  reply_count?: number;
  depth?: number;
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
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Fetch all comments for this post
      const query = supabase
        .from('community_comments')
        .select(`
          *,
          users_local!community_comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        setLoading(false);
        return;
      }

      if (data) {
        // Build comment tree
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        // First pass: create comment objects
        data.forEach((item: any) => {
          const comment: Comment = {
            id: item.id,
            post_id: item.post_id,
            user_id: item.user_id,
            parent_id: item.parent_id,
            content: item.content,
            content_html: item.content_html,
            created_at: item.created_at,
            updated_at: item.updated_at,
            status: item.status,
            author_username: item.users_local?.username || 'Unknown',
            author_avatar: item.users_local?.avatar_url || null,
            depth: 0
          };
          commentMap.set(comment.id, comment);
        });

        // Second pass: build tree and count replies
        commentMap.forEach((comment) => {
          if (comment.parent_id) {
            const parent = commentMap.get(comment.parent_id);
            if (parent) {
              comment.depth = (parent.depth || 0) + 1;
              parent.reply_count = (parent.reply_count || 0) + 1;
            }
          } else {
            rootComments.push(comment);
          }
        });

        // Flatten tree for display (depth-first)
        const flattened: Comment[] = [];
        const flatten = (comment: Comment) => {
          flattened.push(comment);
          const replies = Array.from(commentMap.values()).filter(
            c => c.parent_id === comment.id
          );
          replies.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          replies.forEach(reply => flatten(reply));
        };

        rootComments
          .sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          .forEach(comment => flatten(comment));

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
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!isMember) {
      toast.error('You must be a member to comment');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        post_id: postId,
        user_id: user.id,
        parent_id: parentId,
        content: replyContent.trim(),
        status: 'active'
      };

      const query = supabase
        .from('community_comments')
        .insert(commentData)
        .select()
        .single();

      const [data, error] = await safeFetch(query);

      if (error) {
        throw error;
      }

      toast.success('Comment added');
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
      onCommentAdded?.();
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment) => {
    const isReply = comment.parent_id !== null;
    const indentLevel = comment.depth || 0;

    return (
      <div
        key={comment.id}
        className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}
        style={{ marginLeft: indentLevel > 0 ? `${indentLevel * 2}rem` : '0' }}
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
            {isMember && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-[#030F35]/60 hover:text-[#030F35] transition-colors flex items-center gap-1"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            )}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] text-sm"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                    className="bg-dq-navy hover:bg-[#13285A] text-white text-xs"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Post Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
          {/* Add Comment Form */}
          {isMember && (
            <div className="bg-[#030F35]/5 rounded-lg p-4 mb-4 border border-[#030F35]/20">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="relative overflow-hidden">
                    <GradientAvatar seed={user?.id || 'anonymous'} className="absolute inset-0" />
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
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-8 text-[#030F35]/60 text-sm">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-[#030F35]/60 text-sm">
              {isMember ? 'No comments yet. Be the first to comment!' : 'Sign in and join to comment'}
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

