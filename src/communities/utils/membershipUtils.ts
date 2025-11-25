/**
 * Membership Utilities
 * Centralized utilities for checking and managing community memberships
 */

import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { getCurrentUserId } from './userUtils';

/**
 * Check if a user is a member of a community
 * Uses only the memberships table (primary source of truth)
 * 
 * @param userId - Authenticated user ID (required)
 * @param communityId - Community ID to check
 * @returns Promise<boolean> - True if user is a member
 */
export async function checkIsMember(userId: string | null, communityId: string): Promise<boolean> {
  // If user is not authenticated, they cannot be a member
  if (!userId) {
    return false;
  }

  const query = supabase
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .maybeSingle();

  const [data] = await safeFetch(query);
  return !!data;
}

/**
 * Get membership record for a user in a community
 * Returns the membership object if found, null otherwise
 * 
 * @param userId - Authenticated user ID (required)
 * @param communityId - Community ID to check
 * @returns Promise<{id: string, joined_at: string} | null>
 */
export async function getMembership(
  userId: string,
  communityId: string
): Promise<{ id: string; joined_at: string } | null> {
  const query = supabase
    .from('memberships')
    .select('id, joined_at')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .maybeSingle();

  const [data] = await safeFetch(query);
  return data || null;
}
