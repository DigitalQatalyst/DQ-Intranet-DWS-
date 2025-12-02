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

const RESCUE_SHIFT_SUMMARY = `Guidelines for managing rescue shifts to complete high-volume backlog work outside normal hours.`;

const RESCUE_SHIFT_BODY = `# DQ Rescue Shift Guidelines

## Description

Rescue shifts help complete high-volume backlog work by allowing associates to work extra hours outside normal working time. These guidelines ensure clear processes for scheduling, tracking, and compensating rescue shifts. They apply to all associates, project managers, scrum masters, line managers, and HR involved in coordinating and executing rescue shifts.


## **Key Highlights**

- **Shift Types:** Weekday (4 hours post-working hours) and Weekend (agreed hours)
- **Planning:** Backlog compilation, availability checks, and approvals from Line Manager and HR
- **Execution:** Work during designated hours with mandatory check-ins
- **Payroll:** Payment only after task completion and manager confirmation
- **Remote Work:** WFH requests must be submitted with rescue shift approval
- **Compliance:** Shift canceled if associate doesn't join within one hour


## **Planning Process**

**Step 1: Backlog Compilation**
Project Manager compiles outstanding work items with specifications and effort estimates.

**Step 2: Check Availability**
Coordinate with Scrum Master to confirm associate availability and timeslots.

**Step 3: Link Tasks**
All work items must link back to associate tasks/CLIs for tracking.

**Step 4: Get Approvals**
Send proposed list to Line Manager, then HR for final approval.

**Step 5: Assign Moderator**
Assign a Moderator to oversee progress and provide support.

**Step 6: Confirm & Notify**
Confirm shifts at week start (or 2 days before for urgent cases) and notify associates.


## **During the Shift**

**Join Collab Call**
Check in on HR channel and join the Collab Call during rescue hours.

**Confirm Tasks**
Understand your assigned tasks. Ask Moderator or squad lead if unclear.

**Track Progress**
Keep the team updated on your progress throughout the shift.

**Attend Check-ins**
Attend at least one of the 3 daily check-ins in the Collab Call.

**Shift Cancellation**
If you don't join within one hour of start time, the shift is canceled.


## **Roles & Responsibilities**

**Project Manager/Coordinator**
Compile backlog, coordinate availability, get approvals, notify associates, and confirm participation for payroll.

**Scrum Master**
Confirm associate availability and ensure tasks match skills.

**Line Manager**
Review and approve rescue shift lists, confirm participation and progress.

**HR**
Approve assignments and ensure payroll compliance.

**Associates**
Confirm participation, complete tasks, report progress, attend check-ins, and follow up on issues.


## **Working from Home**

Submit WFH request with rescue shift approval. Confirm associate can perform all activities remotely. Remote associates must follow all guidelines: stay responsive, deliver on time, and remain available.


## **Payroll**

Payment processed only after task completion and manager verification. No payment for incomplete tasks or if shift is canceled.`;

async function fixRescueShiftSpacing() {
  console.log('📝 Fixing spacing between Description and Key Highlights...\n');

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
  console.log('Adding space between Description and Key Highlights...\n');

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
    console.log('✅ Successfully updated!');
    console.log('   - Added blank line between Description and Key Highlights');
    console.log('   - Proper spacing now in place');
  }
}

fixRescueShiftSpacing().catch(console.error);

