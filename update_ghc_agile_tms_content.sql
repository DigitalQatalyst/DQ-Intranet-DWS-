-- Update GHC Competency 4: Agile TMS (Task Management System) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-agile-tms' OR slug = 'ghc-agile-tms' OR slug = 'agile-tms' OR title LIKE '%Agile TMS%Task Management%';

-- Step 2: Update the Agile TMS guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 4: Agile TMS (Task Management System)',
  summary = 'Agile TMS transforms plans, priorities, and ideas into clear, actionable work every day. It''s the rhythm, structure, and momentum that keeps DQ moving forward, ensuring every task contributes meaningfully to our mission.',
  body = '# Introduction

Having a great strategy is one thing; turning it into action is another. At DQ, Agile TMS transforms plans, priorities, and ideas into clear, actionable work every day. It applies to everyone from new joiners to seasoned associates.

Agile TMS helps you:

- **Stay focused and aligned**
- **Coordinate effectively** across teams
- **Deliver measurable impact**

Think of it as the rhythm, structure, and momentum that keeps DQ moving forward.

## What Agile TMS Means

Agile TMS is more than a tool or process, it''s a living system that structures how we plan, execute, and review work. It ensures that every task, sprint, and project contributes meaningfully to our mission: perfecting life''s transactions.

Core principles include:

- **Clarity**: Work is broken into actionable units with clear ownership and intent
- **Rhythm**: Weekly sprints, daily check-ins, and structured reviews create predictable flow
- **Momentum**: Tasks are signals for learning, improvement, and progress
- **Value-Driven**: Every action ties to outcomes that matter, not just busyness

Agile TMS ensures everyone knows what to do, why it matters, and how it connects to the bigger picture.

## Applying Agile TMS in Your Role

Using Agile TMS transforms your daily work:

- **Plan with purpose**: Break projects into achievable, outcome-focused tasks
- **Collaborate seamlessly**: Share updates, blockers, and progress transparently
- **Stay adaptive**: Adjust plans in real-time through sprints and check-ins
- **Measure impact**: Track outcomes, not just activities

By applying Agile TMS, you move faster, reduce confusion, and create momentum across teams and projects.

## Key Elements of Agile TMS

### Structured Rituals and Methods

Agile TMS uses recurring practices to ensure flow and alignment:

**Co-Working Sessions (CWS)**: Collaborative working blocks to tackle tasks together

**Blitz Sprints**: Focused bursts to move high-priority work forward

**Feedback Loops**: Continuous reflection for quality, efficiency, and alignment

These make the system dynamic, adaptive, and practical, ensuring strategy becomes tangible results.

## Growing with Agile TMS

The more you engage, the more you:

- **Gain confidence** in planning, prioritising, and delivering work
- **Spot blockers and opportunities** proactively
- **Strengthen collaboration** across teams and functions
- **Build a habit** of continuous improvement

Agile TMS empowers you to work smarter, not harder.

## DQ Agile TMS

> "Great work doesn''t start with hustle. It starts with structure."

If the Vision gives us purpose, and the House of Values gives us principles, then Agile TMS gives us a working system, a clear, focused, accountable model for action.

In a world where noise can drown out intention, Agile TMS ensures execution remains meaningful, turning strategy into movement, one task at a time.

## Agile Mindset at DQ

- Agile is about **doing what matters**, not doing more
- It''s **responsive and flexible**, adapting to circumstances
- **Progress is valued** over process, clarity over control
- Teams **self-organise**, continuously improving how they work together

## Atomic Unit of Work

Agile TMS breaks work into essential elements:

- **What** needs to be done
- **Who** is responsible
- **By when** it must be delivered
- **Why** it matters

Every task aligns to weekly plans, sprint cadences, and daily check-ins, ensuring work is purposeful, visible, and outcome-driven.

## The 7S Tenets of DQ Agile TMS

### Specify
Tasks have clear context, purpose, outcome, approach, and checklist

### Socialise
Work is visible across channels, updates, threads, and messages

### Share
Collaborate through structured sessions: CWS, Blitz, Urgent, Personal, Feedback, Learning

### Scrum
Agile cadences anchor work: Daily Standups, Weekly CTs, Monthly Townhalls, Quarterly Reviews, Annual Strategic Review

### Structure
ATP system maps strategic priorities to tasks; includes Backlogs, SEDU, WSU, and monthly review

### Succeed
Performance is tracked and rewarded using xPA framework (KRIs, Pay, Develop, Leadership, Reward, Shares)

### Speed-Up
Technology accelerates work with AI, functional, productivity, and analytics tools

## Why Agile TMS Matters

### For Qatalysts - Focus & Ownership

- **Removes guesswork**
- **Aligns tasks to value**
- **Turns work** into a purposeful chain of contribution

### For Clients - Delivery & Confidence

- **Reduces friction**
- **Ensures consistent**, reliable progress
- **Demonstrates method** and alignment

### For Investors - Discipline & Scalability

- **Structured execution** scales reliably
- **Systems of work** are repeatable
- **Teams are coordinated** and accountable

Agile TMS ensures strategy doesn''t just start, it finishes. It''s how DQ delivers on its mission: "To perfect life''s transactions."

## Key Takeaways

- **Agile TMS** turns strategy into action
- **Delivers work** aligned to outcomes and purpose
- **Facilitates collaboration** and adapts to change
- **Builds momentum** that drives measurable impact

## Pro Tip

Before starting any task, ask:

**"Does this task align with outcomes and move the needle?"**

