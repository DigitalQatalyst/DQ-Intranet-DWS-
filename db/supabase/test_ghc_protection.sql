-- Test script to verify GHC duplicate content protection is working
-- Run this AFTER fixing any existing duplicates

-- IMPORTANT: This will FAIL if you try to create duplicate content
-- That's the expected behavior - it means protection is working!

-- Test 1: Try to update a GHC guide with content that matches another GHC guide
-- This should FAIL with an error message
-- 
-- First, get the body content from one GHC guide:
-- SELECT slug, LEFT(body, 50) as preview FROM guides WHERE slug = 'dq-vision';
--
-- Then try to set another GHC guide to the same content (this should fail):
-- UPDATE guides 
-- SET body = (SELECT body FROM guides WHERE slug = 'dq-vision' LIMIT 1)
-- WHERE slug = 'dq-hov';
--
-- Expected error: "GHC guide with slug dq-hov cannot have body content identical to other GHC guide(s): dq-vision..."

-- Test 2: Verify you can still update with unique content (this should work)
-- UPDATE guides 
-- SET body = 'Unique content for ' || slug || ' - updated at ' || NOW()::text
-- WHERE slug = 'dq-vision';

-- Test 3: Check current status
SELECT * FROM public.get_ghc_status_report();

-- Test 4: Check for any remaining duplicates
SELECT * FROM public.identify_ghc_duplicates();
