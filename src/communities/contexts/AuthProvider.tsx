import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string | null;
  role: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from Supabase
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to get user profile from users_local table
      const { data: profile, error } = await supabase
        .from('users_local')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && !error) {
        const userData: User = {
          id: profile.id,
          email: profile.email || '',
          username: profile.username,
          role: profile.role,
          avatar_url: profile.avatar_url
        };
        setUser(userData);
      } else {
        // If no profile in users_local, create a basic user from Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || null,
            role: null,
            avatar_url: authUser.user_metadata?.avatar_url || null
          };
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to Supabase auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || null,
          role: null,
          avatar_url: authUser.user_metadata?.avatar_url || null
        };
        setUser(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        toast.success(`Welcome back!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}