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

// Comprehensive Forum Guidelines content
const FORUM_GUIDELINES_SUMMARY = `Forums are a cornerstone of how Digital Qatalyst (DQ) collaborates, governs, and drives progress. They provide a structured environment for teams and stakeholders to align on objectives, share insights, resolve challenges, and make informed decisions.`;

const FORUM_GUIDELINES_BODY = `# Forum Guidelines

Forums are a cornerstone of how Digital Qatalyst (DQ) collaborates, governs, and drives progress. They provide a structured environment for teams and stakeholders to align on objectives, share insights, resolve challenges, and make informed decisions. To ensure every Forum operates with clarity, efficiency, and purpose, these guidelines establish a common framework that reflects DQ's culture, strategic ambitions, and commitment to operational excellence. By following them, we create a consistent experience that maximizes value for both participants and the organization.

## Forum Definition

In the context of Digital Qatalyst (DQ), a Forum is a structured platform — physical, virtual, or hybrid — designed to facilitate focused discussions, collaboration, and knowledge sharing among targeted participants. Forums are organized around specific topics, projects, domains, or strategic objectives, enabling associates to exchange ideas, provide updates, solve problems, and align on decisions.

## Forum Purpose

The core function of a Forum is to bring together the right people at the right time to address defined objectives. Forums act as an essential governance and collaboration mechanism within DQ, ensuring that decisions are made efficiently, updates are communicated transparently, and collective expertise is leveraged to drive progress.

## Key Characteristics

The following key characteristics define how Forums are structured and conducted across DQ to ensure consistency, alignment, and value delivery.

| # | Item | Description |
|---|------|-------------|
| 01 | Structured and Goal-Oriented | Forums are scheduled with a clear agenda, expected outcomes, and defined timeframes to maintain focus and productivity. |
| 02 | Collaborative Environment | Forums encourage open participation, respectful dialogue, and constructive feedback among all participants. |
| 03 | Aligned to DQ Objectives | Each Forum serves a specific role in advancing DQ's projects, products, or strategic initiatives. |
| 04 | Documented Outcomes | Forums produce records such as minutes, action items, or decisions, which are archived for transparency and future reference. |

## Types of Forums

DQ uses different types of Forums to serve specific purposes — from daily alignment to urgent problem-solving. Each type of Forum is designed to maximize efficiency, foster collaboration, and ensure timely decision-making.

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Scrum | A short, structured daily meeting where the whole team aligns on what was achieved the previous day, what is planned for the current day, and any blockers that need attention. |
| 02 | Control Tower | A review session focused on the overall status and health of a project or initiative, ensuring alignment with timelines and strategic goals. |
| 03 | Collaborative Working Session (CWS) | A planned, hands-on session where participants work together in real-time to solve problems, develop deliverables, or progress specific tasks. |
| 04 | Urgent Working Session (UWS) | A quickly organized session to address critical issues or urgent matters that require immediate discussion and resolution. |
| 05 | Blitz Working Session (BWS) | An intensive, time-boxed session designed to rapidly complete a set of tasks or meet a pressing deadline, often involving cross-functional collaboration. |
| 06 | Retrospective (Retro) | A reflective session held after a sprint, project phase, or major activity to evaluate what went well, what could be improved, and how to apply lessons learned moving forward. |

## Guidelines for Preparation Before the Forum

Proper preparation is critical to the success of any Forum. The following guidelines ensure that all contextual, and role-based requirements are addressed before the session begins.

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Include Context, Purpose, and Agenda in Invite | When setting up the Forum, clearly state the context, purpose, agenda, and any related materials in the Teams invite so participants are fully informed. |
| 02 | Ensure All Relevant Participants Are Invited | Identify and invite all associates who need to be part of the Forum, ensuring they receive timely notification. |
| 03 | Check Participants' Availability | Review participant calendars to confirm availability and avoid double booking expect in case of an UWS. (Use Scheduling Assistance on teams) |
| 04 | Book Sessions in Advance | Schedule all Forum sessions at least 24 hours before the meeting time. The only exception to this is UWS. |
| 05 | Assign Roles in Advance | Clearly assign who will serve as the facilitator, note-taker, and presenters for the Forum before the meeting is held. |

## Guidelines During the Forum

The effectiveness of a Forum depends on how it is conducted in real time. The following guidelines outline best practices to ensure productive discussions, clear decision-making, and active engagement during the session.

| # | Guideline | Action Point |
|---|-----------|--------------|
| 01 | Confirm Attendance at Start | At the beginning of the Forum, verify that all required participants are present and note any absentees. |
| 02 | Start on Time | Begin the Forum promptly to respect participants' schedules and maintain time discipline. |
| 03 | Reconfirm Context, Purpose, and Agenda | Open the session by restating the Forum's context, purpose, and agenda to align all participants. |
| 04 | Facilitate Structured Discussion | The facilitator should guide the discussion, ensuring each agenda item is addressed without deviation. |
| 05 | Encourage Active Participation | Create space for all relevant participants to contribute ideas, feedback, and updates. |
| 06 | Manage Time per Agenda Item | Allocate appropriate time to each topic and prevent prolonged discussion on non-critical points. |
| 07 | Capture Decisions and Action Items in Real Time | The note-taker should record decisions, assigned owners, and deadlines as they are agreed upon. |
| 08 | Address Blockers Promptly | Identify and discuss blockers, escalating unresolved issues if necessary |
| 09 | Summarize Before Closing | Recap the key points, decisions, and next steps before ending the Forum. |

## Guidelines After the Forum

The value of a Forum is fully realized when discussions and decisions are translated into clear actions. The following guidelines ensure timely documentation, accountability, and follow-through after the session ends.

| # | Type | Example |
|---|------|---------|
| 01 | Share Meeting Notes in Teams Channels | Post the meeting notes in the respective Teams channel within 24 hours, clearly listing all action items along with assigned owners and timelines for closure. |
| 02 | Confirm Action Item Ownership | Ensure all assigned owners acknowledge their responsibilities and deadlines. |
| 03 | Follow Up on Outstanding Items | Monitor progress on agreed actions and address delays before the next scheduled Forum. |
| 04 | Document Lessons Learned | Capture insights, improvement points, and good practices for future Forums. |
| 05 | Close the Loop with Associates | Share key outcomes with stakeholders who were not present but are impacted by the decisions made.`;

