import { useEffect } from 'react';
import { useAuth } from './Header/context/AuthContext';

/**
 * Wraps the entire app and auto-redirects unauthenticated users to Azure AD login.
 * Since this is an internal-only app, no one should access it without signing in.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      login();
    }
  }, [isLoading, user, login]);

  // Show nothing while checking auth or redirecting
  if (!user) return null;

  return <>{children}</>;
}
