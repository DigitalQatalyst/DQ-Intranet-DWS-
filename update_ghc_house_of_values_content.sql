-- Update GHC Competency 2: House of Values (Culture) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-house-of-values' OR slug = 'ghc-house-of-values' OR slug = 'dq-hov' OR title LIKE '%House of Values%Culture%';

-- Step 2: Update the House of Values guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 2: House of Values (Culture)',
  summary = 'The House of Values (HoV) gives every Qatalyst a shared cultural reference point. It guides behaviour when deadlines are tight, feedback is uncomfortable, or clarity is required. It provides consistency without rigidity, and autonomy without chaos.',
  body = '# Introduction

Whether you are joining DigitalQatalyst for the first time or continuing to grow within it, one thing becomes clear quickly: how we work together matters as much as what we deliver.

At DQ, culture is not something that emerges by chance. We''ve made peace with a difficult truth, culture will happen with or without intention. And if it is left undefined, it will quietly shape decisions, behaviours, and outcomes in ways we didn''t choose.

So we chose to design it.

The House of Values (HoV) exists to give every Qatalyst regardless of role, seniority, or geography a shared cultural reference point. It guides behaviour when deadlines are tight, feedback is uncomfortable, or clarity is required. It provides consistency without rigidity, and autonomy without chaos.

## What the House of Values Means at DQ

The House of Values is the cultural pillar of the DQ Golden Honeycomb of Competencies (GHC). It functions as the cultural operating system for all Qatalysts: employees, partners, and collaborators.

The HoV is a blueprint for:

- How we **think**
- How we **behave**
- How we **build trust**
- How we **deliver outcomes together**

At DQ, culture is not a "vibe" or a set of inspirational words. It is a **system** engineered to support performance, collaboration, and growth over time.

At the heart of this system are three Mantras, each brought to life through a set of Guiding Values. Together, they define the emotional, operational, and collaborative foundations of how we show up internally, with clients, and across our broader ecosystem.

## The Structure of the House of Values

The HoV is intentionally simple but not shallow.

It is structured as a house, with each layer building on the one below it:

- **The Foundation Mantra**: Self-Development
- **The Pillars Mantra**: Lean Working
- **The Roof Mantra**: Value Co-Creation

Each mantra answers a deeper question, not just what we are doing, but how we are becoming the kind of organisation capable of doing it well.

Each mantra is a cultural doctrine. The Guiding Values translate doctrine into daily behaviour and decision-making clarity.

## HoV Mantra 01: Self-Development

**"We grow ourselves and others through every experience."**

Self-Development is the foundation of the DQ culture.

At DQ, growth is not optional and it is not confined to formal training. We treat every interaction no matter how small as an opportunity to become wiser, more capable, and more self-aware.

This mantra reinforces that:

- Emotional awareness is essential to performance
- Learning is continuous, not episodic
- Personal growth fuels organisational growth

### Guiding Values:

**Emotional Intelligence** - Remaining calm, aware, and accountable under pressure

**Growth Mindset** - Using feedback and failure as fuel for improvement

For new Qatalysts, this creates a psychologically safe space to learn and grow. For experienced Qatalysts, it reinforces responsibility for role-modelling and developing others.

## HoV Mantra 02: Lean Working

**"We pursue clarity, efficiency, and prompt outcomes in everything we do."**

Lean Working forms the structural pillars of the HoV.

At DQ, good intentions are not enough. Delivery matters. Structure matters. Momentum matters.

Lean Working ensures that from idea to outcome, effort is focused, purposeful, and value-driven. We optimise how we work so that results are not only achieved but achieved well.

### Guiding Values:

**Purpose** - Staying connected to why the work matters

**Perceptive** - Anticipating needs and making thoughtful choices

**Proactive** - Taking initiative and moving things forward

**Perseverance** - Pushing through setbacks with focus

**Precision** - Sweating the details that drive performance

This mantra creates clarity in fast-moving environments and ensures that scale does not dilute quality.

## HoV Mantra 03: Value Co-Creation

**"We partner with others to create greater impact together."**

Value Co-Creation is the roof of the HoV, the layer that enables collective impact.

At DQ, collaboration is not a soft skill. It is a competitive advantage.

We believe the best outcomes are co-created through trust, openness, and shared responsibility. This applies across teams, with clients, and with partners.

### Guiding Values:

**Customer** - Designing with empathy for those we serve

**Learning** - Remaining open, curious, and teachable

**Collaboration** - Working as one, not in silos

**Responsibility** - Owning decisions and their consequences

**Trust** - Building reliability through honesty, clarity, and consistency

Value Co-Creation ensures that intelligence is shared, not hoarded and that success is collective, not individual.

## Applying the House of Values in Your Role

The HoV is not theoretical. It is a daily operating guide.

In practice, it helps you:

