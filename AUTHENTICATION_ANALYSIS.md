# Authentication Analysis - Communities Marketplace

## Summary
The Communities Marketplace uses **Supabase Auth** (`auth.users` table) for authentication. User credentials are validated through Supabase's authentication service, not through a custom users table.

## Primary Authentication Table

### `auth.users` (Supabase Managed)
**Location**: Supabase Auth schema (managed by Supabase)
**Purpose**: Primary authentication and credential validation

**Key Columns Used:**
- `id` (UUID) - Primary identifier, used as `auth.uid()` in RLS policies
- `email` (TEXT) - User's email address (used for login)
- `encrypted_password` (TEXT) - Hashed password (managed by Supabase)
- `user_metadata` (JSONB) - Optional metadata (username, avatar_url, etc.)

**Authentication Flow:**
```typescript
// Sign In - Validates credentials against auth.users
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

**Code Location**: `src/communities/contexts/AuthProvider.tsx:113-116`

## Secondary Table (User Profiles)

### `users_local` (Custom Profile Table)
**Location**: Public schema
**Purpose**: Extended user profile information (NOT used for authentication)

**Key Columns:**
- `id` (UUID) - References `auth.users(id)` (NOT a primary key for auth)
- `email` (TEXT) - Synced from auth.users
- `username` (TEXT, nullable) - Display name
- `role` (TEXT, nullable) - User role
- `avatar_url` (TEXT, nullable) - Avatar image URL

**Important**: This table is **NOT used for authentication**. It only stores profile data after authentication.

## Authentication Flow

### 1. Sign In Process

**File**: `src/communities/contexts/AuthProvider.tsx`

```typescript
const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    // Step 1: Validate credentials with Supabase Auth (auth.users table)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message || 'Invalid email or password');
      return false;
    }

    // Step 2: If successful, load user profile from users_local (for display info)
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
```

**Key Points:**
- Credentials are validated against `auth.users` table via `supabase.auth.signInWithPassword()`
- `users_local` is only queried AFTER successful authentication to get profile data
- Authentication happens entirely through Supabase Auth service

### 2. Session Management

**File**: `src/communities/contexts/AuthProvider.tsx:35-41`

```typescript
// Get initial session from Supabase Auth
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    loadUserProfile(session.user.id);
  } else {
    setLoading(false);
  }
});
```

**Key Points:**
- Sessions are managed by Supabase Auth
- Session contains `user.id` from `auth.users` table
- Profile is loaded separately from `users_local` after session is established

### 3. Profile Loading

**File**: `src/communities/contexts/AuthProvider.tsx:60-109`

```typescript
const loadUserProfile = async (userId: string) => {
  try {
    // Try to get user profile from users_local table (for display info)
    const { data: profile, error } = await supabase
      .from('users_local')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile && !error) {
      // Use profile data (username, role, avatar_url)
      const userData: User = {
        id: profile.id,
        email: profile.email || '',
        username: profile.username,
        role: profile.role,
        avatar_url: profile.avatar_url
      };
      setUser(userData);
    } else {
      // Fallback to Supabase auth user if no profile exists
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
    // Error handling...
  }
};
```

**Key Points:**
- Profile loading happens AFTER authentication
- `users_local` is queried for extended profile info (username, role, avatar)
- Falls back to `auth.users` data if profile doesn't exist
- This is for DISPLAY purposes only, not authentication

## Authentication Checks in Operations

### 1. Joining Communities

**File**: `src/communities/services/membershipService.ts:38-49`

```typescript
export async function joinCommunity(
  communityId: string,
  user: any,
  options: JoinCommunityOptions = {}
): Promise<boolean> {
  // Get user ID from auth context (comes from auth.users.id)
  const userId = options.userId || getCurrentUserId(user);
  
  if (!userId) {
    // No authenticated user - reject
    handleMembershipError({ code: 'UNAUTHORIZED', message: 'You must be signed in to join communities' }, null, 'join');
    return false;
  }
  
  // Insert membership with authenticated user ID
  const query = supabase
    .from('memberships')
    .insert({
      user_id: userId, // This is auth.users.id
      community_id: communityId,
    });
}
```

**Database RLS Policy** (`supabase/migrations/20250108000002_remove_anonymous_user_support.sql:55-58`):
```sql
CREATE POLICY "Authenticated users can join communities"
  ON memberships FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL  -- Requires Supabase Auth session
    AND user_id = auth.uid()  -- User ID must match authenticated user
  );
```

**Key Points:**
- Frontend checks if user is authenticated (has `user.id` from auth context)
- Database RLS enforces `auth.uid() IS NOT NULL` (from `auth.users` table)
- `user_id` must match `auth.uid()` (the authenticated user's ID)

### 2. Creating Posts

**File**: `src/communities/components/post/PostComposer.tsx:199-231`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isAuthenticated || !user) {
    setShowSignInModal(true);
    return;
  }
  
  // Insert post with authenticated user ID
  const query = supabase.from('community_posts').insert({
    title,
    content,
    content_html: contentHtml,
    post_type: postType,
    metadata,
    tags,
    community_id: communityId,
    user_id: user.id, // This is auth.users.id
    created_by: user.id,
    status: 'active'
  });
}
```

**Database RLS Policy** (`supabase/migrations/20250108000001_require_auth_for_community_interactions.sql:68-77`):
```sql
CREATE POLICY "Authenticated members can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL  -- Requires Supabase Auth session
    AND EXISTS (
      SELECT 1 FROM memberships
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()  -- Must be member (user_id from auth.users)
    )
  );
```

**Key Points:**
- Frontend checks `isAuthenticated` (from auth context)
- Database RLS enforces `auth.uid() IS NOT NULL`
- Also checks membership via `memberships.user_id = auth.uid()`

