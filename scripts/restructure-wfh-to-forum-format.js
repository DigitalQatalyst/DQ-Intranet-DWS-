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

// Restructured to match Forum Guidelines format - concise, action-oriented, with tables
const wfhGuidelineBody = `# DQ Work From Home (WFH) Guidelines

<div class="feature-box">

## Purpose

Define process and expectations for associates working remotely. Ensure all WFH arrangements are pre-approved, transparent, and aligned with DQ's business continuity and performance expectations.

</div>

<div class="feature-box">

## Scope

Applies to all DQ associates who may occasionally or regularly work remotely upon approval from their Line Managers.

</div>

<div class="feature-box">

## Core Components

| # | Program | Description |
|---|---------|-------------|
| 01 | Request Process | All WFH requests must be submitted at least 24 hours in advance through the HR Channel, clearly stating the reason and date(s) requested. |
| 02 | Approval Oversight | **Line Manager**: Provides pre-approval.<br>**HR**: Gives final approval and ensures policy compliance.<br>**HRA**: Manages compliance, tracking, and consistency. |
| 03 | Visibility and Tracking | Approved WFH schedules must be visible in the logistics channel and be approved in writing by the line manager.<br><br>Associates must create a thread on the HR Channel, posting their actions for the day and attaching channel engagement links for visibility.<br><br>Attendance is tracked via DQ Live.<br><br>In emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device. |
| 04 | Compliance and Performance | Failure to post daily updates or remain active on DQ Live24 will be treated as an unpaid workday.<br><br>Non-compliance may result in revocation of WFH privileges or performance review. |

</div>

<div class="feature-box">

## Roles and Responsibilities

| Key Steps | Description |
|-----------|-------------|
| 01 | **Associate**<br>Must submit WFH requests via HR Channel, post daily actions on HR channel, and stay active on DQ Live24. |
| 02 | **Line Manager**<br>Pre-approves requests, monitors deliverables. |
| 03 | **HR**<br>Manage WFH requests. Give final approval. |
| 04 | **HR & Admin**<br>Oversee compliance, tracking, and consistency. |

</div>

<div class="feature-box">

## Guiding Principles and Controls

- **Transparency**: All WFH activities must be visible to managers and teams
- **Accountability**: Associates remain responsible for deliverables and communication
- **Equity**: WFH approvals are granted fairly based on role and operational needs
- **Security**: All company data handled remotely must follow DQ's data protection standards
- **Compliance**: Violations may lead to privilege suspension or disciplinary review

</div>

<div class="feature-box">

## Tools and Resources

- **DQ Live24**: For visibility and communication
- **DQ Shifts**: For time tracking and attendance management
- **DQ Logistics Channel**: For sharing approved WFH schedules
- **HR Portal**: For submitting requests and tracking WFH history

</div>

<div class="feature-box">

## Key Performance Indicators (KPIs)

- Percentage of associates compliant with WFH submission deadlines
- Number of unapproved or non-compliant WFH incidents
- Percentage of WFH attendance recorded via DQ Shifts
- Associate satisfaction and productivity levels during WFH
- Frequency of policy violations or exceptions reported

</div>

<div class="feature-box">

## Review and Update Schedule

- **Quarterly**: The guidelines will be reviewed every three months to ensure they remain aligned with operational needs
- **Ad-Hoc Optimization**: The guidelines can be optimized at any time if a need for optimization is identified

</div>`;

async function restructureWFHGuideline() {
  console.log('📝 Restructuring WFH Guidelines to match Forum Guidelines format...\n');

  const { data, error } = await supabase
    .from('guides')
    .update({
      body: wfhGuidelineBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dq-wfh-guidelines')
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error updating guide:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ Guide not found');
    return;
  }

  console.log('✅ Successfully restructured WFH Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 Changes made:');
  console.log('   ✅ Reduced from 14 sections to 8 sections');
  console.log('   ✅ Made content concise and action-oriented');
  console.log('   ✅ Added tables for Core Components and Roles & Responsibilities');
  console.log('   ✅ Removed long explanations and context');
  console.log('   ✅ Removed H3 subsections');
  console.log('   ✅ Matches Forum Guidelines format exactly');
  console.log('\n📊 Now includes:');
  console.log('   - Purpose (concise)');
  console.log('   - Scope (one sentence)');
  console.log('   - Core Components (table with 4 rows)');
  console.log('   - Roles and Responsibilities (table with 4 rows)');
  console.log('   - Guiding Principles (bullet points)');
  console.log('   - Tools and Resources (bullet points)');
  console.log('   - KPIs (bullet points)');
  console.log('   - Review Schedule (bullet points)');
}

restructureWFHGuideline().catch(console.error);


