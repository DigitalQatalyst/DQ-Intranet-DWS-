// scripts/make-content-precise.js
// Make content more precise and concise
// Usage: node scripts/make-content-precise.js

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: resolve(__dirname, '..', '.env') })
config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

// Precise, concise content
const preciseBody = `# DQ Scrum Master Framework

## Overview

DQ is implementing a unified Scrum Master Framework where every associate functions as a Scrum Master based on their organizational level. This replaces traditional hierarchical structures with a streamlined five-tier model that enhances agility, alignment, accountability, and delivery momentum across all units.

## Framework Purpose

These guidelines define the structure, roles, responsibilities, and governance expectations for the Scrum Master Framework, ensuring standardization, clarity, and alignment with DQ's culture of execution, visibility, and accountability.

## Position vs. Role: Key Distinctions

Understanding the difference between Position Scrum Masters and Role Scrum Masters is fundamental to the framework.

| Category | Description |
|:---------|:------------|
| **Position SM** | Formal organizational role located within the Center of Excellence (EVMO) |
| **Position Examples** | SM (CoE), SM (Unit), SM (Delivery) |
| **Multi-role Capability** | Position SMs may assume additional functional roles, such as SM (Working Room), as needed |
| **Role SM** | Functional responsibility assigned and executed on an as-needed basis |
| **Role Examples** | SM (Working Room), SM (ATP) |
| **Universal Application** | SM (ATP) applies to all associates regardless of position or level |

## SM (CoE) - Center of Excellence Position

The Center of Excellence Scrum Master serves as the governance and compliance anchor for the framework.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Organizational Location** | Positioned within the CoE (EVMO) unit |
| **Primary Function** | Oversee governance, ensure compliance, and maintain adherence to DQ's L24 Working Room guidelines |
| **Deployment Leadership** | Participate in initial deployment phases, onboarding SM (Working Room) and activating each Working Room |
| **Operational Monitoring** | Conduct assessments across all Working Rooms to verify guideline adherence |
| **Performance Management** | Identify gaps and ensure corrective actions through Unit/Factory/Tower SMs |
| **Standards Development** | Create and maintain Working Room guidelines covering structure, workflow, and expectations |
| **Compliance Oversight** | Ensure guideline deployment and associate compliance across all units |
| **Continuous Improvement** | Optimize guidelines weekly based on observations, performance metrics, and feedback |

## SM (Unit) - Organizational Unit Position

Unit Scrum Masters operate at Sector, Factory, and Tower levels, ensuring cohesive operations within their units.

### SM (Sector) - Sector Level

Sector Scrum Masters oversee multiple factories and ensure sector-wide operational excellence.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Operational Scope** | DCO Operations, DBP Platform, and DBP Delivery sectors |
| **Working Room Support** | Provide SM (Working Room) services when required |
| **Factory Governance** | Ensure factories within the sector operate efficiently |
| **Performance Visibility** | Maintain visibility into sector-level performance and health |
| **Data Integrity** | Ensure sector functional trackers are accurate and current |
| **Issue Management** | Identify gaps, escalate to Factory SMs, and drive resolution |

### SM (Factory) - Factory Level

Factory Scrum Masters manage tower operations and ensure factory-level execution excellence.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Operational Scope** | Finance Factory, Deals Factory, Solution Factory, and other factory-level units |
| **Working Room Support** | Provide SM (Working Room) services when needed |
| **Tower Oversight** | Ensure all towers within the factory operate effectively |
| **Strategic Planning** | Establish clear monthly, weekly, and daily plans for each tower |
| **Progress Monitoring** | Track progress against plans and maintain factory-level trackers |
| **ATP Validation** | Review and validate Associate Task Plans (ATPs) for all factory associates |
| **Blockage Resolution** | Proactively identify and resolve operational blockers |

### SM (Tower) - Tower Level

Tower Scrum Masters focus on tactical execution and day-to-day operational management.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Operational Scope** | GPRC, Payables & Receivables, and other tower-level units |
| **Target Establishment** | Set clear monthly, weekly, and daily targets |
| **Task Specification** | Ensure all tasks have detailed specifications and deadlines aligned with targets |
| **Performance Tracking** | Monitor progress and maintain accurate tower-level trackers |
| **Blockage Management** | Resolve blockers independently or escalate when necessary |
| **Communication** | Communicate plans, progress, and blockers through team channels |

## SM (Working Room) - Functional Role

Working Room Scrum Masters facilitate daily operational sessions and ensure focused execution.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Session Facilitation** | Lead Daily Working Room sessions with clear structure |
| **Focus Management** | Keep sessions focused on execution and measurable outcomes |
| **Engagement Monitoring** | Track attendance, engagement, and task progress |
| **Real-time Support** | Mobilize resources to resolve blockers as they arise |
| **Routine Execution** | Conduct CWS and Retrospectives according to weekly agenda |
| **Cultural Alignment** | Uphold DQ's values: accountability, collaboration, and delivery momentum |
| **Progress Reporting** | Post daily progress and unresolved items on relevant channels |
| **Context Enablement** | Ensure associates understand task context and purpose for meaningful progress |

## SM (Delivery) - Project-Specific Position

Delivery Scrum Masters provide dedicated support for specific projects, ensuring cross-functional coordination.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Project Scope** | Serve as dedicated Scrum Master for assigned projects |
| **Cross-functional Participation** | Operate across all Working Rooms where the project is active |
| **Delivery Coordination** | Ensure project tasks progress smoothly across all units |
| **Control Tower Management** | Conduct weekly Control Tower sessions for respective projects |
| **Visibility Maintenance** | Maintain visibility and alignment across all project-related Working Rooms |
| **Risk Management** | Proactively identify, escalate, and ensure resolution of risks and blockers |

## SM (ATP - Associate) - Universal Role

Every associate functions as their own Scrum Master, taking personal ownership of their work.

| Responsibility Area | Description |
|:-------------------|:------------|
| **Universal Application** | Every associate acts as their own Scrum Master |
| **Planning Discipline** | Link each ATP task to Planner with context, purpose, approach, and CLIs |
| **Specification Excellence** | Define detailed specifications and realistic deadlines for each task |
| **Progress Transparency** | Maintain daily and weekly visibility on personal progress |
| **Self-management** | Manage blockers independently and escalate when needed |
| **Accountability Standards** | Uphold personal accountability and meet delivery expectations |

## Implementation Benefits

This framework delivers:

- **Enhanced Agility**: Faster response to changing business needs
- **Improved Alignment**: Better coordination across organizational levels
- **Increased Accountability**: Clear ownership at every level
- **Accelerated Delivery**: Streamlined processes that increase velocity
- **Cultural Consistency**: Unified approach to execution across all units

## Conclusion

The DQ Scrum Master Framework empowers associates at every level with Scrum Master capabilities, creating a culture of ownership, accountability, and continuous improvement that drives sustainable business value.
`

async function main() {
  console.log('Making content more precise and concise...')
  
  const { data, error } = await sb
    .from('guides')
    .update({ body: preciseBody })
    .eq('slug', 'scrum-master-framework')
    .select('id, title')
    .single()
  
  if (error) {
    console.error('Update failed:', error)
    process.exit(1)
  }
  
  console.log(`✓ Successfully updated guide: ${data.title}`)
  console.log(`✓ Content paraphrased and made more precise`)
  console.log(`✓ Descriptions shortened while maintaining essential information`)
  console.log(`✓ Guide available at: /marketplace/guides/scrum-master-framework`)
  console.log('\nDone! Content is now more concise and precise.')
}

main().catch(err => {
  console.error('Script failed:', err?.message || err)
  process.exit(1)
})

