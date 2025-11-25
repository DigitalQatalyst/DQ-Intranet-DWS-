# Community Marketplace Authentication Update Summary

## Overview
This update enforces Supabase authentication for all community interactions (posts, comments, reactions) while optionally keeping anonymous joining for communities.

## Changes Made

### 1. Authentication Provider (`src/communities/contexts/AuthProvider.tsx`)
- **Updated**: Now uses Supabase Auth (`supabase.auth`) instead of custom `users_local` table authentication
- **Added**: `isAuthenticated` property to context for easy authentication checks
- **Changed**: Session management now handled by Supabase Auth with automatic session restoration

### 2. User Utilities (`src/communities/utils/userUtils.ts`)
- **Updated**: `getCurrentUserId()` now returns `null` for unauthenticated users (removed anonymous fallback)
- **Added**: `isAuthenticated()` helper function
- **Impact**: All interaction components now require explicit authentication checks

### 3. Interaction Components Updated

#### Post Creation
- **PostComposer.tsx**: Requires authentication, shows sign-in modal for unauthenticated users
- **InlineComposer.tsx**: Requires authentication, shows sign-in prompt instead of composer for unauthenticated users

#### Comments
- **AddCommentForm.tsx**: Requires authentication, shows sign-in modal
- **CommunityComments.tsx**: Requires authentication for posting comments/replies, hides comment form for unauthenticated users

#### Reactions
- **PostReactions.tsx**: Requires authentication, shows sign-in modal, disables buttons for unauthenticated users
- **CommunityReactions.tsx**: Requires authentication, shows sign-in modal, disables buttons for unauthenticated users
- **PostCard/index.tsx**: Updated to show error instead of navigating away

#### Polls
- **PollPostContent.tsx**: Requires authentication for voting, shows sign-in modal, disables vote buttons for unauthenticated users

### 4. Membership Service (`src/communities/services/membershipService.ts`)
- **Updated**: Still allows anonymous joins (uses `getAnonymousUserId()` as fallback)
- **Behavior**: Anonymous users can join communities but cannot interact (post, comment, react)

### 5. Database Migration (`supabase/migrations/20250108000001_require_auth_for_community_interactions.sql`)
- **Removed**: Anonymous user interaction triggers
- **Updated**: RLS policies to require `auth.uid() IS NOT NULL` for all INSERT/UPDATE/DELETE operations
- **Maintained**: SELECT policies remain open for viewing content
- **Enforced**: Membership checks for all interactions (users must be members of the community)

## Files Modified

### Core Authentication
1. `src/communities/contexts/AuthProvider.tsx`
2. `src/communities/utils/userUtils.ts`

### Interaction Components
3. `src/communities/components/post/PostComposer.tsx`
4. `src/communities/components/post/InlineComposer.tsx`
5. `src/communities/components/post/AddCommentForm.tsx`
6. `src/communities/components/post/CommunityComments.tsx`
7. `src/communities/components/post/PostReactions.tsx`
8. `src/communities/components/post/CommunityReactions.tsx`
9. `src/communities/components/post/PollPostContent.tsx`
10. `src/communities/components/posts/PostCard/index.tsx`

### Services
11. `src/communities/services/membershipService.ts`

### Database
12. `supabase/migrations/20250108000001_require_auth_for_community_interactions.sql`

## Implementation Details

### Authentication Flow
1. **Sign In**: Users sign in via Supabase Auth (email/password)
2. **Session**: Supabase handles session management automatically
3. **User State**: `AuthProvider` loads user profile from `users_local` table or creates basic profile from Supabase auth metadata

### Interaction Flow
1. **Unauthenticated User Attempts Action**:
   - UI hides interaction elements OR shows disabled state
   - Sign-in modal appears when user clicks
   - User signs in → can then interact

2. **Authenticated User**:
   - Can view all content
   - Can interact if member of community
   - Can edit/delete own content

### Anonymous Joins
- Anonymous users can still join communities
- They receive a localStorage-based anonymous user ID
- They can view content but cannot interact until signing in

## RLS Policy Summary

### Community Posts
- **SELECT**: Anyone can view active posts
- **INSERT**: Authenticated members only
- **UPDATE**: Authenticated users can update own posts
- **DELETE**: Authenticated users can delete own posts

### Community Comments
- **SELECT**: Anyone can view active comments
- **INSERT**: Authenticated members only
- **UPDATE**: Authenticated users can update own comments
- **DELETE**: Authenticated users can delete own comments

### Community Reactions
- **SELECT**: Anyone can view reactions
- **INSERT**: Authenticated members only
- **DELETE**: Authenticated users can delete own reactions

### Community Assets
- **SELECT**: Anyone can view assets
- **INSERT**: Authenticated members only
- **DELETE**: Authenticated users can delete own assets

## Testing Checklist

- [ ] Sign in with valid credentials
- [ ] Attempt to create post without authentication → sign-in modal appears
- [ ] Create post after authentication → succeeds
- [ ] Attempt to comment without authentication → sign-in modal appears
- [ ] Comment after authentication → succeeds
- [ ] Attempt to react without authentication → sign-in modal appears
- [ ] React after authentication → succeeds
- [ ] Attempt to vote in poll without authentication → sign-in modal appears
- [ ] Vote after authentication → succeeds
- [ ] Anonymous user can join community
- [ ] Anonymous user cannot interact (post/comment/react)
- [ ] Authenticated user can edit own posts/comments
- [ ] Authenticated user can delete own posts/comments
- [ ] RLS policies enforce authentication at database level

## Migration Instructions

1. **Run the migration**:
   ```bash
   supabase migration up
   ```

2. **Verify RLS policies**:
   - Check that RLS is enabled on all interaction tables
   - Verify policies require `auth.uid() IS NOT NULL`

3. **Test authentication flow**:
   - Sign in/out
   - Attempt interactions as unauthenticated user
   - Verify sign-in modals appear

4. **Test anonymous joins**:
   - Join community without signing in
   - Verify membership is created
   - Verify cannot interact until signed in

## Notes

- The `SignInModal` component is reused across all interaction components
- Anonymous user IDs are still generated for joins but not used for interactions
- All interaction UI elements are conditionally rendered based on `isAuthenticated`
- Database-level enforcement via RLS provides security even if frontend checks are bypassed