Focused use of Agile TMS ensures your work is aligned, purposeful, and impactful from day one.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-tms' OR slug = 'ghc-agile-tms' OR slug = 'agile-tms' OR title LIKE '%Agile TMS%Task Management%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-agile-tms',
  'GHC Competency 4: Agile TMS (Task Management System)',
  'Agile TMS transforms plans, priorities, and ideas into clear, actionable work every day. It''s the rhythm, structure, and momentum that keeps DQ moving forward, ensuring every task contributes meaningfully to our mission.',
  '# Introduction

Having a great strategy is one thing; turning it into action is another. At DQ, Agile TMS transforms plans, priorities, and ideas into clear, actionable work every day. It applies to everyone from new joiners to seasoned associates.

Agile TMS helps you:

- **Stay focused and aligned**
- **Coordinate effectively** across teams
- **Deliver measurable impact**

Think of it as the rhythm, structure, and momentum that keeps DQ moving forward.

## What Agile TMS Means

Agile TMS is more than a tool or process, it''s a living system that structures how we plan, execute, and review work. It ensures that every task, sprint, and project contributes meaningfully to our mission: perfecting life''s transactions.

Core principles include:

- **Clarity**: Work is broken into actionable units with clear ownership and intent
- **Rhythm**: Weekly sprints, daily check-ins, and structured reviews create predictable flow
- **Momentum**: Tasks are signals for learning, improvement, and progress
- **Value-Driven**: Every action ties to outcomes that matter, not just busyness

Agile TMS ensures everyone knows what to do, why it matters, and how it connects to the bigger picture.

## Applying Agile TMS in Your Role

Using Agile TMS transforms your daily work:

- **Plan with purpose**: Break projects into achievable, outcome-focused tasks
- **Collaborate seamlessly**: Share updates, blockers, and progress transparently
- **Stay adaptive**: Adjust plans in real-time through sprints and check-ins
- **Measure impact**: Track outcomes, not just activities

By applying Agile TMS, you move faster, reduce confusion, and create momentum across teams and projects.

## Key Elements of Agile TMS

### Structured Rituals and Methods

Agile TMS uses recurring practices to ensure flow and alignment:

**Co-Working Sessions (CWS)**: Collaborative working blocks to tackle tasks together

**Blitz Sprints**: Focused bursts to move high-priority work forward

**Feedback Loops**: Continuous reflection for quality, efficiency, and alignment

These make the system dynamic, adaptive, and practical, ensuring strategy becomes tangible results.

## Growing with Agile TMS

The more you engage, the more you:

- **Gain confidence** in planning, prioritising, and delivering work
- **Spot blockers and opportunities** proactively
- **Strengthen collaboration** across teams and functions
- **Build a habit** of continuous improvement

Agile TMS empowers you to work smarter, not harder.

## DQ Agile TMS

> "Great work doesn''t start with hustle. It starts with structure."

If the Vision gives us purpose, and the House of Values gives us principles, then Agile TMS gives us a working system, a clear, focused, accountable model for action.

In a world where noise can drown out intention, Agile TMS ensures execution remains meaningful, turning strategy into movement, one task at a time.

## Agile Mindset at DQ

- Agile is about **doing what matters**, not doing more
- It''s **responsive and flexible**, adapting to circumstances
- **Progress is valued** over process, clarity over control
- Teams **self-organise**, continuously improving how they work together

## Atomic Unit of Work

Agile TMS breaks work into essential elements:

- **What** needs to be done
- **Who** is responsible
- **By when** it must be delivered
- **Why** it matters

Every task aligns to weekly plans, sprint cadences, and daily check-ins, ensuring work is purposeful, visible, and outcome-driven.

## The 7S Tenets of DQ Agile TMS

### Specify
Tasks have clear context, purpose, outcome, approach, and checklist

### Socialise
Work is visible across channels, updates, threads, and messages

### Share
Collaborate through structured sessions: CWS, Blitz, Urgent, Personal, Feedback, Learning

### Scrum
Agile cadences anchor work: Daily Standups, Weekly CTs, Monthly Townhalls, Quarterly Reviews, Annual Strategic Review

### Structure
ATP system maps strategic priorities to tasks; includes Backlogs, SEDU, WSU, and monthly review

### Succeed
Performance is tracked and rewarded using xPA framework (KRIs, Pay, Develop, Leadership, Reward, Shares)

### Speed-Up
Technology accelerates work with AI, functional, productivity, and analytics tools

## Why Agile TMS Matters

### For Qatalysts - Focus & Ownership

- **Removes guesswork**
- **Aligns tasks to value**
- **Turns work** into a purposeful chain of contribution

### For Clients - Delivery & Confidence

- **Reduces friction**
- **Ensures consistent**, reliable progress
- **Demonstrates method** and alignment

### For Investors - Discipline & Scalability

- **Structured execution** scales reliably
- **Systems of work** are repeatable
- **Teams are coordinated** and accountable

Agile TMS ensures strategy doesn''t just start, it finishes. It''s how DQ delivers on its mission: "To perfect life''s transactions."

## Key Takeaways

- **Agile TMS** turns strategy into action
- **Delivers work** aligned to outcomes and purpose
- **Facilitates collaboration** and adapts to change
- **Builds momentum** that drives measurable impact

## Pro Tip

Before starting any task, ask:

**"Does this task align with outcomes and move the needle?"**

Focused use of Agile TMS ensures your work is aligned, purposeful, and impactful from day one.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-agile-tms' OR slug = 'ghc-agile-tms' OR slug = 'agile-tms' OR title LIKE '%Agile TMS%Task Management%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-agile-tms' OR slug = 'ghc-agile-tms' OR slug = 'agile-tms' OR title LIKE '%Agile TMS%Task Management%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-agile-tms' OR slug = 'ghc-agile-tms' OR slug = 'agile-tms' OR title LIKE '%Agile TMS%Task Management%';