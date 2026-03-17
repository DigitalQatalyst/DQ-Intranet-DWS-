-- Update Persona (Identity) guide with correct content
-- This will replace any existing content in the dq-persona guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-persona';

-- Step 2: Update with Persona content
UPDATE public.guides
SET
  title = 'GHC Competency: Persona (Identity)',
  summary = 'Transformation begins with people. Understand the traits and behaviors of high-impact Qatalysts who drive meaningful outcomes across every project.',
  body = '# Introduction

Every transformation journey begins with people. At DQ, we''ve learned that it''s not just about hiring talent, it''s about finding fit. The Persona competency defines who we are as Qatalysts, what behaviours make us effective, and how we show up to deliver impact.

Whether you''re new to DQ or have been contributing for years, understanding the Persona helps you align with the culture, make smarter decisions, and thrive in your role. It''s your roadmap to working effectively with your team, clients, and partners.

## What Persona Means at DQ

The Persona is the shared identity of every Qatalyst. It describes the traits and behaviours that consistently drive impact, ensuring alignment across roles, projects, and teams.

At its core, the DQ Persona emphasizes five key traits:

- **Purpose-driven** - Anchored in the "why," always aligning actions with DQ''s mission.
- **Perceptive** - Aware of systems, signals, and context to make informed choices.
- **Proactive** - Acting ahead of problems, taking initiative to move things forward.
- **Persevering** - Resilient and unshaken when facing ambiguity or challenges.
- **Precise** - Making clarity, craft, and quality non-negotiable in every task.

Together, these traits define how Qatalysts think, act, and collaborate shaping every interaction and decision.

## Applying Persona in Your Role

Understanding and embodying the Persona is practical, not abstract. In your daily work, it helps you:

- Collaborate better - Align with teammates by understanding shared traits and expectations
- Navigate ambiguity - Use perceptiveness and proactivity to make decisions confidently
- Deliver impact consistently - Combine purpose, perseverance, and precision in every task
- Build trust and credibility - Demonstrate reliability and clarity in all interactions

By applying the Persona, you naturally contribute to a high-performing team and a culture that sustains excellence.

## Growing with Persona

The Persona evolves as you gain experience. By living these traits, you can:

- Develop leadership qualities by influencing others through example
- Improve strategic thinking by anticipating challenges and opportunities
- Strengthen professional relationships by communicating with clarity and empathy
- Increase your impact by combining initiative with disciplined execution

Your Persona is your operating identity, the lens through which every challenge, task, and opportunity is approached.

## Key Takeaways

Persona (Identity) defines who you are as a Qatalyst. By internalizing and applying it, you:

- Align your actions with DQ''s mission and culture
- Make proactive, perceptive, and precise decisions
- Collaborate effectively across teams, projects, and clients
- Amplify your impact and grow strategically within the organisation

## Pro Tip

Before taking on a task or joining a meeting, ask yourself: "Which part of the DQ Persona should I bring here?" Focusing on purpose, perceptiveness, proactivity, perseverance, and precision ensures your work is impactful, aligned, and credible.',
  last_updated_at = NOW()
WHERE slug = 'dq-persona';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-persona';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-persona' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-persona'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
