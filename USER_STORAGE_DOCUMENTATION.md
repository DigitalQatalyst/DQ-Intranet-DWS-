# User Storage Documentation

## Overview
This document describes how authenticated users are stored and managed in the Communities Marketplace system.

## User Storage Structure

### 1. Supabase Auth Table (`auth.users`)
**Managed by Supabase** - This is the primary authentication table managed by Supabase Auth.

**Key Fields:**
- `id` (UUID) - Primary key, used as user identifier across the system
- `email` (TEXT) - User's email address
- `user_metadata` (JSONB) - Optional metadata (username, avatar_url, etc.)
- `created_at` (TIMESTAMPTZ) - Account creation timestamp

**Usage:**
- Handles authentication (sign in, sign out, password management)
- Provides `auth.uid()` for RLS policies
- Session management

### 2. Custom User Profile Table (`users_local`)
**Custom table** - Stores extended user profile information for the Communities Marketplace.

**Table Structure:**
```sql
CREATE TABLE users_local (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id` (UUID) - Primary key, references `auth.users(id)`
- `email` (TEXT) - User's email address (synced from auth.users)
- `username` (TEXT, nullable) - Display name for the user
- `role` (TEXT, nullable) - User role (e.g., 'admin', 'moderator', 'member')
- `avatar_url` (TEXT, nullable) - URL to user's avatar image
- `created_at` (TIMESTAMPTZ) - Profile creation timestamp

**Usage:**
- Extended user profile information
- Display names and avatars in community interactions
- Role-based permissions

## User ID Mapping

### Primary Identifier
- **User ID**: `auth.users.id` (UUID)
- This ID is used consistently across all tables:
  - `memberships.user_id`
  - `community_posts.user_id` and `community_posts.created_by`
  - `community_comments.user_id`
  - `community_reactions.user_id`
  - `community_assets.user_id`

### Display Information
When displaying user information in the UI:

1. **Display Name Priority:**
   - First: `users_local.username`
   - Fallback: `users_local.email` (or `auth.users.email`)
   - Last resort: "Unknown User"

2. **Avatar:**
   - `users_local.avatar_url`
   - Fallback: Generated gradient avatar based on user ID

3. **Email:**
   - `users_local.email` or `auth.users.email`

## User Profile Loading Flow

### 1. Authentication
User signs in via Supabase Auth:
```typescript
await supabase.auth.signInWithPassword({ email, password })
```

### 2. Profile Loading
After authentication, the system loads the user profile:

1. **Check `users_local` table:**
   ```typescript
   const { data: profile } = await supabase
     .from('users_local')
     .select('*')
     .eq('id', userId)
     .single();
   ```

2. **If profile exists:**
   - Use profile data (username, role, avatar_url)
   - Display in UI

3. **If profile doesn't exist:**
   - Fallback to `auth.users` data
   - Extract username from `user_metadata` or email prefix
   - Use `user_metadata.avatar_url` if available

### 3. Profile Creation
User profiles in `users_local` can be created:
- Manually via admin interface
- Automatically when user first interacts (if trigger exists)
- Via user registration flow

## Community Membership

### Memberships Table
```sql
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_local(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT memberships_unique UNIQUE (user_id, community_id)
);
```

**Key Points:**
- `user_id` references `users_local(id)`
- Each user can only be a member once per community (unique constraint)
- Membership is required for all interactions (posts, comments, reactions)

## Row Level Security (RLS)

### Authentication Requirement
All RLS policies require `auth.uid() IS NOT NULL` for:
- INSERT operations (creating posts, comments, reactions, memberships)
- UPDATE operations (editing own content)
- DELETE operations (deleting own content)

### Membership Checks
Most interaction policies also verify membership:
```sql
EXISTS (
  SELECT 1 FROM memberships
  WHERE community_id = <community_id>
  AND user_id = auth.uid()
)
```

## Data Flow Example

### User Joins Community
1. User authenticates → `auth.users` record exists
2. User profile loaded → `users_local` record (or fallback to auth.users)
3. Join request → Check `memberships` table
4. Insert membership → `memberships` record created with `user_id = auth.uid()`
5. RLS policy verifies → `auth.uid() IS NOT NULL` and `user_id = auth.uid()`

### User Creates Post
1. User authenticated → `auth.uid()` available
2. Membership check → Verify user is member of community
3. Create post → Insert into `community_posts` with `user_id = auth.uid()`
4. RLS policy verifies → Authentication and membership

## Migration Notes

### Removing Anonymous Users
The migration `20250108000002_remove_anonymous_user_support.sql`:
- Removes anonymous user triggers
- Updates RLS policies to require authentication
- Removes `ensure_user_exists()` function

### Cleanup (Optional)
To remove existing anonymous user records:
```sql
DELETE FROM users_local
WHERE email LIKE 'anonymous-%@system.local'
OR username = 'Guest User'
OR role = 'guest';
```

## Best Practices

1. **Always use `auth.uid()` in RLS policies** - Never trust client-provided user IDs
2. **Check membership before interactions** - Verify user is member of community
3. **Handle missing profiles gracefully** - Fallback to auth.users data
4. **Sync user data** - Keep `users_local.email` in sync with `auth.users.email`
5. **Use user ID consistently** - Always use `auth.users.id` as the primary identifier

## Related Files

- `src/communities/contexts/AuthProvider.tsx` - Auth context and profile loading
- `src/communities/utils/userUtils.ts` - User ID utilities
- `src/communities/services/membershipService.ts` - Membership operations
- `supabase/migrations/20250108000002_remove_anonymous_user_support.sql` - Migration removing anonymous support


