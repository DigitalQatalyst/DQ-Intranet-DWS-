# User Authentication Implementation Review

## Executive Summary

This document reviews the current user authentication implementation in the DQ Intranet DWS application and provides recommendations for migrating from dummy/mock users to Supabase Authentication.

---

## 1. Current User Flow Analysis

### 1.1 User Data Storage

**Current Implementation:**
- **Primary Table**: `users_local` table in Supabase
- **Schema Structure**:
  ```sql
  CREATE TABLE users_local (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,  -- ⚠️ Stored in plain text
    username TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'member',
    notification_settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

**Issues Identified:**
1. ❌ **Passwords stored in plain text** - Major security vulnerability
2. ❌ **No password hashing** - Direct comparison in queries
3. ❌ **No session management** - Uses localStorage for session storage
4. ❌ **No token-based authentication** - Relies on email/password matching

### 1.2 Current Authentication Mechanisms

#### A. Communities Feature (`src/communities/contexts/AuthProvider.tsx`)

**Current Flow:**
```typescript
// Sign-in process
signIn(email, password) {
  // Direct query to users_local table
  const { data } = await supabase
    .from('users_local')
    .select('*')
    .eq('email', email)
    .eq('password', password)  // ⚠️ Plain text comparison
    .single();
  
  // Store user in localStorage
  localStorage.setItem('auth_session', JSON.stringify(userData));
}
```

**Problems:**
- No password hashing/encryption
- Session stored in localStorage (vulnerable to XSS)
- No token refresh mechanism
- No session expiration handling

#### B. Main App Authentication (`src/components/Header/context/AuthContext.tsx`)

**Current Flow:**
- Uses Microsoft Azure AD B2C (MSAL) for main app authentication
- Separate from communities authentication
- Two different auth systems running in parallel

**Issues:**
- **Dual Authentication Systems**: Communities use custom auth, main app uses MSAL
- No unified user identity
- User data split between systems

### 1.3 Anonymous User Handling

**Current Implementation:**
- File: `src/communities/utils/anonymousUser.ts`
- Generates UUIDs for anonymous users
- Stored in localStorage: `dq_anonymous_user_id`
- Allows anonymous users to join communities

**Flow:**
```typescript
// Anonymous user can join communities
const userId = user?.id || getAnonymousUserId();
// Uses anonymous UUID if not authenticated
```

**Issues:**
- Anonymous users can perform actions (join communities, post)
- No proper authentication required for many actions
- Creates orphaned data in database

---

## 2. User-Related Data Management

### 2.1 User Data Usage Across Sessions

**Current Storage:**
1. **localStorage**:
   - `auth_session` - Stores user object (communities)
   - `dq_anonymous_user_id` - Anonymous user ID

2. **Database Tables**:
   - `users_local` - User profiles
   - `memberships` - Community memberships
   - `community_members` - Community member relationships
   - `community_posts` - User posts
   - `community_comments` - User comments
   - `community_reactions` - User reactions

### 2.2 User Actions Permissions

**Current State:**
- ✅ **Authenticated Users**: Can perform all actions
- ⚠️ **Anonymous Users**: Can join communities, post, comment (via anonymous ID)
- ❌ **No Role-Based Access Control (RBAC)** implementation
- ❌ **No proper session validation**

**User Actions Currently Permitted:**

| Action | Authenticated | Anonymous | Notes |
|--------|--------------|-----------|-------|
| Join Community | ✅ | ✅ | Uses anonymous ID |
| Create Post | ✅ | ✅ | Uses anonymous ID |
| Comment | ✅ | ✅ | Uses anonymous ID |
| React to Posts | ✅ | ✅ | Uses anonymous ID |
| Leave Community | ✅ | ✅ | Uses anonymous ID |
| View Communities | ✅ | ✅ | Public access |
| Create Community | ✅ | ❌ | Requires auth |

---

## 3. Current Authentication Mechanism Details

### 3.1 Communities AuthProvider

**Location**: `src/communities/contexts/AuthProvider.tsx`

**Features:**
- Custom sign-in with email/password
- localStorage session management
- No sign-up functionality
- No password reset
- No email verification

**Code Flow:**
```typescript
1. User enters email/password
2. Query users_local table directly
3. Compare plain text password
4. Store user object in localStorage
5. Set user state in React context
```

### 3.2 Main App AuthContext

**Location**: `src/components/Header/context/AuthContext.tsx`

**Features:**
- Microsoft Azure AD B2C integration
- OAuth/OIDC flow
- Proper token management
- Session handling via MSAL

**Issues:**
- Not integrated with communities feature
- Separate user identity system

---

## 4. Integration with Supabase Authentication

### 4.1 Current Supabase Setup

**Supabase Client**: `src/lib/supabaseClient.ts`
- ✅ Properly configured with auth options
- ✅ Session persistence enabled
- ✅ Auto-refresh tokens enabled
- ❌ **Not being used for authentication**

**Current Usage:**
- Only used for database queries
- `supabase.auth` methods not utilized
- No `onAuthStateChange` listener

### 4.2 Recommended Migration Path

#### Phase 1: Replace Custom Auth with Supabase Auth

**Step 1: Update AuthProvider to Use Supabase Auth**

```typescript
// Replace current signIn method
signIn: async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    toast.error(error.message);
    return false;
  }
  
  // User is now authenticated via Supabase
  // Session is automatically managed
  return true;
}
```

**Step 2: Add Sign-Up Functionality**

```typescript
signUp: async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username
      }
    }
  });
  
  if (error) {
    toast.error(error.message);
    return false;
  }
  
  return true;
}
```

**Step 3: Implement Session Management**

```typescript
useEffect(() => {
  // Check existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setUser(session.user);
    }
  });

  // Listen for auth state changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setUser(session.user);
      // Sync user to users_local table if needed
      syncUserToLocalTable(session.user);
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