- **Make behavioural decisions** under pressure
- **Navigate conflict** with clarity and respect
- **Deliver consistently** without losing empathy
- **Balance autonomy** with accountability

Whether you are contributing individually or leading others, the HoV provides a shared language for "how we do things here."

## Growing with the House of Values

As your journey at DQ progresses, the HoV becomes more deeply embedded in how you operate.

Over time, it enables you to:

- **Lead confidently** through ambiguity
- **Build trust faster** with teams and clients
- **Make high-quality decisions** without excessive control
- **Act as a culture-holder**, not just a role-holder

Culture is shaped in small, cumulative moments. Every Qatalyst contributes to it intentionally or not.

## Why the House of Values Matters Across the Ecosystem

### For Qatalysts (Employees): Identity & Mastery

The HoV gives every Qatalyst a playbook for thriving, clarifying how to behave, not just what to do. It fosters belonging, accountability, and high-performance mindsets in everyday work.

### For Customers: Trust & Delivery Consistency

The HoV is the invisible engine behind the DQ client experience. It ensures consistency, empathy, and precision across engagements making collaboration feel seamless and reliable.

### For Investors: Maturity & Scale-Readiness

The HoV signals that DQ is growing by design, not chance. Culture is institutionalised, scaling risk is reduced, and long-term value creation is enabled.

## Culture as a Living System

Culture is rarely seen directly but it is always felt.

You feel it:

- In how feedback is given
- In whether people lean in when things get hard
- In how silence is handled when clarity is needed

To ensure culture remains intentional, DQ uses the Competing Values Framework (CVF) to continuously assess and evolve its cultural profile balancing flexibility with stability, and internal cohesion with external focus.

Culture at DQ is treated as a strategic asset, reviewed bi-annually and integrated into wider organisational development and GHC initiatives.

## Key Takeaways

- Culture at DQ is **engineered**, not assumed
- The House of Values defines how we **grow**, **deliver**, and **collaborate**
- Every Qatalyst is a **culture-holder**
- Performance and culture are **inseparable**

## Pro Tip

Before starting a task, entering a meeting, or making a decision, pause and ask:

**"Which HoV mantra should guide me here?"**

When Self-Development, Lean Working, and Value Co-Creation are lived together, culture becomes our edge.',
  last_updated_at = NOW()
WHERE slug = 'dq-house-of-values' OR slug = 'ghc-house-of-values' OR slug = 'dq-hov' OR title LIKE '%House of Values%Culture%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-house-of-values',
  'GHC Competency 2: House of Values (Culture)',
  'The House of Values (HoV) gives every Qatalyst a shared cultural reference point. It guides behaviour when deadlines are tight, feedback is uncomfortable, or clarity is required. It provides consistency without rigidity, and autonomy without chaos.',
  '# Introduction

Whether you are joining DigitalQatalyst for the first time or continuing to grow within it, one thing becomes clear quickly: how we work together matters as much as what we deliver.

At DQ, culture is not something that emerges by chance. We''ve made peace with a difficult truth, culture will happen with or without intention. And if it is left undefined, it will quietly shape decisions, behaviours, and outcomes in ways we didn''t choose.

So we chose to design it.

The House of Values (HoV) exists to give every Qatalyst regardless of role, seniority, or geography a shared cultural reference point. It guides behaviour when deadlines are tight, feedback is uncomfortable, or clarity is required. It provides consistency without rigidity, and autonomy without chaos.

## What the House of Values Means at DQ

The House of Values is the cultural pillar of the DQ Golden Honeycomb of Competencies (GHC). It functions as the cultural operating system for all Qatalysts: employees, partners, and collaborators.

The HoV is a blueprint for:

- How we **think**
- How we **behave**
- How we **build trust**
- How we **deliver outcomes together**

At DQ, culture is not a "vibe" or a set of inspirational words. It is a **system** engineered to support performance, collaboration, and growth over time.

At the heart of this system are three Mantras, each brought to life through a set of Guiding Values. Together, they define the emotional, operational, and collaborative foundations of how we show up internally, with clients, and across our broader ecosystem.

## The Structure of the House of Values

The HoV is intentionally simple but not shallow.

It is structured as a house, with each layer building on the one below it:

- **The Foundation Mantra**: Self-Development
- **The Pillars Mantra**: Lean Working
- **The Roof Mantra**: Value Co-Creation

Each mantra answers a deeper question, not just what we are doing, but how we are becoming the kind of organisation capable of doing it well.

Each mantra is a cultural doctrine. The Guiding Values translate doctrine into daily behaviour and decision-making clarity.

## HoV Mantra 01: Self-Development

**"We grow ourselves and others through every experience."**

Self-Development is the foundation of the DQ culture.

At DQ, growth is not optional and it is not confined to formal training. We treat every interaction no matter how small as an opportunity to become wiser, more capable, and more self-aware.

