-- Update GHC Competency 7: Agile 6xD (Products) with new comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-agile-6xd';

-- Step 2: Update the Agile 6xD guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 07: Agile 6xD (Products)',
  summary = 'Transformation is a living process. Explore the six digital perspectives that guide DQ in building repeatable, scalable, and high-impact change.',
  body = '# Introduction

At DQ, transformation isn''t something we just talk about, it''s something we design, build, and scale. The Agile 6xD framework turns complex digital transformations into repeatable, measurable, and evolving processes.

Agile 6xD is not a one-off project playbook; it is a living system. Every initiative is designed to deliver value, grow capabilities, and adapt to change.

Whether you''re joining DQ or have been here for years, Agile 6xD helps you navigate our fast-moving ecosystem of clients, frameworks, blueprints, governance rooms, and delivery rhythms in a structured, actionable way.

## Why Agile 6xD Matters

Agile 6xD provides clarity for everyone at DQ:

- **New joiners** gain a clear understanding of the six digital perspectives guiding every product and transformation, providing context for their work.
- **Existing associates** can leverage Agile 6xD to align teams, standardise delivery, and scale impact across multiple projects.

This framework ensures everyone moves in the same direction—creating value while staying agile and adaptable in a fast-changing digital environment.

## The Six Digital Perspectives

Agile 6xD is built around six essential perspectives, each answering a critical question for organisations navigating digital transformation:

### Digital Economy (DE): Why should organisations change?
Understand market shifts, customer behaviour, and drivers of transformation. Consider Economy 4.0 imperatives such as AI, Web3, experience-led value, and the cognitive paradox.

### Digital Cognitive Organisation (DCO): Where are organisations headed?
Define the future enterprise: intelligent, adaptive, orchestrated, capable of learning and responding seamlessly.

### Digital Business Platforms (DBP): What must be built to enable transformation?
Focus on modular, integrated, data-driven systems that unify operations and make transformation scalable.

### Digital Transformation 2.0 (DT2.0): How should transformation be designed and deployed?
Introduce methods, flows, and governance that make enterprise-wide change repeatable, measurable, and outcome-driven.

### Digital Worker & Workspace (DW:WS): Who delivers the change, and how do they work?
Ensure people, roles, skills, and digitally-enabled environments evolve alongside technology for effective and sustainable delivery.

### Digital Accelerators (Tools): When will value be realised, and how fast?
Accelerate execution and measurable impact through the right systems, platforms, and strategies, including the Digital Transformation Management Framework (DTMF) that aligns all products within a cohesive structure.

Together, these perspectives form a transformation compass helping organisations plan, act, and continuously learn.

## The 6xD Portfolio: Operationalising Transformation

The 6xD portfolio is not just a collection of tools, it is the external expression of DQ''s internal excellence:

Vision, Culture, Identity, Work Systems, Governance, Value Flows - everything that underpins our approach is packaged into actionable, scalable offerings. Every 6xD product is designed with intent, reflecting the standards we uphold internally and the outcomes we expect externally.

### Core Products

**DTMP (Digital Transformation Management Platform)**  
A data-driven platform that centralises transformation projects, tracking progress, analytics, and compliance to accelerate ROI.

**DTMA (Digital Transformation Management Academy)**  
AI-personalised, practice-driven online courses equipping professionals with skills for DCOs, DBPs, and transformation leadership.

**DTMaaS (Digital Transformation as a Service)**  
A self-service marketplace enabling scalable, flexible, and cost-effective transformation execution using reusable accelerators and templates.

**DTMI (Digital Transformation Management Insights)**  
An AI-powered knowledge platform curating actionable insights and strategies to help leaders navigate complex transformations.

**DTO4T (Digital Twin of Organisation for Transformation)**  
An AI-driven diagnostic and automation platform that guides organisations toward becoming DCOs faster, cheaper, and with measurable results.

**DTMB (Digital Transformation Management Book)**  
A comprehensive guide and playbook providing frameworks, case studies, and strategies for leading digital transformation.

**Plant 4.0**  
Industrial Operations and Performance Platform integrating assets, automation, energy, and OT cybersecurity to drive connected, autonomous, and optimised industrial operations.

