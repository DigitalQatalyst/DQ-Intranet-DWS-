-- Update House of Values (HoV) guide with correct content
-- This will replace any existing content in the dq-hov guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-hov';

-- Step 2: Update with HoV content
UPDATE public.guides
SET
  title = 'GHC Competency: House of Values (Culture)',
  summary = 'Culture isn''t accidental; it''s built. Explore how our values, mantras, and guiding principles shape behavior, collaboration, and impact at DQ.',
  body = '# Introduction

Culture isn''t something you come across upon, it''s something you build, live, and reinforce every day. At DQ, our culture is the backbone of how we think, act, and collaborate. It guides our behaviour when stakes are high, deadlines are tight, or decisions feel complex.

The House of Values (HoV) is more than a set of statements on a wall, it''s the system that keeps us aligned, resilient, and high-performing. Whether you''re a new joiner learning the ropes or an experienced associate navigating challenging projects, HoV shows you how to operate with clarity, confidence, and impact.

## What the House of Values Means

The HoV defines the behaviours and mindsets that make Qatalysts effective. It''s built around three core mantras that together shape how we grow, work, and create value:

### 1. Self-Development

Growth isn''t optional, it''s a daily responsibility. Through self-development, we:

- Stay curious and open to feedback
- Learn from successes and failures
- Build emotional intelligence to stay calm and accountable under pressure

This mantra reminds every Qatalyst that personal growth drives organisational growth.

### 2. Lean Working

Efficiency and focus matter. Lean Working helps us:

- Prioritise work that moves the needle
- Anticipate challenges and act proactively
- Sweat the details without losing sight of the bigger picture

It''s our approach to doing more with clarity and momentum, ensuring every task contributes real value.

### 3. Value Co-Creation

Collaboration is the engine of impact. Value Co-Creation encourages us to:

- Design solutions with empathy for clients and partners
- Share knowledge and learn openly from others
- Work as one team rather than in silos
- Own decisions and build trust through honesty and consistency

By co-creating, we scale intelligence and amplify impact across the organisation.

## Applying HoV in Your Role

The House of Values is your practical guide to behaviour. Here''s how you can bring it into your daily work:

- Reflect on how your actions reflect our core mantras
- Collaborate with clarity and purpose, even under pressure
- Seek opportunities to grow yourself and support others
- Use the HoV as a framework for making decisions, resolving conflicts, and driving projects forward

Living the HoV ensures that your work is aligned, ethical, and impactful, no matter the role or challenge.

## Growing with the House of Values

The more you embody the HoV, the more naturally you:

- Lead by example in every interaction
- Make high-quality decisions quickly and confidently
- Build stronger relationships with teammates, clients, and partners
- Contribute to a culture that sustains excellence even in fast-paced environments

Your behaviour shapes culture, and culture shapes outcomes.

## Key Takeaways

The House of Values is the blueprint for how we behave at DQ. By embracing it, you:

- Ensure alignment with the organisation''s purpose
- Grow yourself and others intentionally
- Collaborate effectively and build trust across teams
- Turn principles into sustainable performance

## Pro Tip

Before starting any task or meeting, pause and ask: "Which HoV mantra guides this action?" Connecting your work to self-development, lean working, or value co-creation keeps your contributions purposeful and aligned with DQ culture.',
  last_updated_at = NOW()
WHERE slug = 'dq-hov';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-hov';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-hov' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-hov'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
