/**
 * Membership Service
 * Centralized service for joining and leaving communities
 * This eliminates duplicate logic across multiple components
 */

import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { getCurrentUserId } from '@/communities/utils/userUtils';
import { checkIsMember } from '@/communities/utils/membershipUtils';
import { handleMembershipError, showMembershipSuccess } from '@/communities/utils/membershipErrors';
import { toast } from 'sonner';

export interface JoinCommunityOptions {
  userId?: string;
  validateCommunity?: boolean;
  refreshData?: () => Promise<void>;
  onSuccess?: (communityId: string) => void;
  onError?: (error: Error) => void;
}

export interface LeaveCommunityOptions {
  userId?: string;
  refreshData?: () => Promise<void>;
  onSuccess?: (communityId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Join a community
 * Requires Supabase authentication - no anonymous users allowed
 * Uses only the memberships table (primary source of truth)
 * 
 * @param communityId - Community ID to join
 * @param user - User object from auth context (required)
 * @param options - Additional options for join operation
 * @returns Promise<boolean> - True if join was successful
 */
export async function joinCommunity(
  communityId: string,
  user: any,
  options: JoinCommunityOptions = {}
): Promise<boolean> {
  console.log('🔵 joinCommunity called', { communityId, hasUser: !!user, user });
  
  // Get auth user ID directly from Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  const authUserId = session?.user?.id;
  const userId = options.userId || authUserId || getCurrentUserId(user);
  
  console.log('🔵 User IDs:', { authUserId, userIdFromUser: getCurrentUserId(user), finalUserId: userId });
  
  if (!userId) {
    console.error('❌ No user ID found');
    handleMembershipError({ code: 'UNAUTHORIZED', message: 'You must be signed in to join communities' }, null, 'join');
    return false;
  }

  // Validate community exists (if requested)
  if (options.validateCommunity) {
    const { data: communityData } = await supabase
      .from('communities')
      .select('id')
      .eq('id', communityId)
      .single();

    if (!communityData) {
      handleMembershipError({ code: 'NOT_FOUND', message: 'Community not found' }, null, 'join');
      return false;
    }
  }

  // Check if already a member
  const isAlreadyMember = await checkIsMember(userId, communityId);
  if (isAlreadyMember) {
    // Already a member - this is not an error, just return success
    showMembershipSuccess('join', !!user);
    return true;
  }

  // Insert membership record (using memberships table only)
  console.log('🔵 Attempting to join community:', { userId, communityId });
  
  const query = supabase
    .from('memberships')
    .insert({
      user_id: userId,
      community_id: communityId,
    });

  const [, error] = await safeFetch(query);

  if (error) {
    console.error('❌ Error joining community:', error);
    console.error('❌ Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    const handled = handleMembershipError(error, null, 'join');
    options.onError?.(new Error(error.message || 'Failed to join community'));
    return !handled; // Return false if critical error
  }
  
  // Success
  console.log('✅ Successfully joined community');
  showMembershipSuccess('join', !!user);
  toast.success('Successfully joined community!');
  
  // Refresh data if callback provided
  if (options.refreshData) {
    await options.refreshData();
  }

  options.onSuccess?.(communityId);
  return true;
}

/**
 * Leave a community
 * Requires Supabase authentication - no anonymous users allowed
 * Uses only the memberships table (primary source of truth)
 * 
 * @param communityId - Community ID to leave
 * @param user - User object from auth context (required)
 * @param options - Additional options for leave operation
 * @returns Promise<boolean> - True if leave was successful
 */
export async function leaveCommunity(
  communityId: string,
  user: any,
  options: LeaveCommunityOptions = {}
): Promise<boolean> {
  // Require authenticated user - no anonymous users
  const userId = options.userId || getCurrentUserId(user);
  
  if (!userId) {
    handleMembershipError({ code: 'UNAUTHORIZED', message: 'You must be signed in to leave communities' }, null, 'leave');
    return false;
  }

  // Check if user is a member
  const isMember = await checkIsMember(userId, communityId);
  if (!isMember) {
    // Not a member - this is not an error, just return success
    showMembershipSuccess('leave', !!user);
    return true;
  }

  // Delete membership record (using memberships table only)
  const query = supabase
    .from('memberships')
    .delete()
    .match({
      user_id: userId,
      community_id: communityId,
    });

  const [, error] = await safeFetch(query);

  if (error) {
    const handled = handleMembershipError(error, null, 'leave');
    options.onError?.(new Error(error.message || 'Failed to leave community'));
    return !handled; // Return false if critical error
  }

  // Success
  showMembershipSuccess('leave', !!user);

  // Refresh data if callback provided
  if (options.refreshData) {
    await options.refreshData();
  }

  options.onSuccess?.(communityId);
  return true;
}
