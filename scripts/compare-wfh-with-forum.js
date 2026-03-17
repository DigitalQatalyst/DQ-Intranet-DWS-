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

async function compareFormats() {
  console.log('📋 Comparing WFH Guidelines with Forum Guidelines format...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('slug, title, body')
    .in('slug', ['forum-guidelines', 'dq-wfh-guidelines']);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const forum = guides.find(g => g.slug === 'forum-guidelines');
  const wfh = guides.find(g => g.slug === 'dq-wfh-guidelines');

  console.log('='.repeat(80));
  console.log('FORUM GUIDELINES (Reference Format)');
  console.log('='.repeat(80));
  console.log(forum.body);
  
  console.log('\n' + '='.repeat(80));
  console.log('WFH GUIDELINES (Current Format)');
  console.log('='.repeat(80));
  console.log(wfh.body);

  // Analyze differences
  console.log('\n' + '='.repeat(80));
  console.log('COMPARISON ANALYSIS');
  console.log('='.repeat(80));

  const forumBoxes = (forum.body.match(/<div class="feature-box">/g) || []).length;
  const wfhBoxes = (wfh.body.match(/<div class="feature-box">/g) || []).length;
  
  const forumSections = forum.body.match(/##\s+[^\n]+/g) || [];
  const wfhSections = wfh.body.match(/##\s+[^\n]+/g) || [];

  console.log(`\n📦 Feature Boxes:`);
  console.log(`   Forum: ${forumBoxes} boxes`);
  console.log(`   WFH: ${wfhBoxes} boxes`);

  console.log(`\n📑 Sections:`);
  console.log(`   Forum: ${forumSections.length} sections`);
  forumSections.forEach((s, i) => console.log(`      ${i + 1}. ${s.replace('## ', '')}`));
  
  console.log(`\n   WFH: ${wfhSections.length} sections`);
  wfhSections.forEach((s, i) => console.log(`      ${i + 1}. ${s.replace('## ', '')}`));

  // Check for tables
  const forumHasTables = forum.body.includes('|') || forum.body.includes('<table');
  const wfhHasTables = wfh.body.includes('|') || wfh.body.includes('<table');
  
  console.log(`\n📊 Tables:`);
  console.log(`   Forum: ${forumHasTables ? '✅' : '❌'}`);
  console.log(`   WFH: ${wfhHasTables ? '✅' : '❌'}`);

  // Check content length per section
  console.log(`\n📏 Content Length:`);
  const forumBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  let match;
  let forumSectionLengths = [];
  while ((match = forumBoxRegex.exec(forum.body)) !== null) {
    forumSectionLengths.push(match[1].trim().length);
  }
  console.log(`   Forum sections: ${forumSectionLengths.join(', ')} chars`);

  const wfhBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  let wfhSectionLengths = [];
  while ((match = wfhBoxRegex.exec(wfh.body)) !== null) {
    wfhSectionLengths.push(match[1].trim().length);
  }
  console.log(`   WFH sections: ${wfhSectionLengths.join(', ')} chars`);

  console.log(`\n\n❌ ISSUES IDENTIFIED:`);
  console.log(`   1. WFH has ${wfhBoxes} sections vs Forum's ${forumBoxes} - too many sections`);
  console.log(`   2. WFH sections are much longer (${Math.max(...wfhSectionLengths)} vs ${Math.max(...forumSectionLengths)} chars)`);
  console.log(`   3. WFH has detailed explanations vs Forum's concise bullet points`);
  console.log(`   4. WFH missing tables that were in original content`);
  console.log(`   5. WFH has subsections (H3) which Forum doesn't use`);
}

compareFormats().catch(console.error);


