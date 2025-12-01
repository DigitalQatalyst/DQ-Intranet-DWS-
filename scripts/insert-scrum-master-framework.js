// scripts/insert-scrum-master-framework.js
// Insert the Scrum Master Framework guide into Supabase
// Usage: node scripts/insert-scrum-master-framework.js

import { createClient } from '@supabase/supabase-js'

const fail = (msg) => { console.error(msg); process.exit(1) }

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const scrumMasterFrameworkBody = `# Scrum Master Framework

DQ is deploying a unified Scrum Master Framework where every associate functions as a Scrum Master at different levels, depending on their position and responsibilities.

This replaces the previous structure of Sector Leads, Factory Leads, Tower Leads, and traditional Scrum Masters with a streamlined 5-type Scrum Master model that enhances agility, alignment, accountability, and delivery momentum across all units.

## Purpose

These guidelines define the structure, roles, responsibilities, and governance expectations of the new Scrum Master Framework.

They ensure standardization across all units, clarity of responsibilities, and alignment to DQ's culture of execution, visibility, and accountability.

## Understanding Position SM vs Role SM

Below is the difference between Position SM and Role SM.

| # | Items | Description |
|---|-------|-------------|
| 01 | Position SM | Located in CoE(EVMO) |
| 02 | Position Examples | SM (CoE), SM (Unit), SM (Delivery). |
| 03 | Multi-role Execution | Position SMs may take on additional roles such as SM (Working Room). |
| 04 | Role SM | A functional responsibility performed when required. |
| 05 | Role Examples | SM (Working Room), SM (ATP). |
| 06 | Universality | SM(ATP) applies to all associates |

## SM (CoE) - Position

The below table showcases the roles and responsibilities of CoE Scrum Master

| # | Items | Description |
|---|-------|-------------|
| 01 | Location | Sits in the CoE (EVMO) unit. |
| 02 | Core Function | Governance, compliance, and ensuring adherence to DQ's L24 WR guidelines. |
| 03 | Deployment Involvement | Highly involved in the initial deployment phase to onboard SM (Working Room) and activate each Working Room. |
| 04 | Stabilization Activities | Conduct high-level scans across all Working Rooms once operational to ensure guidelines and the WR essence are intact. |
| 05 | Gap Resolution | Identify gaps in WR performance/compliance and ensure corrective action via Unit/Factory/Tower SMs. |
| 06 | Standards Creation | Develop and maintain Working Room guidelines (structure, flow, expectations). |
| 07 | Compliance Assurance | Ensure guideline deployment and associate compliance across all units. |
| 08 | Continuous Optimization | Optimize guidelines weekly based on observations, WR performance, and feedback. |

## SM (Unit) — Position

The below table showcases the roles and responsibilities of Unit Scrum Masters: SM (Unit) represents the Scrum Masters operating at the Sector, Factory, and Tower levels within each unit.

They ensure that all parts of the unit function efficiently, align with DQ's delivery structure, and maintain consistent performance.

### SM (Sector)

The below table showcases the roles and responsibilities of Sector level Scrum Master:

| # | Items | Description |
|---|-------|-------------|
| 01 | Scope | DCO Operations, DBP Platform, DBP Delivery sectors. |
| 02 | Working Room Support | Act as SM (Working Room) when required. |
| 03 | Factory Oversight | Ensure factories under the sector operate efficiently. |
| 04 | Unit Health | Maintain visibility on sector-level performance and health. |
| 05 | Tracker Accuracy | Ensure sector functional trackers are accurate and updated. |
| 06 | Gap Escalation | Flag gaps to Factory SMs and drive resolution. |

### SM (Factory)

The below table showcases the roles and responsibilities of Factory level Scrum Master:

| # | Items | Description |
|---|-------|-------------|
| 01 | Scope | Eg. Finance Factory, Deals Factory, Solution Factory, etc. |
| 02 | Working Room Support | Act as SM (Working Room) when required. |
| 03 | Tower Oversight | Ensure all towers under the factory operate effectively. |
| 04 | Planning | Establish clear monthly, weekly, and daily plans for each tower. |
| 05 | Plan Monitoring | Track progress against plans and maintain factory-level trackers. |
| 06 | ATP Review | Review and validate ATPs of all factory associates. |
| 07 | Blocker Resolution | Identify and proactively resolve blockers. |

### SM (Tower)

The below table showcases the roles and responsibilities of Tower level Scrum Master:

| # | Items | Description |
|---|-------|-------------|
| 01 | Scope | E.g. GPRC, Payables & Receivables, etc. |
| 02 | Target Setting | Set monthly/weekly/daily tower targets. |
| 03 | Task Specification | Ensure all tasks under the towers have specifications and dates which the monthly/weekly targets will be derived from |
| 04 | Performance Tracking | Track progress against plans and maintain factory-level trackers. |
| 06 | Blocker Handling | Resolve blockers or escalate when necessary. |
| 07 | Visibility | Communicate plan, progress, and blockers on team channels. |

## SM (Working Room) - Role

The below table showcases the responsibilities of Working Room Scrum Master

| # | Items | Description |
|---|-------|-------------|
| 01 | Session Leadership | Facilitate Daily Working Room sessions. |
| 02 | Focus Enforcement | Keep sessions focused on execution and measurable outcomes. |
| 03 | Monitor Engagement | Track attendance, engagement, and task progress. |
| 04 | Blocker Resolution | Pull in resources/support in real time to resolve blockers. |
| 05 | Routine Management | Conduct CWS and Retros as per weekly agenda. |
| 06 | Culture Alignment | Uphold DQ culture: accountability, collaboration, delivery momentum. |
| 07 | Reporting | Post daily progress and unresolved items on relevant channels. |
| 08 | Context & Purpose Enablement | Understanding of overall context & purpose of the task enabling associates to make meaningful, effective progress that delivers real value. |

## SM (Delivery) - Position

The below table showcases the roles & responsibilities of Delivery Scrum Master

| # | Items | Description |
|---|-------|-------------|
| 01 | Scope | Dedicated Scrum Master for specific projects. |
| 02 | Multi-WR Participation | Move across all Working Rooms where the project is active. Eg. DFSA Project – appears in WR/Breakout rooms DevOps & WR/Breakout rooms Solution |
| 03 | Delivery Flow | Ensure project tasks progress smoothly across units. |
| 04 | Control Tower | Conduct Control Tower for respective projects weekly |
| 05 | Visibility | Maintain visibility and alignment across all WRs tied to the project. |
| 06 | Escalation | Proactively escalate risks, delays, or blockers and ensure resolution takes place. |

## SM (ATP- Associate) - Role

The below table showcases the responsibilities of Associate Scrum Master

| # | Items | Description |
|---|-------|-------------|
| 01 | Universal Responsibility | Every associate acts as their own Scrum Master. |
| 02 | Planner Discipline | Ensure each ATP task is linked to Planner with clear context, purpose, approach, and CLIs. |
| 03 | Specification Clarity | Define detailed specs and deadlines for each task. |
| 04 | Progress Visibility | Maintain daily and weekly visibility on progress. |
| 07 | Self-Management | Manage blockers independently and escalate when required. |
| 08 | Discipline | Uphold personal accountability and delivery expectations. |
`

