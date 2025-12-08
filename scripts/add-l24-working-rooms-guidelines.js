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
const L24_WORKING_ROOMS_SUMMARY = `Standardized guidelines for DQ's virtual L24 Working Rooms. Enhances collaboration, accountability, and real-time productivity by shifting from passive meetings to active daily execution.`;

const L24_WORKING_ROOMS_BODY = `# DQ L24 Working Rooms Guidelines

The DQ L24 Working Room (WR) initiative has been introduced as part of DQ's effort to enhance collaboration, accountability, and real-time productivity across all units. The concept of virtual Working Rooms represents a new way of working—shifting from meetings and discussions to active daily execution.

These guidelines standardize how all DQ associates, moderators, and teams engage within the L24 Working Rooms, ensuring clarity, discipline, and consistent delivery outcomes across factories and towers.

## Purpose

The purpose of these guidelines is to establish a unified standard for the operation of DQ's virtual L24 Working Rooms:

- Enabling associates to focus on executing concrete, day-to-day tasks rather than attending passive meetings
- Fostering a culture of practical action, peer accountability, and delivery momentum
- Ensuring structured use of Microsoft Teams as an effective collaboration environment
- Promoting alignment, focus, and consistent progress across DQ's operational ecosystem

## Structure Overview

The L24 Working Room (WR) operates under a two-tier structure to ensure efficient collaboration and task ownership:

| Level | Description |
|-------|-------------|
| 01. Unit-Level Working Room | The main collaborative space for each DQ Factory or Unit (e.g., Finance Factory). Serves as the central session hub for coordination and team updates. |
| 02. Tower / Squad-Level Breakout Rooms | Created within the main Working Room using Microsoft Teams breakout features. Each breakout represents a specific functional or operational area (e.g., Budget GPRC, Ledger Pay_Rec). |

Each Working Room session is facilitated by a Moderator, who ensures productive engagement, time discipline, and tangible outcomes throughout the day.

## Session Composition & Conduct

This section defines the key elements that shape the flow, engagement, and discipline of each session.

| Guideline | Action Point |
|-----------|--------------|
| 01. Session Kickoff | All associates must join their designated Working Room immediately after Scrum, by 9:30 AM (DXB time). |
| 02. Collaboration Format | The day is spent in active collaboration, working within unit-level rooms or tower/squad-level breakout rooms aligned to task assignments. |
| 03. CWS & Retros | All Sprint Plan Reviews (CWS) and Retrospectives are conducted in the main room at the times indicated in the meeting agenda. |
| 04. Availability Protocol | Associates stepping out must provide a clear reason and estimated return time (ETA) in the chatbot. Example: "Stepping out for client call – back by 12:15 PM." ❌ "BRB" alone is not acceptable. |
| 05. Lunch Break | A fixed break for all associates from 2:00 PM to 3:00 PM (DXB time). |
| 06. Session Continuity | Associates are expected to stay online and actively collaborate until the end of the working day. |

## Roles & Responsibilities

This section defines the responsibilities of all roles involved to ensure accountability and effective governance.

| Role | Key Responsibilities |
|------|----------------------|
| 01. Associates | Join the Working Room immediately after Scrum (by 9:30 AM DXB time). Actively work on assigned sprint tasks throughout the day. Engage on relevant Teams channels to provide visibility of progress, updates, and blockers. Collaborate effectively within breakout rooms and maintain focus on delivery. Log stepping-out reason and ETA in the chatbot (no "BRB" alone). Observe the fixed lunch break from 2:00 PM to 3:00 PM (DXB time). |
| 02. Scrum Master / Moderator | Lead and facilitate the daily Working Room session. Ensure sessions remain focused on execution and measurable progress. Monitor attendance, engagement, and task completion across associates. Actively pull in necessary resources or support to resolve blockers in real time, not just report them. Conduct CWS and Retros in the main room per the weekly agenda. Uphold DQ's culture of accountability, collaboration, and delivery momentum. Report daily progress and unresolved issues to the relevant channel. |

## Governance & Review Cycle

This section outlines the governance rhythm and review cadence designed to ensure continuous alignment, accountability, and effective execution across all Working Rooms.

| Activity | Frequency | Led By | Purpose |
|----------|-----------|--------|---------|
| 01. Daily Working Room Session | Daily (Post Scrum, 9:30 AM–EOD) | Moderator | Enable active execution, collaboration, and focus. |
| 02. Sprint Plan Review (CWS) | Weekly | Factory Lead/Tower Lead | Review sprint plan for the week and blockers. |
| 03. Retrospective | Weekly | Factory Lead/Tower Lead | Review plan vs action and reflect on performance |
| 04. Compliance Check | Weekly | EVMO Unit | Verify adherence to WR guidelines. |

## Escalation & Payroll Protocol

This section defines the escalation process and accountability measures to ensure timely resolution of issues.

| Condition | Action Required | Owner |
|-----------|-----------------|-------|
| 01. Associate repeatedly absent or inactive during WR sessions | Issue verbal reminder and report to Line Manager | Scrum Master |
| 02. Associate leaves the Working Room without notifying reason and ETA more than twice | Team account will be suspended, and associate must contact HR to request reactivation. | Scrum Master & HR |
| 03. Non-compliance persists beyond two working days | Escalate to Line Manager for review and disciplinary action. | Scrum Master |
| 04. Continuous non-participation or lack of progress for one week | Subject to formal performance review and potential payroll impact. | HR & Line Manager`;