async function updateForumGuidelines() {
  console.log('🔄 Updating Forum Guidelines with comprehensive details...\n');

  // Fetch existing Forum Guidelines
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, domain')
    .ilike('title', '%Forum Guidelines%')
    .eq('status', 'Approved');

  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('❌ No Forum Guidelines found to update');
    return;
  }

  console.log(`📊 Found ${guides.length} Forum Guidelines entries to update\n`);

  // Update each entry
  for (const guide of guides) {
    console.log(`\n🔄 Updating: ${guide.title} (ID: ${guide.id})`);
    console.log(`   Current Domain: ${guide.domain || 'N/A'}`);

    // Determine if this should be Guidelines or Blueprint
    // Based on the check, one has domain "Blueprint" and one has domain "N/A"
    // We'll keep the Blueprint one as Blueprint, but ensure the other is Guidelines
    const shouldBeGuidelines = !guide.domain || guide.domain === 'N/A' || guide.domain.toLowerCase() !== 'blueprint';
    const newDomain = shouldBeGuidelines ? 'Guidelines' : 'Blueprint';

    const updateData = {
      summary: FORUM_GUIDELINES_SUMMARY,
      body: FORUM_GUIDELINES_BODY,
      domain: newDomain,
      guide_type: 'Policy',
      sub_domain: shouldBeGuidelines ? 'resources' : null,
      last_updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('guides')
      .update(updateData)
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error updating: ${updateError.message}`);
    } else {
      console.log(`   ✅ Successfully updated`);
      console.log(`   - Summary: ${FORUM_GUIDELINES_SUMMARY.substring(0, 80)}...`);
      console.log(`   - Body length: ${FORUM_GUIDELINES_BODY.length} characters`);
      console.log(`   - Domain: ${newDomain}`);
      console.log(`   - Guide Type: Policy`);
    }
  }

  console.log('\n✅ Forum Guidelines update complete!');
}

updateForumGuidelines().catch(console.error);