#### Phase 2: Database Schema Updates

**Step 1: Link users_local to auth.users**

```sql
-- Add auth_user_id column to link with Supabase Auth
ALTER TABLE users_local 
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_users_local_auth_user_id ON users_local(auth_user_id);

-- Make email unique constraint work with auth.users
-- (auth.users already has unique email)
```

**Step 2: Create Trigger to Sync Users**

```sql
-- Function to create users_local entry when auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_local (auth_user_id, email, username, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create users_local entry
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Step 3: Remove Password Column**

```sql
-- After migration, remove password column
ALTER TABLE users_local DROP COLUMN password;
```

#### Phase 3: Update User References

**Current Pattern:**
```typescript
// Old way - direct user.id from localStorage
const userId = user?.id;
```

**New Pattern:**
```typescript
// New way - get from Supabase session
const { data: { user: authUser } } = await supabase.auth.getUser();
const userId = authUser?.id;
```

---

## 5. Migration Checklist

### 5.1 Authentication Flow Updates

- [ ] Replace `signIn` method to use `supabase.auth.signInWithPassword()`
- [ ] Add `signUp` method using `supabase.auth.signUp()`
- [ ] Implement `onAuthStateChange` listener
- [ ] Remove localStorage session storage
- [ ] Update session restoration logic
- [ ] Add password reset functionality
- [ ] Add email verification flow

### 5.2 Database Updates

- [ ] Add `auth_user_id` column to `users_local`
- [ ] Create trigger to sync auth.users → users_local
- [ ] Migrate existing users to Supabase Auth
- [ ] Update foreign key references
- [ ] Remove `password` column from `users_local`
- [ ] Update RLS policies to use `auth.uid()`

### 5.3 Code Updates

- [ ] Update all `user.id` references to use `auth.uid()`
- [ ] Remove anonymous user functionality (or keep with proper auth)
- [ ] Update all database queries to use authenticated user
- [ ] Add proper error handling for auth failures
- [ ] Update UI components to handle auth states
- [ ] Add loading states during auth operations

### 5.4 Testing

- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test session persistence
- [ ] Test session expiration
- [ ] Test password reset
- [ ] Test email verification
- [ ] Test user data sync
- [ ] Test RLS policies with auth

---

## 6. Implementation Recommendations

### 6.1 Immediate Actions

1. **Security Fix**: Remove plain text password storage immediately
2. **Implement Supabase Auth**: Replace custom auth with Supabase Auth
3. **Session Management**: Use Supabase session management instead of localStorage

### 6.2 Architecture Decisions

**Option A: Full Supabase Auth Migration** (Recommended)
- Use Supabase Auth for all authentication
- Link `users_local` to `auth.users` via `auth_user_id`
- Remove custom auth completely
- Benefits: Secure, scalable, maintained by Supabase

**Option B: Hybrid Approach**
- Keep MSAL for main app
- Use Supabase Auth for communities
- Sync user identities between systems
- Benefits: Gradual migration, less disruption

**Recommendation**: **Option A** - Full Supabase Auth migration provides better security and unified user management.

### 6.3 User Migration Strategy

**For Existing Users:**
1. Create Supabase Auth accounts for existing users
2. Send password reset emails (since passwords can't be migrated)
3. Link existing `users_local` records to new auth users
4. Users must reset password on first login

**For New Users:**
1. Sign up via Supabase Auth
2. Auto-create `users_local` entry via trigger
3. No manual intervention needed

---

## 7. Code Examples

### 7.1 Updated AuthProvider

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Sync user to users_local table
        await syncUserToLocalTable(session.user);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Signed in successfully!');
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account created! Please check your email to verify your account.');
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset email sent!');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred');
      return false;
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
        resetPassword,
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

// Helper function to sync Supabase Auth user to users_local table
async function syncUserToLocalTable(authUser: User) {
  const { error } = await supabase
    .from('users_local')
    .upsert({
      auth_user_id: authUser.id,
      email: authUser.email,
      username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
      avatar_url: authUser.user_metadata?.avatar_url,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'auth_user_id',
    });

  if (error) {
    console.error('Error syncing user to users_local:', error);
  }
}
```

