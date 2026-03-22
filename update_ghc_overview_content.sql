-- Update DQ Golden Honeycomb of Competencies (GHC) overview page with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-ghc' OR slug = 'ghc-overview' OR slug = 'golden-honeycomb' OR title LIKE '%Golden Honeycomb%Competencies%';

-- Step 2: Update the GHC overview guide with new content
UPDATE public.guides
SET
  title = 'DQ Golden Honeycomb of Competencies (GHC)',
  summary = 'Explore the Golden Honeycomb of Competencies (GHC), the system behind how DQ works and delivers value.',
  author_name = NULL,
  author_org = NULL,
  body = '# Introduction

Whether you''re just starting your journey here or continuing to grow as an experienced Qatalyst, we know that navigating your role can feel exciting and sometimes a little overwhelming. The good news? You''re not alone, and everything we do is guided by a single system designed to help you succeed.

That system is the **Golden Honeycomb of Competencies (GHC)**, our master framework, blueprint, and operating system rolled into one.

The GHC defines:

- **How we think**
- **How we work**
- **How we create value**
- **How we grow**, both internally and with every partner we serve

It brings together the skills, behaviours, and systems that make a Qatalyst effective, ensuring every action, decision, and collaboration is purposeful and aligned with DQ''s mission.

Think of it as your map, compass, and toolkit, helping you:

- **Work seamlessly** with your team
- **Make decisions** that actually move the needle
- **Solve problems** creatively and confidently
- **Deliver real, measurable value** to our clients

In short, the GHC is your guide to thriving at DQ and understanding why every choice matters.

## Why the GHC Exists

DQ tackles complex digital challenges across industries. Without alignment, things can quickly get messy. The GHC exists to make everything coherent, purposeful, and impactful:

- **Everyone knows** why we do what we do
- **Teams can collaborate** effortlessly
- **Work moves forward** with clarity and intention
- **Learning and improvement** are built into every task

Put simply, the GHC is why DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.

## The 7 Competencies of the GHC

At the heart of the GHC are seven interlinked competencies, each answering a foundational question about how a high-performing, purpose-driven digital organisation operates. Together, they form DQ''s DNA:

### 1. Vision (Purpose) - Why We Exist

**To perfect life''s transactions.**

This competency anchors everything in why we do what we do, guiding priorities, aligning playbooks and platforms, and keeping us focused on building trust, clarity, and momentum, not just technology.

It is rooted in the belief that human needs and digital systems should serve each other intelligently and consistently, guided by Digital Blueprints that help organisations evolve into Digital Cognitive Organisations (DCOs).

### 2. House of Values (HoV - Culture) - How We Behave

Culture isn''t accidental. HoV defines how we act, especially under pressure.

**Three guiding mantras:**

**Self-Development** - growth is a daily responsibility
- Emotional Intelligence: stay calm, present, accountable
- Growth Mindset: embrace feedback, learn from failure, evolve fast

**Lean Working** - clarity, focus, and momentum over noise
- Purpose, Perceptive, Proactive, Persevering, Precise

**Value Co-Creation** - collaboration scales intelligence
- Customer focus, Learning, Collaboration, Responsibility, Trust

These principles are reinforced by 12 Guiding Values that keep Qatalysts aligned, focused, and performing at a high level.

### 3. Persona (Identity) - Who We Are

The DQ Persona defines traits of high-impact Qatalysts:

- **Purpose-driven**
- **Perceptive**
- **Proactive**
- **Persevering**
- **Precise**

It shapes team building, role assignment, partnerships, and ensures fit amplifies the mission, allowing the organisation to move faster and more cohesively.

### 4. Agile TMS (Task Management System) – How We Work

Agile TMS turns strategy into motion through a 7S-driven system of execution that ensures work is specified, socialised, shared, scrummed, structured, set up for success, and continuously sped up.

It breaks work into clear, actionable units with ownership, urgency, and intent, while anchoring execution in predictable cadences and collaborative rituals.

**Through:**

