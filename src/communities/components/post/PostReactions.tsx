import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/communities/contexts/AuthProvider';
import { getCurrentUserId } from '@/communities/utils/userUtils';
import { safeFetch } from '@/communities/utils/safeFetch';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { ThumbsUp, Lightbulb, Share2 } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { toast } from 'sonner';
interface PostReactionsProps {
  postId: string;
  communityId?: string;
  isMember?: boolean;
  helpfulCount: number;
  insightfulCount: number;
}
export function PostReactions({
  postId,
  communityId,
  isMember = false,
  helpfulCount: initialHelpfulCount,
  insightfulCount: initialInsightfulCount
}: PostReactionsProps) {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [hasReactedHelpful, setHasReactedHelpful] = useState(false);
  const [hasReactedInsightful, setHasReactedInsightful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [insightfulCount, setInsightfulCount] = useState(initialInsightfulCount);
  const [isReacting, setIsReacting] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  useEffect(() => {
    checkUserReactions();
    fetchReactionCounts();
  }, [postId, isAuthenticated, user]);
  
  useEffect(() => {
    // Update counts when props change
    setHelpfulCount(initialHelpfulCount);
    setInsightfulCount(initialInsightfulCount);
  }, [initialHelpfulCount, initialInsightfulCount]);
  
  const fetchReactionCounts = async () => {
    try {
      const query = supabase
        .from('community_post_reactions_new')
        .select('reaction_type')
        .eq('post_id' as any, postId);
      
      const [data, error] = await safeFetch(query);
      
      if (error) {
        return;
      }
      
      if (data && Array.isArray(data)) {
        const helpful = data.filter((r: any) => r.reaction_type === 'helpful').length;
        const insightful = data.filter((r: any) => r.reaction_type === 'insightful').length;
        setHelpfulCount(helpful);
        setInsightfulCount(insightful);
      }
    } catch (err) {
      // Silently handle errors
    }
  };
  
  const checkUserReactions = async () => {
    if (!isAuthenticated || !user) {
      // Reset reactions when not authenticated
      setHasReactedHelpful(false);
      setHasReactedInsightful(false);
      return;
    }
    const userId = getCurrentUserId(user);
    if (!userId) {
      setHasReactedHelpful(false);
      setHasReactedInsightful(false);
      return;
    }
    
    const query = supabase
      .from('community_post_reactions_new')
      .select('reaction_type')
      .eq('post_id' as any, postId)
      .eq('user_id' as any, userId);
    const [data, error] = await safeFetch(query);
    if (error) {
      console.error('Error checking user reactions:', error);
      return;
    }
    if (data && Array.isArray(data)) {
      setHasReactedHelpful(data.some((r: any) => r.reaction_type === 'helpful'));
      setHasReactedInsightful(data.some((r: any) => r.reaction_type === 'insightful'));
    }
  };
  const handleReaction = async (type: 'helpful' | 'insightful') => {
    if (isReacting) return; // Prevent double-clicks
    
    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, showing sign-in modal');
      setShowSignInModal(true);
      return;
    }
    
    setIsReacting(true);
    
    try {
      // Get user ID directly from Supabase session (must match auth.uid() for RLS)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        console.error('❌ Session error:', sessionError);
        toast.error('Unable to verify authentication. Please sign in again.');
        setIsReacting(false);
        return;
      }
      
      const userId = session.user.id;
      console.log('✅ User ID from session:', userId);
      
      // Check membership if communityId is provided
      if (communityId) {
        // Use optimized membership check (single table query)
        const { checkIsMember } = await import('@/communities/utils/membershipUtils');
        const isCommunityMember = await checkIsMember(userId, communityId);
        
        if (!isCommunityMember) {
          toast.error('You must be a member of this community to react');
          setIsReacting(false);
          return;
        }
      }
      
      const hasReacted = type === 'helpful' ? hasReactedHelpful : hasReactedInsightful;
      
      if (hasReacted) {
        // Remove reaction from new table
        const query = supabase
          .from('community_post_reactions_new')
          .delete()
          .eq('post_id' as any, postId)
          .eq('user_id' as any, userId)
          .eq('reaction_type' as any, type);
        
        const [, error] = await safeFetch(query);
        
        if (error) {
          console.error('❌ Error removing reaction:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error('Failed to remove reaction: ' + (error.message || 'Unknown error'));
          setIsReacting(false);
          return;
        }
        
        console.log('✅ Reaction removed successfully');
        
        // Update local state optimistically
        if (type === 'helpful') {
          setHelpfulCount(prev => Math.max(0, prev - 1));
          setHasReactedHelpful(false);
        } else {
          setInsightfulCount(prev => Math.max(0, prev - 1));
          setHasReactedInsightful(false);
        }
        
        // Refresh counts from database to ensure accuracy
        await fetchReactionCounts();
      } else {
        // Add reaction to new table
        const reactionData = {
          post_id: postId,
          user_id: userId,
          reaction_type: type
        };
        
        const query = supabase
          .from('community_post_reactions_new')
          .insert(reactionData as any);
        
        const [, error] = await safeFetch(query);
        
        if (error) {
          console.error('❌ Error adding reaction:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            reactionData
          });
          toast.error('Failed to add reaction: ' + (error.message || 'Unknown error'));
          setIsReacting(false);
          return;
        }
        
        console.log('✅ Reaction added successfully');
        
        // Update local state optimistically
        if (type === 'helpful') {
          setHelpfulCount(prev => prev + 1);
          setHasReactedHelpful(true);
        } else {
          setInsightfulCount(prev => prev + 1);
          setHasReactedInsightful(true);
        }
        
        // Refresh counts from database to ensure accuracy
        await fetchReactionCounts();
      }
    } catch (err) {
      console.error('Unexpected error in handleReaction:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsReacting(false);
    }
  };
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Post link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isReacting || !isAuthenticated}
          className={`h-9 px-4 gap-2 rounded-full transition-all ${hasReactedHelpful ? 'bg-dq-navy text-white border-dq-navy hover:bg-[#13285A] hover:border-[#13285A]' : 'hover:bg-dq-navy/10 hover:text-dq-navy hover:border-dq-navy/30'} ${isReacting || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            handleReaction('helpful');
          }}
        >
          <ThumbsUp className={`h-4 w-4 ${hasReactedHelpful ? 'fill-white' : ''}`} />
          <span className="font-medium">{helpfulCount}</span>
          <span>Helpful</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isReacting || !isAuthenticated}
          className={`h-9 px-4 gap-2 rounded-full transition-all ${hasReactedInsightful ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600' : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'} ${isReacting || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            handleReaction('insightful');
          }}
        >
          <Lightbulb className={`h-4 w-4 ${hasReactedInsightful ? 'fill-white' : ''}`} />
          <span className="font-medium">{insightfulCount}</span>
          <span>Insightful</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-4 gap-2 rounded-full ml-auto hover:bg-gray-50" 
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSuccess={() => {
          setShowSignInModal(false);
        }}
        title="Sign In to React"
        description="You need to be signed in to react to posts."
      />
    </>
  );
}