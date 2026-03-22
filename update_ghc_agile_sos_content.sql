-- Update GHC Competency 5: Agile SoS (Governance) with comprehensive content
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the guide exists
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length
FROM public.guides
WHERE slug = 'dq-agile-sos' OR slug = 'ghc-agile-sos' OR slug = 'agile-sos' OR title LIKE '%Agile SoS%Governance%';

-- Step 2: Update the Agile SoS guide with new content
UPDATE public.guides
SET
  title = 'GHC Competency 5: Agile SoS (Governance)',
  summary = 'Agile System of Systems (SoS) ensures that, even as we move fast and tackle complex projects, everything we do remains aligned, high-quality, and impactful. It''s the framework that keeps all the moving parts of DQ coordinated and coherent.',
  body = '# Introduction

At DQ, governance isn''t about slowing us down, it''s about steering us forward. The Agile System of Systems (SoS) ensures that, even as we move fast and tackle complex projects, everything we do remains aligned, high-quality, and impactful. Think of it as the framework that keeps all the moving parts of DQ coordinated and coherent, without stifling creativity or agility.

## What is Agile SoS?

Agile SoS is the operational backbone of governance at DQ. It is a living system that connects strategy, quality, value, and discipline ensuring work is purposeful, measurable, and aligned across the organization. It allows teams to act confidently, knowing they are empowered and aligned to organizational priorities.

## Why Agile SoS Matters

Whether you''re a new joiner learning how the organization operates or an existing associate delivering multiple projects, Agile SoS provides clarity and structure:

**New joiners**: Understand how decisions are made, who owns what, and how success is measured, helping them integrate confidently into projects and teams.

**Existing associates**: Align cross-functional teams, track quality and outcomes, and ensure every initiative drives meaningful value, even in fast-changing circumstances.

In short: Agile SoS enables everyone at DQ to move fast without losing direction or coherence.

## DQ Agile Governance | Continuous Improvement

Governance at DQ is a living system. Its strength lies in continuous improvement, generating insights that feed directly into action. This ensures governance drives progress, sharpens decisions, and maintains accountability across every level of the organization.

## Governance vs Management

Governance and management are distinct but interdependent:

**Governance**: Defines rules, priorities, and operating principles. Sets the framework for how work should be approached.

**Management**: Turns that framework into action allocating resources, coordinating teams, and delivering results day-to-day.

Together, they create a dynamic balance: governance charts the course, management steers the ship.

## Governance vs Micro-Management

Micro-management narrows focus, slows decisions, and creates dependency. Agile governance expands autonomy while maintaining discipline by providing:

- **Clear expectations** and operating principles
- **Defined boundaries** for decision-making
- **Shared accountability** mechanisms

## Governance 4 Improvement

### Insight
Transforms scattered data into collective intelligence:

- Provides leaders and teams with timely visibility into performance, risk, and opportunity
- Shifts decisions from reactive firefighting to proactive foresight
- Enables anticipation of challenges before they escalate

### Alignment
Ensures strategic priorities translate into coordinated action:

- Teams and initiatives move in the same direction
- Connects vision to execution, creating collective progress rather than isolated effort

### Work Efficiency
Focuses effort where it matters most:

- Removes duplication
- Defines accountabilities
- Streamlines decision paths

By embedding discipline into prioritization and decision-making, efficiency becomes sustainable.

## Agile SoS | System of Systems

Agile SoS is built on four interconnected systems, ensuring governance is embedded into day-to-day work:

- **System of Governance (SoG)** - how we steer
- **System of Quality (SoQ)** - how we uphold standards
- **System of Value (SoV)** - how we define and deliver impact
- **System of Discipline (SoD)** - how we resolve what holds us back

These systems are the scaffolding through which competencies become contributions and contributions become sustainable transformation.

## SoG | System of Governance

SoG maintains alignment between intent and action:

- Integrates strategic direction from executives with daily delivery rhythms
- Operates through vertical governance (BU Plans) and horizontal governance (daily scrums, check-ins, weekly updates)
- Uses functional trackers to connect vision to execution

### Functional Tracker Anchors:

**Work Areas**: Defines responsibilities

**Purpose**: Clarifies why work exists and its value

**Priority**: Focuses on what matters most

