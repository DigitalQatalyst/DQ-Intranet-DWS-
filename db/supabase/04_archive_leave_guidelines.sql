-- Archive the DQ LEAVE GUIDELINES
-- This guideline should not appear on the home page anymore
-- Run this in your Knowledge Hub Supabase SQL Editor

UPDATE guides
SET status = 'Archived'
WHERE slug = 'dq-leave-guidelines';

-- Verify the update
SELECT id, title, slug, status, type
FROM guides
WHERE type ILIKE 'guideline%'
ORDER BY date DESC;
