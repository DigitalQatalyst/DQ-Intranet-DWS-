import React, { useState, useEffect } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { Heart, ThumbsUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface CommunityReactionsProps {
  postId?: string;
  commentId?: string;
  onReactionChange?: () => void;
}

type ReactionType = 'like' | 'helpful' | 'insightful';

export const CommunityReactions: React.FC<CommunityReactionsProps> = ({
  postId,
  commentId,
  onReactionChange
}) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    like: 0,
    helpful: 0,
    insightful: 0
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReactions();
  }, [postId, commentId, user]);

  const fetchReactions = async () => {
    if (!postId && !commentId) return;

    setLoading(true);
    try {
      const query = supabase
        .from('community_reactions')
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

        data.forEach((reaction: any) => {
          if (reaction.reaction_type in counts) {
            counts[reaction.reaction_type as ReactionType]++;
          }
          if (user && reaction.user_id === user.id) {
            userReactionSet.add(reaction.reaction_type as ReactionType);
          }
        });

        setReactions(counts);
        setUserReactions(userReactionSet);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: ReactionType) => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    if (!postId && !commentId) return;

    const hasReacted = userReactions.has(type);

    try {
      if (hasReacted) {
        // Remove reaction
        const query = supabase
          .from('community_reactions')
          .delete()
          .eq('user_id', user.id)
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
          user_id: user.id,
          reaction_type: type
        };

        if (postId) {
          reactionData.post_id = postId;
        } else if (commentId) {
          reactionData.comment_id = commentId;
        }

        const query = supabase
          .from('community_reactions')
          .insert(reactionData)
          .select()
          .single();

        const [, error] = await safeFetch(query);

        if (error) {
          // If unique constraint violation, user already reacted
          if (error.code === '23505') {
            fetchReactions();
            return;
          }
          throw error;
        }

        setReactions(prev => ({
          ...prev,
          [type]: prev[type] + 1
        }));
        setUserReactions(prev => new Set(prev).add(type));
      }

      onReactionChange?.();
    } catch (err: any) {
      console.error('Error toggling reaction:', err);
      toast.error('Failed to update reaction');
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
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('like')
            ? 'bg-[#FB5535]/10 text-[#FB5535] hover:bg-[#FB5535]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        }`}
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
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('helpful')
            ? 'bg-[#030F35]/10 text-[#030F35] hover:bg-[#030F35]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        }`}
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
        className={`h-8 px-3 text-xs transition-all ${
          userReactions.has('insightful')
            ? 'bg-[#1A2E6E]/10 text-[#1A2E6E] hover:bg-[#1A2E6E]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        }`}
      >
        <Lightbulb
          className={`h-3.5 w-3.5 mr-1.5 ${
            userReactions.has('insightful') ? 'fill-current' : ''
          }`}
        />
        <span className="font-semibold">{reactions.insightful}</span>
        <span>Insightful</span>
      </Button>
    </div>
  );
};

