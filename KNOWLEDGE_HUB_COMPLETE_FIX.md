# Knowledge Hub Complete Database Client Fix

## Issue
All Knowledge Hub pages (Guidelines, GHC/Strategy, card listings, and detail pages) were showing 404 errors because they were querying the wrong Supabase database:

```
GET https://faqystypjlxqvgkhnbyq.supabase.co/rest/v1/guides 404 (Not Found)
```

The guides table exists in the Knowledge Hub database (`jmhtrffmxjxhoxpesubv.supabase.co`), not the main database.

## Root Cause
49 files across the codebase were using `supabaseClient` (main DB) instead of `knowledgeHubSupabase` (Knowledge Hub DB) to query the guides table.

## Solution Applied

### Automated Fix
1. Used Python script to find all files querying the guides table
2. Replaced `supabaseClient.from('guides')` with `knowledgeHubSupabase.from('guides')`
3. Added the necessary import with correct relative paths
4. Fixed import path issues (strategy/guidelines pages needed `../../../` not `../../`)

### Import Path Corrections
- Files in `src/pages/strategy/`: `from '../../../services/knowledgeHubClient'`
- Files in `src/pages/guidelines/`: `from '../../../services/knowledgeHubClient'`
- Files in `src/pages/admin/`: `from '../../../services/knowledgeHubClient'`
- Files in `src/pages/blueprints/`: `from '../../../services/knowledgeHubClient'`
- Files in `src/pages/guides/`: `from '../../services/knowledgeHubClient'`
- Files in `src/components/`: `from '../../services/knowledgeHubClient'`
- Files in `src/services/`: `from './knowledgeHubClient'`

### Files Fixed (49 total)

**Core Components:**
- `src/components/marketplace/MarketplacePage.tsx` - Card listings
- `src/components/guides/GuideCard.tsx` - Individual cards
- `src/components/Discover/Discover_DNASection.tsx`

**Services:**
- `src/services/marketplace.ts` - Marketplace data fetching

**Detail Pages:**
- `src/pages/guides/GuideDetailPage.tsx` - Generic guide detail view
- `src/pages/guides/GuideDetailsPage.tsx` - Alternative detail view
- `src/pages/blueprints/detail/BlueprintPage.tsx` - Blueprint details

**Admin Pages:**
- `src/pages/admin/ghc-inspector/DefinitiveDiagnosis.tsx`
- `src/pages/admin/ghc-inspector/GHCInspectorPage.tsx`
- `src/pages/admin/ghc-inspector/GHCDiagnosticTool.tsx`
- `src/pages/admin/guides/GuideEditor.tsx`

**Strategy (GHC) Pages (20 files):**
- `src/pages/strategy/dq-ghc/GuidelinePage.tsx` - GHC Overview
- `src/pages/strategy/dq-vision/GuidelinePage.tsx` - Vision
- `src/pages/strategy/dq-hov/GuidelinePage.tsx` - House of Values
- `src/pages/strategy/dq-persona/GuidelinePage.tsx` - Persona
- `src/pages/strategy/dq-agile-tms/GuidelinePage.tsx` - Agile TMS
- `src/pages/strategy/dq-agile-sos/GuidelinePage.tsx` - Agile SoS
- `src/pages/strategy/dq-agile-flows/GuidelinePage.tsx` - Agile Flows
- `src/pages/strategy/dq-agile-6xd/GuidelinePage.tsx` - Agile 6xD
- `src/pages/strategy/dq-competencies/GuidelinePage.tsx` - Competencies overview
- `src/pages/strategy/dq-products/GuidelinePage.tsx` - Products
- All 12 competency pages:
  - `dq-competencies-emotional-intelligence`
  - `dq-competencies-growth-mindset`
  - `dq-competencies-purpose`
  - `dq-competencies-perceptive`
  - `dq-competencies-proactive`
  - `dq-competencies-perseverance`
  - `dq-competencies-precision`
  - `dq-competencies-customer`
  - `dq-competencies-learning`
  - `dq-competencies-collaboration`
  - `dq-competencies-responsibility`
  - `dq-competencies-trust`

**Guidelines Pages (13 files):**
- `src/pages/guidelines/house-of-values/HouseOfValuesPage.tsx`
- `src/pages/guidelines/vision-mission/VisionMissionPage.tsx`
- `src/pages/guidelines/scrum-master-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/functional-tracker-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/qforum-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/agenda-scheduling-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/rescue-shift-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/l24-working-rooms/GuidelinePage.tsx`
- `src/pages/guidelines/wfh-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/asset-maintenance-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/dress-code-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/avr-awards-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/biometric-system-guidelines/GuidelinePage.tsx`
- `src/pages/guidelines/wr-attendance-punctuality-policy/GuidelinePage.tsx`
- `src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx`

## Verification
- No TypeScript errors in any fixed files
- All guides queries now target the correct database
- Console should show requests to `jmhtrffmxjxhoxpesubv.supabase.co` (Knowledge Hub DB)

## Expected Results
After this fix:
- ✅ Knowledge Hub card listings load correctly
- ✅ "View Details" buttons work on all guide cards
- ✅ GHC/Strategy pages load with content
- ✅ Guidelines pages load with content
- ✅ Related guides sections populate correctly
- ✅ No 404 errors for guides table in console

## Testing Checklist
1. Navigate to DQ Knowledge Center
2. Check Guidelines tab - cards should display
3. Check GHC tab - cards should display
4. Click "View Details" on any card - detail page should load
5. Check console - no 404 errors for guides table
6. Verify all requests go to `jmhtrffmxjxhoxpesubv.supabase.co`

## Related Configuration
The Knowledge Hub database client is configured in:
- `src/services/knowledgeHubClient.ts`
- Environment variable: `VITE_KNOWLEDGE_HUB_SUPABASE_URL`
- Database URL: `https://jmhtrffmxjxhoxpesubv.supabase.co`
