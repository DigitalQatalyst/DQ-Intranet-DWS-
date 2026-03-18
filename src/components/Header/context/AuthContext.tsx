import React, { createContext, useContext, ReactNode } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: UserProfile = {
  id: 'dev-user-1',
  name: 'Development User',
  email: 'dev@example.com',
  givenName: 'Development',
  familyName: 'User',
};

export function AuthProvider({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const contextValue: AuthContextType = {
    user: mockUser,
    isLoading: false,
    login: () => console.log('Login clicked (development mode)'),
    signup: () => console.log('Signup clicked (development mode)'),
    logout: () => console.log('Logout clicked (development mode)'),
  };

  return <AuthContext.Provider value={contextValue}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}