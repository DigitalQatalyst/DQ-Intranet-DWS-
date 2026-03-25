import { PropsWithChildren } from 'react';

/**
 * Simplified ProtectedRoute for development - no authentication required
 */
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  // In development mode, always render children without authentication
  return <>{children}</>;
};

export default ProtectedRoute;