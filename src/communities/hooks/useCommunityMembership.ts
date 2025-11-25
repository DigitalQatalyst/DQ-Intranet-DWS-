import { useState, useEffect } from 'react';
import { useCurrentUserId } from '@/communities/utils/userUtils';
import { checkIsMember } from '@/communities/utils/membershipUtils';

/**
 * Hook to check if the current authenticated user is a member of a community
 * Uses only the memberships table (primary source of truth)
 */
export function useCommunityMembership(communityId: string | undefined) {
  const userId = useCurrentUserId();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    checkMembership();
  }, [communityId, userId]);

  const checkMembership = async () => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    // If user is not authenticated, they cannot be a member
    if (!userId) {
      setIsMember(false);
      setLoading(false);
      return;
    }

    // Check membership using memberships table only (optimized - single query)
    const membershipStatus = await checkIsMember(userId, communityId);
    setIsMember(membershipStatus);
    setLoading(false);
  };

  return { isMember, loading, refetch: checkMembership };
}

