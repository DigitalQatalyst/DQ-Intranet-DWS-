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
const RAID_GUIDELINES_SUMMARY = `Comprehensive guidelines for managing Risks, Assumptions, Issues, and Dependencies (RAID) across DQ projects. Ensures proactive risk identification, mitigation, and escalation to support successful delivery.`;

const RAID_GUIDELINES_BODY = `# DQ RAID Guidelines

Across DQ projects, whether in design or deploy, delivery is often seen as the finish line—the tangible output of months of effort. But delivery is just a fraction of the broader value stream. Real success hinges on how well we manage risk, clarify assumptions, resolve issues, and track dependencies.

## Value Stream – Heartbeat of DQ Projects

To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn't just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

| Value Streams | Type | Description |
|---------------|------|-------------|
| 01. Client Acquisition | Operational Value Stream | Attract and onboard clients, resulting in signed contracts and clear needs |
| 02. Solution Design & Proposal | Development Value Stream | Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals. |
| 03. Agile Delivery | Development Value Stream | Develop and deploy solutions in agile increments, achieving working software and PI objectives. |
| 04. Client Success | Operational Value Stream | Drive adoption and support, ensuring client satisfaction and meeting KPIs. |
| 05. Continuous Integration & Deployment | Development Value Stream | Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases. |
| 06. Client Retention | Operational Value Stream | Strengthen relationships and upsell, increasing lifetime value and revenue. |
| 07. Capability Development | Development Value Stream | Build agile teams and practices, leading to certified teams and faster delivery. |
| 08. Governance & Risk | Operational Value Stream | Ensure alignment, compliance, and risk control, reducing risks. |
| 09. Value Measurement | Development Value Stream | Measure value, gather feedback, and improve delivery and increase innovation. |

## Lean Governance and Risk Management

From the value stream, we focus on Lean Governance & Risk Management. This operational value stream ensures digital initiatives are aligned with strategic objectives, comply with regulations, and manage risks in a lean, agile manner, supporting effective and efficient delivery.

| Element | Detail |
|---------|--------|
| 01. Value Stream Name | Governance and Risk |
| 02. Type | Operational Value Stream |
| 03. Purpose | To ensure that digital initiatives are aligned with strategic objectives, comply with regulatory requirements, and manage risk in a lean, agile manner. |
| 04. Primary Stakeholders | Portfolio Managers, Risk & Compliance Officers, Enterprise Architects, Delivery Leaders, Finance, Legal |
| 05. Key Activities | Strategic alignment of digital initiatives with business goals. Lean budgeting & investment guardrails. Agile contract management. Risk identification, mitigation & escalation workflows. Regulatory & security compliance monitoring. Audit trail and traceability enablement. |

## Risk Identification, Mitigation and Escalation

A huge part of governance and successfully delivering a project is risk identification, mitigation, and escalation. Managing risks proactively ensures that potential obstacles are addressed before they impact the project's success, client satisfaction, or compliance.

| Element | Detail |
|---------|--------|
| 01. Objective | Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation. |
| 02. Trigger Points | PI Planning, Backlog grooming, Solution Demos, Regulatory Updates, Client Escalations |
| 03. Workflow Stage: Risk Identification | Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues. |
| 04. Workflow Stage: Risk Assessment | Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation. |
| 05. Workflow Stage: Mitigation Planning | Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates. |
| 06. Workflow Stage: Execution & Monitoring | Track mitigation actions, integrate with team boards or dashboards, and update status regularly. |
| 07. Workflow Stage: Escalation Protocols | Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope. |
| 08. Workflow Stage: Closure & Lesson Learned | Review mitigated risks, update risk registers, and capture lessons for future planning. |
| 09. Enablers | Use Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions. |
| 10. Common Risk Types | Common risks include scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability. |
| 11. KPIs / Metrics | KPIs include % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends. |

## Risk Identification Guidelines

Effective risk identification is crucial for proactively addressing potential issues throughout the project lifecycle. By embedding risk identification in all phases, from scoping to closure, teams can anticipate and mitigate risks early, ensuring smoother project delivery.

| Guideline | Action Point |
|-----------|--------------|
| 01. Embed risk identification in all delivery phases | Assess risks during project scoping, planning, execution, and closure. |
| 02. Use structured formats and workshops | Conduct risk discovery sessions in PI planning, daily stand-ups and retros |
| 03. Categorize risks by type | Classify risks as Delivery, Technical, Compliance, Resourcing, Financial, or Reputational. |
| 04. Leverage past project lessons | Review previous DQ project risks and integrate common risks into current planning. |
| 05. Maintain a shared risk register | Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated. |
| 06. Empower all team members to raise risks | Foster a no-blame culture that encourages surfacing issues early and without hesitation. |

## Risk Mitigation Guidelines

Risk mitigation involves taking proactive steps to reduce the impact of identified risks. By assigning ownership, defining clear actions, and continuously monitoring progress, risks can be effectively managed to avoid disruption in project delivery.

| Guideline | Action Point |
|-----------|--------------|
| 01. Assign risk owners | Every open risk must have a person responsible for its mitigation. |
| 02. Define mitigation actions clearly | Include specific action steps, timelines, and measurable checkpoints to track progress. |
| 03. Prioritize risks by impact and probability | Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks. |
| 04. Integrate risk plans into work streams | Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline. |
| 05. Monitor mitigation progress continuously | Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly. |
| 06. Maintain contingency/back-up plans | Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss). |

## Risk Escalation Guidelines

Effective risk escalation ensures that high-priority risks are addressed at the right levels of governance. Escalating risks early, with clear documentation and structured communication, helps to avoid major disruptions and keeps projects on track.

| Guideline | Action Point |
|-----------|--------------|
| 01. Define escalation thresholds | Such as high business impact, legal/compliance implications, or delivery timelines delay |
| 02. Use an escalation matrix | Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly. |
| 03. Escalate early, not late | Don't wait until a risk materializes; escalate when mitigation looks unlikely or weak. |
| 04. Document escalated risks formally | Log escalation details, communications, decisions, and actions taken to ensure transparency and traceability. |
| 05. Escalate via appropriate channels | Use structured channels such as Governance CWS, Project Boards, Email with a clear Subject Line |
| 06. Conduct escalation reviews post-resolution | Hold retros to assess what triggered the escalation and how to avoid similar situations in the future. |

## Risk Types

Understanding different risk types is essential for effectively managing and mitigating them. Below are common categories of risks that may arise during project delivery.

| Type | Example |
|------|---------|
| 01. Delivery Risk | Missed milestones, incomplete stories, client dissatisfaction |
| 02. Technical Risk | Integration failure, security vulnerability, system incompatibility |
| 03. Compliance Risk | Data residency issues, breach of NDAs, GDPR violations |
| 04. Resource Risk | Key team member resignation, overutilization, delayed onboarding |
| 05. Reputational Risk | Failure to deliver on commitment, loss of client account |
| 06. Financial Risk | Budget overruns, cost escalation, revenue impact`;

async function addRAIDGuidelines() {
  console.log('➕ Adding DQ RAID Guidelines...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%RAID%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  RAID Guidelines already exists:');
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
  const slug = 'dq-raid-guidelines';
  const title = 'DQ RAID Guidelines';

  const newGuide = {
    title: title,
    slug: slug,
    summary: RAID_GUIDELINES_SUMMARY,
    body: RAID_GUIDELINES_BODY,
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
    console.log('✅ Successfully created DQ RAID Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Summary: ${RAID_GUIDELINES_SUMMARY}`);
    console.log(`   Body length: ${RAID_GUIDELINES_BODY.length} characters`);
    console.log(`   Domain: Guidelines`);
    console.log(`   Guide Type: ${guideType}`);
    console.log(`   Unit: ${unit}`);
    console.log(`   Location: ${location}`);
    console.log(`\n📊 Assigned to filters with low coverage to ensure all filters have services`);
  } else {
    console.log('❌ Guide creation returned no data');
  }
}

addRAIDGuidelines().catch(console.error);

