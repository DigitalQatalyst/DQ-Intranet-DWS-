import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function convertToTable() {
  console.log('🔄 Converting Risk section to table format...\n')
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = data.body
  
  // Create optimized table format for Risk section
  const riskTableSection = `## Risk Identification, Mitigation and Escalation

Risk identification, mitigation, and escalation are essential for governance and successful project delivery. Proactive risk management ensures potential obstacles are addressed before impacting project success, client satisfaction, or compliance.

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
| **KPIs / Metrics** | % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends`
  
  // Replace the Risk section
  body = body.replace(/(## Risk Identification, Mitigation and Escalation[^#]*)/s, riskTableSection)
  
  const { data: updated, error } = await supabase
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
  
  console.log(`✅ Successfully converted: ${updated.title}`)
  console.log('✅ Risk section now in clean table format!')
  console.log('✅ Much easier to read and reference!')
}

convertToTable().catch(console.error)