- **Specify** – Tasks have clear context, purpose, outcomes, approach, and checklist
- **Socialise** – Work is visible across channels, threads, and updates
- **Share** – Collaboration via CWS, Blitz, Urgent, Personal, Feedback, and Learning sessions
- **Scrum** – Daily standups, weekly CTs, monthly townhalls, quarterly and annual reviews
- **Structure** – ATP system linking strategy → backlogs → sprints → tasks
- **Succeed** – Performance measured and rewarded through xPA
- **Speed-Up** – Technology and AI accelerate planning, execution, and insight

Agile TMS ensures every task answers: "Does this move the needle?" and "How does this contribute to outcomes?"

Purpose: create momentum, not just manage tasks.

### 5. Agile SoS (Governance) - How We Govern

Governance is a steering wheel, not a brake. Agile SoS ensures alignment, quality, and value through four systems:

- **System of Governance (SoG)**: strategic direction and operating rhythm
- **System of Quality (SoQ)**: reinforces excellence and builds mastery
- **System of Value (SoV)**: defines impact and aligns outcomes
- **System of Discipline (SoD)**: tackles root frictions, not just symptoms

These layers make agility scalable and sustainable, today and into the future.

### 6. Agile Flows (Value Streams) - How We Orchestrate

Agile Flows manage end-to-end value streams, connecting strategy to execution:

**Six Stages of the Value Chain:**

- **Market → Lead**: generate awareness and shape demand
- **Lead → Opportunity**: qualify leads, frame client needs
- **Opportunity → Order**: align scope, timeline, delivery
- **Order → Fulfillment**: design, build, launch
- **Fulfillment → Revenue**: measure delivery, track value
- **Revenue → Loyalty**: retain customers, feed insights back into the system

Benefits: eliminate duplication, reduce blockers, see problems early, deliver as one.

### 7. Agile 6xD (Products) - What We Offer

Agile 6xD is DQ''s transformation blueprint, guiding continuous, evolving digital transformation.

**Six Digital Perspectives:**

- **Digital Economy (DE)**: why change is needed
- **Digital Cognitive Organisation (DCO)**: where organisations are headed
- **Digital Business Platforms (DBP)**: what must be built
- **Digital Transformation 2.0 (DT2.0)**: how transformation is designed and executed
- **Digital Worker & Workspace (DW:WS)**: who delivers change and how
- **Digital Accelerators (Tools)**: when and how value is realised

Together, these perspectives provide a transformation compass, enabling organisations to act with clarity, discipline, and speed in a fast-changing world.

## How the GHC Shapes You

The GHC isn''t just theory, it shapes your daily work, decisions, and impact. Use it to:

- **Grow Yourself Every Day**: embrace feedback, learn constantly, turn challenges into growth
- **Work Smart and Lean**: focus on what matters, take initiative, sweat the details
- **Create Value with Others**: collaborate openly, design with empathy, build trust through clarity and consistency

Think of these as practical superpowers you can start using from day one.

## How Work Flows at DQ

Everything moves through connected value streams, from ideas to delivery to lasting impact:

- **Agile task management**: know exactly what to do, who owns it, and why it matters
- **Guided governance**: direction and quality without slowing down
- **End-to-end collaboration**: your work links directly to client outcomes

Understanding these flows helps you see how your contribution fits into the bigger picture, making your role meaningful every day.

## Your Role as a Qatalyst

You don''t need to master everything at once. Keep the Honeycomb in mind:

- **Ask**: "Does this task create real value?"
- **Look** for opportunities to collaborate and support others
- **Apply** GHC principles to make confident decisions
- **Notice** how your work connects to larger projects and outcomes

The GHC is a Honeycomb for a reason: every part is connected, and every Qatalyst strengthens the whole. Live it, and you''ll become more impactful, confident, and strategic every day.

## Pro Tip

Keep this Honeycomb in mind as you start your journey. Whether it''s a sprint, client call, or problem-solving session, your choices, actions, and mindset shape the DQ mission, transaction by transaction, life by life, organisation by organisation.',
  last_updated_at = NOW()
