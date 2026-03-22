-- Update Vision (Purpose) guide with correct content
-- This will replace any GHC content that might be in the dq-vision guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-vision';

-- Step 2: Update with Vision content
UPDATE public.guides
SET
  title = 'GHC Competency: Vision (Purpose)',
  summary = 'Discover the heartbeat of DQ. Learn how our purpose - perfecting life''s transactions - guides every decision, project, and interaction.',
  body = '# Introduction

Starting at DQ is exciting, but it can also feel like stepping into a fast-moving ecosystem where decisions, tasks, and opportunities come at you from all directions. That''s where Vision comes in, your guiding star. It''s the reason we do what we do, the thread that connects every project, client interaction, and innovation.

Think of Vision as your compass in the chaos: it shows you what truly matters, helps you make confident decisions, and reminds you how your work contributes to something bigger than yourself. Whether you''re a new joiner finding your feet or an experienced associate navigating complex projects, understanding Vision makes your role clear, purposeful, and impactful from day one.

## What Vision Means at DQ

At DigitalQatalyst, Vision is more than words, it''s the foundation of everything we do. Our mission is to accelerate life''s transaction improvements using Digital Blueprints. This mission reflects our belief that interactions between people, systems, and organisations can be continuously improved with thoughtful digital design.

Vision gives direction across all levels of the organisation:

- It guides priorities, ensuring we focus on what truly matters.
- It aligns teams and projects around a shared purpose.
- It shapes decisions, making every action intentional and value-driven.

With Vision as a guide, every sprint, client engagement, or internal initiative contributes meaningfully to our mission – not just activity, but real impact.

## Applying Vision in Your Role

Vision is not just a concept, it is practical and actionable. In your daily work, it helps you:

- Identify which tasks truly drive impact
- Make informed decisions that support the broader mission
- Understand how your work connects to client outcomes and organisational goals
- Navigate ambiguity with confidence

By grounding your actions in purpose, you contribute strategically, rather than just completing tasks.

## Growing with Vision

Vision evolves as you gain experience and context. At first, it helps you prioritise and stay focused. Over time, it empowers you to:

- Communicate more clearly about the "why" behind your work
- Anticipate challenges and make proactive choices
- Take ownership with greater independence and confidence

The more you internalise Vision, the more strategic and effective you become as a Qatalyst.

## Key Takeaways

Vision (Purpose) is the reason DQ exists and the foundation for all decisions. By understanding and applying it, you:

- Stay aligned with the organisation''s mission
- Make smarter, value-driven choices
- Connect your day-to-day work to the bigger picture

## Pro Tip

When you feel uncertain, ask yourself: "How does this improve the transaction?" If your answer connects back to this purpose, you''re on the right path.',
  last_updated_at = NOW()
WHERE slug = 'dq-vision';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-vision';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-vision' as guide,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-vision'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