**DWS (Digital Work Solution)**  
Core execution platform unifying digital, functional, and physical work environments into a single structured system of work.

## DQ Blueprints | Accelerating DCOs

Transformation often fails not for lack of vision, but because organisations lack a consistent way to plan, coordinate, and scale change.

DQ Blueprints address this gap:

- **Standardised methodology**: Connect strategy, design, execution, and governance.
- **Integrated tools and templates**: Ready-to-use resources linking people, systems, and workflows.
- **Simulation and scenario planning**: Test assumptions and forecast outcomes before acting.
- **Scalable design**: Works across teams, business units, and geographies without losing consistency.

### Benefits:
- Reduces cost and effort by avoiding repeated reinvention
- Speeds delivery through proven methods and assets
- Ensures consistent results across multiple initiatives
- Embeds DQ''s approach in every engagement, making transformation repeatable and sustainable

## How You Can Apply Agile 6xD

Engaging with Agile 6xD allows you to:

- See how every initiative aligns with the bigger digital mission
- Understand what needs to be built, by whom, and why
- Align your work with measurable outcomes and client impact
- Use a repeatable framework to plan, execute, and scale transformation

For new joiners, Agile 6xD provides structure and clarity. For experienced associates, it acts as a strategic guide for delivering consistent, scalable, and measurable transformation.

## Why It Works

Agile 6xD works because it balances vision, strategy, and execution:

- A clear map of what drives change
- Repeatable processes for planning and delivery
- Alignment across teams, platforms, and tools

It allows DQ to deliver transformation with confidence, ensuring impact is fast, measurable, and sustainable.

## Key Takeaways

Agile 6xD is more than a framework - it''s how DQ:

- Designs transformation end-to-end
- Ensures alignment from strategy to delivery
- Builds scalable and adaptable digital capabilities
- Continuously measures and enhances impact

## Pro Tip

Whenever you engage in a project or product initiative, ask:

"Which perspective of the 6xD am I influencing, and how does this create real value for the client and organisation?"

Keeping Agile 6xD in mind ensures your work contributes to repeatable success, scalable transformation, and measurable impact, whether you''re just joining DQ or leading complex programs.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-6xd';

-- Step 3: If the guide doesn't exist, insert it (simplified version)
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-agile-6xd',
  'GHC Competency 07: Agile 6xD (Products)',
  'Transformation is a living process. Explore the six digital perspectives that guide DQ in building repeatable, scalable, and high-impact change.',
  '# Introduction

At DQ, transformation isn''t something we just talk about, it''s something we design, build, and scale. The Agile 6xD framework turns complex digital transformations into repeatable, measurable, and evolving processes.

Agile 6xD is not a one-off project playbook; it is a living system. Every initiative is designed to deliver value, grow capabilities, and adapt to change.

Whether you''re joining DQ or have been here for years, Agile 6xD helps you navigate our fast-moving ecosystem of clients, frameworks, blueprints, governance rooms, and delivery rhythms in a structured, actionable way.

## Why Agile 6xD Matters

Agile 6xD provides clarity for everyone at DQ:

- **New joiners** gain a clear understanding of the six digital perspectives guiding every product and transformation, providing context for their work.
- **Existing associates** can leverage Agile 6xD to align teams, standardise delivery, and scale impact across multiple projects.

This framework ensures everyone moves in the same direction—creating value while staying agile and adaptable in a fast-changing digital environment.

## The Six Digital Perspectives

Agile 6xD is built around six essential perspectives, each answering a critical question for organisations navigating digital transformation:

### Digital Economy (DE): Why should organisations change?
Understand market shifts, customer behaviour, and drivers of transformation. Consider Economy 4.0 imperatives such as AI, Web3, experience-led value, and the cognitive paradox.

### Digital Cognitive Organisation (DCO): Where are organisations headed?
Define the future enterprise: intelligent, adaptive, orchestrated, capable of learning and responding seamlessly.

### Digital Business Platforms (DBP): What must be built to enable transformation?
Focus on modular, integrated, data-driven systems that unify operations and make transformation scalable.

### Digital Transformation 2.0 (DT2.0): How should transformation be designed and deployed?
Introduce methods, flows, and governance that make enterprise-wide change repeatable, measurable, and outcome-driven.