### 7.2 Database Migration SQL

```sql
-- Migration: Add Supabase Auth integration

-- Step 1: Add auth_user_id column
ALTER TABLE users_local 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index
CREATE INDEX IF NOT EXISTS idx_users_local_auth_user_id 
ON users_local(auth_user_id);

-- Step 3: Create function to sync users
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_local (
    auth_user_id,
    email,
    username,
    avatar_url,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- Step 5: Update RLS policies to use auth.uid()
-- Example for community_posts
ALTER POLICY "Users can insert their own posts"
ON community_posts
USING (auth.uid() = created_by);

-- Step 6: After migration, remove password column
-- ALTER TABLE users_local DROP COLUMN password;
```

---

## 8. Security Improvements

### Current Security Issues:
1. ❌ Plain text passwords
2. ❌ No password hashing
3. ❌ localStorage session storage (XSS vulnerable)
4. ❌ No token refresh
5. ❌ No session expiration

### After Migration:
1. ✅ Passwords hashed by Supabase
2. ✅ Secure session management
3. ✅ Automatic token refresh
4. ✅ Session expiration handling
5. ✅ Built-in security best practices

---

## 9. Next Steps

1. **Review this document** with the team
2. **Create migration branch** for Supabase Auth integration
3. **Implement database migrations** first
4. **Update AuthProvider** to use Supabase Auth
5. **Test thoroughly** in development environment
6. **Plan user migration** strategy
7. **Deploy gradually** with feature flags

---

## 10. Questions to Consider

1. **Should we keep anonymous user functionality?**
   - If yes, how to handle anonymous users with Supabase Auth?
   - Consider Supabase anonymous sessions

2. **How to handle existing users?**
   - Password reset flow required
   - Communication strategy needed

3. **Integration with MSAL?**
   - Keep separate or migrate main app too?
   - Unified identity strategy?

4. **Email verification?**
   - Required or optional?
   - Impact on user experience?

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-03  
**Author**: AI Assistant  
**Status**: Review Required



