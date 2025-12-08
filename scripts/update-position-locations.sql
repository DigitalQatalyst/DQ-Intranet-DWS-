-- ============================================================================
-- Update Position Locations
-- Use this script to standardize and update position locations
-- Run the review script first: scripts/review-position-locations.sql
-- ============================================================================

-- ===== STEP 1: Review Current State =====
-- First, run this to see what needs updating:
-- SELECT id, position_name, location FROM work_positions ORDER BY position_name;

-- ===== STEP 2: Standardize Location Values =====
-- Update common variations to standard values

-- Standardize "Remote" variations
UPDATE work_positions
SET location = 'Remote'
WHERE location IN ('remote', 'REMOTE', 'Remote Work', 'Work from Home', 'WFH', 'Anywhere');

-- Standardize "Global" variations  
UPDATE work_positions
SET location = 'Global'
WHERE location IN ('global', 'GLOBAL', 'Any Location', 'Anywhere', 'Worldwide');

-- Standardize city names
UPDATE work_positions
SET location = 'Nairobi'
WHERE location IN ('NBO', 'nairobi', 'NAIROBI', 'Kenya');

UPDATE work_positions
SET location = 'Dubai'
WHERE location IN ('DXB', 'dubai', 'DUBAI', 'UAE');

UPDATE work_positions
SET location = 'Riyadh'
WHERE location IN ('KSA', 'riyadh', 'RIYADH', 'Saudi Arabia');

UPDATE work_positions
SET location = 'Abu Dhabi'
WHERE location IN ('AD', 'abu dhabi', 'ABU DHABI');

-- ===== STEP 3: Set Location to NULL for Location-Agnostic Positions =====
-- If a position can be done from anywhere and location doesn't matter,
-- set it to NULL (it won't show a location tag)

-- Example: Update positions that should be location-agnostic
-- UPDATE work_positions
-- SET location = NULL
-- WHERE position_name LIKE '%Remote%' OR position_name LIKE '%Virtual%';

-- ===== STEP 4: Set Specific Locations for Office-Based Roles =====
-- Update positions that require being in a specific office

-- Example: Set Nairobi for positions that require Nairobi office
-- UPDATE work_positions
-- SET location = 'Nairobi'
-- WHERE unit_slug = 'hra-factory' AND location IS NULL;

-- ===== STEP 5: Verify Updates =====
-- Run this to see the results:
SELECT 
  id,
  position_name,
  location,
  unit,
  CASE 
    WHEN location IS NULL THEN 'No location (location-agnostic)'
    WHEN location = 'Remote' THEN 'Remote role'
    WHEN location = 'Global' THEN 'Global role'
    ELSE 'Office-based: ' || location
  END as location_type
FROM work_positions
ORDER BY position_name;

-- ===== RECOMMENDATIONS =====
-- 1. Office-based roles: Set to specific city (Nairobi, Dubai, Riyadh, Abu Dhabi)
-- 2. Remote roles: Set to "Remote"
-- 3. Global/Anywhere roles: Set to "Global" or NULL
-- 4. Location-agnostic: Set to NULL (won't show location tag)



