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
const FUNCTIONAL_TRACKER_SUMMARY = `Unified system to monitor and manage all associate tasks across DQ factories. Provides real-time visibility into progress, performance, and task health, ensuring consistency and accountability.`;

const FUNCTIONAL_TRACKER_BODY = `# DQ Functional Tracker Guidelines

The Functional Tracker has been established across all Digital Qatalyst (DQ) factories (Business Units) as a unified system to monitor and manage all associate tasks. It consolidates information from multiple workstreams into a single tracker, allowing real-time visibility into progress, performance, and task health across the organization.

By standardizing how tasks are created, maintained, and reviewed, the Functional Tracker ensures consistency in reporting, strengthens accountability, and supports proactive identification of issues or inefficiencies within each factory. These guidelines ensure the tracker is used effectively and consistently across all units, maintaining its role as a reliable management and decision-support tool.

## Purpose

The Functional Tracker serves as the single source of truth for tracking all work items (tasks) across each DQ Factory (Business Unit). It provides visibility on:

- Task progress and status by associates
- Overall factory health and performance
- Gaps and bottlenecks that impact delivery

It enables Scrum Masters, Factory Leads, and Associates to maintain transparency, accountability, and alignment across all active workstreams.

## Functional Tracker Structure

Each Factory's Functional Tracker is structured with the following elements:

| Item | Description |
|------|-------------|
| 01. WI Areas | Defines the key work item clusters or areas of focus. |
| 02. Purpose | Clarifies the goal or intent of each work item area. |
| 03. Tower | Represents the sub-units or focus areas under each factory. |
| 04. Customer | Indicates the end customer or stakeholder benefiting from the task. |
| 05. Priority (Level) | Reflects the urgency or importance of the task. |
| 06. Priority (Scope) | Captures the task's impact or scope of influence. |
| 07. Assignments | Lists all tasks and links them to their relevant Work Item Areas. |

## Task Structure (Planner)

Each task linked to the tracker (via Planner) must include:

| Guideline | Action Point |
|-----------|--------------|
| 01. Context | A clear description of the task background or what it is addressing. |
| 02. Purpose | Why does the task exist (value, impact, or problem it solves). |
| 03. Approach | The method or steps to achieve the task. |
| 04. Outcome | The tangible, measurable deliverable expected. |
| 05. Relevant Links | References to supporting materials or outputs. |
| 06. Checklist Items (CLIs) | Actionable subtasks with clear completion dates.`;

async function addFunctionalTrackerGuidelines() {
  console.log('➕ Adding DQ Functional Tracker Guidelines...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Functional Tracker%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  Functional Tracker Guidelines already exists:');
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
  const slug = 'dq-functional-tracker-guidelines';
  const title = 'DQ Functional Tracker Guidelines';

  const newGuide = {
    title: title,
    slug: slug,
    summary: FUNCTIONAL_TRACKER_SUMMARY,
    body: FUNCTIONAL_TRACKER_BODY,
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
    console.log('✅ Successfully created DQ Functional Tracker Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Summary: ${FUNCTIONAL_TRACKER_SUMMARY}`);
    console.log(`   Body length: ${FUNCTIONAL_TRACKER_BODY.length} characters`);
    console.log(`   Domain: Guidelines`);
    console.log(`   Guide Type: ${guideType}`);
    console.log(`   Unit: ${unit}`);
    console.log(`   Location: ${location}`);
    console.log(`\n📊 Assigned to filters with low coverage to ensure all filters have services`);
  } else {
    console.log('❌ Guide creation returned no data');
  }
}

addFunctionalTrackerGuidelines().catch(console.error);