**Tasks**: Outlines specific actions to achieve goals

Governance here is orientation, not overhead enabling speed without fragmentation.

## SoQ | System of Quality

Quality is engineered into the organization, not assumed:

- Reinforced through rituals, review structures, and cultural expectations
- Tied to capacity excellence requires equipping people to meet standards

### Layers of SoQ:

**QPMS (Quality & Performance Management System)**: Houses standards, templates, playbooks

**Agile 7S Framework**: Ensures structured clarity, collaboration, and improvement at the task level

**Guidelines & Forums**: Embeds quality into daily work; e.g., Effective Forum Initiative

SoQ ensures speed doesn''t compromise craft, and quality is owned by everyone.

## SoV | System of Value

Value is designed in from the start:

- Aligns every product, service, and initiative to measurable, meaningful impact
- Connects design → delivery → outcomes → business relevance
- Encourages all tasks to answer: "What value will this create, and how will it be measured?"

Value is assessed both externally (client outcomes) and internally (effort vs. contribution).

## SoD | System of Discipline

SoD addresses persistent issues and friction points:

- Not a performance management layer, but a self-correction system
- Ensures long-term integrity and adherence to standards
- Uses tools like STOP Protocol to pause, reflect, and intervene when needed

Discipline here is continuity, not constraint, keeping the mission on course.

## Key Takeaways

Mastering Agile SoS ensures you can:

- **Move fast** without losing direction
- **Deliver projects** with measurable value
- **Coordinate effectively** across teams and initiatives
- **Embed discipline, quality, and alignment** into daily work

## Pro Tip

Before starting or reviewing a task, ask:

**"Does this follow our governance framework and deliver clear value?"**

Agile SoS makes your work strategic, aligned, and accountable, empowering you from day one and at every level at DQ.',
  last_updated_at = NOW()
WHERE slug = 'dq-agile-sos' OR slug = 'ghc-agile-sos' OR slug = 'agile-sos' OR title LIKE '%Agile SoS%Governance%';

-- Step 3: If the guide doesn't exist, insert it
INSERT INTO public.guides (
  slug,
  title,
  summary,
  body,
  last_updated_at
)
SELECT 
  'dq-agile-sos',
  'GHC Competency 5: Agile SoS (Governance)',
  'Agile System of Systems (SoS) ensures that, even as we move fast and tackle complex projects, everything we do remains aligned, high-quality, and impactful. It''s the framework that keeps all the moving parts of DQ coordinated and coherent.',
  '# Introduction

At DQ, governance isn''t about slowing us down, it''s about steering us forward. The Agile System of Systems (SoS) ensures that, even as we move fast and tackle complex projects, everything we do remains aligned, high-quality, and impactful. Think of it as the framework that keeps all the moving parts of DQ coordinated and coherent, without stifling creativity or agility.

## What is Agile SoS?

Agile SoS is the operational backbone of governance at DQ. It is a living system that connects strategy, quality, value, and discipline ensuring work is purposeful, measurable, and aligned across the organization. It allows teams to act confidently, knowing they are empowered and aligned to organizational priorities.

## Why Agile SoS Matters

Whether you''re a new joiner learning how the organization operates or an existing associate delivering multiple projects, Agile SoS provides clarity and structure:

**New joiners**: Understand how decisions are made, who owns what, and how success is measured, helping them integrate confidently into projects and teams.

**Existing associates**: Align cross-functional teams, track quality and outcomes, and ensure every initiative drives meaningful value, even in fast-changing circumstances.

In short: Agile SoS enables everyone at DQ to move fast without losing direction or coherence.

## DQ Agile Governance | Continuous Improvement

Governance at DQ is a living system. Its strength lies in continuous improvement, generating insights that feed directly into action. This ensures governance drives progress, sharpens decisions, and maintains accountability across every level of the organization.

## Governance vs Management

Governance and management are distinct but interdependent:

**Governance**: Defines rules, priorities, and operating principles. Sets the framework for how work should be approached.

**Management**: Turns that framework into action allocating resources, coordinating teams, and delivering results day-to-day.

Together, they create a dynamic balance: governance charts the course, management steers the ship.

## Governance vs Micro-Management

