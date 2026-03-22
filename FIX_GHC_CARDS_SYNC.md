# Fix: GHC Element Cards Not Syncing with Supabase

## Problem
The GHC element cards on the Strategy Center (DNA section) use **hardcoded data** instead of fetching from Supabase. When you:
- Change data in Supabase → It doesn't show on localhost
- Change data in UI → It doesn't save to Supabase

## Root Cause
The `Discover_DNASection.tsx` component uses:
1. **Hardcoded `GROWTH_DIMENSIONS_CONTENT`** for modal content
2. **Hardcoded `NODES`** array for hexagon display
3. Tries to fetch from `dq_dna_nodes` table (which may not exist or be empty)
4. Falls back to hardcoded data if fetch fails

## Solution
Update the component to fetch GHC guides from the `guides` table in Supabase.

### Mapping GHC Guides to DNA Nodes
```
Node ID 1 → dq-vision (The Vision)
Node ID 2 → dq-hov (The HoV)
Node ID 3 → dq-persona (The Personas)
Node ID 4 → dq-agile-tms (Agile TMS)
Node ID 5 → dq-agile-sos (Agile SoS)
Node ID 6 → dq-agile-flows (Agile Flows)
Node ID 7 → dq-agile-6xd (Agile 6xD)
```

## Quick Fix Steps

### Option 1: Update Component to Fetch from Guides Table
1. Add a `useEffect` to fetch GHC guides from Supabase
2. Map guides to DNA nodes by slug
3. Use guide data (title, summary, body) instead of hardcoded content
4. Update modal to use guide data

### Option 2: Populate `dq_dna_nodes` Table
If you want to keep the current structure:
1. Create/update `dq_dna_nodes` table in Supabase
2. Populate it with data from `guides` table
3. Sync when guides are updated

## Recommended Approach
**Option 1** is better because:
- Single source of truth (guides table)
- No duplicate data
- Changes in guides automatically reflect in DNA section

## Files to Update
- `src/components/Discover/Discover_DNASection.tsx`
  - Add fetch from `guides` table
  - Map GHC slugs to node IDs
  - Use guide data for modal content

## Testing
After fix:
1. Change a guide in Supabase (e.g., update `dq-hov` title)
2. Hard refresh browser (Ctrl+Shift+R)
3. Click the HoV hexagon
4. Verify modal shows updated data
