-- Update Agile TMS (Task Management System) guide with correct content
-- This will replace any existing content in the dq-agile-tms guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-agile-tms';

-- Step 2: Update with Agile TMS content
UPDATE public.guides
SET
  title = 'GHC Competency: Agile TMS (Task Management System)',
  summary = 'Strategy only matters if it moves. Learn how Agile TMS helps you break work into clear actions, maintain momentum, and deliver value consistently.',
  body = '# Introduction

Having a great strategy is one thing, turning it into action is another. At DQ, we use the Agile Task Management System (TMS) to transform ideas, plans, and priorities into clear, actionable work every day. This applies to everyone, from new joiners to existing associates.

Whether you''re just starting your journey or navigating complex projects, Agile TMS helps you stay focused, coordinate effectively, and deliver measurable value. Think of it as the rhythm, structure, and momentum that keeps DQ moving forward.

## What Agile TMS Means

Agile TMS is more than a tool or process, it''s a living system that structures how we plan, execute, and review work. It ensures that every task, sprint, and project contributes meaningfully to our mission: perfecting life''s transactions.

The core principles include:

- **Clarity** - Work is broken down into actionable units with clear ownership and intent
- **Rhythm** - Weekly sprints, daily check-ins, and structured reviews create predictable flow
- **Momentum** - Tasks are not just tracked; they are signals for learning, improvement, and progress
- **Value-driven** - Every action is tied to outcomes that matter, not just busyness

Agile TMS ensures that everyone knows what to do, why it matters, and how it connects to the bigger picture.

## How to Apply Agile TMS in Your Role

Using Agile TMS effectively transforms your daily work:

- Plan with purpose - Break projects into tasks that are achievable and outcome-focused
- Collaborate seamlessly - Share updates, blockers, and progress transparently with teammates
- Stay adaptive - Use sprints and check-ins to adjust plans based on real-time feedback
- Measure impact - Track outcomes, not just activities, to ensure your work drives results

By applying Agile TMS, you move faster, reduce confusion, and create momentum across teams and projects.

## Key Elements of the System

Agile TMS uses structured rituals and methods to ensure flow and alignment:

- **Co-Working Sessions (CWS)** - Collaborative working blocks to tackle tasks together
- **Blitz Sprints** - Focused bursts of effort to move high-priority work forward
- **Feedback Loops** - Continuous reflection to improve quality, efficiency, and alignment

These elements make the system dynamic, adaptive, and practical, ensuring that strategy becomes tangible results.

## Growing with Agile TMS

The more you engage with Agile TMS, the more you:

- Gain confidence in planning, prioritising, and delivering work
- Become proactive in spotting blockers and opportunities
- Strengthen collaboration across teams and functions
- Build a habit of continuous improvement and value delivery

Agile TMS doesn''t just help you manage tasks, it empowers you to work smarter, not harder.

## Key Takeaways

Agile TMS is the engine that turns strategy into action. By using it consistently, you:

- Deliver work that is aligned with purpose and outcomes
- Collaborate effectively across teams and projects
- Adapt quickly to changing priorities and feedback
- Build momentum that drives measurable impact for clients and the organisation

## Pro Tip

Before starting any task, ask: "Does this task align with outcomes and move the needle?" Using Agile TMS with intention ensures that your work is focused, aligned, and impactful from day one.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-tms';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-agile-tms';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-agile-tms' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-agile-tms'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