Micro-management narrows focus, slows decisions, and creates dependency. Agile governance expands autonomy while maintaining discipline by providing:

- **Clear expectations** and operating principles
- **Defined boundaries** for decision-making
- **Shared accountability** mechanisms

## Governance 4 Improvement

### Insight
Transforms scattered data into collective intelligence:

- Provides leaders and teams with timely visibility into performance, risk, and opportunity
- Shifts decisions from reactive firefighting to proactive foresight
- Enables anticipation of challenges before they escalate

### Alignment
Ensures strategic priorities translate into coordinated action:

- Teams and initiatives move in the same direction
- Connects vision to execution, creating collective progress rather than isolated effort

### Work Efficiency
Focuses effort where it matters most:

- Removes duplication
- Defines accountabilities
- Streamlines decision paths

By embedding discipline into prioritization and decision-making, efficiency becomes sustainable.

## Agile SoS | System of Systems

Agile SoS is built on four interconnected systems, ensuring governance is embedded into day-to-day work:

- **System of Governance (SoG)** - how we steer
- **System of Quality (SoQ)** - how we uphold standards
- **System of Value (SoV)** - how we define and deliver impact
- **System of Discipline (SoD)** - how we resolve what holds us back

These systems are the scaffolding through which competencies become contributions and contributions become sustainable transformation.

## SoG | System of Governance

SoG maintains alignment between intent and action:

- Integrates strategic direction from executives with daily delivery rhythms
- Operates through vertical governance (BU Plans) and horizontal governance (daily scrums, check-ins, weekly updates)
- Uses functional trackers to connect vision to execution

### Functional Tracker Anchors:

**Work Areas**: Defines responsibilities

**Purpose**: Clarifies why work exists and its value

**Priority**: Focuses on what matters most

**Tasks**: Outlines specific actions to achieve goals

Governance here is orientation, not overhead enabling speed without fragmentation.

## SoQ | System of Quality

Quality is engineered into the organization, not assumed:

- Reinforced through rituals, review structures, and cultural expectations
- Tied to capacity excellence requires equipping people to meet standards

### Layers of SoQ:

**QPMS (Quality & Performance Management System)**: Houses standards, templates, playbooks

**Agile 7S Framework**: Ensures structured clarity, collaboration, and improvement at the task level

**Guidelines & Forums**: Embeds quality into daily work; e.g., Effective Forum Initiative

SoQ ensures speed doesn''t compromise craft, and quality is owned by everyone.

## SoV | System of Value

Value is designed in from the start:

- Aligns every product, service, and initiative to measurable, meaningful impact
- Connects design → delivery → outcomes → business relevance
- Encourages all tasks to answer: "What value will this create, and how will it be measured?"

Value is assessed both externally (client outcomes) and internally (effort vs. contribution).

## SoD | System of Discipline

SoD addresses persistent issues and friction points:

- Not a performance management layer, but a self-correction system
- Ensures long-term integrity and adherence to standards
- Uses tools like STOP Protocol to pause, reflect, and intervene when needed

Discipline here is continuity, not constraint, keeping the mission on course.

## Key Takeaways

Mastering Agile SoS ensures you can:

- **Move fast** without losing direction
- **Deliver projects** with measurable value
- **Coordinate effectively** across teams and initiatives
- **Embed discipline, quality, and alignment** into daily work

## Pro Tip

Before starting or reviewing a task, ask:

**"Does this follow our governance framework and deliver clear value?"**

Agile SoS makes your work strategic, aligned, and accountable, empowering you from day one and at every level at DQ.',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.guides WHERE slug = 'dq-agile-sos' OR slug = 'ghc-agile-sos' OR slug = 'agile-sos' OR title LIKE '%Agile SoS%Governance%'
);

-- Step 4: Verify the update/insert was successful
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-agile-sos' OR slug = 'ghc-agile-sos' OR slug = 'agile-sos' OR title LIKE '%Agile SoS%Governance%';

-- Step 5: Show a preview of the content
SELECT 
  slug,
  title,
  LEFT(body, 300) as content_preview
FROM public.guides
WHERE slug = 'dq-agile-sos' OR slug = 'ghc-agile-sos' OR slug = 'agile-sos' OR title LIKE '%Agile SoS%Governance%';