-- Comprehensive fix for all GHC guide duplicate content
-- This ensures each GHC guide has unique content

-- Step 1: Check current state - find all duplicates
SELECT * FROM public.identify_ghc_duplicates();

-- Step 2: Get status report
SELECT * FROM public.get_ghc_status_report();

-- Step 3: Update each GHC guide with correct unique content
-- This will only update if content is missing or duplicate

-- Update dq-vision
UPDATE public.guides
SET 
  title = 'DQ Vision (Purpose)',
  summary = 'The foundational purpose that drives DigitalQatalyst: To perfect life''s transactions through Digital Blueprints that guide organisations in their evolution to Digital Cognitive Organisations (DCOs).',
  body = '# DQ Vision (Purpose)

> "People don''t buy what you do, they buy why you do it."
>
> — Simon Sinek.

Every organisation has a mission. But not every organisation is clear on _why_ it exists.

At DigitalQatalyst, our work is bold, technical, and complex — but it is rooted in something simple:
A belief that the world moves forward when human needs and digital systems are designed to serve one another — intelligently, and consistently.

That belief is the heartbeat of everything we do.

It''s what unifies hundreds of choices we make daily — in how we work, what we build, and where we focus.

Our **why** is this:
**To perfect life''s transactions.**

This vision is not powered by guesswork.
It is driven by **Digital Blueprints** — modular frameworks and systems that guide organisations in their evolution from traditional structures to **Digital Cognitive Organisations (DCOs)**.

Because in a world that is rapidly digitising, the future will belong to organisations that can _**think**_**,** _**learn**_**,** and _**adapt**_— not just deploy tools, but deliver purpose through them.

Our vision gives us direction. It grounds every product, every playbook, every plan and it reminds us that we''re not just building technology.
We''re building trust, momentum, and clarity — system by system, transaction by transaction, life by life.

## Learn More

For a comprehensive understanding of how the DQ Vision fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-vision';

