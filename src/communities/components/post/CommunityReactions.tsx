import React, { useState, useEffect } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { useCommunityMembership } from '@/communities/hooks/useCommunityMembership';
import { Heart, ThumbsUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface CommunityReactionsProps {
  postId?: string;
  commentId?: string;
  communityId?: string;
  isMember?: boolean;
  onReactionChange?: () => void;
}

type ReactionType = 'like' | 'helpful' | 'insightful';

export const CommunityReactions: React.FC<CommunityReactionsProps> = ({
  postId,
  commentId,
  communityId,
  isMember: isMemberProp,
  onReactionChange
}) => {
  const { user, isAuthenticated } = useAuth();
  const { isMember: isMemberFromHook } = useCommunityMembership(communityId);
  // Use prop if provided, otherwise fall back to hook
  const isMember = isMemberProp !== undefined ? isMemberProp : isMemberFromHook;
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    like: 0,
    helpful: 0,
    insightful: 0
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [postId, commentId]);

  const fetchReactions = async () => {
    if (!postId && !commentId) return;

    setLoading(true);
    try {
      const query = supabase
        .from('reactions')
        .select('reaction_type, user_id')
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching reactions:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const counts: Record<ReactionType, number> = {
          like: 0,
          helpful: 0,
          insightful: 0
        };
        const userReactionSet = new Set<ReactionType>();

        if (isAuthenticated && user) {
          // Get auth user ID directly from Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id || user?.id;
          
          data.forEach((reaction: any) => {
            if (reaction.reaction_type in counts) {
              counts[reaction.reaction_type as ReactionType]++;
            }
            if (userId && reaction.user_id === userId) {
              userReactionSet.add(reaction.reaction_type as ReactionType);
            }
          });
        } else {
          // Just count reactions, don't track user reactions
          data.forEach((reaction: any) => {
            if (reaction.reaction_type in counts) {
              counts[reaction.reaction_type as ReactionType]++;
            }
          });
        }

        setReactions(counts);
        setUserReactions(userReactionSet);
      }
    } catch (err) {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: ReactionType) => {
    if (!postId && !commentId) return;

    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      return;
    }

    // Check if user is a member of the community (if communityId is provided)
    if (communityId && !isMember) {
      toast.error('You must join the community before reacting');
      return;
    }

    // Get auth user ID directly from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || user?.id;
    
    if (!userId) {
      toast.error('Unable to identify user. Please sign in again.');
      return;
    }

    const hasReacted = userReactions.has(type);

    try {
      if (hasReacted) {
        // Remove reaction
        const query = supabase
          .from('reactions')
          .delete()
          .eq('user_id', userId)
          .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
          .eq('reaction_type', type);

        const [, error] = await safeFetch(query);

        if (error) throw error;

        setReactions(prev => ({
          ...prev,
          [type]: Math.max(0, prev[type] - 1)
        }));
        setUserReactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(type);
          return newSet;
        });
      } else {
        // Add reaction
        const reactionData: any = {
          user_id: userId,
          reaction_type: type
        };

        if (postId) {
          reactionData.post_id = postId;
        } else if (commentId) {
          reactionData.comment_id = commentId;
        }

        const query = supabase
          .from('reactions')
          .insert(reactionData);

        const [, error] = await safeFetch(query);

        if (error) {
          // If unique constraint violation, user already reacted
          if (error.code === '23505') {
            fetchReactions();
            return;
          }
          toast.error('Failed to add reaction: ' + (error.message || 'Unknown error'));
          return;
        }

        setReactions(prev => ({
          ...prev,
          [type]: prev[type] + 1
        }));
        setUserReactions(prev => new Set(prev).add(type));
      }

      onReactionChange?.();
    } catch (err: any) {
      toast.error('Failed to update reaction: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('like')}
        disabled={!isAuthenticated}
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('like')
            ? 'bg-[#FB5535]/10 text-[#FB5535] hover:bg-[#FB5535]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Heart
          className={`h-3.5 w-3.5 mr-1.5 ${
            userReactions.has('like') ? 'fill-current' : ''
          }`}
        />
        <span className="font-semibold">{reactions.like}</span>
        <span>Like</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('helpful')}
        disabled={!isAuthenticated}
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('helpful')
            ? 'bg-[#030F35]/10 text-[#030F35] hover:bg-[#030F35]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ThumbsUp
          className={`h-3.5 w-3.5 mr-1.5 ${
            userReactions.has('helpful') ? 'fill-current' : ''
          }`}
        />
        <span className="font-semibold">{reactions.helpful}</span>
        <span>Helpful</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('insightful')}
        disabled={!isAuthenticated}
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('insightful')
            ? 'bg-[#1A2E6E]/10 text-[#1A2E6E] hover:bg-[#1A2E6E]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Lightbulb
          className={`h-3.5 w-3.5 mr-1.5 ${
            userReactions.has('insightful') ? 'fill-current' : ''
          }`}
        />
        <span className="font-semibold">{reactions.insightful}</span>
        <span>Insightful</span>
      </Button>
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSuccess={() => {
          setShowSignInModal(false);
        }}
        title="Sign In to React"
        description="You need to be signed in to react to posts and comments."
      />
    </div>
  );
};


