# Recreate Work Positions Table Guide

## Overview

This guide will help you drop the existing `work_positions` table and recreate it with the correct structure and data from the ADP tracker.

## ⚠️ WARNING

**This will DELETE all existing position data!** Make sure you have a backup if you need to preserve any existing data.

## Steps to Recreate Positions Table

### Step 1: Run the Recreation Script

1. Go to your **Supabase Dashboard** → Select your project
2. Navigate to **SQL Editor** → Click **New Query**
3. Open the file: `supabase/recreate-work-positions-table.sql`
4. Copy the **entire contents** and paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify the Results

After running the script, you should see:
- ✅ Table created successfully
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ 58 positions inserted (organized by role family)

The verification query at the end will show:
- Count of positions per role family
- Total position count (should be 58)

### Step 3: Test in Your Application

1. Refresh your work directory page
2. Navigate to the **Positions** tab
3. Verify all positions are showing correctly
4. Test filtering by:
   - Role Family
   - Location
   - SFIA Level
   - Unit

## What This Script Does

1. **Drops** the existing `work_positions` table (and all dependencies)
2. **Creates** a new table with the correct structure:
   - Required fields: `id`, `slug`, `position_name`, `role_family`, `status`
   - Optional fields: `location`, `sfia_level`, `unit`, `department`, etc.
3. **Creates indexes** for better query performance
4. **Enables RLS** and creates public read policies
5. **Inserts 58 positions** from the ADP tracker, organized into:
   - Core Delivery & Product Roles (10 positions)
   - Design & UX Roles (3 positions)
   - Engineering Roles (14 positions)
   - Platform / Operations / TechOps Roles (6 positions)
   - Data / Intelligence Roles (6 positions)
   - Business / Commercial Roles (7 positions)
   - HR / People Roles (2 positions)
   - Specialized Roles (6 positions)
   - Leadership Roles (5 positions)

## Role Families Included

- **Core Delivery & Product Roles** - Product owners, analysts, managers, leads
- **Design & UX Roles** - UI/UX designers, product designers
- **Engineering Roles** - Developers, engineers, architects
- **Platform / Operations / TechOps Roles** - TechOps, support, operations
- **Data / Intelligence Roles** - Data analysts, engineers, architects
- **Business / Commercial Roles** - BD, marketing, content
- **HR / People Roles** - HR analysts and admins
- **Specialized Roles** - Cybersecurity, governance, finance
- **Leadership Roles** - Various leadership levels

## Troubleshooting

### Error: "relation work_positions does not exist"
- This is normal if the table was already dropped
- The script will create it fresh

### Error: "permission denied"
- Make sure you're running this as a database admin
- Check that you have the correct permissions in Supabase

### Positions not showing in frontend
- Check that RLS policies are enabled (they should be)
- Verify the frontend is querying the correct table name
- Check browser console for any errors

### Missing positions
- Verify all INSERT statements ran successfully
- Check the verification query at the end of the script
- Make sure all 58 positions were inserted

## Next Steps

After recreating the table, you can:
1. Add more details to positions (descriptions, responsibilities, etc.)
2. Update locations for specific positions
3. Add SFIA levels where applicable
4. Link positions to specific units

## Related Files

- `supabase/work-directory-schema.sql` - Full schema (includes other tables)
- `supabase/work-directory-positions-from-adp.sql` - Original ADP data (for reference)
- `scripts/review-position-locations.sql` - Review position locations
- `scripts/update-position-locations.sql` - Update position locations


