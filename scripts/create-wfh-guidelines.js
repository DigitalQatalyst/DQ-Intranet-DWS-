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

const wfhGuideline = {
  slug: 'dq-wfh-guidelines',
  title: 'DQ Work From Home (WFH) Guidelines',
  summary: 'Comprehensive guidelines for DQ associates working remotely, ensuring productivity, accountability, and collaboration remain consistent across flexible working models.',
  domain: 'guidelines',
  sub_domain: null,
  guide_type: 'Guideline',
  status: 'Approved',
  hero_image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&q=80',
  body: `# Work From Home (WFH) Guidelines

## Context

The Work From Home (WFH) Guidelines are designed to align DQ's remote work practices with the company's operational, cultural, and compliance standards.

As the organization continues to adopt flexible working models, it is essential to establish clear structures that ensure productivity, accountability, and collaboration remain consistent — whether associates are working remotely or from the office.

These guidelines provide a unified framework for associates, Practice Leads, and the DQ Operations (DQ Ops) team to coordinate and manage WFH arrangements transparently and efficiently.

## Overview

The main objective of the WFH Guidelines is to ensure that remote work:

- Maintains high standards of performance and accountability.
- Promotes operational consistency across all DQ practices.
- Supports flexible work arrangements without compromising team collaboration.
- Provides clear approval, tracking, and visibility mechanisms.

## Purpose and Scope

### Purpose

The purpose of these guidelines is to define the process and expectations for associates working remotely. They ensure all WFH arrangements are pre-approved, transparent, and aligned with DQ's business continuity and performance expectations.

### Scope

These guidelines apply to all DQ associates who may occasionally or regularly work remotely upon approval from their Line Managers.

## Core Components

The Guidelines comprises of:

### 01. Request Process

All WFH requests must be submitted at least 24 hours in advance through the HR Channel, clearly stating the reason and date(s) requested.

### 02. Approval Oversight

- **Line Manager**: Provides pre-approval.
- **HR**: Gives final approval and ensures policy compliance.
- **HRA**: Manages compliance, tracking, and consistency.

### 03. Visibility and Tracking

- Approved WFH schedules must be visible in the logistics channel and be approved in writing by the line manager.
- Associates must create a thread on the HR Channel, posting their actions for the day and attaching channel engagement links for visibility.
- Attendance is tracked via DQ Live.

In emergency cases where a personal device is temporarily unavailable, associates may "Hold Their Own Device" by borrowing a company device.

### 04. Compliance and Performance

- Failure to post daily updates or remain active on DQ Live24 will be treated as an unpaid workday.
- Non-compliance may result in revocation of WFH privileges or performance review.

## Roles and Responsibilities

To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:

### Associate

Must submit WFH requests via HR Channel, post daily actions on HR channel, and stay active on DQ Live24.

### Line Manager

Pre-approves requests, monitors deliverables.

### HR

- Manage WFH requests.
- Give final approval.

### HR & Admin

Oversee compliance, tracking, and consistency.

## Guiding Principles and Controls

- **Transparency**: All WFH activities must be visible to managers and teams.
- **Accountability**: Associates remain responsible for deliverables and communication.
- **Equity**: WFH approvals are granted fairly based on role and operational needs.
- **Security**: All company data handled remotely must follow DQ's data protection standards.
- **Compliance**: Violations may lead to privilege suspension or disciplinary review.

## Tools and Resources

- **DQ Live24**: For visibility and communication.
- **DQ Shifts**: For time tracking and attendance management.
- **DQ Logistics Channel**: For sharing approved WFH schedules.
- **HR Portal**: For submitting requests and tracking WFH history.

## Key Performance Indicators (KPIs)

- Percentage of associates compliant with WFH submission deadlines.
- Number of unapproved or non-compliant WFH incidents.
- Percentage of WFH attendance recorded via DQ Shifts.
- Associate satisfaction and productivity levels during WFH.
- Frequency of policy violations or exceptions reported.

## Review and Update Schedule

- **Quarterly**: The guidelines will be reviewed every three months to ensure they remain aligned with operational needs.
- **Ad-Hoc Optimization**: The guidelines can be optimized at any time if a need for optimization is identified.

## Appendix

- **Appendix A**: WFH Request Template
- **Appendix B**: DQ Shifts Attendance Guide
- **Appendix C**: Remote Work Security Checklist`
};

async function createWFHGuideline() {
  console.log('📝 Creating DQ Work From Home (WFH) Guidelines...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, slug, title')
    .eq('slug', wfhGuideline.slug)
    .maybeSingle();

  if (existing) {
    console.log(`⚠️  Guide with slug "${wfhGuideline.slug}" already exists:`);
    console.log(`   Title: ${existing.title}`);
    console.log(`\n🔄 Updating existing guide...\n`);
    
    const { data, error } = await supabase
      .from('guides')
      .update({
        title: wfhGuideline.title,
        summary: wfhGuideline.summary,
        body: wfhGuideline.body,
        domain: wfhGuideline.domain,
        sub_domain: wfhGuideline.sub_domain,
        guide_type: wfhGuideline.guide_type,
        status: wfhGuideline.status,
        hero_image_url: wfhGuideline.hero_image_url,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', wfhGuideline.slug)
      .select('id, slug, title, status');

    if (error) {
      console.error('❌ Error updating guide:', error);
      return;
    }

    console.log('✅ Successfully updated WFH Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Slug: ${data[0].slug}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Status: ${data[0].status}`);
  } else {
    const { data, error } = await supabase
      .from('guides')
      .insert({
        ...wfhGuideline,
        last_updated_at: new Date().toISOString()
      })
      .select('id, slug, title, status');

    if (error) {
      console.error('❌ Error creating guide:', error);
      return;
    }

    console.log('✅ Successfully created WFH Guidelines!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Slug: ${data[0].slug}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Status: ${data[0].status}`);
  }

  console.log('\n📋 The guideline is now available on the Guidelines tab!');
}

createWFHGuideline().catch(console.error);

