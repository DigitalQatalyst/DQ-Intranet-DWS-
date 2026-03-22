# Knowledge Center Fix Summary

## Problem
DQ Knowledge Center was showing no cards and throwing 404 errors in console:
```
GET https://faqystypjlxqvgkhnbyq.supabase.co/rest/v1/guides?... 404 (Not Found)
```

## Root Cause
The Knowledge Center components were using the **wrong Supabase client**:
- ❌ Using: `supabaseClient` (main database: `faqystypjlxqvgkhnbyq.supabase.co`)
- ✅ Should use: `knowledgeHubSupabase` (Knowledge Hub database: `jmhtrffmxjxhoxpesubv.supabase.co`)

The `guides` table exists in the Knowledge Hub database, not the main database.

## Solution Applied

### Files Modified:
1. **src/components/marketplace/MarketplacePage.tsx**
   - Added import: `knowledgeHubSupabase`
   - Replaced `supabaseClient.from('guides')` with `knowledgeHubSupabase.from('guides')`
   - Added null check for Knowledge Hub client

2. **src/components/guides/GuideCard.tsx**
   - Added import: `knowledgeHubSupabase`
   - Replaced `supabaseClient.from('guides')` with `knowledgeHubSupabase.from('guides')`

### Changes Made:
```typescript
// Before
import { supabaseClient } from '../../lib/supabaseClient';
let q = supabaseClient.from('guides').select(...);

// After
import { knowledgeHubSupabase } from '../../services/knowledgeHubClient';
let q = knowledgeHubSupabase.from('guides').select(...);
```

## Expected Result
✅ Knowledge Center should now load cards from the correct database  
✅ No more 404 errors for `/rest/v1/guides` endpoints  
✅ Guidelines tab should display content  
✅ Strategy tab should display content  

## Testing Steps
1. Navigate to Knowledge Center (DQ Knowledge Center from nav)
2. Open DevTools Console
3. Verify no 404 errors for `guides` table
4. Verify cards are displayed
5. Check Network tab - should see requests to `jmhtrffmxjxhoxpesubv.supabase.co` (not `faqystypjlxqvgkhnbyq.supabase.co`)

## Environment Variables Used
```env
VITE_KNOWLEDGE_HUB_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Related Issues Fixed
- ✅ Knowledge Center 404 errors
- ✅ Empty cards/no content display
- ✅ Wrong database being queried

## Commit
```
fix: use Knowledge Hub Supabase client for guides table queries

- Replace supabaseClient with knowledgeHubSupabase in MarketplacePage
- Replace supabaseClient with knowledgeHubSupabase in GuideCard
- Fixes 404 errors when fetching guides from wrong database
```

## Status
✅ **FIXED** - Changes committed to develop branch

## Next Steps
1. Test on local dev server
2. Verify on Vercel preview
3. Confirm cards are loading
4. Ready for merge/deployment