WHERE slug = 'dq-ghc' OR slug = 'ghc-overview' OR slug = 'golden-honeycomb' OR title LIKE '%Golden Honeycomb%Competencies%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-ghc',
  'DQ Golden Honeycomb of Competencies (GHC)',
  'Explore the Golden Honeycomb of Competencies (GHC), the system behind how DQ works and delivers value.',
  '# Introduction

Whether you''re just starting your journey here or continuing to grow as an experienced Qatalyst, we know that navigating your role can feel exciting and sometimes a little overwhelming. The good news? You''re not alone, and everything we do is guided by a single system designed to help you succeed.

That system is the **Golden Honeycomb of Competencies (GHC)**, our master framework, blueprint, and operating system rolled into one.

The GHC defines:

- **How we think**
- **How we work**
- **How we create value**
- **How we grow**, both internally and with every partner we serve

It brings together the skills, behaviours, and systems that make a Qatalyst effective, ensuring every action, decision, and collaboration is purposeful and aligned with DQ''s mission.

Think of it as your map, compass, and toolkit, helping you:

- **Work seamlessly** with your team
- **Make decisions** that actually move the needle
- **Solve problems** creatively and confidently
- **Deliver real, measurable value** to our clients

In short, the GHC is your guide to thriving at DQ and understanding why every choice matters.

## Why the GHC Exists

DQ tackles complex digital challenges across industries. Without alignment, things can quickly get messy. The GHC exists to make everything coherent, purposeful, and impactful:

- **Everyone knows** why we do what we do
- **Teams can collaborate** effortlessly
- **Work moves forward** with clarity and intention
- **Learning and improvement** are built into every task

Put simply, the GHC is why DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.

## The 7 Competencies of the GHC

At the heart of the GHC are seven interlinked competencies, each answering a foundational question about how a high-performing, purpose-driven digital organisation operates. Together, they form DQ''s DNA:

### 1. Vision (Purpose) - Why We Exist

**To perfect life''s transactions.**

This competency anchors everything in why we do what we do, guiding priorities, aligning playbooks and platforms, and keeping us focused on building trust, clarity, and momentum, not just technology.

It is rooted in the belief that human needs and digital systems should serve each other intelligently and consistently, guided by Digital Blueprints that help organisations evolve into Digital Cognitive Organisations (DCOs).

### 2. House of Values (HoV - Culture) - How We Behave

Culture isn''t accidental. HoV defines how we act, especially under pressure.

**Three guiding mantras:**

**Self-Development** - growth is a daily responsibility
- Emotional Intelligence: stay calm, present, accountable
- Growth Mindset: embrace feedback, learn from failure, evolve fast

**Lean Working** - clarity, focus, and momentum over noise
- Purpose, Perceptive, Proactive, Persevering, Precise

**Value Co-Creation** - collaboration scales intelligence
- Customer focus, Learning, Collaboration, Responsibility, Trust

These principles are reinforced by 12 Guiding Values that keep Qatalysts aligned, focused, and performing at a high level.

### 3. Persona (Identity) - Who We Are

The DQ Persona defines traits of high-impact Qatalysts:

- **Purpose-driven**
- **Perceptive**
- **Proactive**
- **Persevering**
- **Precise**

It shapes team building, role assignment, partnerships, and ensures fit amplifies the mission, allowing the organisation to move faster and more cohesively.

### 4. Agile TMS (Task Management System) – How We Work

Agile TMS turns strategy into motion through a 7S-driven system of execution that ensures work is specified, socialised, shared, scrummed, structured, set up for success, and continuously sped up.

It breaks work into clear, actionable units with ownership, urgency, and intent, while anchoring execution in predictable cadences and collaborative rituals.

**Through:**

- **Specify** – Tasks have clear context, purpose, outcomes, approach, and checklist
- **Socialise** – Work is visible across channels, threads, and updates
- **Share** – Collaboration via CWS, Blitz, Urgent, Personal, Feedback, and Learning sessions
- **Scrum** – Daily standups, weekly CTs, monthly townhalls, quarterly and annual reviews
- **Structure** – ATP system linking strategy → backlogs → sprints → tasks
- **Succeed** – Performance measured and rewarded through xPA
- **Speed-Up** – Technology and AI accelerate planning, execution, and insight

