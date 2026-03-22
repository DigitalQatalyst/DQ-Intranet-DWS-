-- Update House of Values (Culture) guide content
-- This script updates the dq-hov guide in Supabase with properly formatted markdown
-- Run this in Supabase SQL Editor

-- Step 1: Check current content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as current_body_length,
  LEFT(body, 200) as current_preview
FROM public.guides
WHERE slug = 'dq-hov';

-- Step 2: Update with formatted content
UPDATE public.guides
SET 
  title = 'House of Values (Culture)',
  summary = 'Culture isn''t accidental; it''s designed. Discover how the DQ House of Values (HoV) shapes behaviors, collaboration, and trust, making every Qatalyst a co-creator of excellence.',
  body = '# Introduction

At DigitalQatalyst, we know that culture is not a vibe, it''s a system. Within the Golden Honeycomb of Competencies (GHC), the House of Values (HoV) is the central pillar that defines how we think, behave, and build trust. It''s the cultural operating system that guides every Qatalyst, whether you''re a new joiner finding your feet or an experienced associate navigating complex projects.

Culture will happen with or without intention. At DQ, we''ve made the choice to shape it deliberately. The HoV is our blueprint for what good looks like, helping every Qatalyst respond effectively when stakes are high, timelines are tight, or clarity is needed most.

## Why the HoV Matters

The House of Values does more than provide a framework, it creates a foundation for growth, collaboration, and trust. It defines the emotional, operational, and behavioral norms that guide how we show up within teams, with clients, and across the organisation.

For new joiners, it provides a clear playbook for thriving. For existing associates, it acts as a reminder of the standards that make DQ distinctive: high-performance mindsets, consistent delivery, and a culture of trust. The HoV turns employees into co-architects of DQ''s excellence, not just task-doers.

## The Three Mantras of the HoV

At the heart of the House of Values are three mantras, each reinforced by Guiding Values. Together, they structure DQ''s culture from foundation to roof:

### 1. Self-Development

**"We grow ourselves and others through every experience."**

Growth at DQ is intentional. Every interaction, project, and challenge is an opportunity to develop skills, resilience, and emotional intelligence.

**Guiding Values:**

- **Emotional Intelligence** – Stay calm, aware, and accountable under pressure
- **Growth Mindset** – Use feedback and failure to drive evolution

### 2. Lean Working

**"We pursue clarity, efficiency, and prompt outcomes in everything we do."**

Efficiency and clarity are critical. Lean Working ensures that ideas are turned into meaningful outcomes with speed and structure.

**Guiding Values:**

- **Purpose** – Stay connected to why the work matters
- **Perceptive** – Anticipate needs and make thoughtful choices
- **Proactive** – Take initiative and move things forward
- **Perseverance** – Push through setbacks with focus
- **Precision** – Sweat the details that drive performance

### 3. Value Co-Creation

**"We partner with others to create greater impact together."**

Collaboration isn''t optional; it''s essential. Value Co-Creation emphasizes teamwork, trust, and shared responsibility to maximize impact.

**Guiding Values:**

- **Customer** – Design with empathy for those we serve
- **Learning** – Remain open, curious, and teachable
- **Collaboration** – Work as one, not in silos
- **Responsibility** – Own decisions and consequences
- **Trust** – Build honesty, clarity, and consistency

## Impact Across the Ecosystem

The HoV influences every part of DQ''s ecosystem:

- **For Qatalysts:** Clarifies how to behave, fosters belonging, and embeds high-performance mindsets into daily work.
- **For Customers:** Ensures consistent delivery, faster engagement, and trust in every interaction.
- **For Investors:** Demonstrates institutionalised culture, reducing scaling risk and signaling readiness for growth.

## Measuring & Evolving Culture

Culture is never static. DQ uses the Competing Values Framework (CVF) to track and guide cultural evolution along two axes: Flexibility vs. Stability and Internal vs. External Focus.

Over time, the company has moved from a hierarchy-heavy culture toward a more agile, innovative, and externally aware model. Continuous assessment ensures Qatalysts can adapt, collaborate, and deliver with precision while keeping culture alive and actionable.

## Call to Action for Qatalysts

Culture at DQ is a living system – every Qatalyst contributes. To fully embrace the HoV:

- Lead with the mantras in mind, not just the tasks
- Collaborate openly and co-create solutions
- Embed the guiding values into every project and interaction
- Reflect on how your behaviors shape team culture

Whether you''re just starting or a seasoned associate, your engagement with the HoV determines both your growth and DQ''s ability to deliver impact consistently.

## Pro Tip

Keep the HoV close in mind daily. Culture isn''t just what''s taught — it''s what''s practiced. Every decision, every interaction, and every project is a chance to live the mantras, strengthen trust, and build a legacy of excellence.',
  last_updated_at = NOW()
WHERE slug = 'dq-hov';

-- Step 3: Verify the update
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as new_body_length,
  LEFT(body, 200) as new_preview
FROM public.guides
WHERE slug = 'dq-hov';

-- Step 4: Check for duplicates (should be OK)
SELECT * FROM public.identify_ghc_duplicates();
