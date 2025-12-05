import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RESCUE_SHIFT_SUMMARY = `Guidelines for managing rescue shifts to complete high-volume backlog work outside normal hours. Covers planning, execution, roles, and payroll.`;

const RESCUE_SHIFT_BODY = `# DQ Rescue Shift Guidelines

## Description

Rescue shifts help complete high-volume backlog work by allowing associates to work extra hours outside normal working time. These guidelines ensure clear processes for scheduling, tracking, and compensating rescue shifts. They apply to all associates, project managers, scrum masters, line managers, and HR involved in coordinating and executing rescue shifts.

## Key Highlights

- **Shift Types:** Weekday (4 hours post-working hours) and Weekend (agreed hours)
- **Planning Process:** Backlog compilation, availability checks, task linkage, and approvals from Line Manager and HR
- **Execution:** Associates work during designated rescue hours with mandatory check-ins and progress tracking
- **Payroll:** Payment processed only after task completion and manager confirmation
- **Roles Defined:** Clear responsibilities for Project Managers, Scrum Masters, Line Managers, HR, and Associates
- **Remote Work:** WFH requests must be submitted with rescue shift approval and operational confirmation
- **Compliance:** Shift cancellation if associate doesn't join within one hour; no payment for incomplete tasks

## Planning Process

### Step 1: Backlog Compilation
Project Manager/Coordinator compiles outstanding work items with clear specifications and estimated effort for each task.

### Step 2: Check Availability
Project Manager/Coordinator coordinates with Scrum Master to confirm associate availability and agree on suitable timeslots.

### Step 3: Link Tasks
All work items must link back to associate tasks/CLIs for tracking and visibility.

### Step 4: Get Line Manager Approval
Project Manager/Coordinator sends the proposed list (associates + tasks) to Line Manager for approval.

### Step 5: Get HR Approval
After Line Manager approval, send the list to HR for final validation.

### Step 6: Assign Moderator
Project Manager/Coordinator assigns a Moderator for each rescue shift to oversee progress and provide support.

### Step 7: Confirm Timing
Confirm rescue shifts at the start of the week, or at least 2 days before for urgent cases.

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
There are 3 check-ins per day in the Collab Call. You must attend at least one check-in during your shift.

### Shift Cancellation
If you don't join the rescue shift within one hour of start time, the shift will be canceled.

## Roles & Responsibilities

### Project Manager/Coordinator
- Compile backlog items and estimate effort
- Coordinate with scrum masters for availability
- Get approvals from line managers and HR
- Notify associates about shifts and appoint moderators
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

Project Coordinator/Manager must submit a formal WFH request together with the rescue shift approval if associates need to work from home due to logistical concerns. The request must confirm that the associate can perform all required activities effectively while working remotely. Remote-working associates must follow all rescue shift guidelines: stay responsive, deliver tasks on time, and remain available throughout the shift.

## Payroll

Payment is processed only if the associate completes all assigned tasks and the Project Manager or Line Manager verifies completion. If expectations are not met, the shift will not be compensated. If an associate doesn't join within one hour of start time, the shift is canceled and no payment will be made.`;

async function updateRescueShiftGuidelines() {
  console.log('📝 Updating Rescue Shift Guidelines to match the format...\n');

  const { data: guide, error: findError } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Rescue Shift%')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved')
    .maybeSingle();

  if (findError) {
    console.error('❌ Error finding guide:', findError);
    return;
  }

  if (!guide) {
    console.log('❌ Rescue Shift Guidelines not found');
    return;
  }

  console.log(`Found: "${guide.title}" (ID: ${guide.id})`);
  console.log('Updating with Description and Key Highlights format...\n');

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      summary: RESCUE_SHIFT_SUMMARY,
      body: RESCUE_SHIFT_BODY,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', guide.id);

  if (updateError) {
    console.error(`❌ Error updating: ${updateError.message}`);
  } else {
    console.log('✅ Successfully updated Rescue Shift Guidelines!');
    console.log('   - Added Description section');
    console.log('   - Added Key Highlights section with bullet points');
    console.log('   - Maintained detailed sections below');
  }
}

updateRescueShiftGuidelines().catch(console.error);

