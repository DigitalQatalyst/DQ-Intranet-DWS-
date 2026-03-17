-- Create Missing dq-hov Guide
-- This script creates the missing dq-hov (House of Values) guide
-- Run this in Supabase SQL Editor

-- First, check if it already exists (should not, but safe to check)
DO $$
DECLARE
  existing_id uuid;
  hero_image_url text := 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
BEGIN
  -- Check if guide already exists
  SELECT id INTO existing_id
  FROM public.guides
  WHERE slug = 'dq-hov';
  
  IF existing_id IS NOT NULL THEN
    RAISE NOTICE 'Guide dq-hov already exists with ID: %', existing_id;
    RAISE NOTICE 'Skipping creation. If you want to update it, use UPDATE instead.';
    RETURN;
  END IF;
  
  -- Insert the missing guide (using only fields that exist in the database)
  INSERT INTO public.guides (
    slug,
    title,
    summary,
    body,
    domain,
    guide_type,
    status,
    hero_image_url,
    sub_domain
  ) VALUES (
    'dq-hov',
    'HoV (House of Values)',
    'DQ''s culture system built on three Mantras (Self-Development, Lean Working, Value Co-Creation) and 12 Guiding Values that shape how Qatalysts think, behave, and collaborate.',
    '# HoV (House of Values)

At DQ, we believe culture is not something you hope for. It''s something you **build**.

Every company has values — written on walls, buried in onboarding slides. But what matters is how those values show up when stakes are high, time is short, or no one is watching.

That''s why we built a culture system. We call it the **House of Values (HoV).**

It''s made up of **three Mantras** that guide how Qatalysts think, behave, and collaborate.

## 1. Self-Development

This mantra reinforces that growth is not passive — it''s a daily responsibility.

> "We grow ourselves and others through every experience."

- **Emotional Intelligence** — We stay calm, present, and accountable under pressure
- **Growth Mindset** — We embrace feedback, learn from failure, and evolve fast

## 2. Lean Working

This is how we protect momentum and reduce waste.

> _"We pursue clarity, efficiency, and prompt outcomes in everything we do."_

- **Purpose** – We stay connected to why the work matters
- **Perceptive** – We anticipate needs and make thoughtful choices
- **Proactive** – We take initiative and move things forward
- **Perseverance** – We push through setbacks with focus
- **Precision** – We sweat the details that drive performance

## 3. Value Co-Creation

Collaboration isn''t optional — it''s how we scale intelligence.

> _"We partner with others to create greater impact together."_

- **Customer** – We design with empathy for those we serve
- **Learning** – We remain open, curious, and teachable
- **Collaboration** – We work as one, not in silos
- **Responsibility** – We own our decisions and their consequences
- **Trust** – We build it through honesty, clarity, and consistency

These are reinforced by **12 Guiding Values** — practical behaviors that help us lead with focus, collaborate with trust, and perform under pressure.

Whether in a sprint, a client engagement, or a tough feedback session — these principles give us direction.

They keep us aligned when things move fast.
They raise the bar when standards slip.
They make performance sustainable — because they''re shared.

**At DQ, culture isn''t an extra layer.**
**It''s the structure beneath everything we do.**

## Learn More

For a comprehensive understanding of how the House of Values fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
    'Strategy',
    NULL,
    'Approved',
    hero_image_url,
    'hov'  -- sub_domain for House of Values
  );
  
  RAISE NOTICE '✅ Successfully created dq-hov guide!';
  RAISE NOTICE '   Guide is now available at: /marketplace/guides/dq-hov';
END $$;

-- Verify the guide was created
SELECT 
  id,
  slug,
  title,
  status,
  domain,
  LENGTH(COALESCE(body, '')) as body_length,
  CASE 
    WHEN body IS NULL OR TRIM(body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as body_status
FROM public.guides
WHERE slug = 'dq-hov';