This mantra reinforces that:

- Emotional awareness is essential to performance
- Learning is continuous, not episodic
- Personal growth fuels organisational growth

### Guiding Values:

**Emotional Intelligence** - Remaining calm, aware, and accountable under pressure

**Growth Mindset** - Using feedback and failure as fuel for improvement

For new Qatalysts, this creates a psychologically safe space to learn and grow. For experienced Qatalysts, it reinforces responsibility for role-modelling and developing others.

## HoV Mantra 02: Lean Working

**"We pursue clarity, efficiency, and prompt outcomes in everything we do."**

Lean Working forms the structural pillars of the HoV.

At DQ, good intentions are not enough. Delivery matters. Structure matters. Momentum matters.

Lean Working ensures that from idea to outcome, effort is focused, purposeful, and value-driven. We optimise how we work so that results are not only achieved but achieved well.

### Guiding Values:

**Purpose** - Staying connected to why the work matters

**Perceptive** - Anticipating needs and making thoughtful choices

**Proactive** - Taking initiative and moving things forward

**Perseverance** - Pushing through setbacks with focus

**Precision** - Sweating the details that drive performance

This mantra creates clarity in fast-moving environments and ensures that scale does not dilute quality.

## HoV Mantra 03: Value Co-Creation

**"We partner with others to create greater impact together."**

Value Co-Creation is the roof of the HoV, the layer that enables collective impact.

At DQ, collaboration is not a soft skill. It is a competitive advantage.

We believe the best outcomes are co-created through trust, openness, and shared responsibility. This applies across teams, with clients, and with partners.

### Guiding Values:

**Customer** - Designing with empathy for those we serve

**Learning** - Remaining open, curious, and teachable

**Collaboration** - Working as one, not in silos

**Responsibility** - Owning decisions and their consequences

**Trust** - Building reliability through honesty, clarity, and consistency

Value Co-Creation ensures that intelligence is shared, not hoarded and that success is collective, not individual.

## Applying the House of Values in Your Role

The HoV is not theoretical. It is a daily operating guide.

In practice, it helps you:

- **Make behavioural decisions** under pressure
- **Navigate conflict** with clarity and respect
- **Deliver consistently** without losing empathy
- **Balance autonomy** with accountability

Whether you are contributing individually or leading others, the HoV provides a shared language for "how we do things here."

## Growing with the House of Values

As your journey at DQ progresses, the HoV becomes more deeply embedded in how you operate.

Over time, it enables you to:

- **Lead confidently** through ambiguity
- **Build trust faster** with teams and clients
- **Make high-quality decisions** without excessive control
- **Act as a culture-holder**, not just a role-holder

Culture is shaped in small, cumulative moments. Every Qatalyst contributes to it intentionally or not.

## Why the House of Values Matters Across the Ecosystem

### For Qatalysts (Employees): Identity & Mastery

The HoV gives every Qatalyst a playbook for thriving, clarifying how to behave, not just what to do. It fosters belonging, accountability, and high-performance mindsets in everyday work.

### For Customers: Trust & Delivery Consistency

The HoV is the invisible engine behind the DQ client experience. It ensures consistency, empathy, and precision across engagements making collaboration feel seamless and reliable.

### For Investors: Maturity & Scale-Readiness

The HoV signals that DQ is growing by design, not chance. Culture is institutionalised, scaling risk is reduced, and long-term value creation is enabled.

## Culture as a Living System

Culture is rarely seen directly but it is always felt.

You feel it:

- In how feedback is given
- In whether people lean in when things get hard
- In how silence is handled when clarity is needed

To ensure culture remains intentional, DQ uses the Competing Values Framework (CVF) to continuously assess and evolve its cultural profile balancing flexibility with stability, and internal cohesion with external focus.

Culture at DQ is treated as a strategic asset, reviewed bi-annually and integrated into wider organisational development and GHC initiatives.

## Key Takeaways

- Culture at DQ is **engineered**, not assumed
- The House of Values defines how we **grow**, **deliver**, and **collaborate**
- Every Qatalyst is a **culture-holder**
- Performance and culture are **inseparable**

## Pro Tip

Before starting a task, entering a meeting, or making a decision, pause and ask:

**"Which HoV mantra should guide me here?"**

When Self-Development, Lean Working, and Value Co-Creation are lived together, culture becomes our edge.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-house-of-values' OR slug = 'ghc-house-of-values' OR slug = 'dq-hov' OR title LIKE '%House of Values%Culture%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-house-of-values' OR slug = 'ghc-house-of-values' OR slug = 'dq-hov' OR title LIKE '%House of Values%Culture%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-house-of-values' OR slug = 'ghc-house-of-values' OR slug = 'dq-hov' OR title LIKE '%House of Values%Culture%';