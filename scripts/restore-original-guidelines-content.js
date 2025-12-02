import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Original content from the previous scripts
const originalContent = {
  'raid-guidelines': {
    summary: `Comprehensive guidelines for managing Risks, Assumptions, Issues, and Dependencies (RAID) across DQ projects. Ensures proactive risk identification, mitigation, and escalation to support successful delivery.`,
    body: `# DQ RAID Guidelines

Across DQ projects, whether in design or deploy, delivery is often seen as the finish line—the tangible output of months of effort. But delivery is just a fraction of the broader value stream. Real success hinges on how well we manage risk, clarify assumptions, resolve issues, and track dependencies.

## Value Stream – Heartbeat of DQ Projects

To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn't just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

| Value Streams | Type | Description |
|---------------|------|-------------|
| Client Acquisition | Operational Value Stream | Attract and onboard clients, resulting in signed contracts and clear needs |
| Solution Design & Proposal | Development Value Stream | Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals. |
| Agile Delivery | Development Value Stream | Develop and deploy solutions in agile increments, achieving working software and PI objectives. |
| Client Success | Operational Value Stream | Drive adoption and support, ensuring client satisfaction and meeting KPIs. |
| Continuous Integration & Deployment | Development Value Stream | Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases. |
| Client Retention | Operational Value Stream | Strengthen relationships and upsell, increasing lifetime value and revenue. |
| Capability Development | Development Value Stream | Build agile teams and practices, leading to certified teams and faster delivery. |
| Governance & Risk | Operational Value Stream | Ensure alignment, compliance, and risk control, reducing risks. |
| Value Measurement | Development Value Stream | Measure value, gather feedback, and improve delivery and increase innovation. |

## Lean Governance and Risk Management

From the value stream, we focus on Lean Governance & Risk Management. This operational value stream ensures digital initiatives are aligned with strategic objectives, comply with regulations, and manage risks in a lean, agile manner, supporting effective and efficient delivery.

| Element | Detail |
|---------|--------|
| Value Stream Name | Governance and Risk |
| Type | Operational Value Stream |
| Purpose | To ensure that digital initiatives are aligned with strategic objectives, comply with regulatory requirements, and manage risk in a lean, agile manner. |
| Primary Stakeholders | Portfolio Managers, Risk & Compliance Officers, Enterprise Architects, Delivery Leaders, Finance, Legal |
| Key Activities | Strategic alignment of digital initiatives with business goals. Lean budgeting & investment guardrails. Agile contract management. Risk identification, mitigation & escalation workflows. Regulatory & security compliance monitoring. Audit trail and traceability enablement. |

## Risk Identification, Mitigation and Escalation

A huge part of governance and successfully delivering a project is risk identification, mitigation, and escalation. Managing risks proactively ensures that potential obstacles are addressed before they impact the project's success, client satisfaction, or compliance.

| Element | Detail |
|---------|--------|
| Objective | Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation. |
| Trigger Points | PI Planning, Backlog grooming, Solution Demos, Regulatory Updates, Client Escalations |
| Workflow Stage: Risk Identification | Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues. |
| Workflow Stage: Risk Assessment | Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation. |
| Workflow Stage: Mitigation Planning | Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates. |
| Workflow Stage: Execution & Monitoring | Track mitigation actions, integrate with team boards or dashboards, and update status regularly. |
| Workflow Stage: Escalation Protocols | Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope. |
| Workflow Stage: Closure & Lesson Learned | Review mitigated risks, update risk registers, and capture lessons for future planning. |
| Enablers | Use Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions. |
| Common Risk Types | Common risks include scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability. |
| KPIs / Metrics | KPIs include % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends. |

## Risk Identification Guidelines

Effective risk identification is crucial for proactively addressing potential issues throughout the project lifecycle. By embedding risk identification in all phases, from scoping to closure, teams can anticipate and mitigate risks early, ensuring smoother project delivery.

| Guideline | Action Point |
|-----------|--------------|
| Embed risk identification in all delivery phases | Assess risks during project scoping, planning, execution, and closure. |
| Use structured formats and workshops | Conduct risk discovery sessions in PI planning, daily stand-ups and retros |
| Categorize risks by type | Classify risks as Delivery, Technical, Compliance, Resourcing, Financial, or Reputational. |
| Leverage past project lessons | Review previous DQ project risks and integrate common risks into current planning. |
| Maintain a shared risk register | Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated. |
| Empower all team members to raise risks | Foster a no-blame culture that encourages surfacing issues early and without hesitation. |

## Risk Mitigation Guidelines

Risk mitigation involves taking proactive steps to reduce the impact of identified risks. By assigning ownership, defining clear actions, and continuously monitoring progress, risks can be effectively managed to avoid disruption in project delivery.

| Guideline | Action Point |
|-----------|--------------|
| Assign risk owners | Every open risk must have a person responsible for its mitigation. |
| Define mitigation actions clearly | Include specific action steps, timelines, and measurable checkpoints to track progress. |
| Prioritize risks by impact and probability | Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks. |
| Integrate risk plans into work streams | Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline. |
| Monitor mitigation progress continuously | Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly. |
| Maintain contingency/back-up plans | Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss). |

## Risk Escalation Guidelines

Effective risk escalation ensures that high-priority risks are addressed at the right levels of governance. Escalating risks early, with clear documentation and structured communication, helps to avoid major disruptions and keeps projects on track.

| Guideline | Action Point |
|-----------|--------------|
| Define escalation thresholds | Such as high business impact, legal/compliance implications, or delivery timelines delay |
| Use an escalation matrix | Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly. |
| Escalate early, not late | Don't wait until a risk materializes; escalate when mitigation looks unlikely or weak. |
| Document escalated risks formally | Log escalation details, communications, decisions, and actions taken to ensure transparency and traceability. |
| Escalate via appropriate channels | Use structured channels such as Governance CWS, Project Boards, Email with a clear Subject Line |
| Conduct escalation reviews post-resolution | Hold retros to assess what triggered the escalation and how to avoid similar situations in the future. |

## Risk Types

Understanding different risk types is essential for effectively managing and mitigating them. Below are common categories of risks that may arise during project delivery.

| Type | Example |
|------|---------|
| Delivery Risk | Missed milestones, incomplete stories, client dissatisfaction |
| Technical Risk | Integration failure, security vulnerability, system incompatibility |
| Compliance Risk | Data residency issues, breach of NDAs, GDPR violations |
| Resource Risk | Key team member resignation, overutilization, delayed onboarding |
| Reputational Risk | Failure to deliver on commitment, loss of client account |
| Financial Risk | Budget overruns, cost escalation, revenue impact`
  },
  'dq-l24-working-rooms-guidelines': {
    summary: `Standardized guidelines for DQ's virtual L24 Working Rooms. Enhances collaboration, accountability, and real-time productivity by shifting from passive meetings to active daily execution.`,
    body: `# DQ L24 Working Rooms Guidelines

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
| Unit-Level Working Room | The main collaborative space for each DQ Factory or Unit (e.g., Finance Factory). Serves as the central session hub for coordination and team updates. |
| Tower / Squad-Level Breakout Rooms | Created within the main Working Room using Microsoft Teams breakout features. Each breakout represents a specific functional or operational area (e.g., Budget GPRC, Ledger Pay_Rec). |

Each Working Room session is facilitated by a Moderator, who ensures productive engagement, time discipline, and tangible outcomes throughout the day.

## Session Composition & Conduct

This section defines the key elements that shape the flow, engagement, and discipline of each session.

| Guideline | Action Point |
|-----------|--------------|
| Session Kickoff | All associates must join their designated Working Room immediately after Scrum, by 9:30 AM (DXB time). |
| Collaboration Format | The day is spent in active collaboration, working within unit-level rooms or tower/squad-level breakout rooms aligned to task assignments. |
| CWS & Retros | All Sprint Plan Reviews (CWS) and Retrospectives are conducted in the main room at the times indicated in the meeting agenda. |
| Availability Protocol | Associates stepping out must provide a clear reason and estimated return time (ETA) in the chatbot. Example: "Stepping out for client call – back by 12:15 PM." ❌ "BRB" alone is not acceptable. |
| Lunch Break | A fixed break for all associates from 2:00 PM to 3:00 PM (DXB time). |
| Session Continuity | Associates are expected to stay online and actively collaborate until the end of the working day. |

## Roles & Responsibilities

This section defines the responsibilities of all roles involved to ensure accountability and effective governance.

| Role | Key Responsibilities |
|------|----------------------|
| Associates | Join the Working Room immediately after Scrum (by 9:30 AM DXB time). Actively work on assigned sprint tasks throughout the day. Engage on relevant Teams channels to provide visibility of progress, updates, and blockers. Collaborate effectively within breakout rooms and maintain focus on delivery. Log stepping-out reason and ETA in the chatbot (no "BRB" alone). Observe the fixed lunch break from 2:00 PM to 3:00 PM (DXB time). |
| Scrum Master / Moderator | Lead and facilitate the daily Working Room session. Ensure sessions remain focused on execution and measurable progress. Monitor attendance, engagement, and task completion across associates. Actively pull in necessary resources or support to resolve blockers in real time, not just report them. Conduct CWS and Retros in the main room per the weekly agenda. Uphold DQ's culture of accountability, collaboration, and delivery momentum. Report daily progress and unresolved issues to the relevant channel. |

## Governance & Review Cycle

This section outlines the governance rhythm and review cadence designed to ensure continuous alignment, accountability, and effective execution across all Working Rooms.

| Activity | Frequency | Led By | Purpose |
|----------|-----------|--------|---------|
| Daily Working Room Session | Daily (Post Scrum, 9:30 AM–EOD) | Moderator | Enable active execution, collaboration, and focus. |
| Sprint Plan Review (CWS) | Weekly | Factory Lead/Tower Lead | Review sprint plan for the week and blockers. |
| Retrospective | Weekly | Factory Lead/Tower Lead | Review plan vs action and reflect on performance |
| Compliance Check | Weekly | EVMO Unit | Verify adherence to WR guidelines. |

## Escalation & Payroll Protocol

This section defines the escalation process and accountability measures to ensure timely resolution of issues.

| Condition | Action Required | Owner |
|-----------|-----------------|-------|
| Associate repeatedly absent or inactive during WR sessions | Issue verbal reminder and report to Line Manager | Scrum Master |
| Associate leaves the Working Room without notifying reason and ETA more than twice | Team account will be suspended, and associate must contact HR to request reactivation. | Scrum Master & HR |
| Non-compliance persists beyond two working days | Escalate to Line Manager for review and disciplinary action. | Scrum Master |
| Continuous non-participation or lack of progress for one week | Subject to formal performance review and potential payroll impact. | HR & Line Manager`
  },
  'dq-functional-tracker-guidelines': {
    summary: `Unified system to monitor and manage all associate tasks across DQ factories. Provides real-time visibility into progress, performance, and task health, ensuring consistency and accountability.`,
    body: `# DQ Functional Tracker Guidelines

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
| WI Areas | Defines the key work item clusters or areas of focus. |
| Purpose | Clarifies the goal or intent of each work item area. |
| Tower | Represents the sub-units or focus areas under each factory. |
| Customer | Indicates the end customer or stakeholder benefiting from the task. |
| Priority (Level) | Reflects the urgency or importance of the task. |
| Priority (Scope) | Captures the task's impact or scope of influence. |
| Assignments | Lists all tasks and links them to their relevant Work Item Areas. |

## Task Structure (Planner)

Each task linked to the tracker (via Planner) must include:

| Guideline | Action Point |
|-----------|--------------|
| Context | A clear description of the task background or what it is addressing. |
| Purpose | Why does the task exist (value, impact, or problem it solves). |
| Approach | The method or steps to achieve the task. |
| Outcome | The tangible, measurable deliverable expected. |
| Relevant Links | References to supporting materials or outputs. |
| Checklist Items (CLIs) | Actionable subtasks with clear completion dates.`
  },
  'dq-agenda-scheduling-guidelines': {
    summary: `Standardized approach for planning, organizing, and executing meetings and sessions at DQ. Ensures clear objectives, proper scheduling, and productive outcomes.`,
    body: `# DQ Agenda & Scheduling Guidelines

Effective agenda planning and scheduling ensure DQ operates with discipline, alignment, and efficiency. These guidelines standardize how agendas are built and sessions are scheduled to maximize productivity and create clarity for all participants.

## Definition

Agenda and scheduling practices define the structured approach for planning, organizing, and executing meetings, workshops, and sessions. This includes setting clear objectives, sharing preparatory material in advance, aligning schedules to participant availability, and ensuring each session is purposeful, time-bound, and outcome-oriented.

## Purpose

Bring order, clarity, and predictability to DQ's working rhythm. Ensure time is respected, objectives are achieved, and every session contributes to progress.

## Key Characteristics

| Item | Description |
|------|-------------|
| Clear and Purposeful | Well-defined context, purpose, and logical flow. |
| Transparent and Accessible | Shared in advance for participant preparation. |
| Time-Disciplined | Scheduled within reasonable timeframes with strict overrun management. |
| Inclusive and Aligned | All relevant participants can join using Teams scheduling assistant. |
| Documented and Traceable | Recorded for future reference and accountability. |

## Types of Scheduling Practices

| Guideline | Action Point |
|-----------|--------------|
| Standard Meeting Booking | Schedule 24+ hours in advance with structured agenda. |
| Urgent Session Setup | Allow flexibility for urgent sessions (exception to 24-hour rule). |
| Recurring Meetings | Establish recurring schedules for regular Forums to reduce ad-hoc bookings. |
| Time-Zone Sensitivity | Account for global time differences when inviting associates. |
| Conflict Management | Use scheduling tools to identify and resolve calendar conflicts proactively. |

## Roles & Responsibilities

| Role | Action Point |
|-----|--------------|
| Facilitator | Owns agenda, drives discussion, manages time, ensures objectives achieved. |
| Note-taker | Captures key points, decisions, and action items in real time. |
| Organizer | Sends invites, checks availability, shares preparatory material. |
| Participants | Prepare in advance, actively engage, respect agenda and time boundaries. |

## Agenda Design Guidelines

### Context

| Guideline | Action Point |
|-----------|--------------|
| State Organizational Context | Briefly outline the current situation or challenges (e.g., growth spurt, governance gaps). |
| Link to Strategic Objectives | Clearly connect the agenda to broader organizational goals (e.g., visibility, governance, delivery performance). |
| Define the Forum | Specify why the session exists and how it contributes to ongoing governance or operational improvement. |

### Purpose

| Guideline | Action Point |
|-----------|--------------|
| State the Why (Intended Impact) | Explain why the session exists and the value it must create (e.g., "Align governance to sustain growth"). |
| Make Outcomes Explicit | Name the concrete outcomes/decisions expected (approve plan, confirm KPIs, assign owners & dates) rather than "discuss." |
| Keep Purpose Concise & Action-Led | Use 1–3 verb-led bullets that directly shape agenda sequencing and time-boxing. |

### Agenda Structure

| Guideline | Action Point |
|-----------|--------------|
| Focus on Core Priorities | Include items that align with the forum's main mandate. |
| Sequence Logically | Group items by related themes to ensure structured discussion. |
| Allow for Open Items | Include AoB (Any other Business) to capture additional, non-planned topics. |
| Keep Agenda Time-Boxed | Allocate time for each section to prevent overruns and ensure coverage of all topics. |

### Related Materials

| Guideline | Action Point |
|-----------|--------------|
| Attach Relevant Documents | Link supporting materials (e.g., trackers, governance decks) directly in the invite or agenda. |
| Keep Materials Updated | Ensure related documents are refreshed before each session to avoid outdated or conflicting information. |
| Capture Outcomes in Same Space | Store meeting notes, updated trackers, and decisions in the same repository to create a single source of truth.`
  },
  'dq-rescue-shift-guidelines': {
    summary: `Guidelines for managing rescue shifts to complete high-volume backlog work outside normal hours. Covers planning, execution, roles, and payroll.`,
    body: `# DQ Rescue Shift Guidelines

Rescue shifts help complete high-volume backlog work by allowing associates to work extra hours outside normal working time. These guidelines apply to all associates, project managers, scrum masters, line managers, and HR.

## Purpose

These guidelines ensure:

- Clear and consistent scheduling, tracking, and compensation
- Clear task specifications and time estimates
- Clear roles, responsibilities, and expectations
- Smooth coordination between associates, managers, and HR
- Timely completion of backlog tasks

## How It Works

**Shift Types:**
- **Weekday:** 4 hours after normal working hours
- **Weekend:** Hours agreed in advance

**Process Overview:**
1. **Planning** - Backlog compilation, effort estimates, approvals
2. **Execution** - Associates work during rescue hours with check-ins
3. **Payroll** - Payment only after task completion and manager confirmation

## Planning Process

### Step 1: Backlog Compilation
Project Manager/Coordinator compiles outstanding work items with:
- Clear specifications
- Estimated effort for each task

### Step 2: Check Availability
Project Manager/Coordinator coordinates with Scrum Master to:
- Confirm associate availability
- Agree on suitable timeslots

### Step 3: Link Tasks
All work items must link back to associate tasks/CLIs for tracking and visibility.

### Step 4: Get Line Manager Approval
Project Manager/Coordinator sends the proposed list (associates + tasks) to Line Manager for approval.

### Step 5: Get HR Approval
After Line Manager approval, send the list to HR for final validation.

### Step 6: Assign Moderator
Project Manager/Coordinator assigns a Moderator for each rescue shift to:
- Oversee progress
- Provide support when needed

### Step 7: Confirm Timing
- Confirm rescue shifts at the start of the week
- For urgent cases: confirm at least 2 days before the shift

### Step 8: Notify Associates
Officially notify associates about their scheduled shifts and tasks well in advance.

## During the Rescue Shift

### Join the Collab Call
Check in on your HR channel and join the Collab Call during your rescue hours.

### Confirm Your Tasks
Make sure you understand what you'll be working on. If unclear, ask the Moderator or your squad lead.

### Track Your Progress
Keep the team updated on your progress throughout the shift.

### Attend Check-ins
- There are 3 check-ins per day in the Collab Call
- You must attend at least one check-in during your shift

### Shift Cancellation
If you don't join the rescue shift within one hour of start time, the shift will be canceled.

## Roles & Responsibilities

### Project Manager/Coordinator
- Compile backlog items and estimate effort
- Coordinate with scrum masters for availability
- Get approvals from line managers and HR
- Notify associates about shifts
- Appoint moderators
- Confirm associate participation for payroll

### Scrum Master
- Confirm associate availability and timeslots
- Ensure tasks match associate skills and availability

### Line Manager
- Review and approve rescue shift lists
- Confirm associate participation and task progress

### HR
- Approve and validate rescue shift assignments
- Ensure payroll compliance

### Associates
- Confirm participation in rescue shifts
- Complete assigned tasks and report progress
- Attend at least one check-in per shift
- Follow up on issues with moderator or squad lead

## Working from Home During Rescue Shifts

### Submit WFH Request
Project Coordinator/Manager must submit a formal WFH request together with the rescue shift approval if associates need to work from home due to logistical concerns.

### Confirm Operational Capability
The request must confirm that the associate can perform all required activities effectively while working remotely.

### Follow Guidelines
Remote-working associates must follow all rescue shift guidelines:
- Stay responsive
- Deliver tasks on time
- Remain available throughout the shift

## Payroll

### Payment Requirements
Payment is processed only if:
- Associate completes all assigned tasks
- Project Manager or Line Manager verifies completion

### Non-Completion
If expectations are not met, the shift will not be compensated.

### Cancellation
If an associate doesn't join within one hour of start time:
- The shift is canceled
- No payment will be made`
  },
  'dq-scrum-master-guidelines': {
    summary: `DQ is implementing a unified Scrum Master Framework that empowers every associate to function as a Scrum Master, with responsibilities tailored to their organizational level. This framework replaces traditional hierarchical structures with a streamlined five-tier model designed to enhance agility, alignment, accountability, and delivery velocity across all business units.`,
    body: `# DQ Scrum Master Framework

## Overview

Digital Qatalyst is implementing a comprehensive Scrum Master Framework that empowers every associate to function as a Scrum Master, with responsibilities tailored to their organizational level and role. This innovative approach replaces traditional hierarchical structures—including Sector Leads, Factory Leads, Tower Leads, and conventional Scrum Masters—with a streamlined, five-tier Scrum Master model designed to enhance organizational agility, strategic alignment, accountability, and delivery velocity across all business units.

## Framework Purpose

This framework establishes clear guidelines that define the organizational structure, role definitions, responsibility matrices, and governance expectations for the new Scrum Master Framework. These guidelines ensure:

- **Standardization**: Consistent application across all organizational units
- **Clarity**: Well-defined responsibilities and expectations
- **Alignment**: Integration with DQ's core values of execution excellence, transparency, and accountability

## Position vs. Role: Key Distinctions

Understanding the difference between Position Scrum Masters and Role Scrum Masters is fundamental to the framework's implementation.

| Category | Description |
|----------|-------------|
| Position SM | A formal organizational role located within the Center of Excellence (EVMO) |
| Position Examples | SM (CoE), SM (Unit), SM (Delivery) |
| Multi-role Capability | Position SMs may assume additional functional roles, such as SM (Working Room), as operational needs require |
| Role SM | A functional responsibility assigned and executed on an as-needed basis |
| Role Examples | SM (Working Room), SM (ATP) |
| Universal Application | SM (ATP) applies to all associates regardless of position or level |

## SM (CoE) - Center of Excellence Position

The Center of Excellence Scrum Master serves as the governance and compliance anchor for the framework across the organization.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Organizational Location | Positioned within the CoE (EVMO) unit, serving as the central governance hub |
| Primary Function | Oversee governance, ensure compliance, and maintain adherence to DQ's L24 Working Room guidelines |
| Deployment Leadership | Actively participate in initial deployment phases, onboarding SM (Working Room) personnel and activating each Working Room |
| Operational Monitoring | Conduct comprehensive assessments across all Working Rooms post-deployment to verify guideline adherence and preserve Working Room operational integrity |
| Performance Management | Identify performance gaps, compliance issues, and operational deficiencies, ensuring corrective actions through Unit/Factory/Tower SMs |
| Standards Development | Create, maintain, and evolve Working Room guidelines covering structure, workflow, and performance expectations |
| Compliance Oversight | Guarantee guideline deployment and associate compliance across all organizational units |
| Continuous Improvement | Weekly optimization of guidelines based on operational observations, Working Room performance metrics, and stakeholder feedback |

## SM (Unit) - Organizational Unit Position

Unit Scrum Masters operate at three distinct organizational levels—Sector, Factory, and Tower—ensuring cohesive operations within their respective units.

### SM (Sector) - Sector Level

Sector Scrum Masters oversee multiple factories and ensure sector-wide operational excellence.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Operational Scope | DCO Operations, DBP Platform, and DBP Delivery sectors |
| Working Room Support | Provide SM (Working Room) services when operational requirements demand |
| Factory Governance | Ensure factories within the sector operate at optimal efficiency and alignment |
| Performance Visibility | Maintain comprehensive visibility into sector-level performance metrics and organizational health |
| Data Integrity | Ensure sector functional trackers are accurate, current, and reflective of actual performance |
| Issue Management | Identify operational gaps, escalate to Factory SMs, and drive resolution to completion |

### SM (Factory) - Factory Level

Factory Scrum Masters manage tower operations and ensure factory-level execution excellence.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Operational Scope | Examples include Finance Factory, Deals Factory, Solution Factory, and other factory-level units |
| Working Room Support | Provide SM (Working Room) services when operational needs arise |
| Tower Oversight | Ensure all towers within the factory operate effectively and meet performance standards |
| Strategic Planning | Establish clear, actionable plans at monthly, weekly, and daily intervals for each tower |
| Progress Monitoring | Track execution progress against established plans and maintain accurate factory-level performance trackers |
| ATP Validation | Review and validate Associate Task Plans (ATPs) for all factory associates |
| Blockage Resolution | Proactively identify and resolve operational blockers before they impact delivery |

### SM (Tower) - Tower Level

Tower Scrum Masters focus on tactical execution and day-to-day operational management.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Operational Scope | Examples include GPRC, Payables & Receivables, and other tower-level units |
| Target Establishment | Set clear, measurable targets at monthly, weekly, and daily intervals |
| Task Specification | Ensure all tower tasks have detailed specifications and deadlines that align with monthly and weekly target objectives |
| Performance Tracking | Monitor progress against plans and maintain accurate tower-level performance trackers |
| Blockage Management | Resolve operational blockers independently or escalate when resolution requires higher-level intervention |
| Communication | Maintain transparent communication of plans, progress, and blockers through appropriate team channels |

## SM (Working Room) - Functional Role

Working Room Scrum Masters facilitate daily operational sessions and ensure focused execution.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Session Facilitation | Lead Daily Working Room sessions with clear structure and purpose |
| Focus Management | Maintain session focus on execution and measurable outcomes, minimizing distractions |
| Engagement Monitoring | Track participant attendance, engagement levels, and task progress throughout sessions |
| Real-time Support | Mobilize resources and support in real-time to resolve blockers as they arise |
| Routine Execution | Conduct Collaborative Working Sessions (CWS) and Retrospectives according to weekly agenda |
| Cultural Alignment | Uphold DQ's core cultural values: accountability, collaboration, and delivery momentum |
| Progress Reporting | Post daily progress updates and unresolved items on relevant communication channels |
| Context Enablement | Ensure associates understand the broader context and purpose of tasks, enabling meaningful progress that delivers tangible value |

## SM (Delivery) - Project-Specific Position

Delivery Scrum Masters provide dedicated support for specific projects, ensuring cross-functional coordination.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Project Scope | Serve as dedicated Scrum Master for assigned projects |
| Cross-functional Participation | Operate across all Working Rooms where the project is active (e.g., DFSA Project spans WR/Breakout rooms for DevOps and WR/Breakout rooms for Solution) |
| Delivery Coordination | Ensure project tasks progress smoothly across all organizational units |
| Control Tower Management | Conduct weekly Control Tower sessions for respective projects |
| Visibility Maintenance | Maintain comprehensive visibility and alignment across all Working Rooms connected to the project |
| Risk Management | Proactively identify, escalate, and ensure resolution of risks, delays, and blockers |

## SM (ATP - Associate) - Universal Role

Every associate functions as their own Scrum Master, taking personal ownership of their work and delivery.

| Responsibility Area | Detailed Description |
|-------------------|---------------------|
| Universal Application | Every associate acts as their own Scrum Master, regardless of position or level |
| Planning Discipline | Ensure each ATP task is linked to Planner with comprehensive context, clear purpose, defined approach, and specified Command Line Interfaces (CLIs) |
| Specification Excellence | Define detailed specifications and realistic deadlines for each assigned task |
| Progress Transparency | Maintain daily and weekly visibility on personal progress and task completion |
| Self-management | Independently manage blockers and escalate only when resolution requires additional support or resources |
| Accountability Standards | Uphold personal accountability and meet delivery expectations consistently |

## Implementation Benefits

This framework delivers significant organizational advantages:

- **Enhanced Agility**: Faster response to changing business needs
- **Improved Alignment**: Better coordination across organizational levels
- **Increased Accountability**: Clear ownership and responsibility at every level
- **Accelerated Delivery**: Streamlined processes that reduce friction and increase velocity
- **Cultural Consistency**: Unified approach to execution across all units

## Conclusion

The DQ Scrum Master Framework represents a transformative approach to organizational agility and delivery excellence. By empowering associates at every level with Scrum Master capabilities, DQ creates a culture of ownership, accountability, and continuous improvement that drives sustainable business value.`
  }
}

async function restoreOriginalContent() {
  console.log('🔄 Restoring original content to guidelines...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, content] of Object.entries(originalContent)) {
    const { data, error } = await supabase
      .from('guides')
      .update({
        summary: content.summary,
        body: content.body,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('title')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else if (data) {
      console.log(`✅ Restored original content: "${data.title}"`)
      updated++
    } else {
      console.log(`⚠️  Guideline not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

restoreOriginalContent().catch(console.error)