const guideData = {
  slug: 'scrum-master-framework',
  title: 'Scrum Master Framework',
  summary: 'DQ is deploying a unified Scrum Master Framework where every associate functions as a Scrum Master at different levels, depending on their position and responsibilities. This replaces the previous structure with a streamlined 5-type Scrum Master model that enhances agility, alignment, accountability, and delivery momentum across all units.',
  body: scrumMasterFrameworkBody,
  domain: 'guidelines',
  guide_type: 'Framework',
  function_area: 'Operations',
  status: 'Approved',
  author_name: 'DQ Operations',
  author_org: 'DQ Operations',
  last_updated_at: new Date().toISOString(),
  complexity_level: 'Intermediate'
}

async function main() {
  console.log('Inserting Scrum Master Framework guide...')
  
  // Check if guide already exists
  const { data: existing } = await sb
    .from('guides')
    .select('id, slug')
    .eq('slug', guideData.slug)
    .single()

  if (existing) {
    console.log('Guide already exists. Updating...')
    const { data, error } = await sb
      .from('guides')
      .update(guideData)
      .eq('slug', guideData.slug)
      .select('id')
      .single()
    
    if (error) {
      console.error('Update failed:', error)
      process.exit(1)
    }
    console.log(`✓ Updated guide with ID: ${data.id}`)
  } else {
    const { data, error } = await sb
      .from('guides')
      .insert(guideData)
      .select('id')
      .single()
    
    if (error) {
      console.error('Insert failed:', error)
      process.exit(1)
    }
    console.log(`✓ Inserted guide with ID: ${data.id}`)
  }
  
  console.log('Done!')
}

main().catch(err => {
  console.error('Script failed:', err?.message || err)
  process.exit(1)
})

