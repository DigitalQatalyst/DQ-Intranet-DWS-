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

function formatGuide(title, description, keyHighlights, sections) {
  let body = `# ${title}\n\n## Description\n\n${description}\n\n`;
  
  if (keyHighlights && keyHighlights.length > 0) {
    body += `## **Key Highlights**\n\n`;
    keyHighlights.forEach((item, index) => {
      body += `- ${item}\n`;
      if (index < keyHighlights.length - 1) body += `\n`;
    });
    body += `\n`;
  }
  
  if (sections && sections.length > 0) {
    sections.forEach((section, index) => {
      body += `## **${section.title}**\n\n`;
      if (Array.isArray(section.items)) {
        section.items.forEach((item, itemIndex) => {
          if (typeof item === 'string') {
            body += `${item}\n`;
          } else {
            body += `${item.title || item.label}\n`;
            if (item.content) body += `${item.content}\n`;
          }
          if (itemIndex < section.items.length - 1) body += `\n`;
        });
      } else if (section.content) {
        body += `${section.content}\n`;
      }
      if (index < sections.length - 1) body += `\n`;
    });
  }
  
  return body;
}

async function reformatAllGuidelines() {
  console.log('📝 Reformatting all Guidelines to match Rescue Shift format...\n');

  // Get all guides except Rescue Shift (already formatted)
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, body, summary')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const guidesToFormat = guides.filter(g => !g.title.includes('Rescue Shift'));
  console.log(`Found ${guidesToFormat.length} guides to format\n`);

  for (const guide of guidesToFormat) {
    console.log(`Formatting: "${guide.title}"...`);
    
    const currentBody = guide.body || '';
    const description = guide.summary || 'Guidelines for DQ operations.';
    
    // Parse and reformat based on guide title
    const { keyHighlights, sections } = parseGuideContent(guide.title, currentBody, description);
    
    const formattedBody = formatGuide(guide.title, description, keyHighlights, sections);
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        body: formattedBody,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Formatted successfully\n`);
    }
  }
}

function parseGuideContent(title, body, summary) {
  const keyHighlights = [];
  const sections = [];
  
  // Parse based on title
  if (title.includes('Agenda') || title.includes('Scheduling')) {
    keyHighlights.push('Clear meeting objectives and structured agendas');
    keyHighlights.push('Proper scheduling and time management');
    keyHighlights.push('Productive outcomes and follow-up actions');
    
    sections.push({
      title: 'Process',
      content: 'Standardized approach for planning, organizing, and executing meetings and sessions at DQ. Ensures clear objectives, proper scheduling, and productive outcomes.'
    });
  } else if (title.includes('Functional Tracker')) {
    keyHighlights.push('Unified task monitoring across all DQ factories');
    keyHighlights.push('Real-time visibility into progress and performance');
    keyHighlights.push('Consistency and accountability in task management');
    
    sections.push({
      title: 'Overview',
      content: 'Unified system to monitor and manage all associate tasks across DQ factories. Provides real-time visibility into progress, performance, and task health.'
    });
  } else if (title.includes('L24')) {
    keyHighlights.push('Virtual working rooms for daily collaboration');
    keyHighlights.push('Active execution instead of passive meetings');
    keyHighlights.push('Enhanced accountability and real-time productivity');
    
    sections.push({
      title: 'Overview',
      content: 'Standardized guidelines for DQ\'s virtual L24 Working Rooms. Enhances collaboration, accountability, and real-time productivity by shifting from passive meetings to active daily execution.'
    });
  } else if (title.includes('RAID')) {
    keyHighlights.push('Proactive risk identification and mitigation');
    keyHighlights.push('Comprehensive tracking of Risks, Assumptions, Issues, and Dependencies');
    keyHighlights.push('Escalation processes to support successful delivery');
    
    sections.push({
      title: 'Overview',
      content: 'Comprehensive guidelines for managing Risks, Assumptions, Issues, and Dependencies (RAID) across DQ projects. Ensures proactive risk identification, mitigation, and escalation to support successful delivery.'
    });
  } else if (title.includes('Leave')) {
    keyHighlights.push('Multiple leave types: Annual, Sick, Emergency, Unpaid');
    keyHighlights.push('Clear eligibility and approval processes');
    keyHighlights.push('Documentation requirements and compliance');
    
    // Parse leave types from body
    const leaveTypes = [];
    if (body.includes('Annual leave')) leaveTypes.push('Annual leave: Paid time off accrued monthly');
    if (body.includes('Sick leave')) leaveTypes.push('Sick leave: For illness; medical certificate required if >2 days');
    if (body.includes('Emergency leave')) leaveTypes.push('Emergency leave: Unplanned urgent situations; manager notification ASAP');
    if (body.includes('Unpaid leave')) leaveTypes.push('Unpaid leave: Manager + HR approval required');
    
    sections.push({
      title: 'Leave Types',
      items: leaveTypes.length > 0 ? leaveTypes : ['Annual leave', 'Sick leave', 'Emergency leave', 'Unpaid leave']
    });
    
    sections.push({
      title: 'Request Process',
      content: 'Check team calendar, submit request in HR system, get manager approval, and update OOO message and calendar.'
    });
  }
  
  return { keyHighlights, sections };
}

reformatAllGuidelines().catch(console.error);

