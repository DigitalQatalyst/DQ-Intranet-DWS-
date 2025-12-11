-- ============================================================================
-- Fix work_positions department column to be nullable
-- Run this BEFORE importing positions
-- ============================================================================

-- Make department nullable if it's currently NOT NULL
ALTER TABLE public.work_positions 
ALTER COLUMN department DROP NOT NULL;

-- Verify the change
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'work_positions' 
  AND column_name = 'department';