async function addL24WorkingRoomsGuidelines() {
  console.log('➕ Adding DQ L24 Working Rooms Guidelines...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%L24%Working%Room%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  L24 Working Rooms Guidelines already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nSkipping creation. Use update script if you need to modify.');
    return;
  }

  // Check which filters need more coverage
  const { data: allGuides } = await supabase
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, sub_domain, domain')
    .eq('status', 'Approved');

  const guidelines = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  // Count services per filter
  const guideTypeCounts = {};
  const unitCounts = {};
  const locationCounts = {};

  guidelines.forEach(g => {
    const guideType = (g.guide_type || '').toLowerCase().trim();
    if (guideType) guideTypeCounts[guideType] = (guideTypeCounts[guideType] || 0) + 1;

    const unit = (g.unit || g.function_area || '').toLowerCase().trim();
    if (unit) unitCounts[unit] = (unitCounts[unit] || 0) + 1;

    const location = (g.location || '').toUpperCase().trim();
    if (location) locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  // Find filters with low coverage
  const lowCoverageGuideTypes = Object.entries(guideTypeCounts)
    .filter(([_, count]) => count < 2)
    .map(([type]) => type);

  const lowCoverageUnits = Object.entries(unitCounts)
    .filter(([_, count]) => count < 2)
    .map(([unit]) => unit);

  const lowCoverageLocations = Object.entries(locationCounts)
    .filter(([_, count]) => count < 2)
    .map(([loc]) => loc);

  // Assign to low coverage filters
  let guideType = 'Policy';
  if (lowCoverageGuideTypes.length > 0) {
    const typeMap = {
      'best practice': 'Best Practice',
      'best-practice': 'Best Practice',
      'policy': 'Policy',
      'process': 'Process',
      'sop': 'SOP'
    };
    const targetType = lowCoverageGuideTypes.find(t => typeMap[t]) || lowCoverageGuideTypes[0];
    if (typeMap[targetType]) guideType = typeMap[targetType];
  }

  let unit = 'SecDevOps';
  if (lowCoverageUnits.length > 0) {
    const unitMap = {
      'deals': 'Deals',
      'dq-delivery-accounts': 'DQ Delivery (Accounts)',
      'dq-delivery-deploys': 'DQ Delivery (Deploys)',
      'dq-delivery-designs': 'DQ Delivery (Designs)',
      'finance': 'Finance',
      'hra': 'HRA',
      'intelligence': 'Intelligence',
      'products': 'Products',
      'secdevops': 'SecDevOps',
      'solutions': 'Solutions',
      'stories': 'Stories'
    };
    const targetUnit = lowCoverageUnits.find(u => unitMap[u]) || lowCoverageUnits[0];
    if (unitMap[targetUnit]) unit = unitMap[targetUnit];
  }

  let location = 'DXB';
  if (lowCoverageLocations.length > 0) {
    location = lowCoverageLocations[0];
  }

  // Create the guide
  const slug = 'dq-l24-working-rooms-guidelines';
  const title = 'DQ L24 Working Rooms Guidelines';

  const newGuide = {
    title: title,
    slug: slug,
    summary: L24_WORKING_ROOMS_SUMMARY,
    body: L24_WORKING_ROOMS_BODY,
    guide_type: guideType,
    domain: 'Guidelines',
    sub_domain: 'resources',
    unit: unit,
    location: location,
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
    console.log('✅ Successfully created DQ L24 Working Rooms Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Summary: ${L24_WORKING_ROOMS_SUMMARY}`);
    console.log(`   Body length: ${L24_WORKING_ROOMS_BODY.length} characters`);
    console.log(`   Domain: Guidelines`);
    console.log(`   Guide Type: ${guideType}`);
    console.log(`   Unit: ${unit}`);
    console.log(`   Location: ${location}`);
    console.log(`\n📊 Assigned to filters with low coverage to ensure all filters have services`);
  } else {
    console.log('❌ Guide creation returned no data');
  }
}

addL24WorkingRoomsGuidelines().catch(console.error);

