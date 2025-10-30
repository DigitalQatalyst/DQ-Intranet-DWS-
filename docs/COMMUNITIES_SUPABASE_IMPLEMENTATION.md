# Communities Supabase Implementation

## Overview

Successfully implemented Supabase data fetching for `/communities` and `/communities/feed` routes, following the same pattern used in `/marketplace/guides`.

## Implementation Summary

### 1. CommunityList (`/communities`)

**File**: `src/communities/CommunityList.tsx`

**Changes Made**:
- ✅ Replaced mock data with Supabase queries
- ✅ Fetches from `communities` table
- ✅ Implements pagination with "Load More" functionality
- ✅ Shows only public communities (`isprivate = false`)
- ✅ Orders by member count (most popular first)
- ✅ Added loading skeletons
- ✅ Added error handling with retry functionality
- ✅ Displays community metadata (tags, category, member counts)

**Query Pattern**:
```typescript
const { data, error, count } = await supabaseClient
  .from('communities')
  .select('*', { count: 'exact' })
  .eq('isprivate', false)
  .order('membercount', { ascending: false })
  .range(from, to);
```

**Features**:
- Pagination: 9 communities per page
- Loading states with skeleton UI
- Error handling with retry button
- Fallback images for missing community images
- Links to individual community pages
- Displays: name, description, category, tags, member count, active members

### 2. CommunityFeed (`/communities/feed`)

**File**: `src/communities/CommunityFeed.tsx`

**Changes Made**:
- ✅ Replaced all mock data with Supabase queries
- ✅ Implements three feed types:
  - **My Communities**: Posts from communities user joined
  - **Global**: All posts from public communities
  - **Trending**: Most engaged posts from last 7 days
- ✅ Fetches related data with joins (community, author, reactions, comments)
- ✅ Tag filtering functionality
- ✅ Sort options (recent, popular)
- ✅ Load more pagination for each feed type

**Query Patterns**:

#### My Communities Feed:
```typescript
const { data, error } = await supabaseClient
  .from('posts')
  .select(`
    *,
    community:communities(id, name),
    author:users_local(id, username, avatar_url),
    reactions(reaction_type),
    comments(id)
  `)
  .eq('status', 'active')
  .in('community_id', 
    supabaseClient
      .from('memberships')
      .select('community_id')
      .eq('user_id', user.id)
  )
  .order('created_at', { ascending: false })
  .range(offset, offset + 9);
```

#### Global Feed:
```typescript
const { data, error } = await supabaseClient
  .from('posts')
  .select(`
    *,
    community:communities!inner(id, name, isprivate),
    author:users_local(id, username, avatar_url),
    reactions(reaction_type),
    comments(id)
  `)
  .eq('status', 'active')
  .eq('community.isprivate', false)
  .order('created_at', { ascending: false })
  .range(offset, offset + 9);
```

#### Trending Feed:
```typescript
const { data, error } = await supabaseClient
  .from('posts')
  .select(`
    *,
    community:communities!inner(id, name, isprivate),
    author:users_local(id, username, avatar_url),
    reactions(reaction_type),
    comments(id)
  `)
  .eq('status', 'active')
  .eq('community.isprivate', false)
  .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  .order('created_at', { ascending: false })
  .range(offset, offset + 9);

// Then sort by engagement (reactions + comments) client-side
```

**Features**:
- Three tabbed feeds with independent data fetching
- Tag filtering across all feeds
- Reaction counts (helpful, insightful)
- Comment counts
- Author information with avatars
- Event metadata (date, location) for event posts
- Load more pagination per feed
- Real-time post creation refresh

## Database Schema Used

### Tables:
- **communities**: Community information
- **posts**: Post content and metadata
- **users_local**: User profiles
- **memberships**: User-community relationships
- **reactions**: Post reactions (helpful, insightful)
- **comments**: Post comments

### Key Relationships:
```
communities
  ├── posts (community_id)
  └── memberships (community_id)

posts
  ├── community (foreign key)
  ├── author/users_local (created_by)
  ├── reactions (post_id)
  └── comments (post_id)

memberships
  ├── user_id (users_local)
  └── community_id (communities)
```

## Pattern Consistency with Guides Marketplace

Both implementations follow the same pattern:

### 1. **Data Fetching**:
- Use `supabaseClient` from `src/lib/supabaseClient.ts`
- Async/await with try-catch error handling
- Loading states during fetch
- Error states with retry functionality

### 2. **Pagination**:
- `.range(from, to)` for pagination
- "Load More" button functionality
- Track `hasMore` state

### 3. **Filtering**:
- URL query parameters for filters
- `.eq()`, `.in()`, `.contains()` for filtering
- Client-side and server-side filtering

### 4. **Joins**:
- `.select()` with nested relationships
- Transform data to match component interfaces
- Handle null/undefined values

### 5. **UI States**:
- Loading skeletons
- Error displays with retry
- Empty states
- Success states with data

## Testing Checklist

- [ ] Communities list loads from Supabase
- [ ] Pagination works (Load More button)
- [ ] Only public communities are shown
- [ ] Community cards display correctly
- [ ] Images load with fallbacks
- [ ] Feed tabs load different data
- [ ] My Communities shows only joined communities
- [ ] Global feed shows all public posts
- [ ] Trending feed shows recent engaged posts
- [ ] Tag filtering works across feeds
- [ ] Load more works for each feed
- [ ] Reaction and comment counts display
- [ ] Author information shows correctly
- [ ] Error handling works (try with invalid credentials)

## Environment Setup Required

Ensure `.env.local` has:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup Required

Run the schema migration:
```sql
-- File: db/supabase/communities_schema.sql
```

Seed with sample data:
```sql
-- File: db/supabase/communities_seed_data.sql
```

## Next Steps

1. **Authentication Integration**: Connect with actual user authentication
2. **Real-time Subscriptions**: Add real-time updates for new posts
3. **Optimistic Updates**: Implement optimistic UI updates for reactions
4. **Caching**: Add query caching to reduce API calls
5. **Search**: Implement full-text search for posts
6. **Filters**: Add more filter options (date range, post type, etc.)
7. **Performance**: Optimize queries with indexes
8. **RLS Policies**: Review and enhance Row Level Security policies

## Performance Considerations

- **Pagination**: 9-10 items per page to balance UX and performance
- **Joins**: Limited to necessary relationships only
- **Counting**: Use `{ count: 'exact' }` only when needed
- **Filtering**: Server-side filtering preferred over client-side
- **Caching**: Consider implementing React Query or SWR for caching

## Error Handling

All queries include:
- Try-catch blocks
- Console error logging
- User-friendly error messages
- Retry functionality
- Graceful fallbacks

## Code Quality

- TypeScript interfaces for type safety
- Consistent naming conventions
- Reusable patterns
- Clean separation of concerns
- Comprehensive error handling
- Loading and empty states

## References

- Guides Marketplace: `src/components/marketplace/MarketplacePage.tsx`
- Supabase Client: `src/lib/supabaseClient.ts`
- Database Schema: `db/supabase/communities_schema.sql`
- Setup Guide: `SUPABASE_SETUP.md`
- Quick Reference: `docs/SUPABASE_QUICK_REFERENCE.md`
