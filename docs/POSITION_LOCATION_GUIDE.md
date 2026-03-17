# Position Location Tags - Guide

## Overview

This guide explains how location tags work for positions in the Work Directory and when to use them.

## When to Show Location Tags

### ✅ **Show Location Tag When:**
- **Office-based roles**: Position requires being in a specific office (e.g., "Nairobi", "Dubai", "Riyadh")
- **Hybrid roles**: Position has location requirements (e.g., "Dubai (Hybrid)")
- **Remote roles**: Position is fully remote (show "Remote" or "🌐 Remote")
- **Regional roles**: Position is tied to a specific region (e.g., "Middle East", "Africa")

### ❌ **Don't Show Location Tag When:**
- **Location-agnostic**: Position can be done from anywhere, location doesn't matter
- **NULL or empty**: Set location to `NULL` in database - tag won't appear
- **Too generic**: If "Global" is too vague and not helpful

## Location Values

### Standard Values:
- **Cities**: `Nairobi`, `Dubai`, `Riyadh`, `Abu Dhabi`
- **Remote**: `Remote` (displays with 🌐 icon)
- **Global**: `Global` (for roles available worldwide)
- **NULL**: No location tag shown (for location-agnostic roles)

### Display Logic:
- **Remote**: Shows with 🌐 icon and purple badge
- **Global**: Shows with gray badge
- **Specific cities**: Shows with slate badge
- **NULL/Empty**: No badge shown

## How to Update Positions

### Step 1: Review Current Locations
Run the review script in Supabase SQL Editor:
```sql
-- Copy contents of: scripts/review-position-locations.sql
```

This will show:
- All positions and their current locations
- Recommendations for each position
- Summary statistics

### Step 2: Update Locations
Run the update script:
```sql
-- Copy contents of: scripts/update-position-locations.sql
```

Or update manually:
```sql
-- Example: Set a position to Remote
UPDATE work_positions
SET location = 'Remote'
WHERE id = 'position-id-here';

-- Example: Set a position to location-agnostic (no tag)
UPDATE work_positions
SET location = NULL
WHERE id = 'position-id-here';

-- Example: Set a position to specific city
UPDATE work_positions
SET location = 'Nairobi'
WHERE id = 'position-id-here';
```

### Step 3: Verify Changes
Check the Work Directory page to see how locations appear.

## Best Practices

1. **Be Specific**: Use actual city names for office-based roles
2. **Be Consistent**: Use standard values (Nairobi, Dubai, Riyadh, Remote, Global)
3. **When in Doubt**: If location doesn't matter, set to `NULL`
4. **Remote Roles**: Use "Remote" for fully remote positions
5. **Hybrid Roles**: Consider format like "Dubai (Hybrid)" if needed

## Code Changes Made

### PositionCard Component
- Location tag only shows if location is meaningful (not null/empty)
- Remote locations show with 🌐 icon
- Different badge colors for Remote vs Global vs Cities

### PositionHero Component
- Same smart location display logic
- Consistent with card display

## Questions?

If you're unsure whether a position should have a location tag:
1. Ask: "Does this role require being in a specific location?"
2. If YES → Set specific city or "Remote"
3. If NO → Set to `NULL` (no tag will show)



