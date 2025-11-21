/**
 * User Utilities
 * Centralized utilities for user ID retrieval and related operations
 * 
 * NOTE: All operations now require Supabase authentication.
 * Anonymous users are not supported - users must sign in to join communities or interact.
 */

import { useAuth } from '@/communities/contexts/AuthProvider';

/**
 * Gets the current authenticated user ID
 * Returns null if user is not authenticated
 * This centralizes the user ID retrieval logic used throughout the app
 */
export function getCurrentUserId(user: any): string | null {
  return user?.id || null;
}

/**
 * Hook version to get current authenticated user ID
 * Use this in React components
 * Returns null if user is not authenticated
 */
export function useCurrentUserId(): string | null {
  const { user } = useAuth();
  return getCurrentUserId(user);
}

/**
 * Checks if the current user is authenticated
 */
export function isAuthenticated(user: any): boolean {
  return !!user?.id;
}
