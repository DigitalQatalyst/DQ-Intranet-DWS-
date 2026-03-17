-- Template: Update dq-ghc (or any GHC guide) with content from UI
-- Replace the content below with what you see in the browser console

-- Step 1: Check current content in Supabase
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-ghc';

-- Step 2: Update with your UI content
-- REPLACE THE CONTENT BELOW with what you see in the browser console
UPDATE public.guides
SET 
  title = 'DQ Golden Honeycomb of Competencies (GHC)',  -- REPLACE with your title
  summary = 'Your summary from UI...',                  -- REPLACE with your summary
  body = 'YOUR_BODY_CONTENT_FROM_UI_GOES_HERE',         -- REPLACE this whole string
  last_updated_at = NOW()
WHERE slug = 'dq-ghc';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-ghc';

-- Step 4: Check for duplicates (should be OK)
SELECT * FROM public.identify_ghc_duplicates();
