-- Update GHC Competency 6: Agile Flows (Value Streams) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-agile-flows' OR slug = 'ghc-agile-flows' OR slug = 'agile-flows' OR title LIKE '%Agile Flows%Value Streams%';

-- Step 2: Update the Agile Flows guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 6: Agile Flows (Value Streams)',
  summary = 'Agile Flows is our system for orchestrating work across end-to-end value streams. It ensures that every project, task, and initiative flows seamlessly from concept to delivery, connecting teams, tools, and processes to drive real outcomes.',
  body = '# Introduction

At DQ, ideas alone aren''t enough, what matters is delivering them across the finish line with impact, clarity, and alignment.

Agile Flows is our system for orchestrating work across end-to-end value streams. It ensures that every project, task, and initiative flows seamlessly from concept to delivery, connecting teams, tools, and processes to drive real outcomes.

## What is Agile Flows?

Agile Flows is the operating architecture for value creation at scale. It treats work as a connected system, not isolated tasks, ensuring that every handoff is intentional, every outcome is measurable, and every team sees how their contribution affects organizational impact.

## Why Agile Flows Matters

Understanding Agile Flows is critical for all associates:

**New joiners**: Learn how work moves across teams, where responsibilities lie, and how their contribution fits into the bigger picture.

**Existing associates**: Gain clarity on coordination, handoffs, and dependencies, enabling smoother execution, reduced duplication, and faster delivery.

In short: Agile Flows ensures everyone at DQ can see the path from ideas to impact, making work purposeful and predictable.

## DQ Agile Purpose | Outcomes Layering

Agile Flows connects work to four layers of outcomes:

**Purposeful Outcome (DCOs)**: Deliver seamless, intelligent digital interactions that reduce friction and create value.

**Enabling Outcome (DBPs)**: Embed smarter, technology-enabled processes to ensure agility, scalability, and resilience.

**Orchestrating Outcome (DT2.0)**: Use repeatable templates and playbooks for consistent, scalable deployment of DBPs.

**Structural Outcome**: Streamline flows across value streams, minimizing bottlenecks and ensuring continuous value delivery.

## DQ Agile Purpose | Effectiveness & Efficiency

**Agile Mindset (Efficiency)**: Shorten cycles, eliminate waste, and accelerate outcomes without losing quality.

**Agile Flow (Effectiveness)**: Ensure every handoff is purposeful and every outcome traceable.

**Agile Value Stream**: Integrates strategy, design, and execution into one continuum.

**Value Stream Mapping**: Visualizes how work moves from start to finish, highlighting where value is created and where bottlenecks occur.

## DQ Agile Streams | Macro Flows

Agile Flows are organized into six stages, spanning the end-to-end value chain:

### Market to Lead (M2L)
Identify potential markets, generate awareness, and convert marketing into qualified leads.

### Lead to Opportunity (L2O)
Progress leads to defined sales opportunities through qualification and structured handoffs.

### Opportunity to Order (O2O)
Convert opportunities into confirmed orders with clear tracking and accountability.

### Order to Fulfillment (O2F)
Execute commitments consistently, from planning to delivery.

### Fulfillment to Revenue (F2R)
Ensure delivery translates into recognized revenue with no gaps.

### Revenue to Loyalty (R2L)
Nurture post-delivery client relationships to build retention, advocacy, and repeat business.

Each stream is cross-functionally owned, uniting teams in Business Development, Delivery, Engineering, Design, Operations, and Content. Work flows through structured tools, check-ins, and cadence points, avoiding silos.

## DQ Agile Flow | Micro Flows

**Task Friction**: Identifies blockers, dependencies, and ownership to ensure smooth progress.

**TMS Specs**: Tasks are tracked in Agile TMS for visibility, accountability, and measurable outcomes.

**Value Alignment**: Each epic, feature, story, and task links directly to defined value outcomes:

- **Epics**: Big-picture objectives tied to business value
- **Features**: Functional capabilities that move epics forward
- **User Stories**: Human-centered needs shaping features
- **Tasks**: Concrete deliverables bringing user stories to life

**Value Backlog**: A living pipeline of priorities tied to strategy, not just activity.

### Value Specifications:

**Strategy Deck** → articulates high-level intent

**Task Outcomes** → defines success criteria

**MVP & Engagement** → delivers minimum viable outcomes early to prove value and gather feedback

## Why Agile Flows Works

Agile Flows works because it treats work as a system, not isolated tasks:

- **Eliminates duplicated effort**
- **Identifies bottlenecks early**
- **Enables real-time coordination**
- **Prioritizes client and organizational outcomes**

It ensures work is structured without rigidity, movement without confusion, and collaboration without rework.

## Key Takeaways

Mastering Agile Flows means you can:

- **See the end-to-end flow** of work
- **Understand your role** in driving value
- **Collaborate seamlessly** across teams
- **Deliver outcomes** that truly matter to clients

## Pro Tip

Before starting or handing off a task, ask:

**"How does this connect to the value chain, and who else depends on it?"**

Agile Flows ensures work contributes to seamless delivery, measurable impact, and coordinated execution - whether you''re new to DQ or managing complex projects.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-flows' OR slug = 'ghc-agile-flows' OR slug = 'agile-flows' OR title LIKE '%Agile Flows%Value Streams%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-agile-flows',
  'GHC Competency 6: Agile Flows (Value Streams)',
  'Agile Flows is our system for orchestrating work across end-to-end value streams. It ensures that every project, task, and initiative flows seamlessly from concept to delivery, connecting teams, tools, and processes to drive real outcomes.',
  '# Introduction

