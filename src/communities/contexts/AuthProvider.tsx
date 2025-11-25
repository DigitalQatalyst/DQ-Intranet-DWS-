import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'sonner';

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
  signUp: (email: string, password: string, username?: string) => Promise<boolean>;
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
    let mounted = true;

    // Get initial session with better error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('🔵 Initial session check:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          event: 'INITIAL_SESSION'
        });

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          console.log('⚠️ No session found on initialization');
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('❌ Error initializing auth:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔵 Auth state changed:', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });

      if (!mounted) return;

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        console.log('⚠️ Session cleared, setting user to null');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('🔵 Loading user profile for:', userId);
      
      // Try to get user profile from users_local table
      const { data: profile, error } = await supabase
        .from('users_local')
        .select('*')
        .eq('id' as any, userId as any)
        .maybeSingle();

      if (!error && profile && typeof profile === 'object' && 'id' in profile) {
        console.log('✅ Found user in users_local table');
        const userData: User = {
          id: (profile as any).id,
          email: (profile as any).email || '',
          username: (profile as any).username,
          role: (profile as any).role,
          avatar_url: (profile as any).avatar_url
        };
        setUser(userData);
        setLoading(false);
        console.log('✅ User authenticated:', true);
        return;
      } else {
        console.log('⚠️ User not found in users_local, using Supabase auth user');
        if (error) {
          console.warn('⚠️ Error querying users_local:', error);
        }
      }

      // If no profile in users_local, create a basic user from Supabase auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ Error getting auth user:', authError);
        setLoading(false);
        return;
      }

      if (authUser && authUser.id === userId) {
        console.log('✅ Using Supabase auth user');
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || null,
          role: null,
          avatar_url: authUser.user_metadata?.avatar_url || null
        };
        setUser(userData);
        setLoading(false);
        console.log('✅ User authenticated:', true);
      } else {
        console.error('❌ Auth user ID mismatch or not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Fallback to Supabase auth user
      try {
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
          console.log('✅ User authenticated (fallback):', true);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      } finally {
        setLoading(false);
      }
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
        // Load user profile and wait for it to complete
        await loadUserProfile(data.user.id);
        // Force a small delay to ensure state updates propagate
        await new Promise(resolve => setTimeout(resolve, 100));
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

  const signUp = async (email: string, password: string, username?: string): Promise<boolean> => {
    try {
      // Sign up user - this automatically stores email and encrypted password in auth.users
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        toast.error(error.message || 'Failed to create account');
        return false;
      }

      if (data.user) {
        // Create profile in users_local table
        const { error: profileError } = await supabase
          .from('users_local')
          .insert({
            id: data.user.id,
            email: email,
            username: username || email.split('@')[0],
            role: 'member',
            created_at: new Date().toISOString()
          } as any);

        // If profile creation fails, it's not critical - user is still created in auth.users
        if (profileError) {
          console.warn('Profile creation failed (user still created in auth.users):', profileError);
        }

        // Load user profile
        await loadUserProfile(data.user.id);
        
        toast.success('Account created successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
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
        signUp,
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