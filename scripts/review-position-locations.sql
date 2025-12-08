-- ============================================================================
-- Review Position Locations
-- This query helps you review all positions and their location data
-- Use this to decide which positions should have location tags
-- ============================================================================

-- View all positions with their location information
SELECT 
  id,
  position_name,
  location,
  unit,
  unit_slug,
  role_family,
  department,
  status,
  contract_type,
  CASE 
    WHEN location IS NULL THEN '❓ No location set'
    WHEN location = 'Remote' OR location = 'Global' THEN '🌐 Remote/Global'
    WHEN location IN ('Nairobi', 'Dubai', 'Riyadh', 'Abu Dhabi') THEN '📍 Office-based'
    ELSE '⚠️ Check location value'
  END as location_type,
  CASE
    WHEN location IS NULL THEN 'Consider: Set to NULL if location-agnostic, or specific city if office-based'
    WHEN location = 'Remote' OR location = 'Global' THEN 'Good: Keep as is for remote roles'
    WHEN location IN ('Nairobi', 'Dubai', 'Riyadh', 'Abu Dhabi') THEN 'Good: Specific location for office-based roles'
    ELSE 'Review: Location value may need standardization'
  END as recommendation
FROM work_positions
ORDER BY 
  CASE 
    WHEN location IS NULL THEN 1
    WHEN location = 'Remote' OR location = 'Global' THEN 2
    ELSE 3
  END,
  position_name;

-- Summary statistics
SELECT 
  COUNT(*) as total_positions,
  COUNT(location) as positions_with_location,
  COUNT(*) - COUNT(location) as positions_without_location,
  COUNT(CASE WHEN location IN ('Remote', 'Global') THEN 1 END) as remote_positions,
  COUNT(CASE WHEN location IN ('Nairobi', 'Dubai', 'Riyadh', 'Abu Dhabi') THEN 1 END) as office_based_positions,
  COUNT(CASE WHEN location IS NOT NULL AND location NOT IN ('Remote', 'Global', 'Nairobi', 'Dubai', 'Riyadh', 'Abu Dhabi') THEN 1 END) as other_locations
FROM work_positions;

-- Group by location to see distribution
SELECT 
  COALESCE(location, 'NULL (No location)') as location,
  COUNT(*) as position_count,
  STRING_AGG(position_name, ', ' ORDER BY position_name) as positions
FROM work_positions
GROUP BY location
ORDER BY 
  CASE 
    WHEN location IS NULL THEN 1
    WHEN location = 'Remote' THEN 2
    WHEN location = 'Global' THEN 3
    ELSE 4
  END,
  location;



