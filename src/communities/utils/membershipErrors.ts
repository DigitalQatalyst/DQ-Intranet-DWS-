/**
 * Membership Error Handling Utilities
 * Centralized error handling for membership operations
 */

import { toast } from 'sonner';

export interface MembershipError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

/**
 * Handle membership operation errors
 * Provides consistent error messages across all membership operations
 * 
 * @param error1 - Primary error (from memberships table)
 * @param error2 - Secondary error (optional, for backward compatibility)
 * @param operation - Operation type ('join' | 'leave')
 * @returns boolean - True if error was handled (not a critical error)
 */
export function handleMembershipError(
  error1: MembershipError | null,
  error2: MembershipError | null = null,
  operation: 'join' | 'leave' = 'join'
): boolean {
  // If both errors exist, prefer error1 (primary table)
  const error = error1 || error2;

  if (!error) {
    return false; // No error
  }

  // Handle duplicate key error (user already a member/not a member)
  if (error.code === '23505') {
    if (operation === 'join') {
      toast.error('You are already a member of this community');
    } else {
      toast.error('You are not a member of this community');
    }
    return true; // Error handled, not critical
  }

  // Handle foreign key violation (invalid community or user)
  if (error.code === '23503') {
    toast.error('Invalid community or user');
    return true; // Error handled, not critical
  }

  // Handle other errors
  const operationText = operation === 'join' ? 'join' : 'leave';
  toast.error(`Failed to ${operationText} community`);
  return true; // Error handled
}

/**
 * Show success message for membership operations
 * Provides consistent success messages
 * 
 * @param operation - Operation type ('join' | 'leave')
 * @param isAuthenticated - Whether user is authenticated
 */
export function showMembershipSuccess(
  operation: 'join' | 'leave',
  isAuthenticated: boolean
): void {
  if (operation === 'join') {
    toast.success(isAuthenticated ? 'Joined community!' : 'Joined community as guest!');
  } else {
    toast.success('Left community');
  }
}

