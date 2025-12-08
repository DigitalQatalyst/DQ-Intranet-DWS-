import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function restoreRAIDTables() {
  console.log('🔄 Restoring RAID Guidelines to clean table format...\n')
  
  // Restore to a clean structure with proper tables
  const body = `# DQ RAID Guidelines

<div class="feature-box">

## Value Stream – Heartbeat of DQ Projects

Value streams are end-to-end processes that ensure projects deliver continuous value, not just completion. DQ value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

### Operational Value Streams

| Value Stream | Description |
|--------------|-------------|
| **Client Acquisition** | Attract and onboard clients, resulting in signed contracts and clear needs |
| **Client Success** | Drive adoption and support, ensuring client satisfaction and meeting KPIs |
| **Client Retention** | Strengthen relationships and upsell, increasing lifetime value and revenue |
| **Governance & Risk** | Ensure alignment, compliance, and risk control, reducing risks |

### Development Value Streams

| Value Stream | Description |
|--------------|-------------|
| **Solution Design & Proposal** | Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals |
| **Agile Delivery** | Develop and deploy solutions in agile increments, achieving working software and PI objectives |
| **Continuous Integration & Deployment** | Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases |
| **Capability Development** | Build agile teams and practices, leading to certified teams and faster delivery |
| **Value Measurement** | Measure value, gather feedback, and improve delivery and increase innovation

</div>

<div class="feature-box">

## Risk Identification, Mitigation and Escalation

Effective risk management is essential for successful project delivery. Proactive identification, assessment, and escalation ensure obstacles are addressed before impacting project success or client satisfaction.

| Element | Details |
|---------|---------|
| **Objective** | Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation |
| **Trigger Points** | PI Planning, Backlog grooming, Solution Demos, Regulatory Updates, Client Escalations |
| **Risk Identification** | Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues |
| **Risk Assessment** | Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation |
| **Mitigation Planning** | Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates |
| **Execution & Monitoring** | Track mitigation actions, integrate with team boards or dashboards, and update status regularly |
| **Escalation Protocols** | Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope |
| **Closure & Lessons Learned** | Review mitigated risks, update risk registers, and capture lessons for future planning |
| **Enablers** | Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions |
| **Common Risk Types** | Scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability |
| **KPIs / Metrics** | % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends

</div>

<div class="feature-box">

## Risk Identification Guidelines

Effective risk identification is crucial for proactively addressing potential issues throughout the project lifecycle, ensuring smoother project delivery by embedding it in all phases.

- Embed risk identification in all delivery phases
- Assess risks during project scoping, planning, execution, and closure
- Use structured formats and workshops
- Conduct risk discovery sessions in PI planning, daily stand-ups, and retros
- Categorize risks by type (Delivery, Technical, Compliance, Resourcing, Financial, or Reputational)
- Leverage past project lessons
- Review previous DQ project risks and integrate common risks into current planning
- Maintain a shared risk register (Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated)
- Empower all team members to raise risks
- Foster a no-blame culture that encourages surfacing issues early and without hesitation

</div>

<div class="feature-box">

## Risk Mitigation Guidelines

Risk mitigation involves proactive steps to reduce the impact of identified risks, managed through assigning ownership, defining clear actions, and continuous monitoring.

- Assign risk owners (Every open risk must have a person responsible for its mitigation)
- Define mitigation actions clearly (Include specific action steps, timelines, and measurable checkpoints to track progress)
- Prioritize risks by impact and probability (Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks)
- Integrate risk plans into work streams (Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline)
- Monitor mitigation progress continuously (Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly)
- Maintain contingency/back-up plans (Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss))

</div>

<div class="feature-box">

## Risk Escalation Guidelines

Effective risk escalation ensures high-priority risks are addressed at the right levels of governance, avoiding major disruptions through early escalation, clear documentation, and structured communication.

- Define escalation thresholds (Such as high business impact, legal/compliance implications, or delivery timelines delay)
- Use an escalation matrix (Define who to escalate to based on risk severity and type)
- Document escalation clearly (Include risk details, impact assessment, attempted mitigations, and recommended actions)
- Communicate proactively (Notify stakeholders before risks become critical issues)
- Track escalation outcomes (Monitor how escalated risks are resolved and learn from the process)

</div>

<div class="feature-box">

## Risk Types

Understanding different risk types is essential for effectively managing and mitigating potential issues. Common risk categories include:

| Risk Type | Description | Examples |
|-----------|-------------|----------|
| **Delivery** | Risks affecting project timelines, scope, or quality | Scope creep, missed deadlines, quality issues |
| **Technical** | Technology-related risks | Integration failures, system downtime, data loss |
| **Compliance** | Regulatory and legal risks | Non-compliance with regulations, data privacy breaches |
| **Resourcing** | People and resource availability risks | Key person unavailability, skill gaps, resource constraints |
| **Financial** | Budget and cost-related risks | Budget overruns, unexpected costs, revenue impact |
| **Reputational** | Risks affecting brand or client relationships | Client dissatisfaction, negative publicity, trust issues |

</div>

<div class="feature-box">

## Lean Governance and Risk Management

From the value stream, we focus on Lean Governance & Risk Management to ensure alignment, compliance, and effective risk control throughout project delivery.

- Ensure alignment across teams and stakeholders
- Maintain compliance with regulations and standards
- Control and mitigate risks proactively
- Reduce overall project and organizational risks
- Integrate governance into daily operations
- Use data-driven decision making for risk management

</div>`
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'raid-guidelines')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  const tileCount = (body.match(/<div class="feature-box">/g) || []).length
  const tableCount = (body.match(/\|.*\|/g) || []).length / 3
  
  console.log(`✅ Successfully restored: ${data.title}`)
  console.log(`✅ ${tileCount} tiles with clean table format`)
  console.log(`✅ ~${Math.round(tableCount)} tables properly formatted`)
  console.log('✅ Structure is clean and readable!')
}

restoreRAIDTables().catch(console.error)