At DQ, ideas alone aren''t enough, what matters is delivering them across the finish line with impact, clarity, and alignment.

Agile Flows is our system for orchestrating work across end-to-end value streams. It ensures that every project, task, and initiative flows seamlessly from concept to delivery, connecting teams, tools, and processes to drive real outcomes.

## What is Agile Flows?

Agile Flows is the operating architecture for value creation at scale. It treats work as a connected system, not isolated tasks, ensuring that every handoff is intentional, every outcome is measurable, and every team sees how their contribution affects organizational impact.

## Why Agile Flows Matters

Understanding Agile Flows is critical for all associates:

**New joiners**: Learn how work moves across teams, where responsibilities lie, and how their contribution fits into the bigger picture.

**Existing associates**: Gain clarity on coordination, handoffs, and dependencies, enabling smoother execution, reduced duplication, and faster delivery.

In short: Agile Flows ensures everyone at DQ can see the path from ideas to impact, making work purposeful and predictable.

## DQ Agile Purpose | Outcomes Layering

Agile Flows connects work to four layers of outcomes:

**Purposeful Outcome (DCOs)**: Deliver seamless, intelligent digital interactions that reduce friction and create value.

**Enabling Outcome (DBPs)**: Embed smarter, technology-enabled processes to ensure agility, scalability, and resilience.

**Orchestrating Outcome (DT2.0)**: Use repeatable templates and playbooks for consistent, scalable deployment of DBPs.

**Structural Outcome**: Streamline flows across value streams, minimizing bottlenecks and ensuring continuous value delivery.

## DQ Agile Purpose | Effectiveness & Efficiency

**Agile Mindset (Efficiency)**: Shorten cycles, eliminate waste, and accelerate outcomes without losing quality.

**Agile Flow (Effectiveness)**: Ensure every handoff is purposeful and every outcome traceable.

**Agile Value Stream**: Integrates strategy, design, and execution into one continuum.

**Value Stream Mapping**: Visualizes how work moves from start to finish, highlighting where value is created and where bottlenecks occur.

## DQ Agile Streams | Macro Flows

Agile Flows are organized into six stages, spanning the end-to-end value chain:

### Market to Lead (M2L)
Identify potential markets, generate awareness, and convert marketing into qualified leads.

### Lead to Opportunity (L2O)
Progress leads to defined sales opportunities through qualification and structured handoffs.

### Opportunity to Order (O2O)
Convert opportunities into confirmed orders with clear tracking and accountability.

### Order to Fulfillment (O2F)
Execute commitments consistently, from planning to delivery.

### Fulfillment to Revenue (F2R)
Ensure delivery translates into recognized revenue with no gaps.

### Revenue to Loyalty (R2L)
Nurture post-delivery client relationships to build retention, advocacy, and repeat business.

Each stream is cross-functionally owned, uniting teams in Business Development, Delivery, Engineering, Design, Operations, and Content. Work flows through structured tools, check-ins, and cadence points, avoiding silos.

## DQ Agile Flow | Micro Flows

**Task Friction**: Identifies blockers, dependencies, and ownership to ensure smooth progress.

**TMS Specs**: Tasks are tracked in Agile TMS for visibility, accountability, and measurable outcomes.

**Value Alignment**: Each epic, feature, story, and task links directly to defined value outcomes:

- **Epics**: Big-picture objectives tied to business value
- **Features**: Functional capabilities that move epics forward
- **User Stories**: Human-centered needs shaping features
- **Tasks**: Concrete deliverables bringing user stories to life

**Value Backlog**: A living pipeline of priorities tied to strategy, not just activity.

### Value Specifications:

**Strategy Deck** → articulates high-level intent

**Task Outcomes** → defines success criteria

**MVP & Engagement** → delivers minimum viable outcomes early to prove value and gather feedback

## Why Agile Flows Works

Agile Flows works because it treats work as a system, not isolated tasks:

- **Eliminates duplicated effort**
- **Identifies bottlenecks early**
- **Enables real-time coordination**
- **Prioritizes client and organizational outcomes**

It ensures work is structured without rigidity, movement without confusion, and collaboration without rework.

## Key Takeaways

Mastering Agile Flows means you can:

- **See the end-to-end flow** of work
- **Understand your role** in driving value
- **Collaborate seamlessly** across teams
- **Deliver outcomes** that truly matter to clients

## Pro Tip

Before starting or handing off a task, ask:

**"How does this connect to the value chain, and who else depends on it?"**

Agile Flows ensures work contributes to seamless delivery, measurable impact, and coordinated execution - whether you''re new to DQ or managing complex projects.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-agile-flows' OR slug = 'ghc-agile-flows' OR slug = 'agile-flows' OR title LIKE '%Agile Flows%Value Streams%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-agile-flows' OR slug = 'ghc-agile-flows' OR slug = 'agile-flows' OR title LIKE '%Agile Flows%Value Streams%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-agile-flows' OR slug = 'ghc-agile-flows' OR slug = 'agile-flows' OR title LIKE '%Agile Flows%Value Streams%';