-- Update dq-hov (already fixed, but ensure it's correct)
UPDATE public.guides
SET 
  title = 'HoV (House of Values)',
  summary = 'DQ''s culture system built on three Mantras (Self-Development, Lean Working, Value Co-Creation) and 12 Guiding Values that shape how Qatalysts think, behave, and collaborate.',
  body = '# HoV (House of Values)

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
  last_updated_at = NOW()
WHERE slug = 'dq-hov';

-- Update dq-persona
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
WHERE slug = 'dq-persona';

-- Update dq-agile-tms
UPDATE public.guides
SET 
  title = 'Agile TMS',
  summary = 'The Agile Task Management System (TMS) is how DQ turns strategy into motion through weekly sprints, daily check-ins, structured reviews, and rituals like Co-Working Sessions (CWS) and Blitz Sprints.',
  body = '# Agile TMS

The Agile TMS (Task Management System) is how DQ turns strategy into motion — every day, in every team. It''s the living rhythm of how we plan, prioritise, deliver, and adapt — all without sacrificing speed or coherence.

Agile TMS breaks down work into clear, actionable units — with **ownership**, **urgency**, and **intent** baked in. This isn''t just about managing tasks, it''s about creating momentum — with purpose.

Our teams move in weekly sprints, daily check-ins, and structured reviews. We use rituals like **Co-Working Sessions (CWS)**, **Blitz Sprints**, and **Feedback Loops** to unblock friction and drive clarity.

And most importantly, we treat every task as a signal — a chance to ask:
_Does this move the needle?_
_Is this tied to a larger outcome?_
_Will this help us get better, not just busier?_

## Learn More

For a comprehensive understanding of how Agile TMS fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-tms';

-- Update dq-agile-sos
UPDATE public.guides
SET 
  title = 'Agile SoS (Governance)',
  summary = 'Agile System of Systems (SoS) is the governance model composed of four systems: System of Governance (SoG), System of Quality (SoQ), System of Value (SoV), and System of Discipline (SoD).',
  body = '# Agile SoS (Governance)

Most organisations treat governance like brakes.
At DQ, it''s a **steering wheel**.

Agile SoS — our System of Systems — is the governance model that helps us move fast **without losing direction**.
It''s not about control. It''s about **coherence** — ensuring that quality, alignment, and value flow through everything we do.

It''s composed of four systems:

- **System of Governance (SoG)** — sets strategic direction and operating rhythm
- **System of Quality (SoQ)** — reinforces excellence and builds mastery
- **System of Value (SoV)** — defines impact, aligns outcomes
- **System of Discipline (SoD)** — tackles root frictions, not just symptoms

They are designed layers that help us scale — where each team knows how to move, and why it matters.

This is how we make agility sustainable. Not just for today — but for the future we''re building.

## Learn More

For a comprehensive understanding of how Agile SoS fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-sos';

-- Update dq-agile-flows
UPDATE public.guides
SET 
  title = 'Agile Flows (Value Streams)',
  summary = 'Agile Flows designs and manages value streams across the DQ organisation through six stages: Market to Lead, Lead to Opportunity, Opportunity to Order, Order to Fulfillment, Fulfillment to Revenue, and Revenue to Loyalty.',
  body = '# Agile Flows (Value Streams)

Ideas are easy.
What''s hard is getting them across the finish line — intact, on time, and aligned to purpose.

**Agile Flows** is our answer to that challenge.
It''s how we design and manage value streams across the DQ organisation — from market insight to customer impact.

Rather than siloing work by function, we structure it by **flow** — end-to-end streams. Each stream connects product, design, engineering, delivery, and strategy — with shared artefacts and handoffs that keep everyone in sync.

## The Six Stages of the Value Chain:

**1. Market to Lead**
_Where opportunities begin._

Marketing and ecosystem teams work to generate awareness, attract interest, and shape demand around DQ''s products and services.

**2. Lead to Opportunity**
_Where interest becomes intent._

Business development qualifies leads, frames client needs, and shapes solution proposals.

**3. Opportunity to Order**
_Where solutions are formalized._

Cross-functional teams align on scope, timeline, and delivery approach — moving from proposal to signed engagement.

**4. Order to Fulfillment**
_Where delivery begins._

Product, engineering, and delivery teams collaborate to design, build, and launch the solution — bringing ideas into reality.

**5. Fulfillment to Revenue**
_Where outcomes are recognized._

Operations and finance ensure that delivery is measured, value is tracked, and agreements are fulfilled with discipline.

**6. Revenue to Loyalty**
_Where value is sustained._

Customer teams drive retention, gather insights, and support long-term relationships — closing the loop and feeding improvements back into the system.

This architecture allows us to:
 → Eliminate duplication
 → Reduce blockers
 → See problems before they scale
 → Deliver as one

Because when you design delivery like a system, you create room for excellence to scale.

## Learn More

For a comprehensive understanding of how Agile Flows fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-flows';

-- Update dq-agile-6xd
UPDATE public.guides
SET 
  title = 'Agile 6xD (Products)',
  summary = 'The Agile 6xD Framework is how DQ designs, builds, and scales digital transformation through Six Essential Perspectives: Digital Economy, Digital Cognitive Organisation, Digital Business Platforms, Digital Transformation 2.0, Digital Worker & Workspace, and Digital Accelerators.',
  body = '# Agile 6xD (Products)

Transformation isn''t something we talk about.
It''s something we **build**.

The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It''s built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

## The 6 Digital Perspectives:

**1. Digital Economy (DE):**
_Why should organisations change?_

Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation.

**2. Digital Cognitive Organisation (DCO)**:
_Where are organisations headed?_

Defines the future enterprise — intelligent, adaptive, and orchestrated — capable of learning, responding, and coordinating seamlessly across people, systems, and decisions.

**3. Digital Business Platforms (DBP)**:
_What must be built to enable transformation?_

Focuses on the modular, integrated, and data-driven architectures that unify operations and make transformation scalable and resilient.

**4. Digital Transformation 2.0 (DT2.0)**:
_How should transformation be designed and deployed?_

Positions transformation as a discipline of design and orchestration, introducing the methods, flows, and governance needed to make change repeatable and outcome-driven.

**5. Digital Worker & Workspace (DW:WS):**
_Who delivers the change, and how do they work?_

Centers on people and their environments — redefining roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively.

**6. Digital Accelerators (Tools)**:
_When will value be realised, and how fast, effective, and aligned will it be?_

Drives execution speed and alignment through tools, systems, and strategies that compress time-to-value and scale measurable impact.

Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

## Learn More

For a comprehensive understanding of how Agile 6xD fits into the complete organizational framework, explore the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc), which articulates the complete DNA of DigitalQatalyst.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-6xd';

-- Step 4: Verify all fixes
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  CASE 
    WHEN body IS NULL OR TRIM(body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as body_status
FROM public.guides
WHERE slug IN (
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
)
ORDER BY slug;

-- Step 5: Final check for duplicates
SELECT * FROM public.identify_ghc_duplicates();

-- Step 6: Get final status report
SELECT * FROM public.get_ghc_status_report();
