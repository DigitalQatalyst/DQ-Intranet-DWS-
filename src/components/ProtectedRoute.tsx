import React, { PropsWithChildren } from 'react';
import { useAuth } from './Header/context/AuthContext';

/**
 * Guards any route behind Azure AD authentication.
 * Unauthenticated users are redirected to the MSAL login flow.
 */
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030F35]">
        <div className="text-white text-lg font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    login(globalThis.window !== undefined ? window.location.pathname : '/');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
