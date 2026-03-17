-- Update Agile Flows (Value Streams) guide with correct content
-- This will replace any existing content in the dq-agile-flows guide

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-agile-flows';

-- Step 2: Update with Agile Flows content
UPDATE public.guides
SET
  title = 'GHC Competency: Agile Flows (Value Streams)',
  summary = 'Work flows end-to-end, not in silos. See how Agile Flows map value streams from opportunity to client impact, ensuring clarity, ownership, and measurable outcomes.',
  body = '# Introduction

At DQ, ideas alone aren''t enough, what matters is getting them across the finish line with impact, clarity, and alignment. That''s the purpose of Agile Flows, our system for orchestrating work across end-to-end value streams. It ensures that every project, task, and initiative flows seamlessly from concept to delivery, connecting teams, tools, and processes in a way that drives real outcomes.

## Why Agile Flows Matters

Whether you''re a new joiner finding your footing or an existing associate managing complex projects, understanding Agile Flows is critical:

- **New joiners** learn how work moves across teams, where responsibilities lie, and how their contribution fits into the bigger picture.
- **Existing associates** gain clarity on coordination, handoffs, and dependencies, enabling smoother execution, reduced duplication, and faster delivery.

Agile Flows ensures everyone at DQ can see the path from ideas to impact, making work purposeful and predictable, even in fast-paced environments.

## The Six Stages of the Value Chain

Agile Flows is structured around six stages that cover the full lifecycle of work and value delivery:

- **Market to Lead** - Where opportunities begin. Marketing and ecosystem teams generate awareness, attract interest, and shape demand.
- **Lead to Opportunity** - Where interest becomes intent. Business development qualifies leads, frames client needs, and prepares proposals.
- **Opportunity to Order** - Where solutions are formalized. Cross-functional teams align on scope, timeline, and delivery approach.
- **Order to Fulfillment** - Where delivery begins. Product, engineering, and delivery teams collaborate to design, build, and launch solutions.
- **Fulfillment to Revenue** - Where outcomes are recognized. Operations and finance track delivery, measure value, and ensure agreements are fulfilled.
- **Revenue to Loyalty** - Where value is sustained. Customer teams drive retention, gather insights, and improve long-term relationships.

This structured approach ensures that work is visible, measurable, and coordinated across teams, enabling DQ to deliver impact as one organisation.

## How You Can Apply Agile Flows

Engaging with Agile Flows means you can:

- Understand how your work connects to the overall delivery chain
- Collaborate effectively across departments and teams
- Anticipate handoffs and dependencies to avoid delays
- Identify opportunities for improvement and efficiency

For new joiners, this is your map to understand DQ''s workflow. For experienced associates, it''s a tool to orchestrate complex projects smoothly, ensuring that every initiative delivers value on time.

## Why It Works

Agile Flows works because it treats work as a system, not isolated tasks. By focusing on value streams rather than silos:

- Duplicated effort is eliminated
- Bottlenecks and blockers are identified early
- Teams can coordinate in real-time
- Client and organisational outcomes are prioritized

This systemic approach allows DQ to scale excellence without sacrificing speed or quality.

## Key Takeaways

Agile Flows is about making work visible, connected, and efficient. Mastering it means:

- Seeing the end-to-end flow of work
- Understanding your role in driving value
- Collaborating seamlessly across teams
- Delivering outcomes that truly matter to clients

## Pro Tip

Whenever you start a task or hand it off, ask yourself: "How does this connect to the value chain, and who else depends on it?" By keeping Agile Flows in mind, you ensure your work contributes to seamless delivery, measurable impact, and coordinated execution, whether you''re just starting at DQ or leading complex projects.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-flows';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-agile-flows';

-- Step 4: Verify it's different from dq-ghc
SELECT 
  'dq-agile-flows' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-agile-flows'
UNION ALL
SELECT 
  'dq-ghc' as guide,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 100) as preview
FROM public.guides
WHERE slug = 'dq-ghc';
