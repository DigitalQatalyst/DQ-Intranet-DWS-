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

// Reorganize content into structured sections for tabs
const LEAVE_GUIDELINES_BODY = `# Leave Guidelines

## Description

Guidance on leave types, eligibility, approvals and documentation.

## **Key Highlights**

- Multiple leave types: Annual, Sick, Emergency, Unpaid

- Clear eligibility and approval processes

- Documentation requirements and compliance

## **Leave Types**

Annual leave: Paid time off accrued monthly

Sick leave: For illness; medical certificate required if >2 days

Emergency leave: Unplanned urgent situations; manager notification ASAP

Unpaid leave: Manager + HR approval required

## **Eligibility**

Full-time employees accrue leave from day 1

Part-time/contractors: pro-rated where applicable

## **Request Process**

Check team calendar and coverage

Submit request in HR system with dates and type

Manager approves; HR confirms balance

Update OOO message and calendar

## **Documentation**

Attach medical notes for sick leave >2 days

Keep records for audit (12 months)

## **Blackout Periods**

Critical business windows require director approval

## **Escalation**

Unresolved issues → HR Business Partner`;

async function reorganizeLeaveGuidelines() {
  console.log('📝 Reorganizing Leave Guidelines for tabbed navigation...\n');

  const { data: guide, error: findError } = await supabase
    .from('guides')
    .select('id, title')
    .eq('domain', 'Guidelines')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved')
    .maybeSingle();

  if (findError) {
    console.error('❌ Error finding guide:', findError);
    return;
  }

  if (!guide) {
    console.log('Leave Guidelines not found');
    return;
  }

  console.log(`Found: "${guide.title}" (ID: ${guide.id})`);
  console.log('Updating content structure for tabs...\n');

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      body: LEAVE_GUIDELINES_BODY,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', guide.id);

  if (updateError) {
    console.error(`❌ Error updating: ${updateError.message}`);
  } else {
    console.log('✅ Successfully reorganized Leave Guidelines!');
    console.log('   Content is now structured for tabbed navigation');
  }
}

reorganizeLeaveGuidelines().catch(console.error);

