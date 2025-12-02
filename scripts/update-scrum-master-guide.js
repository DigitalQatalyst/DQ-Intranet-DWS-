// scripts/update-scrum-master-guide.js
// Update the Scrum Master Framework guide with unique image and improved documentation
// Usage: node scripts/update-scrum-master-guide.js

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

// Improved, paraphrased content
const improvedBody = `# DQ Scrum Master Framework

## Overview

Digital Qatalyst is implementing a comprehensive Scrum Master Framework that empowers every associate to function as a Scrum Master, with responsibilities tailored to their organizational level and role. This innovative approach replaces traditional hierarchical structures—including Sector Leads, Factory Leads, Tower Leads, and conventional Scrum Masters—with a streamlined, five-tier Scrum Master model designed to enhance organizational agility, strategic alignment, accountability, and delivery velocity across all business units.

## Framework Purpose

This framework establishes clear guidelines that define the organizational structure, role definitions, responsibility matrices, and governance expectations for the new Scrum Master Framework. These guidelines ensure:

- **Standardization**: Consistent application across all organizational units
- **Clarity**: Well-defined responsibilities and expectations
- **Alignment**: Integration with DQ's core values of execution excellence, transparency, and accountability

## Position vs. Role: Key Distinctions

Understanding the difference between Position Scrum Masters and Role Scrum Masters is fundamental to the framework's implementation.

| # | Category | Description |
|---|----------|-------------|
| 01 | **Position SM** | A formal organizational role located within the Center of Excellence (EVMO) |
| 02 | **Position Examples** | SM (CoE), SM (Unit), SM (Delivery) |
| 03 | **Multi-role Capability** | Position SMs may assume additional functional roles, such as SM (Working Room), as operational needs require |
| 04 | **Role SM** | A functional responsibility assigned and executed on an as-needed basis |
| 05 | **Role Examples** | SM (Working Room), SM (ATP) |
| 06 | **Universal Application** | SM (ATP) applies to all associates regardless of position or level |

## SM (CoE) - Center of Excellence Position

The Center of Excellence Scrum Master serves as the governance and compliance anchor for the framework across the organization.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Organizational Location** | Positioned within the CoE (EVMO) unit, serving as the central governance hub |
| 02 | **Primary Function** | Oversee governance, ensure compliance, and maintain adherence to DQ's L24 Working Room guidelines |
| 03 | **Deployment Leadership** | Actively participate in initial deployment phases, onboarding SM (Working Room) personnel and activating each Working Room |
| 04 | **Operational Monitoring** | Conduct comprehensive assessments across all Working Rooms post-deployment to verify guideline adherence and preserve Working Room operational integrity |
| 05 | **Performance Management** | Identify performance gaps, compliance issues, and operational deficiencies, ensuring corrective actions through Unit/Factory/Tower SMs |
| 06 | **Standards Development** | Create, maintain, and evolve Working Room guidelines covering structure, workflow, and performance expectations |
| 07 | **Compliance Oversight** | Guarantee guideline deployment and associate compliance across all organizational units |
| 08 | **Continuous Improvement** | Weekly optimization of guidelines based on operational observations, Working Room performance metrics, and stakeholder feedback |

## SM (Unit) - Organizational Unit Position

Unit Scrum Masters operate at three distinct organizational levels—Sector, Factory, and Tower—ensuring cohesive operations within their respective units.

### SM (Sector) - Sector Level

Sector Scrum Masters oversee multiple factories and ensure sector-wide operational excellence.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Operational Scope** | DCO Operations, DBP Platform, and DBP Delivery sectors |
| 02 | **Working Room Support** | Provide SM (Working Room) services when operational requirements demand |
| 03 | **Factory Governance** | Ensure factories within the sector operate at optimal efficiency and alignment |
| 04 | **Performance Visibility** | Maintain comprehensive visibility into sector-level performance metrics and organizational health |
| 05 | **Data Integrity** | Ensure sector functional trackers are accurate, current, and reflective of actual performance |
| 06 | **Issue Management** | Identify operational gaps, escalate to Factory SMs, and drive resolution to completion |

### SM (Factory) - Factory Level

Factory Scrum Masters manage tower operations and ensure factory-level execution excellence.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Operational Scope** | Examples include Finance Factory, Deals Factory, Solution Factory, and other factory-level units |
| 02 | **Working Room Support** | Provide SM (Working Room) services when operational needs arise |
| 03 | **Tower Oversight** | Ensure all towers within the factory operate effectively and meet performance standards |
| 04 | **Strategic Planning** | Establish clear, actionable plans at monthly, weekly, and daily intervals for each tower |
| 05 | **Progress Monitoring** | Track execution progress against established plans and maintain accurate factory-level performance trackers |
| 06 | **ATP Validation** | Review and validate Associate Task Plans (ATPs) for all factory associates |
| 07 | **Blockage Resolution** | Proactively identify and resolve operational blockers before they impact delivery |

### SM (Tower) - Tower Level

Tower Scrum Masters focus on tactical execution and day-to-day operational management.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Operational Scope** | Examples include GPRC, Payables & Receivables, and other tower-level units |
| 02 | **Target Establishment** | Set clear, measurable targets at monthly, weekly, and daily intervals |
| 03 | **Task Specification** | Ensure all tower tasks have detailed specifications and deadlines that align with monthly and weekly target objectives |
| 04 | **Performance Tracking** | Monitor progress against plans and maintain accurate tower-level performance trackers |
| 05 | **Blockage Management** | Resolve operational blockers independently or escalate when resolution requires higher-level intervention |
| 06 | **Communication** | Maintain transparent communication of plans, progress, and blockers through appropriate team channels |

## SM (Working Room) - Functional Role

Working Room Scrum Masters facilitate daily operational sessions and ensure focused execution.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Session Facilitation** | Lead Daily Working Room sessions with clear structure and purpose |
| 02 | **Focus Management** | Maintain session focus on execution and measurable outcomes, minimizing distractions |
| 03 | **Engagement Monitoring** | Track participant attendance, engagement levels, and task progress throughout sessions |
| 04 | **Real-time Support** | Mobilize resources and support in real-time to resolve blockers as they arise |
| 05 | **Routine Execution** | Conduct Collaborative Working Sessions (CWS) and Retrospectives according to weekly agenda |
| 06 | **Cultural Alignment** | Uphold DQ's core cultural values: accountability, collaboration, and delivery momentum |
| 07 | **Progress Reporting** | Post daily progress updates and unresolved items on relevant communication channels |
| 08 | **Context Enablement** | Ensure associates understand the broader context and purpose of tasks, enabling meaningful progress that delivers tangible value |

## SM (Delivery) - Project-Specific Position

Delivery Scrum Masters provide dedicated support for specific projects, ensuring cross-functional coordination.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Project Scope** | Serve as dedicated Scrum Master for assigned projects |
| 02 | **Cross-functional Participation** | Operate across all Working Rooms where the project is active (e.g., DFSA Project spans WR/Breakout rooms for DevOps and WR/Breakout rooms for Solution) |
| 03 | **Delivery Coordination** | Ensure project tasks progress smoothly across all organizational units |
| 04 | **Control Tower Management** | Conduct weekly Control Tower sessions for respective projects |
| 05 | **Visibility Maintenance** | Maintain comprehensive visibility and alignment across all Working Rooms connected to the project |
| 06 | **Risk Management** | Proactively identify, escalate, and ensure resolution of risks, delays, and blockers |

## SM (ATP - Associate) - Universal Role

Every associate functions as their own Scrum Master, taking personal ownership of their work and delivery.

| # | Responsibility Area | Detailed Description |
|---|-------------------|---------------------|
| 01 | **Universal Application** | Every associate acts as their own Scrum Master, regardless of position or level |
| 02 | **Planning Discipline** | Ensure each ATP task is linked to Planner with comprehensive context, clear purpose, defined approach, and specified Command Line Interfaces (CLIs) |
| 03 | **Specification Excellence** | Define detailed specifications and realistic deadlines for each assigned task |
| 04 | **Progress Transparency** | Maintain daily and weekly visibility on personal progress and task completion |
| 05 | **Self-management** | Independently manage blockers and escalate only when resolution requires additional support or resources |
| 06 | **Accountability Standards** | Uphold personal accountability and meet delivery expectations consistently |

## Implementation Benefits

This framework delivers significant organizational advantages:

- **Enhanced Agility**: Faster response to changing business needs
- **Improved Alignment**: Better coordination across organizational levels
- **Increased Accountability**: Clear ownership and responsibility at every level
- **Accelerated Delivery**: Streamlined processes that reduce friction and increase velocity
- **Cultural Consistency**: Unified approach to execution across all units

## Conclusion

The DQ Scrum Master Framework represents a transformative approach to organizational agility and delivery excellence. By empowering associates at every level with Scrum Master capabilities, DQ creates a culture of ownership, accountability, and continuous improvement that drives sustainable business value.
`

