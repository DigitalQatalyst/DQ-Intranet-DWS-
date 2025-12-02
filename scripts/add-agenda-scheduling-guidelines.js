import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Paraphrased, concise content
const AGENDA_SCHEDULING_SUMMARY = `Standardized approach for planning, organizing, and executing meetings and sessions at DQ. Ensures clear objectives, proper scheduling, and productive outcomes.`;

const AGENDA_SCHEDULING_BODY = `# DQ Agenda & Scheduling Guidelines

Effective agenda planning and scheduling ensure DQ operates with discipline, alignment, and efficiency. These guidelines standardize how agendas are built and sessions are scheduled to maximize productivity and create clarity for all participants.

## Definition

Agenda and scheduling practices define the structured approach for planning, organizing, and executing meetings, workshops, and sessions. This includes setting clear objectives, sharing preparatory material in advance, aligning schedules to participant availability, and ensuring each session is purposeful, time-bound, and outcome-oriented.

## Purpose

Bring order, clarity, and predictability to DQ's working rhythm. Ensure time is respected, objectives are achieved, and every session contributes to progress.

## Key Characteristics

| # | Item | Description |
|---|------|-------------|
| 01 | Clear and Purposeful | Agendas are drafted with well-defined context, purpose, and logical flow. |
| 02 | Transparent and Accessible | Agendas and schedules are shared in advance, ensuring participants can prepare. |
| 03 | Time-Disciplined | Sessions are scheduled within reasonable timeframes and strictly managed against overruns. |
| 04 | Inclusive and Aligned | Scheduling ensures all relevant participants can join, using tools like Teams scheduling assistant. |
| 05 | Documented and Traceable | Agendas, schedules, and related updates are recorded for future reference and accountability. |

## Types of Scheduling Practices

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Standard Meeting Booking | Schedule at least 24 hours in advance with a structured agenda in the invite. |
| 02 | Urgent Session Setup | Allow for flexibility in scheduling urgent sessions (exception to the 24-hour rule). |
| 03 | Recurring Meetings | Establish recurring schedules for regular Forums (e.g., Scrums, Retros) to reduce ad-hoc bookings. |
| 04 | Time-Zone Sensitivity | Account for global time differences when inviting associates from multiple regions. |
| 05 | Conflict Management | Use scheduling tools to identify and resolve calendar conflicts proactively. |

## Roles & Responsibilities

| # | Role | Action Point |
|---|-----|--------------|
| 01 | Facilitator | Owns the agenda, drives structured discussion, manages time, and ensures objectives are achieved. |
| 02 | Note-taker | Captures key points, decisions, and action items in real time and ensures proper documentation. |
| 03 | Organizer | Sends invites, checks availability, shares preparatory material, and manages scheduling logistics. |
| 04 | Participants | Prepare in advance, actively engage during the session, and respect agenda and time boundaries. |

## Agenda Design Guidelines

### Context

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | State Organizational Context | Briefly outline the current situation or challenges (e.g., growth spurt, governance gaps). |
| 02 | Link to Strategic Objectives | Clearly connect the agenda to broader organizational goals (e.g., visibility, governance, delivery performance). |
| 03 | Define the Forum | Specify why the session exists and how it contributes to ongoing governance or operational improvement. |

### Purpose

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | State the Why (Intended Impact) | Explain why the session exists and the value it must create (e.g., "Align governance to sustain growth"). |
| 02 | Make Outcomes Explicit | Name the concrete outcomes/decisions expected (approve plan, confirm KPIs, assign owners & dates) rather than "discuss." |
| 03 | Keep Purpose Concise & Action-Led | Use 1–3 verb-led bullets that directly shape agenda sequencing and time-boxing. |

### Agenda Structure

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Focus on Core Priorities | Include items that align with the forum's main mandate. |
| 02 | Sequence Logically | Group items by related themes to ensure structured discussion. |
| 03 | Allow for Open Items | Include AoB (Any other Business) to capture additional, non-planned topics. |
| 04 | Keep Agenda Time-Boxed | Allocate time for each section to prevent overruns and ensure coverage of all topics. |

### Related Materials

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Attach Relevant Documents | Link supporting materials (e.g., trackers, governance decks) directly in the invite or agenda. |
| 02 | Keep Materials Updated | Ensure related documents are refreshed before each session to avoid outdated or conflicting information. |
| 03 | Capture Outcomes in Same Space | Store meeting notes, updated trackers, and decisions in the same repository to create a single source of truth.`;

async function addAgendaSchedulingGuidelines() {
  console.log('➕ Adding DQ Agenda & Scheduling Guidelines...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Agenda%Scheduling%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  Agenda & Scheduling Guidelines already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nSkipping creation. Use update script if you need to modify.');
    return;
  }

  // Create the guide
  const slug = 'dq-agenda-scheduling-guidelines';
  const title = 'DQ Agenda & Scheduling Guidelines';

  const newGuide = {
    title: title,
    slug: slug,
    summary: AGENDA_SCHEDULING_SUMMARY,
    body: AGENDA_SCHEDULING_BODY,
    guide_type: 'Policy',
    domain: 'Guidelines',
    sub_domain: 'resources',
    unit: 'SecDevOps', // Using same unit as Forum Guidelines
    location: 'DXB', // Using same location as Forum Guidelines
    status: 'Approved'
  };

  const { data, error } = await supabase
    .from('guides')
    .insert(newGuide)
    .select();

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Successfully created DQ Agenda & Scheduling Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Summary: ${AGENDA_SCHEDULING_SUMMARY}`);
    console.log(`   Body length: ${AGENDA_SCHEDULING_BODY.length} characters`);
    console.log(`   Domain: Guidelines`);
    console.log(`   Guide Type: Policy`);
    console.log(`   Unit: SecDevOps`);
    console.log(`   Location: DXB`);
  } else {
    console.log('❌ Guide creation returned no data');
  }
}

addAgendaSchedulingGuidelines().catch(console.error);

