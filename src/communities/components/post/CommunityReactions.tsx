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
    // New table only supports posts, skip if commentId only
    if (!postId) return;

    setLoading(true);
    try {
      // Use new reactions table (posts only)
      const query = supabase
        .from('community_post_reactions_new')
        .select('reaction_type, user_id')
        .eq('post_id' as any, postId);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching reactions:', error);
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data)) {
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
    console.log('🔵 CommunityReactions handleReaction called:', { type, postId, commentId });
    
    // New table only supports posts
    if (!postId) {
      console.warn('CommunityReactions: postId required for new reactions table');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, showing sign-in modal');
      setShowSignInModal(true);
      return;
    }

    // Check if user is a member of the community (if communityId is provided)
    // Note: RLS policy doesn't require membership, but we check it here for UX
    if (communityId && !isMember) {
      console.log('⚠️ Membership check:', { communityId, isMember, isMemberProp, isMemberFromHook });
      // Don't block - let RLS handle it, but show a warning
      console.warn('⚠️ User may not be a member, but attempting reaction anyway (RLS will enforce)');
    }

    // Get auth user ID directly from Supabase session (must use auth.uid())
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user?.id) {
      console.error('❌ Session error:', sessionError);
      toast.error('Unable to verify authentication. Please sign in again.');
      return;
    }
    
    const userId = session.user.id;
    console.log('✅ User ID from session:', userId);
    console.log('✅ Session user object:', {
      id: session.user.id,
      email: session.user.email,
      aud: session.user.aud,
      role: session.user.role
    });
    console.log('📋 Post ID:', postId);
    console.log('📋 Community ID:', communityId);
    
    // Double-check auth.uid() matches
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('🔍 Auth user from getUser():', {
      id: authUser?.id,
      matchesSession: authUser?.id === userId
    });

    // Verify post exists in posts_v2 (required by foreign key)
    const { data: postCheck } = await supabase
      .from('posts_v2')
      .select('id')
      .eq('id' as any, postId)
      .single();
    
    if (!postCheck) {
      console.error('❌ Post not found in posts_v2 table. Post ID:', postId);
      toast.error('Post not found. Please refresh the page.');
      return;
    }
    console.log('✅ Post verified in posts_v2');

    const hasReacted = userReactions.has(type);
    console.log('📊 Reaction state check:', { hasReacted, type, userId, postId });

    try {
      if (hasReacted) {
        // Remove reaction from new table
        console.log('🔄 Attempting to remove reaction...');
        const query = supabase
          .from('community_post_reactions_new')
          .delete()
          .eq('user_id' as any, userId)
          .eq('post_id' as any, postId)
          .eq('reaction_type' as any, type);

        const [data, error] = await safeFetch(query);
        console.log('📥 Delete response:', { data, error });

        if (error) {
          console.error('❌ Error removing reaction:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error('Failed to remove reaction: ' + (error.message || 'Unknown error'));
          throw error;
        }
        
        console.log('✅ Reaction removed successfully', data);

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
        // Add reaction to new table
        const reactionData = {
          post_id: postId,
          user_id: userId,
          reaction_type: type
        };
        console.log('🔄 Attempting to add reaction...', reactionData);

        // Verify user_id format matches what auth.uid() expects
        console.log('🔍 Verifying user_id format:', {
          userId,
          userIdType: typeof userId,
          userIdLength: userId?.length,
          isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '')
        });

        const query = supabase
          .from('community_post_reactions_new')
          .insert(reactionData as any);

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
          console.error('❌ Error adding reaction:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            reactionData
          });
          // If unique constraint violation, user already reacted
          if (error.code === '23505') {
            console.log('⚠️ User already reacted, refreshing...');
            fetchReactions();
            return;
          }
          toast.error('Failed to add reaction: ' + (error.message || 'Unknown error'));
          return;
        }
        
        console.log('✅ Reaction added successfully', data);

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
        onClick={(e) => {
          console.log('🔵 Like button clicked');
          e.stopPropagation();
          e.preventDefault();
          handleReaction('like');
        }}
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
        onClick={(e) => {
          console.log('🔵 Helpful button clicked');
          e.stopPropagation();
          e.preventDefault();
          handleReaction('helpful');
        }}
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
        onClick={(e) => {
          console.log('🔵 Insightful button clicked');
          e.stopPropagation();
          e.preventDefault();
          handleReaction('insightful');
        }}
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


