/**
 * Anonymous User Utility
 * 
 * Generates and manages anonymous user IDs for users who haven't signed in.
 * Anonymous user IDs are stored in localStorage and persist across sessions.
 */

const ANONYMOUS_USER_KEY = 'dq_anonymous_user_id';

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets or creates an anonymous user ID
 * The ID is stored in localStorage and persists across sessions
 */
export function getAnonymousUserId(): string {
  // Check if we already have an anonymous user ID
  const storedId = localStorage.getItem(ANONYMOUS_USER_KEY);
  if (storedId) {
    return storedId;
  }

  // Generate a new anonymous user ID
  const newId = generateUUID();
  localStorage.setItem(ANONYMOUS_USER_KEY, newId);
  return newId;
}

/**
 * Clears the anonymous user ID (e.g., when user signs in)
 */
export function clearAnonymousUserId(): void {
  localStorage.removeItem(ANONYMOUS_USER_KEY);
}

/**
 * Checks if a user ID is an anonymous user ID
 * (This can be used to identify anonymous users vs authenticated users)
 */
export function isAnonymousUserId(userId: string): boolean {
  const storedId = localStorage.getItem(ANONYMOUS_USER_KEY);
  return storedId === userId;
}

