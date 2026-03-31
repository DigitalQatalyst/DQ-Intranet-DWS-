# Viva Engage Complete Implementation - All Fixes

## 🔧 TASK 1: Supabase Database Schema

### Complete SQL Migration
**File:** `supabase/migrations/20250112000002_complete_viva_engage_schema.sql`

**Key Features:**
- ✅ Adds `view_count` column to `posts_v2` (INTEGER, default 0)
- ✅ Creates `post_views` table with unique constraint
- ✅ Ensures `emoji` column exists in `community_post_reactions_new`
- ✅ Creates trigger to auto-update `view_count` when views are added/removed
- ✅ Creates `posts_with_analytics` view with aggregated data
- ✅ Creates `get_post_analytics()` function for single post
- ✅ Creates `get_community_analytics()` function for dashboard (REAL DATA ONLY)

**Tables:**
```sql
posts_v2 (
  id UUID PRIMARY KEY,
  community_id UUID,
  user_id UUID (author_id),
  title TEXT,
  content TEXT,
  view_count INTEGER DEFAULT 0,  -- ✅ ADDED
  created_at TIMESTAMPTZ
)

post_views (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts_v2(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, post_id)  -- One view per user per post
)

community_post_reactions_new (
  id UUID PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  reaction_type TEXT ('like', 'helpful', 'insightful'),
  emoji TEXT,  -- ✅ STORES ACTUAL EMOJI
  UNIQUE(user_id, post_id)  -- One reaction per user per post
)

community_post_comments_new (
  id UUID PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  parent_id UUID,  -- For threading
  content TEXT,
  status TEXT DEFAULT 'active'
)
```

---

## 🔧 TASK 2: Fix "viewCount is not defined" Error

### Root Cause
The error happens because:
1. `view_count` column didn't exist in `posts_v2` table
2. Frontend queries didn't select `view_count`
3. No default fallback values in TypeScript

### Solution

**1. Database Fix:**
```sql
-- Migration adds view_count column
ALTER TABLE posts_v2 ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
```

**2. Frontend Query Fix:**
```typescript
// ✅ CORRECT: Always select view_count
const query = supabase
  .from('posts_with_analytics')  // Use view that includes view_count
  .select('id, title, content, view_count, ...')  // ✅ Includes view_count
  .eq('id', postId);
```

**3. TypeScript Safe Defaults:**
```typescript
// ✅ ALWAYS use ?? operator for defaults
const viewCount = post.view_count ?? 0;
const commentCount = post.comment_count ?? 0;
const reactionCount = post.reaction_count ?? 0;
```

**New Hook:** `src/communities/hooks/usePostData.ts`
- Always fetches `view_count` from database
- Provides safe defaults
- Never crashes on missing data

---

## 🔧 TASK 3: Fix Emoji Reactions (Always Falls Back to 👍)

### Root Cause
1. Emoji was stored only in localStorage, not database
2. On page reload, localStorage might be empty
3. Code fell back to 'like' type, which always shows 👍

### Solution

**1. Database Storage:**
```sql
-- Emoji column stores actual emoji character
ALTER TABLE community_post_reactions_new ADD COLUMN emoji TEXT;

-- When inserting reaction, store emoji:
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type, emoji)
VALUES (post_id, user_id, 'like', '❤️');  -- ✅ Stores actual emoji
```

**2. Frontend Logic:**
```typescript
// ✅ NEW: usePostReactions hook
const { userReaction, addReaction } = usePostReactions(postId);

// When user selects emoji:
await addReaction('❤️');  // Stores '❤️' in database

// When fetching:
const emoji = reaction.emoji || '👍';  // Use DB emoji, fallback only if null
```

**3. Aggregation Display:**
```typescript
// ✅ Shows aggregated emojis: "👍 ❤️ 😂 3"
const aggregated = reactions.reduce((acc, r) => {
  const emoji = r.emoji || '👍';
  acc[emoji] = (acc[emoji] || 0) + 1;
  return acc;
}, {});
```

**New Hook:** `src/communities/hooks/usePostReactions.ts`
- Stores emoji in database (not just localStorage)
- Fetches emoji from database on load
- Proper aggregation for display

---

## 🔧 TASK 4: Comments Behavior (Viva-style)

### Current State
✅ Already implemented correctly:
- Comments visible by default (`expanded = true`)
- Comment input hidden by default (`isReplying = false`)
- Clicking "Comment" opens input (`focusInput()` method)
- Threaded replies supported (`parent_id`)

### Verification
**File:** `src/communities/components/post/CommunityComments.tsx`

```typescript
// ✅ Comment input is closed by default
const [isReplying, setIsReplying] = useState(false);

// ✅ Opens only when Comment button clicked
focusInput: () => {
  setIsReplying(true);
  replyInputRef.current?.focus();
}

// ✅ Replies nested under comments
{comment.replies && comment.replies.map(reply => (
  <ReplyCard comment={reply} isReply={true} />
))}
```

