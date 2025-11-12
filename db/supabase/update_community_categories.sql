-- Update community categories to DQ-specific categories
-- New categories: DQ Culture, DQ Agile, DQ Tech, DQ Persona, DQ DTMF, DQ Vision

-- Option 1: Map existing categories to new DQ categories
-- This maps old generic categories to the new DQ-specific ones
UPDATE communities 
SET category = CASE
  WHEN LOWER(category) LIKE '%tech%' OR LOWER(category) LIKE '%technology%' THEN 'DQ Tech'
  WHEN LOWER(category) LIKE '%agile%' THEN 'DQ Agile'
  WHEN LOWER(category) LIKE '%persona%' THEN 'DQ Persona'
  WHEN LOWER(category) LIKE '%dtmf%' THEN 'DQ DTMF'
  WHEN LOWER(category) LIKE '%vision%' THEN 'DQ Vision'
  WHEN LOWER(category) LIKE '%culture%' THEN 'DQ Culture'
  WHEN LOWER(category) LIKE '%business%' OR LOWER(category) LIKE '%creative%' OR LOWER(category) LIKE '%social%' THEN 'DQ Culture'
  WHEN LOWER(category) LIKE '%education%' THEN 'DQ Vision'
  ELSE 'DQ Culture'  -- Default for unmapped categories
END
WHERE category IS NOT NULL;

-- Option 2: Set all existing communities to a default category (uncomment if preferred)
-- UPDATE communities SET category = 'DQ Culture' WHERE category IS NOT NULL;

-- Option 3: Set NULL categories to default (uncomment if preferred)
-- UPDATE communities SET category = 'DQ Culture' WHERE category IS NULL;

-- Verify the update - check category distribution
SELECT DISTINCT category, COUNT(*) as count 
FROM communities 
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

-- Verify all communities have categories (optional check)
SELECT COUNT(*) as communities_without_category
FROM communities 
WHERE category IS NULL;

COMMENT ON COLUMN communities.category IS 'DQ-specific categories: DQ Culture, DQ Agile, DQ Tech, DQ Persona, DQ DTMF, DQ Vision';

