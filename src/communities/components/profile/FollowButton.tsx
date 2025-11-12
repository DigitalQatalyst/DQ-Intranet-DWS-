import { useState, useEffect } from 'react';
import { Button } from '@/communities/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { useToast } from '@/communities/hooks/use-toast';
interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
}
export function FollowButton({
  currentUserId,
  targetUserId
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    checkFollowStatus();
  }, [currentUserId, targetUserId]);
  const checkFollowStatus = async () => {
    try {
      console.log('Checking follow status:', {
        currentUserId,
        targetUserId
      });
      const {
        data,
        error
      } = await supabase.rpc('get_relationship_status', {
        p_follower_id: currentUserId,
        p_following_id: targetUserId
      });
      console.log('Follow status result:', {
        data,
        error
      });
      if (error) throw error;
      setIsFollowing(data === 'follow');
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };
  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.rpc('toggle_follow', {
        p_follower_id: currentUserId,
        p_following_id: targetUserId
      });
      if (error) throw error;
      setIsFollowing(data === 'following');
      toast({
        title: data === 'following' ? 'Following' : 'Unfollowed',
        description: data === 'following' ? 'You are now following this member' : 'You have unfollowed this member'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update follow status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  return <Button onClick={handleToggleFollow} disabled={loading} variant={isFollowing ? 'outline' : 'default'} className="w-full gap-2 min-h-[44px] text-dq-navy bg-dq-navy/20 hover:bg-dq-navy/10">
      {isFollowing ? <>
          <UserCheck className="h-4 w-4" />
          Following
        </> : <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>}
    </Button>;
}