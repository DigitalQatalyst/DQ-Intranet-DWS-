# Knowledge Hub Detail Page Fix

## Issue
Guide detail pages ("View Details" button on cards) were not loading and showing 404 errors in console:
```
GET https://faqystypjlxqvgkhnbyq.supabase.co/rest/v1/guides?select=*&slug=eq.dq-ghc 404 (Not Found)
```

## Root Cause
`GuideDetailPage.tsx` was using `supabaseClient` (main database) instead of `knowledgeHubSupabase` (Knowledge Hub database) to query the guides table.

## Solution Applied

### File: `src/pages/guides/GuideDetailPage.tsx`

1. **Added import** for Knowledge Hub client:
```typescript
import { knowledgeHubSupabase } from '../../services/knowledgeHubClient'
```

2. **Replaced database client** in guide fetch logic:
```typescript
// Before:
const { data: row, error: err1 } = await supabaseClient.from('guides').select('*').eq('slug', key).maybeSingle()

// After:
const { data: row, error: err1 } = await knowledgeHubSupabase.from('guides').select('*').eq('slug', key).maybeSingle()
```

Both slug-based and ID-based queries now use the correct database.

## Verification
- No TypeScript errors
- Guide detail pages should now load correctly
- Console should show requests to `jmhtrffmxjxhoxpesubv.supabase.co` (Knowledge Hub DB) instead of `faqystypjlxqvgkhnbyq.supabase.co` (main DB)

## Related Fixes
This completes the Knowledge Hub database client migration:
- ✅ MarketplacePage.tsx (card listing) - fixed previously
- ✅ GuideCard.tsx (card component) - fixed previously  
- ✅ GuideDetailPage.tsx (detail view) - fixed now

All Knowledge Hub features now query the correct database.
