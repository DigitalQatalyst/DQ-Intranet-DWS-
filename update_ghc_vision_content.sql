-- Update GHC Competency 1: Vision (Purpose) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-vision' OR slug = 'ghc-vision' OR title LIKE '%Vision%Purpose%';

-- Step 2: Update the Vision guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 1: Vision (Purpose)',
  summary = 'Vision is the steady reference point that keeps us aligned as complexity increases. It explains why DQ exists, why we think differently, and why we remain disciplined in how we work.',
  body = '# Introduction

Whether you''re joining DQ for the first time or continuing your journey here, you''re stepping into a collaborative environment where learning, growth, and shared purpose guide the work we do together.

That''s where Vision comes in.

Vision is not a slogan or an abstract ideal. It is the steady reference point that keeps us aligned as complexity increases. It explains why DQ exists, why we think differently, and why we remain disciplined in how we work.

For new associates, Vision provides orientation as a way to understand how your work fits into something larger from day one. For existing associates, it acts as a compass helping you prioritise, make confident decisions, and stay coherent as responsibilities grow.

## What Vision Means at DQ

At DigitalQatalyst, Vision is the foundation of everything we do. It defines our worldview and shapes how we design, build, and deliver.

We start from a simple but powerful observation: **life is made up of transactions.**

A bill payment. A form submission. Accessing health records. Tracking a delivery.

These moments may seem small, but together they form the fabric of daily life. Every transaction is a point of contact between people and the systems meant to serve them. When those systems are clear, connected, and intentional, life moves forward with less resistance. When they are not, friction builds delays, confusion, rework, and frustration.

At DQ, we believe most of this friction is not inevitable. It is the result of poorly designed and poorly orchestrated data and decision flows across organisational systems.

Our Vision responds directly to this reality.

## The DQ Vision (Our Purpose)

Our Vision is: **To perfect life''s transactions.**

This does not mean perfection as an endpoint. It means perfection as a discipline of continuous improvement reducing friction, increasing clarity, and shortening the distance between intent and value.

Organisations exist to deliver value to the people they serve. Yet legacy systems, siloed thinking, and shortcut-driven decisions have gradually eroded that value.

Today, the scale of data and the rise of machine intelligence create a new possibility: organisations that don''t just digitise processes, but think, learn, and adapt by design.

This is the future we are working toward.

## A New Organisational Model

At DQ, Vision leads us to enable a new kind of organisation, the **Digital Cognitive Organisation (DCO)**.

A DCO is a living system that:

- **Integrates** people, systems, intelligence, and intent
- **Learns** continuously rather than reacting late
- **Anticipates** change instead of being disrupted by it

This model is made possible through unified **Digital Business Platforms (DBPs)** environments where data, decision-making, and execution are orchestrated as one system rather than fragmented parts.

Our Vision is not just about technology. It is about better thinking, better coordination, and better outcomes at scale.

## Our Enabling Beliefs

Our Vision is grounded in a set of beliefs that guide our behaviour and decisions:

- We believe the systematic orchestration of human and machine intelligence can meaningfully improve lives within organisations and across the communities they serve.
- We believe this orchestration is most effective when organisations operate on a unified Digital Business Platform, not disconnected tools and silos.
- And we believe organisations that successfully transition into Digital Cognitive Organisations will define the next chapter of the global digital economy.

These beliefs are not aspirational statements. They are our internal logic the lens through which we evaluate opportunities, design solutions, and make trade-offs.

## How Vision Connects to the DQ Mission

Vision explains why we exist. Mission explains how we act on that purpose.

Our Mission is: **To accelerate the realisation of Digital Business Platforms using easy-to-implement blueprints.**

We do this by equipping people and organisations with the thinking, tools, and capabilities needed to operate effectively and adapt continuously in a changing digital economy.

Because transformation is no longer a one-time initiative. It is an ongoing condition and to be real, it must be structured, adaptive, and connected from vision through to execution.

## Applying Vision in Your Role

Vision at DQ is practical and actionable.

In your day-to-day work, it helps you:

- **Prioritise** what truly matters
- **Make confident decisions** in ambiguous situations
- **Understand** how your work connects to client outcomes
- **See beyond tasks** to systemic impact

Whether you are contributing to delivery, design, governance, or strategy, Vision ensures your work is not just activity but meaningful progress toward our purpose.

## Growing with Vision

As you gain experience at DQ, your relationship with Vision deepens.

Early on, it helps you orient yourself and focus your effort. Over time, it enables you to:

- **Communicate** the "why" behind decisions more clearly
- **Anticipate** challenges rather than react to them
- **Take ownership** with greater confidence and independence

Vision evolves with you not by changing, but by becoming more deeply understood and applied.

## Why Vision Matters

- **For associates**, Vision reduces friction in everyday work. It brings coherence to decisions, alignment to teams, and meaning to effort.
- **For clients**, it offers a path to transformation that doesn''t rely on constant reinvention but on systems designed for adaptability.
- **For investors and partners**, it signals an organisation built not just to scale output, but to scale intelligence and intent.

## Key Takeaways

- **Vision (Purpose)** is the foundation of the DQ Golden Honeycomb
- It explains why DQ exists and how we see the world
- It connects individual work to organisational impact
- It guides decision-making at every level of the organisation

## Pro Tip

When you feel uncertain or stuck, ask yourself:

**"How does this improve the transaction?"**

If the answer brings more clarity, less friction, or better flow you''re aligned with the Vision.',
  last_updated_at = NOW()