### Digital Worker & Workspace (DW:WS): Who delivers the change, and how do they work?
Ensure people, roles, skills, and digitally-enabled environments evolve alongside technology for effective and sustainable delivery.

### Digital Accelerators (Tools): When will value be realised, and how fast?
Accelerate execution and measurable impact through the right systems, platforms, and strategies, including the Digital Transformation Management Framework (DTMF) that aligns all products within a cohesive structure.

Together, these perspectives form a transformation compass helping organisations plan, act, and continuously learn.

## The 6xD Portfolio: Operationalising Transformation

The 6xD portfolio is not just a collection of tools, it is the external expression of DQ''s internal excellence:

Vision, Culture, Identity, Work Systems, Governance, Value Flows - everything that underpins our approach is packaged into actionable, scalable offerings. Every 6xD product is designed with intent, reflecting the standards we uphold internally and the outcomes we expect externally.

### Core Products

**DTMP (Digital Transformation Management Platform)**  
A data-driven platform that centralises transformation projects, tracking progress, analytics, and compliance to accelerate ROI.

**DTMA (Digital Transformation Management Academy)**  
AI-personalised, practice-driven online courses equipping professionals with skills for DCOs, DBPs, and transformation leadership.

**DTMaaS (Digital Transformation as a Service)**  
A self-service marketplace enabling scalable, flexible, and cost-effective transformation execution using reusable accelerators and templates.

**DTMI (Digital Transformation Management Insights)**  
An AI-powered knowledge platform curating actionable insights and strategies to help leaders navigate complex transformations.

**DTO4T (Digital Twin of Organisation for Transformation)**  
An AI-driven diagnostic and automation platform that guides organisations toward becoming DCOs faster, cheaper, and with measurable results.

**DTMB (Digital Transformation Management Book)**  
A comprehensive guide and playbook providing frameworks, case studies, and strategies for leading digital transformation.

**Plant 4.0**  
Industrial Operations and Performance Platform integrating assets, automation, energy, and OT cybersecurity to drive connected, autonomous, and optimised industrial operations.

**DWS (Digital Work Solution)**  
Core execution platform unifying digital, functional, and physical work environments into a single structured system of work.

## DQ Blueprints | Accelerating DCOs

Transformation often fails not for lack of vision, but because organisations lack a consistent way to plan, coordinate, and scale change.

DQ Blueprints address this gap:

- **Standardised methodology**: Connect strategy, design, execution, and governance.
- **Integrated tools and templates**: Ready-to-use resources linking people, systems, and workflows.
- **Simulation and scenario planning**: Test assumptions and forecast outcomes before acting.
- **Scalable design**: Works across teams, business units, and geographies without losing consistency.

### Benefits:
- Reduces cost and effort by avoiding repeated reinvention
- Speeds delivery through proven methods and assets
- Ensures consistent results across multiple initiatives
- Embeds DQ''s approach in every engagement, making transformation repeatable and sustainable

## How You Can Apply Agile 6xD

Engaging with Agile 6xD allows you to:

- See how every initiative aligns with the bigger digital mission
- Understand what needs to be built, by whom, and why
- Align your work with measurable outcomes and client impact
- Use a repeatable framework to plan, execute, and scale transformation

For new joiners, Agile 6xD provides structure and clarity. For experienced associates, it acts as a strategic guide for delivering consistent, scalable, and measurable transformation.

## Why It Works

Agile 6xD works because it balances vision, strategy, and execution:

- A clear map of what drives change
- Repeatable processes for planning and delivery
- Alignment across teams, platforms, and tools

It allows DQ to deliver transformation with confidence, ensuring impact is fast, measurable, and sustainable.

## Key Takeaways

Agile 6xD is more than a framework - it''s how DQ:

- Designs transformation end-to-end
- Ensures alignment from strategy to delivery
- Builds scalable and adaptable digital capabilities
- Continuously measures and enhances impact

## Pro Tip

Whenever you engage in a project or product initiative, ask:

"Which perspective of the 6xD am I influencing, and how does this create real value for the client and organisation?"

Keeping Agile 6xD in mind ensures your work contributes to repeatable success, scalable transformation, and measurable impact, whether you''re just joining DQ or leading complex programs.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-agile-6xd'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-agile-6xd';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-agile-6xd';