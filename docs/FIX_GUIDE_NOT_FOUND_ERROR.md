# Fix: "Guide not found" Error

## Problem
When clicking "View Details" (Read More) button on the GHC page, users were getting a "Guide not found" error.

## Root Cause
The GHC page was using `currentSlug = 'ghc'` but the database has the slug stored as `dq-ghc`. When the GuideDetailsPage tried to fetch the guide using slug `ghc`, it couldn't find it.

## Solution
Updated the GHC page to use the correct database slug while maintaining the content key:

```typescript
// Before:
const currentSlug = 'ghc'
const content = GUIDE_CONTENT[currentSlug]

// After:
const currentSlug = 'dq-ghc'  // Matches database slug
const contentKey = 'ghc'       // Matches GUIDE_CONTENT key
const content = GUIDE_CONTENT[contentKey]
```

## Files Modified
- `src/pages/strategy/dq-ghc/GuidelinePage.tsx`

## Why Other Pages Work
The other 7 pages (dq-vision, dq-hov, dq-persona, dq-agile-tms, dq-agile-sos, dq-agile-flows, dq-agile-6xd) already have matching slugs:
- Database slug: `dq-vision`
- GUIDE_CONTENT key: `dq-vision`
- currentSlug: `dq-vision`

So they work correctly without needing a separate contentKey.

## Testing
1. Navigate to the GHC page: `/marketplace/guides/ghc`
2. Click the "View Details" button
3. Should now successfully load the guide details page
4. Verify all other guide pages still work correctly

## Status
✅ Fixed - GHC page now uses correct database slug
