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

const wfhGuidelineBody = `# DQ Work From Home (WFH) Guidelines

<div class="feature-box">

## Context

The Work From Home (WFH) Guidelines are designed to align DQ's remote work practices with the company's operational, cultural, and compliance standards.

As the organization continues to adopt flexible working models, it is essential to establish clear structures that ensure productivity, accountability, and collaboration remain consistent — whether associates are working remotely or from the office.

These guidelines provide a unified framework for associates, Practice Leads, and the DQ Operations (DQ Ops) team to coordinate and manage WFH arrangements transparently and efficiently.

</div>

<div class="feature-box">

## Overview

The main objective of the WFH Guidelines is to ensure that remote work:

- Maintains high standards of performance and accountability.
- Promotes operational consistency across all DQ practices.
- Supports flexible work arrangements without compromising team collaboration.
- Provides clear approval, tracking, and visibility mechanisms.

</div>

<div class="feature-box">

## Purpose

The purpose of these guidelines is to define the process and expectations for associates working remotely. They ensure all WFH arrangements are pre-approved, transparent, and aligned with DQ's business continuity and performance expectations.

</div>

<div class="feature-box">

## Scope

These guidelines apply to all DQ associates who may occasionally or regularly work remotely upon approval from their Line Managers.

</div>

<div class="feature-box">

## Request Process

All WFH requests must be submitted at least 24 hours in advance through the HR Channel, clearly stating the reason and date(s) requested.

</div>

<div class="feature-box">

## Approval Oversight

- **Line Manager**: Provides pre-approval.
- **HR**: Gives final approval and ensures policy compliance.
- **HRA**: Manages compliance, tracking, and consistency.

</div>

<div class="feature-box">

## Visibility and Tracking

- Approved WFH schedules must be visible in the logistics channel and be approved in writing by the line manager.
- Associates must create a thread on the HR Channel, posting their actions for the day and attaching channel engagement links for visibility.
- Attendance is tracked via DQ Live.

In emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device.

</div>

<div class="feature-box">

## Compliance and Performance

- Failure to post daily updates or remain active on DQ Live24 will be treated as an unpaid workday.
- Non-compliance may result in revocation of WFH privileges or performance review.

</div>

<div class="feature-box">

## Roles and Responsibilities

### Associate

Must submit WFH requests via HR Channel, post daily actions on HR channel, and stay active on DQ Live24.

### Line Manager

Pre-approves requests, monitors deliverables.

### HR

- Manage WFH requests.
- Give final approval.

### HR & Admin

Oversee compliance, tracking, and consistency.

</div>

<div class="feature-box">

## Guiding Principles and Controls

- **Transparency**: All WFH activities must be visible to managers and teams.
- **Accountability**: Associates remain responsible for deliverables and communication.
- **Equity**: WFH approvals are granted fairly based on role and operational needs.
- **Security**: All company data handled remotely must follow DQ's data protection standards.
- **Compliance**: Violations may lead to privilege suspension or disciplinary review.

</div>

<div class="feature-box">

## Tools and Resources

- **DQ Live24**: For visibility and communication.
- **DQ Shifts**: For time tracking and attendance management.
- **DQ Logistics Channel**: For sharing approved WFH schedules.
- **HR Portal**: For submitting requests and tracking WFH history.

</div>

<div class="feature-box">

## Key Performance Indicators (KPIs)

- Percentage of associates compliant with WFH submission deadlines.
- Number of unapproved or non-compliant WFH incidents.
- Percentage of WFH attendance recorded via DQ Shifts.
- Associate satisfaction and productivity levels during WFH.
- Frequency of policy violations or exceptions reported.

</div>

<div class="feature-box">

## Review and Update Schedule

- **Quarterly**: The guidelines will be reviewed every three months to ensure they remain aligned with operational needs.
- **Ad-Hoc Optimization**: The guidelines can be optimized at any time if a need for optimization is identified.

</div>

<div class="feature-box">

## Appendix

- **Appendix A**: WFH Request Template
- **Appendix B**: DQ Shifts Attendance Guide
- **Appendix C**: Remote Work Security Checklist

</div>`;

async function updateWFHGuidelineFormat() {
  console.log('📝 Updating DQ Work From Home (WFH) Guidelines format...\n');

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

  console.log('✅ Successfully updated WFH Guidelines format!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline now follows the same format as other guidelines in the tab!');
}

updateWFHGuidelineFormat().catch(console.error);