### 3. Creating Comments

**File**: `src/communities/components/post/AddCommentForm.tsx:27-42`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isAuthenticated || !user) {
    setShowSignInModal(true);
    return;
  }
  
  const query = supabase.from('community_comments').insert({
    post_id: postId,
    content: content.trim(),
    user_id: user.id, // This is auth.users.id
    status: 'active'
  });
}
```

**Database RLS Policy** (`supabase/migrations/20250108000001_require_auth_for_community_interactions.sql:106-116`):
```sql
CREATE POLICY "Authenticated members can create comments"
  ON community_comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL  -- Requires Supabase Auth session
    AND EXISTS (
      SELECT 1 FROM community_posts p
      JOIN memberships m ON m.community_id = p.community_id
      WHERE p.id = community_comments.post_id
      AND m.user_id = auth.uid()  -- Must be member
    )
  );
```

### 4. Creating Reactions

**File**: `src/communities/components/post/PostReactions.tsx:83-108`

```typescript
const handleReaction = async (type: 'helpful' | 'insightful') => {
  if (!isAuthenticated || !user) {
    setShowSignInModal(true);
    return;
  }
  
  const userId = getCurrentUserId(user); // Returns auth.users.id
  if (!userId) {
    toast.error('Please sign in to react');
    return;
  }
  
  // Insert reaction with authenticated user ID
  const { error } = await supabase
    .from('community_reactions')
    .insert({
      post_id: postId,
      user_id: userId, // This is auth.users.id
      reaction_type: type
    });
}
```

**Database RLS Policy** (`supabase/migrations/20250108000001_require_auth_for_community_interactions.sql:131-161`):
```sql
CREATE POLICY "Authenticated members can create reactions"
  ON community_reactions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL  -- Requires Supabase Auth session
    AND (
      -- For post reactions, check membership via post's community
      (post_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM community_posts p
        JOIN memberships m ON m.community_id = p.community_id
        WHERE p.id = community_reactions.post_id
        AND m.user_id = auth.uid()  -- Must be member
      ))
      OR
      -- For comment reactions, check membership via comment's post's community
      (comment_id IS NOT NULL AND EXISTS (...))
    )
  );
```

## Authentication Validation Summary

### Frontend Checks
- **Location**: All interaction components
- **Method**: Check `isAuthenticated` from `useAuth()` hook
- **Source**: `AuthProvider` context, which gets user from Supabase Auth session
- **User ID Source**: `user.id` from auth context (which is `auth.users.id`)

### Backend/Database Checks
- **Location**: Row Level Security (RLS) policies
- **Method**: `auth.uid() IS NOT NULL` in all INSERT/UPDATE/DELETE policies
- **Source**: Supabase Auth session (`auth.users.id`)
- **Enforcement**: Database-level, cannot be bypassed

## Key Code Snippets

### 1. Sign In (Credential Validation)
```typescript
// File: src/communities/contexts/AuthProvider.tsx:113-116
const { data, error } = await supabase.auth.signInWithPassword({
  email,    // Validated against auth.users.email
  password  // Validated against auth.users.encrypted_password
});
```
**Table**: `auth.users`
**Columns**: `email`, `encrypted_password`

### 2. Get Current User ID
```typescript
// File: src/communities/utils/userUtils.ts:13-15
export function getCurrentUserId(user: any): string | null {
  return user?.id || null;  // user.id is auth.users.id
}
```
**Source**: `auth.users.id` from Supabase Auth session

### 3. Check Authentication Status
```typescript
// File: src/communities/contexts/AuthProvider.tsx:154
isAuthenticated: !!user  // user comes from auth.users via Supabase Auth
```

### 4. Database RLS Authentication Check
```sql
-- Example from memberships table
CREATE POLICY "Authenticated users can join communities"
  ON memberships FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL  -- auth.uid() returns auth.users.id from session
    AND user_id = auth.uid()
  );
```
**Function**: `auth.uid()` - Returns `auth.users.id` from current Supabase Auth session

## Table Relationships

```
auth.users (Supabase Auth)
  ├── id (UUID) ──────────────┐
  ├── email (TEXT)             │
  ├── encrypted_password       │
  └── user_metadata (JSONB)    │
                                │
users_local (Profile Table)     │
  ├── id (UUID) ────────────────┘ (REFERENCES auth.users.id)
  ├── email (TEXT) - synced
  ├── username (TEXT)
  ├── role (TEXT)
  └── avatar_url (TEXT)

memberships
  └── user_id (UUID) ────────────┐ (REFERENCES users_local.id → auth.users.id)
                                  │
community_posts                   │
  ├── user_id (UUID) ────────────┤ (REFERENCES users_local.id → auth.users.id)
  └── created_by (UUID) ──────────┤
                                  │
community_comments                │
  └── user_id (UUID) ─────────────┤
                                  │
community_reactions               │
  └── user_id (UUID) ─────────────┘
```

## Conclusion

**Primary Authentication Table**: `auth.users` (Supabase Auth)
- Validates credentials (email/password)
- Manages sessions
- Provides `auth.uid()` for RLS policies

**Secondary Table**: `users_local` (Custom Profile)
- Stores extended profile information
- NOT used for authentication
- Only queried after successful authentication for display purposes

**Authentication Flow**:
1. User provides email/password
2. Supabase Auth validates against `auth.users` table
3. If valid, creates session with `auth.users.id`
4. Frontend loads profile from `users_local` (optional, for display)
5. All operations use `auth.users.id` (via `auth.uid()` in RLS)
6. RLS policies enforce `auth.uid() IS NOT NULL` for all operations


