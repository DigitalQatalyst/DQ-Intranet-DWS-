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

async function identifyIssues() {
  console.log('🔍 Identifying format issues in WFH Guidelines...\n');

  // Get Forum Guidelines as reference
  const { data: forumGuide } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'forum-guidelines')
    .maybeSingle();

  // Get WFH Guidelines
  const { data: wfhGuide } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (!forumGuide || !wfhGuide) {
    console.log('❌ Guides not found');
    return;
  }

  console.log('='.repeat(80));
  console.log('FORUM GUIDELINES - REFERENCE FORMAT');
  console.log('='.repeat(80));
  console.log(forumGuide.body);
  console.log('\n' + '='.repeat(80));

  console.log('\n' + '='.repeat(80));
  console.log('WFH GUIDELINES - CURRENT FORMAT');
  console.log('='.repeat(80));
  console.log(wfhGuide.body);
  console.log('\n' + '='.repeat(80));

  // Extract and compare each section
  console.log('\n' + '='.repeat(80));
  console.log('DETAILED COMPARISON');
  console.log('='.repeat(80));

  // Extract Forum sections
  const forumBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  const forumSections = [];
  let match;
  while ((match = forumBoxRegex.exec(forumGuide.body)) !== null) {
    const content = match[1].trim();
    const heading = content.match(/^##\s+(.+)$/m)?.[1] || 'No heading';
    const bodyText = content.replace(/^##\s+[^\n]+\n/, '').trim();
    forumSections.push({ heading, content: bodyText, length: bodyText.length });
  }

  // Extract WFH sections
  const wfhBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  const wfhSections = [];
  while ((match = wfhBoxRegex.exec(wfhGuide.body)) !== null) {
    const content = match[1].trim();
    const heading = content.match(/^##\s+(.+)$/m)?.[1] || 'No heading';
    const bodyText = content.replace(/^##\s+[^\n]+\n/, '').trim();
    wfhSections.push({ heading, content: bodyText, length: bodyText.length });
  }

  console.log('\n📊 SECTION-BY-SECTION COMPARISON:\n');

  forumSections.forEach((forumSec, i) => {
    console.log(`\nForum Section ${i + 1}: "${forumSec.heading}"`);
    console.log(`   Length: ${forumSec.length} chars`);
    console.log(`   Content: ${forumSec.content.substring(0, 100)}${forumSec.content.length > 100 ? '...' : ''}`);
    
    // Count bullets
    const forumBullets = (forumSec.content.match(/^-\s+/gm) || []).length;
    console.log(`   Bullet points: ${forumBullets}`);
    
    // Show each bullet
    const bullets = forumSec.content.match(/^-\s+(.+)$/gm) || [];
    bullets.forEach((b, bi) => {
      const bulletText = b.replace(/^-\s+/, '').trim();
      console.log(`      ${bi + 1}. ${bulletText.substring(0, 80)}${bulletText.length > 80 ? '...' : ''}`);
    });
  });

  console.log('\n' + '-'.repeat(80));
  console.log('WFH SECTIONS:\n');

  wfhSections.forEach((wfhSec, i) => {
    console.log(`\nWFH Section ${i + 1}: "${wfhSec.heading}"`);
    console.log(`   Length: ${wfhSec.length} chars`);
    
    // Check if it's a table
    const hasTable = wfhSec.content.includes('|');
    if (hasTable) {
      console.log(`   Type: TABLE`);
      const tableRows = (wfhSec.content.match(/\|.*\|/g) || []).length;
      console.log(`   Table rows: ${tableRows}`);
    } else {
      console.log(`   Type: TEXT/BULLETS`);
      const bullets = (wfhSec.content.match(/^-\s+/gm) || []).length;
      console.log(`   Bullet points: ${bullets}`);
      
      // Show content preview
      const preview = wfhSec.content.substring(0, 150);
      console.log(`   Content: ${preview}${wfhSec.content.length > 150 ? '...' : ''}`);
      
      // Show each bullet if any
      if (bullets > 0) {
        const bulletMatches = wfhSec.content.match(/^-\s+(.+)$/gm) || [];
        bulletMatches.forEach((b, bi) => {
          const bulletText = b.replace(/^-\s+/, '').trim();
          console.log(`      ${bi + 1}. ${bulletText.substring(0, 100)}${bulletText.length > 100 ? '...' : ''}`);
        });
      }
    }
  });

  // Identify specific issues
  console.log('\n' + '='.repeat(80));
  console.log('❌ ISSUES IDENTIFIED');
  console.log('='.repeat(80));

  const issues = [];

  // Compare Purpose sections
  const forumPurpose = forumSections.find(s => s.heading === 'Purpose');
  const wfhPurpose = wfhSections.find(s => s.heading === 'Purpose');
  
  if (forumPurpose && wfhPurpose) {
    console.log(`\n1. PURPOSE SECTION:`);
    console.log(`   Forum: "${forumPurpose.content}" (${forumPurpose.length} chars)`);
    console.log(`   WFH: "${wfhPurpose.content.substring(0, 100)}..." (${wfhPurpose.length} chars)`);
    if (wfhPurpose.length > forumPurpose.length * 2) {
      issues.push('Purpose section is too long - Forum Guidelines use ONE short sentence');
      console.log(`   ❌ ISSUE: WFH Purpose is ${Math.round(wfhPurpose.length / forumPurpose.length)}x longer than Forum`);
    }
  }

  // Check bullet point lengths
  console.log(`\n2. BULLET POINT LENGTHS:`);
  const wfhBulletSections = wfhSections.filter(s => !s.content.includes('|') && s.content.includes('-'));
  wfhBulletSections.forEach(sec => {
    const bullets = sec.content.match(/^-\s+(.+)$/gm) || [];
    bullets.forEach((b, i) => {
      const bulletText = b.replace(/^-\s+/, '').trim();
      if (bulletText.length > 100) {
        issues.push(`"${sec.heading}" section has long bullet points - Forum Guidelines use very short bullets`);
        console.log(`   ❌ "${sec.heading}" bullet ${i + 1}: ${bulletText.length} chars - TOO LONG`);
        console.log(`      "${bulletText.substring(0, 80)}..."`);
      }
    });
  });

  // Compare Forum bullets (they're all very short)
  console.log(`\n3. FORUM GUIDELINES BULLET STYLE:`);
  forumSections.forEach(sec => {
    const bullets = sec.content.match(/^-\s+(.+)$/gm) || [];
    bullets.forEach((b, i) => {
      const bulletText = b.replace(/^-\s+/, '').trim();
      console.log(`   "${sec.heading}" bullet ${i + 1}: "${bulletText}" (${bulletText.length} chars)`);
    });
  });

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY OF ISSUES');
  console.log('='.repeat(80));
  
  if (issues.length === 0) {
    console.log('\n✅ No issues found - format matches Forum Guidelines');
  } else {
    console.log(`\n❌ Found ${issues.length} issue(s):\n`);
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    
    console.log(`\n📋 KEY DIFFERENCE:`);
    console.log(`   Forum Guidelines: EXTREMELY concise - each section is just a few words`);
    console.log(`   WFH Guidelines: More detailed explanations - this is the "older format"`);
    console.log(`\n   Forum style: "- Clear title and context"`);
    console.log(`   WFH style: "- **Transparency**: All WFH activities must be visible to managers and teams"`);
    console.log(`\n   The WFH bullets are explanatory sentences, Forum bullets are action phrases.`);
  }
}

identifyIssues().catch(console.error);


