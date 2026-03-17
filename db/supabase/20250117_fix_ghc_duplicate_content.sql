-- Migration: Fix GHC Duplicate Content Issue
-- Date: 2025-01-17
-- Purpose: Clean up and prevent duplicate content in GHC guides
-- 
-- This migration:
-- 1. Identifies GHC guides with duplicate body content
-- 2. Creates a function to validate GHC guide uniqueness
-- 3. Creates a trigger to prevent duplicate content on GHC guides
-- 4. Provides a cleanup function to identify issues

-- GHC guide slugs (these are fixed and should never change)
DO $$
DECLARE
  ghc_slugs text[] := ARRAY[
    'dq-vision',
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ];
BEGIN
  -- Store in a temporary table for reference
  CREATE TEMP TABLE IF NOT EXISTS ghc_slugs_list AS
  SELECT unnest(ghc_slugs) AS slug;
END $$;

-- ============================================================================
-- 1. Function to identify GHC guides with duplicate content
-- ============================================================================
CREATE OR REPLACE FUNCTION public.identify_ghc_duplicates()
RETURNS TABLE (
  body_hash text,
  body_preview text,
  body_length int,
  guide_count int,
  guide_ids uuid[],
  guide_slugs text[],
  guide_titles text[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ghc_slugs text[] := ARRAY[
    'dq-vision',
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ];
BEGIN
  RETURN QUERY
  WITH ghc_guides AS (
    SELECT 
      id,
      slug,
      title,
      body,
      COALESCE(TRIM(body), '') AS body_trimmed,
      LENGTH(COALESCE(TRIM(body), '')) AS body_len
    FROM public.guides
    WHERE slug = ANY(ghc_slugs)
      AND body IS NOT NULL
      AND TRIM(body) != ''
  ),
  body_groups AS (
    SELECT 
      body_trimmed,
      COUNT(*) AS cnt,
      ARRAY_AGG(id ORDER BY slug) AS ids,
      ARRAY_AGG(slug ORDER BY slug) AS slugs,
      ARRAY_AGG(title ORDER BY slug) AS titles,
      MIN(body_len) AS min_len
    FROM ghc_guides
    GROUP BY body_trimmed
    HAVING COUNT(*) > 1
  )
  SELECT 
    MD5(bg.body_trimmed) AS body_hash,
    LEFT(bg.body_trimmed, 100) AS body_preview,
    bg.min_len AS body_length,
    bg.cnt::int AS guide_count,
    bg.ids AS guide_ids,
    bg.slugs AS guide_slugs,
    bg.titles AS guide_titles
  FROM body_groups bg
  ORDER BY bg.cnt DESC, bg.min_len DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.identify_ghc_duplicates() TO authenticated, anon;

-- ============================================================================
-- 2. Function to validate GHC guide uniqueness (for use in triggers/checks)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.validate_ghc_uniqueness(
  p_guide_id uuid,
  p_slug text,
  p_body text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ghc_slugs text[] := ARRAY[
    'dq-vision',
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ];
  is_ghc boolean;
  body_trimmed text;
  duplicate_count int;
BEGIN
  -- Check if this is a GHC guide
  is_ghc := p_slug = ANY(ghc_slugs);
  
  -- If not a GHC guide, skip validation
  IF NOT is_ghc THEN
    RETURN true;
  END IF;
  
  -- If body is empty/null, allow it (but warn)
  IF p_body IS NULL OR TRIM(p_body) = '' THEN
    RETURN true;
  END IF;
  
  body_trimmed := TRIM(p_body);
  
  -- Check if any other GHC guide has the same body content
  SELECT COUNT(*)
  INTO duplicate_count
  FROM public.guides
  WHERE slug = ANY(ghc_slugs)
    AND id != p_guide_id
    AND body IS NOT NULL
    AND TRIM(body) = body_trimmed;
  
  -- If duplicates found, return false
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 
      'GHC guide with slug % cannot have body content identical to another GHC guide. Each GHC element must have unique content.',
      p_slug;
  END IF;
  
  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.validate_ghc_uniqueness(uuid, text, text) TO authenticated, anon;

-- ============================================================================
-- 3. Trigger function to prevent duplicate content on INSERT/UPDATE
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_ghc_content_uniqueness()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ghc_slugs text[] := ARRAY[
    'dq-vision',
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ];
  is_ghc boolean;
  body_trimmed text;
  duplicate_count int;
  duplicate_slugs text[];
BEGIN
  -- Check if this is a GHC guide
  is_ghc := NEW.slug = ANY(ghc_slugs);
  
  -- If not a GHC guide, skip validation
  IF NOT is_ghc THEN
    RETURN NEW;
  END IF;
  
  -- If body is empty/null, allow it
  IF NEW.body IS NULL OR TRIM(NEW.body) = '' THEN
    RETURN NEW;
  END IF;
  
  body_trimmed := TRIM(NEW.body);
  
  -- Check if any other GHC guide has the same body content
  SELECT COUNT(*), ARRAY_AGG(slug)
  INTO duplicate_count, duplicate_slugs
  FROM public.guides
  WHERE slug = ANY(ghc_slugs)
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND body IS NOT NULL
    AND TRIM(body) = body_trimmed;
  
  -- If duplicates found, raise error
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 
      'GHC guide with slug % cannot have body content identical to other GHC guide(s): %. Each GHC element must have unique content.',
      NEW.slug,
      array_to_string(duplicate_slugs, ', ');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS trg_check_ghc_content_uniqueness ON public.guides;
CREATE TRIGGER trg_check_ghc_content_uniqueness
  BEFORE INSERT OR UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.check_ghc_content_uniqueness();

-- ============================================================================
-- 4. Function to get GHC guide status report
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_ghc_status_report()
RETURNS TABLE (
  total_ghc_guides int,
  missing_slugs text[],
  duplicate_content_groups int,
  guides_with_empty_body text[],
  status_summary jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ghc_slugs text[] := ARRAY[
    'dq-vision',
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ];
  total_count int;
  missing text[];
  empty_body text[];
  dup_groups int;
  summary jsonb;
BEGIN
  -- Count total GHC guides
  SELECT COUNT(*)
  INTO total_count
  FROM public.guides
  WHERE slug = ANY(ghc_slugs);
  
  -- Find missing slugs
  SELECT ARRAY_AGG(s)
  INTO missing
  FROM unnest(ghc_slugs) s
  WHERE NOT EXISTS (
    SELECT 1 FROM public.guides WHERE slug = s
  );
  
  -- Find guides with empty body
  SELECT ARRAY_AGG(slug)
  INTO empty_body
  FROM public.guides
  WHERE slug = ANY(ghc_slugs)
    AND (body IS NULL OR TRIM(body) = '');
  
  -- Count duplicate content groups
  SELECT COUNT(*)
  INTO dup_groups
  FROM public.identify_ghc_duplicates();
  
  -- Build summary JSON
  summary := jsonb_build_object(
    'total_expected', array_length(ghc_slugs, 1),
    'total_found', total_count,
    'all_present', total_count = array_length(ghc_slugs, 1),
    'has_duplicates', dup_groups > 0,
    'has_empty_bodies', array_length(empty_body, 1) > 0
  );
  
  RETURN QUERY SELECT
    total_count,
    COALESCE(missing, ARRAY[]::text[]) AS missing_slugs,
    dup_groups,
    COALESCE(empty_body, ARRAY[]::text[]) AS guides_with_empty_body,
    summary;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_ghc_status_report() TO authenticated, anon;

-- ============================================================================
-- 5. Comments for documentation
-- ============================================================================
COMMENT ON FUNCTION public.identify_ghc_duplicates() IS 
  'Identifies GHC guides that have identical body content. Returns groups of guides sharing the same content.';

COMMENT ON FUNCTION public.validate_ghc_uniqueness(uuid, text, text) IS 
  'Validates that a GHC guide has unique body content. Raises exception if duplicate found.';

COMMENT ON FUNCTION public.check_ghc_content_uniqueness() IS 
  'Trigger function that prevents inserting/updating GHC guides with duplicate body content.';

COMMENT ON FUNCTION public.get_ghc_status_report() IS 
  'Returns a comprehensive status report of all GHC guides including missing slugs, duplicates, and empty bodies.';

-- ============================================================================
-- 6. Example usage queries (commented out - for reference)
-- ============================================================================
/*
-- Check for duplicates:
SELECT * FROM public.identify_ghc_duplicates();

-- Get status report:
SELECT * FROM public.get_ghc_status_report();

-- Test validation (should fail if duplicate):
SELECT public.validate_ghc_uniqueness(
  'some-uuid'::uuid,
  'dq-vision',
  'some content that already exists'
);
*/
