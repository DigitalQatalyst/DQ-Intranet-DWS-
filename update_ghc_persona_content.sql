-- Update GHC Competency 3: Persona (Identity) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-persona' OR slug = 'ghc-persona' OR title LIKE '%Persona%Identity%';

-- Step 2: Update the Persona guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 3: Persona (Identity)',
  summary = 'The Persona competency articulates who we are as Qatalysts, what behaviours make us effective, and how we show up to deliver impact. It''s your roadmap for working effectively with teams, clients, partners, and the broader ecosystem.',
  body = '# Introduction

Every transformation journey begins with people. At DQ, it''s not just about hiring talent, it''s about finding fit. The Persona competency articulates who we are as Qatalysts, what behaviours make us effective, and how we show up to deliver impact.

Whether you''re new to DQ or have been contributing for years, understanding the Persona helps you:

- **Align** with our culture
- **Make smarter decisions**
- **Thrive** in your role

It''s your roadmap for working effectively with teams, clients, partners, and the broader ecosystem.

## What Persona Means at DQ

The Persona is the shared identity of every Qatalyst. It describes the traits and behaviours that consistently drive impact and ensures alignment across roles, projects, and teams.

At its core, the DQ Persona emphasizes five key traits:

### Purpose-driven
Anchored in the "why," connecting daily work to lasting value.

### Perceptive
Aware of systems, signals, and context to make informed decisions.

### Proactive
Initiating, anticipating, and moving work forward without waiting.

### Persevering
Resilient and focused even in ambiguity or under pressure.

### Precise
Executing with clarity, craft, and quality as non-negotiables.

Together, these traits define how Qatalysts think, act, and collaborate shaping every interaction, decision, and outcome.

## Applying Persona in Your Role

Understanding and embodying the Persona is practical, not abstract. It guides you to:

- **Collaborate better** - Align with teammates through shared traits and expectations.
- **Navigate ambiguity** - Use perceptiveness and proactivity to make confident decisions.
- **Deliver impact consistently** - Combine purpose, perseverance, and precision in every task.
- **Build trust and credibility** - Demonstrate reliability, clarity, and accountability in all interactions.

By applying the Persona, you contribute naturally to a high-performing team and a culture that sustains excellence.

## Growing with Persona

The Persona evolves as you gain experience. By living these traits, you can:

- **Develop leadership qualities** by influencing others through example
- **Improve strategic thinking** by anticipating challenges and opportunities
- **Strengthen professional relationships** through clarity and empathy
- **Increase your impact** by combining initiative with disciplined execution

Your Persona is your operating identity, the lens through which every challenge, task, and opportunity is approached.

## DQ Persona in the Ecosystem

The DQ Persona extends beyond employees. Success requires alignment across all stakeholders:

### DQ Associates (Employees, Contractors, Leaders)

**Employees**: Bring mission to motion, embed HoV in daily behaviours, move with purpose, structure, and urgency, and own outcomes.

**Contractors**: Trusted executors who integrate quickly, respect DQ systems, and contribute meaningfully with accountability.

**Leaders**: Culture activators and blueprint translators who build alignment, reinforce clarity, model perseverance, and develop others.

### DQ Customers

**Ideal Accounts**: Committed to improving life transactions, open to structured transformation, and value insight, not just output.

**Account Coach**: Drives adoption, learning, and momentum internally, bridging business goals and DQ delivery.

### DQ Partners

**Shared Solutions Vision**: Co-builders of transformation playbooks who share design-first, delivery-secure approaches.

**Solution Coach**: Champions cross-team coordination, proactively manages risks, and maintains technical and behavioural fit.

### DQ Investors

**Shared Growth Ambition**: Invest in scalable, systemic digital impact and support culture as a key to long-term value.

**Growth Coach**: Provides strategic insight, unlocks new opportunities, and encourages bold moves aligned to mission.

## Fit Is the Future

The DQ Persona protects the integrity of our vision while scaling impact. We don''t just choose people who can do the work, we partner with those who amplify the mission through mindset, behaviour, and belief in better digital futures.

> "In the economy ahead, cultural fit won''t be a nice-to-have, it will be the single most important driver of real, scalable transformation."

## Key Takeaways

- **Persona** defines who you are as a Qatalyst
- Internalizing it helps you align actions with DQ''s mission and culture
- Proactive, perceptive, precise decisions foster collaboration and impact
- Living the Persona allows strategic growth and sustained excellence

## Pro Tip

Before any task or meeting, ask yourself:

**"Which part of the DQ Persona should I bring here?"**

Focusing on purpose, perceptiveness, proactivity, perseverance, and precision ensures work is impactful, aligned, and credible.',
  last_updated_at = NOW()