Agile TMS ensures every task answers: "Does this move the needle?" and "How does this contribute to outcomes?"

Purpose: create momentum, not just manage tasks.

### 5. Agile SoS (Governance) - How We Govern

Governance is a steering wheel, not a brake. Agile SoS ensures alignment, quality, and value through four systems:

- **System of Governance (SoG)**: strategic direction and operating rhythm
- **System of Quality (SoQ)**: reinforces excellence and builds mastery
- **System of Value (SoV)**: defines impact and aligns outcomes
- **System of Discipline (SoD)**: tackles root frictions, not just symptoms

These layers make agility scalable and sustainable, today and into the future.

### 6. Agile Flows (Value Streams) - How We Orchestrate

Agile Flows manage end-to-end value streams, connecting strategy to execution:

**Six Stages of the Value Chain:**

- **Market → Lead**: generate awareness and shape demand
- **Lead → Opportunity**: qualify leads, frame client needs
- **Opportunity → Order**: align scope, timeline, delivery
- **Order → Fulfillment**: design, build, launch
- **Fulfillment → Revenue**: measure delivery, track value
- **Revenue → Loyalty**: retain customers, feed insights back into the system

Benefits: eliminate duplication, reduce blockers, see problems early, deliver as one.

### 7. Agile 6xD (Products) - What We Offer

Agile 6xD is DQ''s transformation blueprint, guiding continuous, evolving digital transformation.

**Six Digital Perspectives:**

- **Digital Economy (DE)**: why change is needed
- **Digital Cognitive Organisation (DCO)**: where organisations are headed
- **Digital Business Platforms (DBP)**: what must be built
- **Digital Transformation 2.0 (DT2.0)**: how transformation is designed and executed
- **Digital Worker & Workspace (DW:WS)**: who delivers change and how
- **Digital Accelerators (Tools)**: when and how value is realised

Together, these perspectives provide a transformation compass, enabling organisations to act with clarity, discipline, and speed in a fast-changing world.

## How the GHC Shapes You

The GHC isn''t just theory, it shapes your daily work, decisions, and impact. Use it to:

- **Grow Yourself Every Day**: embrace feedback, learn constantly, turn challenges into growth
- **Work Smart and Lean**: focus on what matters, take initiative, sweat the details
- **Create Value with Others**: collaborate openly, design with empathy, build trust through clarity and consistency

Think of these as practical superpowers you can start using from day one.

## How Work Flows at DQ

Everything moves through connected value streams, from ideas to delivery to lasting impact:

- **Agile task management**: know exactly what to do, who owns it, and why it matters
- **Guided governance**: direction and quality without slowing down
- **End-to-end collaboration**: your work links directly to client outcomes

Understanding these flows helps you see how your contribution fits into the bigger picture, making your role meaningful every day.

## Your Role as a Qatalyst

You don''t need to master everything at once. Keep the Honeycomb in mind:

- **Ask**: "Does this task create real value?"
- **Look** for opportunities to collaborate and support others
- **Apply** GHC principles to make confident decisions
- **Notice** how your work connects to larger projects and outcomes

The GHC is a Honeycomb for a reason: every part is connected, and every Qatalyst strengthens the whole. Live it, and you''ll become more impactful, confident, and strategic every day.

## Pro Tip

Keep this Honeycomb in mind as you start your journey. Whether it''s a sprint, client call, or problem-solving session, your choices, actions, and mindset shape the DQ mission, transaction by transaction, life by life, organisation by organisation.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-ghc' OR slug = 'ghc-overview' OR slug = 'golden-honeycomb' OR title LIKE '%Golden Honeycomb%Competencies%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-ghc' OR slug = 'ghc-overview' OR slug = 'golden-honeycomb' OR title LIKE '%Golden Honeycomb%Competencies%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-ghc' OR slug = 'ghc-overview' OR slug = 'golden-honeycomb' OR title LIKE '%Golden Honeycomb%Competencies%';