WHERE slug = 'dq-vision' OR slug = 'ghc-vision' OR title LIKE '%Vision%Purpose%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-vision',
  'GHC Competency 1: Vision (Purpose)',
  'Vision is the steady reference point that keeps us aligned as complexity increases. It explains why DQ exists, why we think differently, and why we remain disciplined in how we work.',
  '# Introduction

Whether you''re joining DQ for the first time or continuing your journey here, you''re stepping into a collaborative environment where learning, growth, and shared purpose guide the work we do together.

That''s where Vision comes in.

Vision is not a slogan or an abstract ideal. It is the steady reference point that keeps us aligned as complexity increases. It explains why DQ exists, why we think differently, and why we remain disciplined in how we work.

For new associates, Vision provides orientation as a way to understand how your work fits into something larger from day one. For existing associates, it acts as a compass helping you prioritise, make confident decisions, and stay coherent as responsibilities grow.

## What Vision Means at DQ

At DigitalQatalyst, Vision is the foundation of everything we do. It defines our worldview and shapes how we design, build, and deliver.

We start from a simple but powerful observation: **life is made up of transactions.**

A bill payment. A form submission. Accessing health records. Tracking a delivery.

These moments may seem small, but together they form the fabric of daily life. Every transaction is a point of contact between people and the systems meant to serve them. When those systems are clear, connected, and intentional, life moves forward with less resistance. When they are not, friction builds delays, confusion, rework, and frustration.

At DQ, we believe most of this friction is not inevitable. It is the result of poorly designed and poorly orchestrated data and decision flows across organisational systems.

Our Vision responds directly to this reality.

## The DQ Vision (Our Purpose)

Our Vision is: **To perfect life''s transactions.**

This does not mean perfection as an endpoint. It means perfection as a discipline of continuous improvement reducing friction, increasing clarity, and shortening the distance between intent and value.

Organisations exist to deliver value to the people they serve. Yet legacy systems, siloed thinking, and shortcut-driven decisions have gradually eroded that value.

Today, the scale of data and the rise of machine intelligence create a new possibility: organisations that don''t just digitise processes, but think, learn, and adapt by design.

This is the future we are working toward.

## A New Organisational Model

At DQ, Vision leads us to enable a new kind of organisation, the **Digital Cognitive Organisation (DCO)**.

A DCO is a living system that:

- **Integrates** people, systems, intelligence, and intent
- **Learns** continuously rather than reacting late
- **Anticipates** change instead of being disrupted by it

This model is made possible through unified **Digital Business Platforms (DBPs)** environments where data, decision-making, and execution are orchestrated as one system rather than fragmented parts.

Our Vision is not just about technology. It is about better thinking, better coordination, and better outcomes at scale.

## Our Enabling Beliefs

Our Vision is grounded in a set of beliefs that guide our behaviour and decisions:

- We believe the systematic orchestration of human and machine intelligence can meaningfully improve lives within organisations and across the communities they serve.
- We believe this orchestration is most effective when organisations operate on a unified Digital Business Platform, not disconnected tools and silos.
- And we believe organisations that successfully transition into Digital Cognitive Organisations will define the next chapter of the global digital economy.

These beliefs are not aspirational statements. They are our internal logic the lens through which we evaluate opportunities, design solutions, and make trade-offs.

## How Vision Connects to the DQ Mission

Vision explains why we exist. Mission explains how we act on that purpose.

Our Mission is: **To accelerate the realisation of Digital Business Platforms using easy-to-implement blueprints.**

We do this by equipping people and organisations with the thinking, tools, and capabilities needed to operate effectively and adapt continuously in a changing digital economy.

Because transformation is no longer a one-time initiative. It is an ongoing condition and to be real, it must be structured, adaptive, and connected from vision through to execution.

## Applying Vision in Your Role

Vision at DQ is practical and actionable.

In your day-to-day work, it helps you:

- **Prioritise** what truly matters
- **Make confident decisions** in ambiguous situations
- **Understand** how your work connects to client outcomes
- **See beyond tasks** to systemic impact

Whether you are contributing to delivery, design, governance, or strategy, Vision ensures your work is not just activity but meaningful progress toward our purpose.

## Growing with Vision

As you gain experience at DQ, your relationship with Vision deepens.

Early on, it helps you orient yourself and focus your effort. Over time, it enables you to:

- **Communicate** the "why" behind decisions more clearly
- **Anticipate** challenges rather than react to them
- **Take ownership** with greater confidence and independence

Vision evolves with you not by changing, but by becoming more deeply understood and applied.

## Why Vision Matters

- **For associates**, Vision reduces friction in everyday work. It brings coherence to decisions, alignment to teams, and meaning to effort.
- **For clients**, it offers a path to transformation that doesn''t rely on constant reinvention but on systems designed for adaptability.
- **For investors and partners**, it signals an organisation built not just to scale output, but to scale intelligence and intent.

## Key Takeaways

- **Vision (Purpose)** is the foundation of the DQ Golden Honeycomb
- It explains why DQ exists and how we see the world
- It connects individual work to organisational impact
- It guides decision-making at every level of the organisation

## Pro Tip

When you feel uncertain or stuck, ask yourself:

**"How does this improve the transaction?"**

If the answer brings more clarity, less friction, or better flow you''re aligned with the Vision.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-vision' OR slug = 'ghc-vision' OR title LIKE '%Vision%Purpose%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-vision' OR slug = 'ghc-vision' OR title LIKE '%Vision%Purpose%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-vision' OR slug = 'ghc-vision' OR title LIKE '%Vision%Purpose%';