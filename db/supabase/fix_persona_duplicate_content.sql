-- Fix dq-persona duplicate content issue
-- This script updates dq-persona with unique content if it's sharing content with dq-ghc

-- First, check current state
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as body_preview
FROM public.guides
WHERE slug IN ('dq-persona', 'dq-ghc')
ORDER BY slug;

-- Check if they have identical content
SELECT 
  g1.slug as slug1,
  g2.slug as slug2,
  CASE 
    WHEN TRIM(COALESCE(g1.body, '')) = TRIM(COALESCE(g2.body, '')) THEN 'IDENTICAL - NEEDS FIX'
    ELSE 'DIFFERENT - OK'
  END as content_match
FROM public.guides g1
CROSS JOIN public.guides g2
WHERE g1.slug = 'dq-persona'
  AND g2.slug = 'dq-ghc'
  AND g1.body IS NOT NULL
  AND g2.body IS NOT NULL;

-- Update dq-persona with correct unique content
UPDATE public.guides
SET 
  title = 'Persona (Identity)',
  summary = 'The DQ Persona defines the shared identity and traits that characterize impactful people at DQ: purpose-driven, perceptive, proactive, persevering, and precise.',
  body = '# Persona (Identity)

Every transformation journey begins with people.
And at DQ, we''ve learned: it''s not just about hiring talent. It''s about **finding fit**.

The DQ Persona is our shared identity — a set of traits and behaviours that define not just who thrives here, but _why_ they do.

In every interaction, across every role — from employees to clients, partners to investors — the most impactful people at DQ are:

- **Purpose-driven** – Anchored in the why
- **Perceptive** – Aware of system, self, and signals
- **Proactive** – Acting before being asked
- **Persevering** – Unshaken by ambiguity or challenge
- **Precise** – Making clarity and craft non-negotiable

This Persona shapes how we build teams, assign roles, and make partnerships.
It helps us move faster — because we don''t waste energy on misalignment.

In a world where skills evolve quickly, **fit is the future**.
And at DQ, fit means more than matching values — it means amplifying the mission.

## Learn More

For a comprehensive understanding of how the DQ Persona fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-persona'
  AND (
    -- Only update if body is empty, null, or matches dq-ghc content
    body IS NULL 
    OR TRIM(body) = ''
    OR EXISTS (
      SELECT 1 
      FROM public.guides g2 
      WHERE g2.slug = 'dq-ghc' 
        AND TRIM(COALESCE(guides.body, '')) = TRIM(COALESCE(g2.body, ''))
    )
  );

-- Verify the fix
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  CASE 
    WHEN body IS NULL OR TRIM(body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as body_status
FROM public.guides
WHERE slug = 'dq-persona';

-- Check for any remaining duplicates
SELECT * FROM public.identify_ghc_duplicates();