**No changes needed** - already matches Viva Engage behavior.

---

## 🔧 TASK 5: Share Button

### Current Implementation
✅ Already implemented in `src/communities/components/post/ShareDropdown.tsx`

**Features:**
- Copy link (generates real post URL)
- Share to storyline
- Share to community
- Share to private message
- Rich preview support

**Usage:**
```typescript
<ShareDropdown
  postId={post.id}
  postTitle={safeTitle}
  postContent={safeContent}
  communityName={safeCommunity}
  authorName={safeAuthor}
/>
```

**No changes needed** - already production-ready.

---

## 🔧 TASK 6: Dashboard Analytics (REAL DATA ONLY)

### Problem
Dashboard was using manual queries that could miss data or show incorrect counts.

### Solution

**1. Database Function:**
```sql
-- ✅ REAL DATA: Uses actual Supabase queries
CREATE FUNCTION get_community_analytics(community_uuid UUID, days_back INTEGER)
RETURNS TABLE (
  total_posts BIGINT,
  total_views BIGINT,
  total_reactions BIGINT,
  total_comments BIGINT,
  posts_by_type JSONB,
  engagement_funnel JSONB
)
```

**2. Frontend Usage:**
```typescript
// ✅ Uses real Supabase function (NO MOCK DATA)
const { data } = await supabase.rpc('get_community_analytics', {
  community_uuid: id,
  days_back: 30
});

// ✅ Fallback to manual queries if function doesn't exist
if (error) {
  await fetchAnalyticsManual();  // Still uses real data
}
```

**3. Metrics Calculated:**
- Total posts (from `posts_v2`)
- Total views (from `post_views` + `view_count`)
- Total reactions (from `community_post_reactions_new`)
- Total comments (from `community_post_comments_new`)
- Posts by type (discussion/question/poll/praise/article)
- Engagement funnel (viewed → reacted → commented → posted)

**Updated File:** `src/communities/pages/CommunityAnalyticsDashboard.tsx`
- Uses `get_community_analytics()` RPC function
- Fallback to manual queries (still real data)
- No mock data anywhere

---

## 📋 Implementation Checklist

### Database
- [x] `view_count` column added to `posts_v2`
- [x] `post_views` table created with unique constraint
- [x] `emoji` column added to reactions table
- [x] Trigger to auto-update `view_count`
- [x] `posts_with_analytics` view created
- [x] `get_post_analytics()` function created
- [x] `get_community_analytics()` function created
- [x] RLS policies for all tables

### Frontend Hooks
- [x] `usePostData` - Fetches post with `view_count` (fixes viewCount error)
- [x] `usePostReactions` - Stores/fetches emoji from DB (fixes 👍 fallback)
- [x] `usePostViews` - Tracks views with debounce
- [x] `useReactionSummary` - Aggregates reactions by emoji

### Components
- [x] `PostCard` - Optional-safe, uses new hooks
- [x] `CommunityReactions` - Uses `usePostReactions` hook
- [x] `ReactionSummary` - Shows aggregated emojis
- [x] `CommunityComments` - Closed by default, opens on click
- [x] `ShareDropdown` - Production-ready
- [x] `CommunityAnalyticsDashboard` - Uses real Supabase queries

---

## 🚀 Deployment Steps

1. **Run Migration:**
   ```bash
   supabase migration up
   ```

2. **Verify Tables:**
   ```sql
   -- Check view_count column exists
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'posts_v2' AND column_name = 'view_count';
   ```

3. **Test Functions:**
   ```sql
   -- Step 1: Get a real community ID first
   SELECT id, name FROM communities LIMIT 1;
   
   -- Step 2: Use that UUID to test the function
   -- Replace 'YOUR_COMMUNITY_ID_HERE' with the actual UUID from Step 1
   SELECT * FROM get_community_analytics(
     'YOUR_COMMUNITY_ID_HERE'::UUID,  -- Must be a valid UUID, not 'community-id'
     30
   );
   
   -- OR use subquery (automatic):
   SELECT * FROM get_community_analytics(
     (SELECT id FROM communities LIMIT 1)::UUID,
     30
   );
   ```
   
   **⚠️ Important:** The function requires a valid UUID format (e.g., `'123e4567-e89b-12d3-a456-426614174000'`), 
   not a placeholder string like `'community-id'`. Use `::UUID` cast or get the ID from the `communities` table.

4. **Frontend:**
   - All hooks use real Supabase queries
   - All components have safe defaults
   - No mock data anywhere

---

## ✅ All Issues Fixed

1. ✅ **viewCount is not defined** → Fixed with `view_count` column + safe defaults
2. ✅ **Emoji always 👍** → Fixed by storing emoji in database
3. ✅ **Dashboard fake data** → Fixed with real Supabase RPC function
4. ✅ **Reaction counts mismatch** → Fixed with proper aggregation from DB

**Everything now uses real backend data with proper error handling.**

