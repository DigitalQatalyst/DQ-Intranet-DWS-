-- Update Agile SoS (System of Systems / Governance) guide with correct content
-- This will replace any existing content in the dq-agile-sos guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-agile-sos';

-- Step 2: Update with Agile SoS content
UPDATE public.guides
SET
  title = 'GHC Competency: Agile SoS (Governance)',
  summary = 'Governance can guide without slowing down. Discover how Agile SoS keeps teams aligned, ensures quality, and maintains direction in a fast-moving environment.',
  body = '# Introduction

At DQ, governance isn''t about slowing us down, it''s about steering us forward. The Agile System of Systems (SoS) ensures that, even as we move fast and tackle complex projects, everything we do remains aligned, high-quality, and impactful. Think of it as the framework that keeps all the moving parts of DQ coordinated and coherent, without stifling creativity or agility.

## Why Agile SoS Matters

Whether you''re a new joiner learning how the organisation operates or an existing associate responsible for delivering multiple projects, Agile SoS provides clarity and structure:

- **New joiners** gain a clear understanding of how decisions are made, who owns what, and how success is measured, helping them integrate confidently into projects and teams.
- **Existing associates** use it to align cross-functional teams, track quality and outcomes, and ensure every initiative drives value, even in fast-changing circumstances.

In short, Agile SoS makes it possible for everyone at DQ to move quickly without losing direction or coherence.

## What Agile SoS Looks Like in Practice

Agile SoS is built on four interconnected systems, each ensuring that governance supports action rather than bureaucracy:

- **System of Governance (SoG)** - Sets strategic direction and establishes the operating rhythm
- **System of Quality (SoQ)** - Reinforces excellence and develops mastery across teams
- **System of Value (SoV)** - Defines impact, aligns outcomes, and tracks results
- **System of Discipline (SoD)** - Addresses root causes of friction, ensuring smooth operations

By combining these systems, DQ ensures that strategy, quality, and outcomes are always connected, letting teams act confidently knowing they''re aligned with organisational priorities.

## How You Can Apply Agile SoS

Engaging with Agile SoS means you can:

- Understand the why behind every decision and action
- Ensure your work aligns with broader organisational goals
- Identify potential risks or blockers before they escalate
- Contribute to a culture of continuous improvement and accountability

For new joiners, this is your roadmap for learning how DQ operates at scale. For experienced associates, it provides a steering mechanism to coordinate complex projects and teams effectively.

## Governance in Action

Agile SoS relies on practical routines and tools that embed governance into daily work:

- **Alignment Meetings** - Ensure strategic priorities are communicated and understood
- **Quality Reviews** - Assess work output and provide feedback for continuous improvement
- **Outcome Tracking** - Monitor value delivered to clients and stakeholders
- **Root Cause Analysis** - Solve underlying challenges, not just symptoms

These practices help everyone stay on track, maintain quality, and deliver value consistently.

## Key Takeaways

Agile SoS is the steering wheel of DQ. Mastering it means:

- Moving fast without losing direction
- Ensuring every project delivers measurable value
- Coordinating effectively across teams and initiatives
- Embedding discipline, quality, and alignment into daily work

## Pro Tip

Whenever you start or review a task, ask: "Does this follow our governance framework and deliver clear value?" Agile SoS ensures your work is strategic, aligned, and accountable, helping you succeed from your first day and at every level of responsibility at DQ.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-sos';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-agile-sos';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-agile-sos' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-agile-sos'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
