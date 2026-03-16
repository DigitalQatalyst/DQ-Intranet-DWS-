-- Archive DQ Leave Guidelines
-- This will set the status to 'Archived' so it won't appear in the Knowledge Center

UPDATE guides
SET status = 'Archived'
WHERE slug = 'dq-leave-guidelines'
   OR title ILIKE '%leave guidelines%'
   OR title ILIKE '%DQ LEAVE GUIDELINES%';

-- Verify the update
SELECT id, title, slug, status
FROM guides
WHERE slug = 'dq-leave-guidelines'
   OR title ILIKE '%leave guidelines%';
