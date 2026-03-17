 -- Diagnostic query to check what columns actually exist in the guides table
-- Run this first to see what columns are available

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'guides'
ORDER BY ordinal_position;