WHERE slug = 'dq-persona' OR slug = 'ghc-persona' OR title LIKE '%Persona%Identity%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-persona',
  'GHC Competency 3: Persona (Identity)',
  'The Persona competency articulates who we are as Qatalysts, what behaviours make us effective, and how we show up to deliver impact. It''s your roadmap for working effectively with teams, clients, partners, and the broader ecosystem.',
  '# Introduction

Every transformation journey begins with people. At DQ, it''s not just about hiring talent, it''s about finding fit. The Persona competency articulates who we are as Qatalysts, what behaviours make us effective, and how we show up to deliver impact.

Whether you''re new to DQ or have been contributing for years, understanding the Persona helps you:

- **Align** with our culture
- **Make smarter decisions**
- **Thrive** in your role

It''s your roadmap for working effectively with teams, clients, partners, and the broader ecosystem.

## What Persona Means at DQ

The Persona is the shared identity of every Qatalyst. It describes the traits and behaviours that consistently drive impact and ensures alignment across roles, projects, and teams.

At its core, the DQ Persona emphasizes five key traits:

### Purpose-driven
Anchored in the "why," connecting daily work to lasting value.

### Perceptive
Aware of systems, signals, and context to make informed decisions.

### Proactive
Initiating, anticipating, and moving work forward without waiting.

### Persevering
Resilient and focused even in ambiguity or under pressure.

### Precise
Executing with clarity, craft, and quality as non-negotiables.

Together, these traits define how Qatalysts think, act, and collaborate shaping every interaction, decision, and outcome.

## Applying Persona in Your Role

Understanding and embodying the Persona is practical, not abstract. It guides you to:

- **Collaborate better** - Align with teammates through shared traits and expectations.
- **Navigate ambiguity** - Use perceptiveness and proactivity to make confident decisions.
- **Deliver impact consistently** - Combine purpose, perseverance, and precision in every task.
- **Build trust and credibility** - Demonstrate reliability, clarity, and accountability in all interactions.

By applying the Persona, you contribute naturally to a high-performing team and a culture that sustains excellence.

## Growing with Persona

The Persona evolves as you gain experience. By living these traits, you can:

- **Develop leadership qualities** by influencing others through example
- **Improve strategic thinking** by anticipating challenges and opportunities
- **Strengthen professional relationships** through clarity and empathy
- **Increase your impact** by combining initiative with disciplined execution

Your Persona is your operating identity, the lens through which every challenge, task, and opportunity is approached.

## DQ Persona in the Ecosystem

The DQ Persona extends beyond employees. Success requires alignment across all stakeholders:

### DQ Associates (Employees, Contractors, Leaders)

**Employees**: Bring mission to motion, embed HoV in daily behaviours, move with purpose, structure, and urgency, and own outcomes.

**Contractors**: Trusted executors who integrate quickly, respect DQ systems, and contribute meaningfully with accountability.

**Leaders**: Culture activators and blueprint translators who build alignment, reinforce clarity, model perseverance, and develop others.

### DQ Customers

**Ideal Accounts**: Committed to improving life transactions, open to structured transformation, and value insight, not just output.

**Account Coach**: Drives adoption, learning, and momentum internally, bridging business goals and DQ delivery.

### DQ Partners

**Shared Solutions Vision**: Co-builders of transformation playbooks who share design-first, delivery-secure approaches.

**Solution Coach**: Champions cross-team coordination, proactively manages risks, and maintains technical and behavioural fit.

### DQ Investors

**Shared Growth Ambition**: Invest in scalable, systemic digital impact and support culture as a key to long-term value.

**Growth Coach**: Provides strategic insight, unlocks new opportunities, and encourages bold moves aligned to mission.

## Fit Is the Future

The DQ Persona protects the integrity of our vision while scaling impact. We don''t just choose people who can do the work, we partner with those who amplify the mission through mindset, behaviour, and belief in better digital futures.

> "In the economy ahead, cultural fit won''t be a nice-to-have, it will be the single most important driver of real, scalable transformation."

## Key Takeaways

- **Persona** defines who you are as a Qatalyst
- Internalizing it helps you align actions with DQ''s mission and culture
- Proactive, perceptive, precise decisions foster collaboration and impact
- Living the Persona allows strategic growth and sustained excellence

## Pro Tip

Before any task or meeting, ask yourself:

**"Which part of the DQ Persona should I bring here?"**

Focusing on purpose, perceptiveness, proactivity, perseverance, and precision ensures work is impactful, aligned, and credible.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-persona' OR slug = 'ghc-persona' OR title LIKE '%Persona%Identity%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-persona' OR slug = 'ghc-persona' OR title LIKE '%Persona%Identity%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-persona' OR slug = 'ghc-persona' OR title LIKE '%Persona%Identity%';