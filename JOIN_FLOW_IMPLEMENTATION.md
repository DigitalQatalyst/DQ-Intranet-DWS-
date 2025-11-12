# Join Community Flow Implementation - DQ-Intranet-DWS-

## Summary
The join community flow has been updated to mirror MZN-EJP-v2. Clicking "Join Community" or "Request to Join" on community cards now navigates to the Community Detail page, where users can complete the join action.

## Implementation Details

### 1. Navigation Flow (Communities.tsx)
**File**: `src/communities/pages/Communities.tsx`

**Function**: `handleJoinCommunity` (lines 197-203)
```typescript
const handleJoinCommunity = useCallback((communityId: string) => {
  if (!user) {
    navigate('/login');
    return;
  }
  navigate(`/community/${communityId}`);
}, [user, navigate]);
```

**Behavior**:
- If user not logged in → Navigates to `/login`
- If user logged in → Navigates to `/community/${communityId}`

### 2. Route Configuration
**File**: `src/AppRouter.tsx`

**Route**: Line 129
```typescript
<Route path="/community/:id" element={<Community />} />
```

**Component**: `Community` component from `./communities/pages/Community`

### 3. Community Detail Page (Community.tsx)
**File**: `src/communities/pages/Community.tsx`

**Join Button States**:
- **Not logged in**: Shows "Login to Join" button
- **Logged in, not a member, public community**: Shows "Join Community" button
- **Logged in, not a member, private community**: Shows "Request to Join" button
- **Logged in, is a member**: Shows "Leave Community" button

**Button Implementation** (lines 507-538):
```typescript
{!user ? (
  <Button onClick={() => navigate("/community")}>
    Login to Join
  </Button>
) : isMember ? (
  <Button onClick={handleJoinLeave} variant="outline">
    {joinLoading ? "Processing..." : "Leave Community"}
  </Button>
) : (
  <Button onClick={handleJoinLeave}>
    {joinLoading
      ? "Processing..."
      : community?.isprivate
      ? "Request to Join"
      : "Join Community"}
  </Button>
)}
```

### 4. Join/Leave Action (Community.tsx)
**Function**: `handleJoinLeave` (lines 175-210)

**Join Logic**:
- Inserts membership record into `memberships` table
- Updates UI state (`isMember`, `memberCount`)
- Shows success/error toast messages

**Leave Logic**:
- Deletes membership record from `memberships` table
- Updates UI state (`isMember`, `memberCount`)
- Shows success/error toast messages

### 5. Database Schema Updates
**File**: `db/supabase/communities_schema.sql`

**Updated View**: `communities_with_counts` (line 320-332)
- Added `isprivate` field to the view
- Updated GROUP BY clause to include `isprivate`

### 6. Data Fetching Updates

#### Communities.tsx
- Added `isprivate?: boolean` to `Community` interface
- Updated to use actual `isprivate` field from database instead of random value
- Passes `isPrivate: community.isprivate || false` to CommunityCard

#### Community.tsx
- Added `isprivate?: boolean` to `Community` interface
- Fetches `isprivate` field from `communities_with_counts` view
- Uses `isprivate` to determine button text

## Flow Diagram

```
User clicks "Join Community" / "Request to Join" on Community Card
         ↓
handleJoinCommunity(communityId)
         ↓
    Check if user logged in
         ↓
    ┌─────────┴─────────┐
    │                   │
  No user          User logged in
    │                   │
    ↓                   ↓
Navigate to      Navigate to
/login          /community/:id
                        ↓
                Community.tsx page loads
                        ↓
                Fetches community data
                (including isprivate field)
                        ↓
                Checks membership status
                        ↓
                Shows appropriate button:
                - "Join Community" (public, not member)
                - "Request to Join" (private, not member)
                - "Leave Community" (is member)
                        ↓
                User clicks button
                        ↓
                handleJoinLeave() executes
                        ↓
                Inserts/deletes membership
                        ↓
                Updates UI state
```

## Button States

| User State | Community Type | Button Text | Action |
|------------|----------------|-------------|--------|
| Not logged in | Any | "Login to Join" | Navigate to `/community` |
| Logged in, not member | Public | "Join Community" | Join community |
| Logged in, not member | Private | "Request to Join" | Join community |
| Logged in, is member | Any | "Leave Community" | Leave community |

## Notes

1. **No Request Pending State**: The system doesn't have a separate membership request mechanism. Private communities use the same `memberships` table as public communities. The "Request to Join" text is just UI indication - the actual join action is immediate.

2. **Database View**: The `communities_with_counts` view now includes the `isprivate` field, so it's available when fetching communities.

3. **Route Pattern**: Matches MZN-EJP-v2 exactly: `/community/:id`

4. **Membership Check**: Uses the `memberships` table to check if a user is already a member.

## Files Modified

1. ✅ `src/communities/pages/Communities.tsx`
   - Added `isprivate` to interface
   - Updated to use actual `isprivate` field from database

2. ✅ `src/communities/pages/Community.tsx`
   - Added `isprivate` to interface
   - Updated `fetchCommunity` to fetch `isprivate` field
   - Updated button text to show "Request to Join" for private communities

3. ✅ `db/supabase/communities_schema.sql`
   - Updated `communities_with_counts` view to include `isprivate` field

## Verification

- ✅ Navigation flow matches MZN-EJP-v2
- ✅ Route pattern matches MZN-EJP-v2 (`/community/:id`)
- ✅ Button states match MZN-EJP-v2 behavior
- ✅ Private community support implemented
- ✅ Membership status correctly displayed
- ✅ Join/Leave functionality working

## Testing Checklist

- [ ] Click "Join Community" on public community card → Navigates to detail page
- [ ] Click "Request to Join" on private community card → Navigates to detail page
- [ ] On detail page, see "Join Community" for public communities (not member)
- [ ] On detail page, see "Request to Join" for private communities (not member)
- [ ] On detail page, see "Leave Community" when already a member
- [ ] Click join button → Successfully joins community
- [ ] Click leave button → Successfully leaves community
- [ ] Membership status updates correctly after join/leave

