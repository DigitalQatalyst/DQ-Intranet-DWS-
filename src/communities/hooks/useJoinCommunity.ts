/**
 * useJoinCommunity Hook
 * React hook for joining and leaving communities
 * This hook wraps the membership service and provides React-specific functionality
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { joinCommunity, leaveCommunity, JoinCommunityOptions, LeaveCommunityOptions } from '@/communities/services/membershipService';

export interface UseJoinCommunityOptions {
  onJoinSuccess?: (communityId: string) => void;
  onLeaveSuccess?: (communityId: string) => void;
  onError?: (error: Error) => void;
  refreshData?: () => Promise<void>;
  validateCommunity?: boolean;
}

export interface UseJoinCommunityReturn {
  isJoining: boolean;
  isLeaving: boolean;
  joinCommunity: (communityId: string) => Promise<boolean>;
  leaveCommunity: (communityId: string) => Promise<boolean>;
  toggleMembership: (communityId: string, isCurrentlyMember: boolean) => Promise<boolean>;
}

/**
 * Hook to join and leave communities
 * Provides loading states and convenience methods
 * 
 * @param options - Options for join/leave operations
 * @returns Hook interface with join/leave functions and loading states
 */
export function useJoinCommunity(options: UseJoinCommunityOptions = {}): UseJoinCommunityReturn {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleJoin = useCallback(async (communityId: string): Promise<boolean> => {
    setIsJoining(true);
    try {
      const success = await joinCommunity(communityId, user, {
        validateCommunity: options.validateCommunity,
        refreshData: options.refreshData,
        onSuccess: options.onJoinSuccess,
        onError: options.onError,
      });
      return success;
    } finally {
      setIsJoining(false);
    }
  }, [user, options]);

  const handleLeave = useCallback(async (communityId: string): Promise<boolean> => {
    setIsLeaving(true);
    try {
      const success = await leaveCommunity(communityId, user, {
        refreshData: options.refreshData,
        onSuccess: options.onLeaveSuccess,
        onError: options.onError,
      });
      return success;
    } finally {
      setIsLeaving(false);
    }
  }, [user, options]);

  const toggleMembership = useCallback(async (
    communityId: string,
    isCurrentlyMember: boolean
  ): Promise<boolean> => {
    if (isCurrentlyMember) {
      return handleLeave(communityId);
    } else {
      return handleJoin(communityId);
    }
  }, [handleJoin, handleLeave]);

  return {
    isJoining,
    isLeaving,
    joinCommunity: handleJoin,
    leaveCommunity: handleLeave,
    toggleMembership,
  };
}

