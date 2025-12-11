-- Delete DQ L24 Working Rooms Guidelines from Supabase
-- This will completely remove the guide from the database

DELETE FROM guides
WHERE slug = 'dq-l24-working-rooms-guidelines';

-- Verify deletion
SELECT 
  slug,
  title,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Guide deleted successfully'
    ELSE '✗ Guide still exists'
  END as deletion_status
FROM guides
WHERE slug = 'dq-l24-working-rooms-guidelines'
GROUP BY slug, title;