const improvedSummary = `DQ is implementing a unified Scrum Master Framework that empowers every associate to function as a Scrum Master, with responsibilities tailored to their organizational level. This framework replaces traditional hierarchical structures with a streamlined five-tier model designed to enhance agility, alignment, accountability, and delivery velocity across all business units.`

const guideUpdate = {
  title: 'DQ Scrum Master Framework',
  summary: improvedSummary,
  body: improvedBody,
  hero_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&auto=format', // Unique Scrum/Agile image
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
  console.log('Updating Scrum Master Framework guide with improved content and unique image...')
  
  const { data, error } = await sb
    .from('guides')
    .update(guideUpdate)
    .eq('slug', 'scrum-master-framework')
    .select('id, title')
    .single()
  
  if (error) {
    console.error('Update failed:', error)
    process.exit(1)
  }
  
  console.log(`✓ Successfully updated guide: ${data.title}`)
  console.log(`✓ Guide ID: ${data.id}`)
  console.log(`✓ Unique hero image added`)
  console.log(`✓ Content paraphrased and improved`)
  console.log(`✓ Guide available at: /marketplace/guides/scrum-master-framework`)
  console.log('\nDone! The guide is now updated with professional documentation.')
}

main().catch(err => {
  console.error('Script failed:', err?.message || err)
  process.exit(1)
})

