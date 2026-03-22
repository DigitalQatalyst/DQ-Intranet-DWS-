-- Update Agile 6xD (Products) guide with correct content
-- This will replace any existing content in the dq-agile-6xd guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-agile-6xd';

-- Step 2: Update with Agile 6xD content
UPDATE public.guides
SET
  title = 'GHC Competency: Agile 6xD (Products)',
  summary = 'Transformation is a living process. Explore the six digital perspectives that guide DQ in building repeatable, scalable, and high-impact change.',
  body = '# Introduction

At DQ, transformation isn''t something we just talk about, it''s something we design, build, and scale. The Agile 6xD framework is how we turn complex digital transformations into repeatable, measurable, and evolving processes. It''s not a one-off project playbook; it''s a living system that ensures every initiative delivers value, grows capabilities, and adapts to change.

## Why Agile 6xD Matters

Whether you''re a new joiner or an existing associate, Agile 6xD gives you clarity on what DQ delivers, why it matters, and how it''s executed:

- **New joiners** can quickly understand the six essential perspectives that guide every product and transformation, giving context to their work.
- **Existing associates** can leverage Agile 6xD to align teams, standardize delivery, and scale impact across multiple projects.

This framework ensures that everyone at DQ is moving in the same direction, creating value while staying agile and adaptable in a fast-changing digital environment.

## The Six Digital Perspectives

Agile 6xD is built around six critical perspectives, each answering a fundamental question for organisations navigating digital transformation:

- **Digital Economy (DE): Why should organisations change?**
  Helps leaders understand market shifts, customer behaviour, and forces driving transformation.

- **Digital Cognitive Organisation (DCO): Where are organisations headed?**
  Defines the future enterprise: intelligent, adaptive, and orchestrated, capable of learning and responding seamlessly.

- **Digital Business Platforms (DBP): What must be built to enable transformation?**
  Focuses on modular, integrated, data-driven systems that unify operations and make transformation scalable.

- **Digital Transformation 2.0 (DT2.0): How should transformation be designed and deployed?**
  Positions transformation as a discipline of orchestration, introducing methods, flows, and governance to make change repeatable and outcome-driven.

- **Digital Worker & Workspace (DW:WS): Who delivers the change, and how do they work?**
  Centers on people, skills, and digitally-enabled environments to ensure teams can deliver and sustain transformation effectively.

- **Digital Accelerators (Tools): When will value be realised, and how fast?**
  Drives execution speed, alignment, and measurable impact through the right tools, systems, and strategies.

Together, these six perspectives form a transformation compass, helping organisations not just plan change, but live it, continuously learning, adapting, and delivering value.

## How You Can Apply Agile 6xD

Engaging with Agile 6xD means you can:

- See how every initiative aligns with the bigger digital mission
- Understand what needs to be built, by whom, and why
- Align your work with measurable outcomes and client impact
- Use a repeatable framework to plan, execute, and scale transformation

For new joiners, this framework provides structure and clarity for getting started. For experienced associates, it acts as a strategic guide to drive consistent, scalable transformation across teams and clients.

## Why It Works

Agile 6xD works because it balances vision, strategy, and execution. By providing:

- A clear map of what drives change
- Repeatable processes for planning and delivery
- Alignment across teams, platforms, and tools

It allows DQ to deliver transformation with confidence, ensuring impact is fast, measurable, and sustainable.

## Key Takeaways

Agile 6xD is more than a framework, it''s how DQ:

- Designs transformation end-to-end
- Ensures alignment from strategy to delivery
- Builds scalable and adaptable digital capabilities
- Continuously measures and enhances impact

## Pro Tip

Whenever you engage in a project or product initiative, ask yourself: "Which perspective of the 6xD am I influencing, and how does this create real value for the client and organisation?" Keeping Agile 6xD in mind ensures your work contributes to repeatable success, scalable transformation, and measurable impact, whether you''re just joining DQ or leading complex programs.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-6xd';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-agile-6xd';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-agile-6xd' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-agile-6xd'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
