-- Update DQ Golden Honeycomb of Competencies (GHC) overview guide with correct content
-- This will replace any existing content in the dq-ghc guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-ghc';

-- Step 2: Update with GHC overview content
UPDATE public.guides
SET
  title = 'DQ Golden Honeycomb of Competencies (GHC)',
  summary = 'The Golden Honeycomb of Competencies (GHC) is DQ''s operating system, connecting how we think, work, and create meaningful impact through every decision and action.',
  body = '# Introduction

Starting at DQ or even navigating your role as an existing Qatalyst can feel overwhelming. But here''s the secret: everything we do is guided by a system. That system is the Golden Honeycomb of Competencies (GHC), our master framework, blueprint, and operating system rolled into one.

The GHC defines how we think, how we work, how we create value, and how we grow. It brings together the skills, behaviours, and systems that make a Qatalyst effective, ensuring every action, decision, and collaboration is purposeful and aligned with DQ''s mission. Think of it as your map, compass, and toolkit, helping you:

- Work together seamlessly with your team
- Make decisions that actually move the needle
- Solve problems creatively and confidently
- Deliver real, measurable value to our clients

In short, the GHC is your guide to thriving at DQ and understanding why every choice matters.

## Why the GHC Exists

DQ tackles complex digital challenges across industries. Without alignment, things can quickly get messy. The GHC exists to make everything coherent, purposeful, and impactful:

- Everyone knows why we do what we do
- Teams can collaborate effortlessly
- Work moves forward with clarity and intention
- Learning and improvement are built into every task

Put simply, the GHC is why DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.

## The 7 Competencies of the GHC

At the heart of the GHC are seven interlinked competencies—each answering a foundational question about how a high-performing, purpose-driven digital organisation operates. Together, they form DQ''s DNA.

### 1. Vision (Purpose) - Why We Exist

To perfect life''s transactions. This competency anchors everything in why we do what we do, guiding priorities, aligning playbooks and platforms, and keeping us focused on building trust, clarity, and momentum, not just technology.

### 2. House of Values (Culture) - How We Behave

Culture isn''t accidental. The House of Values (HoV) defines how we act, especially when stakes are high:

- **Self-Development** - growth is a daily responsibility
- **Lean Working** - clarity, focus, and momentum over noise
- **Value Co-Creation** - collaboration scales intelligence

### 3. Persona (Identity) - Who We Are

Skills evolve, fit endures. The DQ Persona describes the traits of high-impact Qatalysts:

- Purpose-driven
- Perceptive
- Proactive
- Persevering
- Precise

### 4. Agile TMS (Task Management System) - How We Work

Strategy only matters if it turns into motion. Agile TMS helps us:

- Break work into clear, actionable tasks
- Maintain rhythm through sprints, check-ins, and reviews
- Ensure every action drives real value

### 5. Agile SoS (Governance) - How We Govern

Governance isn''t a brake, it''s a steering wheel. Agile SoS ensures alignment, quality, value, and discipline, letting us move fast without losing direction.

### 6. Agile Flows (Value Streams) - How We Orchestrate

Work flows end-to-end, not in silos. Agile Flows structure delivery across the full value chain, connecting market insight to client impact, reducing blockers, and giving clarity on ownership and risk.

### 7. Agile 6xD (Products) - What We Offer

This framework helps DQ design, deliver, and scale transformation. Through six digital perspectives, we help organisations understand why they must change, what to build, how to execute, who delivers, and when value is realised.

## How the GHC Shapes You

The GHC isn''t just theory, it shapes your daily work, decisions, and impact. Use it to:

- **Grow Yourself Every Day** - embrace feedback, learn constantly, and turn challenges into growth
- **Work Smart and Lean** - focus on what matters, take initiative, sweat the details
- **Create Value with Others** - collaborate openly, design with empathy, build trust through clarity and consistency

Think of these as practical superpowers you can start using from day one.

## How Work Flows at DQ

At DQ, work doesn''t happen in silos. Everything moves through connected value streams, from ideas to delivery to lasting impact. Here''s what that means for you:

- **Agile task management** - know exactly what to do, who owns it, and why it matters
- **Guided governance** - direction and quality without slowing down
- **End-to-end collaboration** - your work links directly to client outcomes

By understanding these flows, you''ll see how your contribution fits into the bigger picture, making your role meaningful every day.

## Your Role as a Qatalyst

You don''t need to master everything at once. Keep the Honeycomb in mind:

- Ask: "Does this task create real value?"
- Look for opportunities to collaborate and support others
- Apply GHC principles to make confident decisions
- Notice how your work connects to larger projects and outcomes

The GHC is a Honeycomb for a reason, every part is connected, and every Qatalyst strengthens the whole. Live it, and you''ll become more impactful, confident, and strategic every day.

## Pro Tip

Keep this Honeycomb in mind as you start your journey. Whether it''s a sprint, a client call, or a problem-solving session, your choices, actions, and mindset shape the DQ mission, transaction by transaction, life by life, organisation by organisation.',
  last_updated_at = NOW()
WHERE slug = 'dq-ghc';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-ghc';

-- Step 4: Verify it's different from other GHC guides
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug IN ('dq-ghc', 'dq-vision', 'dq-hov', 'dq-persona')
ORDER BY slug;
