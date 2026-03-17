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

function countMatches(text, pattern) {
  return (text?.match(pattern) || []).length;
}

function analyzeStructure(body) {
  const featureBoxes = countMatches(body, /<div class="feature-box">/g);
  const sections = countMatches(body, /##\s+[^\n]+/g);
  const tables = countMatches(body, /\|.*\|/g);
  const bulletPoints = countMatches(body, /^-\s+/gm);
  
  return { featureBoxes, sections, tables, bulletPoints };
}

function extractSections(body) {
  return body?.match(/##\s+([^\n]+)/g) || [];
}

function checkTables(body) {
  const hasCoreComponentsTable = body?.includes('| # | Program | Description |');
  const hasRolesTable = body?.includes('| Key Steps | Description |');
  return { hasCoreComponentsTable, hasRolesTable };
}

function printStructureAnalysis(analysis) {
  console.log('\n📊 STRUCTURE ANALYSIS');
  console.log('='.repeat(80));
  console.log(`\n📦 Feature Boxes: ${analysis.featureBoxes}`);
  console.log(`📑 Sections (H2): ${analysis.sections}`);
  console.log(`📊 Table rows: ${Math.floor(analysis.tables / 3)} (estimated)`);
  console.log(`• Bullet points: ${analysis.bulletPoints}`);
}

function printSectionsList(sectionMatches) {
  console.log(`\n📋 Sections List:`);
  sectionMatches.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.replace('## ', '').trim()}`);
  });
}

function printTablesCheck(tables) {
  console.log(`\n📊 Tables:`);
  console.log(`   Core Components: ${tables.hasCoreComponentsTable ? '✅' : '❌'}`);
  console.log(`   Roles & Responsibilities: ${tables.hasRolesTable ? '✅' : '❌'}`);
}

function compareWithForum(forumGuide, wfhGuide, wfhAnalysis) {
  console.log('\n' + '='.repeat(80));
  console.log('COMPARISON WITH FORUM GUIDELINES');
  console.log('='.repeat(80));

  const forumAnalysis = analyzeStructure(forumGuide.body);

  console.log(`\nFeature Boxes:`);
  console.log(`   Forum: ${forumAnalysis.featureBoxes}`);
  console.log(`   WFH: ${wfhAnalysis.featureBoxes}`);
  console.log(`   Match: ${wfhAnalysis.featureBoxes > 0 ? '✅' : '❌'}`);

  console.log(`\nSections:`);
  console.log(`   Forum: ${forumAnalysis.sections}`);
  console.log(`   WFH: ${wfhAnalysis.sections}`);
  console.log(`   Match: ${wfhAnalysis.sections > 0 ? '✅' : '❌'}`);

  console.log(`\nBullet Points:`);
  console.log(`   Forum: ${forumAnalysis.bulletPoints}`);
  console.log(`   WFH: ${wfhAnalysis.bulletPoints}`);
  console.log(`   Match: ${wfhAnalysis.bulletPoints > 0 ? '✅' : '❌'}`);

  checkFormatStyle(forumGuide, wfhGuide);
  checkContextSections(wfhGuide);
}

function checkFormatStyle(forumGuide, wfhGuide) {
  console.log(`\n📐 Format Style Check:`);
  const wfhHasLongParagraphs = countMatches(wfhGuide.body, /[^.\n]{200,}/g);
  const forumHasLongParagraphs = countMatches(forumGuide.body, /[^.\n]{200,}/g);
  
  console.log(`   Long paragraphs (>200 chars):`);
  console.log(`   Forum: ${forumHasLongParagraphs}`);
  console.log(`   WFH: ${wfhHasLongParagraphs}`);
  console.log(`   Issue: ${wfhHasLongParagraphs > forumHasLongParagraphs ? '⚠️ WFH has more long paragraphs' : '✅'}`);
}

function checkContextSections(wfhGuide) {
  const hasContext = wfhGuide.body?.includes('Context') || wfhGuide.body?.includes('context');
  const hasOverview = wfhGuide.body?.includes('Overview') || wfhGuide.body?.includes('overview');
  
  console.log(`\n⚠️  Potential Issues:`);
  if (hasContext) {
    console.log(`   ❌ Has "Context" section - Forum Guidelines don't have this`);
  }
  if (hasOverview) {
    console.log(`   ⚠️  Has "Overview" section - Forum Guidelines don't have this`);
  }
  if (hasContext === false && hasOverview === false) {
    console.log(`   ✅ No Context/Overview sections - matches Forum format`);
  }
}

function printContentLengthPerSection(body) {
  console.log('\n' + '='.repeat(80));
  console.log('CONTENT LENGTH PER SECTION');
  console.log('='.repeat(80));

  const featureBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  let match;
  let sectionNum = 1;
  
  while ((match = featureBoxRegex.exec(body || '')) !== null) {
    const sectionContent = match[1].trim();
    const headingMatch = sectionContent.match(/^##\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1] : 'No heading';
    const contentLength = sectionContent.length;
    const hasTable = sectionContent.includes('|');
    const bulletCount = countMatches(sectionContent, /^-\s+/gm);
    
    console.log(`\nSection ${sectionNum}: ${heading}`);
    console.log(`   Length: ${contentLength} chars`);
    console.log(`   Has table: ${hasTable ? '✅' : '❌'}`);
    console.log(`   Bullet points: ${bulletCount}`);
    
    const preview = sectionContent.replace(/##\s+[^\n]+\n/, '').trim().substring(0, 150);
    console.log(`   Preview: ${preview}${preview.length >= 150 ? '...' : ''}`);
    
    sectionNum++;
  }
}

function performFinalAssessment(analysis, tables) {
  console.log('\n' + '='.repeat(80));
  console.log('FINAL ASSESSMENT');
  console.log('='.repeat(80));
  
  const issues = [];
  const good = [];

  if (analysis.featureBoxes < 5) {
    issues.push('Too few feature boxes');
  } else {
    good.push(`Has ${analysis.featureBoxes} feature boxes`);
  }

  if (tables.hasCoreComponentsTable === false || tables.hasRolesTable === false) {
    issues.push('Missing required tables');
  } else {
    good.push('Has both required tables');
  }

  if (analysis.sections < 5) {
    issues.push('Too few sections');
  } else {
    good.push(`Has ${analysis.sections} sections`);
  }

  if (analysis.bulletPoints < 5) {
    issues.push('Too few bullet points');
  } else {
    good.push(`Has ${analysis.bulletPoints} bullet points`);
  }

  console.log(`\n✅ Good:`);
  good.forEach(g => console.log(`   - ${g}`));

  if (issues.length > 0) {
    console.log(`\n❌ Issues:`);
    issues.forEach(i => console.log(`   - ${i}`));
  } else {
    console.log(`\n✅ No major issues found!`);
  }

  console.log(`\n📋 Overall: ${issues.length === 0 ? '✅ Format looks correct!' : '⚠️  Some issues to address'}`);
}

async function reviewWFHCreation() {
  console.log('🔍 Reviewing WFH Guidelines creation...\n');

  const { data: forumGuide } = await supabase
    .from('guides')
    .select('slug, title, body')
    .eq('slug', 'forum-guidelines')
    .maybeSingle();

  const { data: wfhGuide } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (wfhGuide === null) {
    console.log('❌ WFH Guidelines not found');
    return;
  }

  console.log('='.repeat(80));
  console.log('WFH GUIDELINES - FULL CONTENT');
  console.log('='.repeat(80));
  console.log(wfhGuide.body);
  console.log('\n' + '='.repeat(80));

  const analysis = analyzeStructure(wfhGuide.body);
  printStructureAnalysis(analysis);

  const sectionMatches = extractSections(wfhGuide.body);
  printSectionsList(sectionMatches);

  const tables = checkTables(wfhGuide.body);
  printTablesCheck(tables);

  if (forumGuide) {
    compareWithForum(forumGuide, wfhGuide, analysis);
  }

  printContentLengthPerSection(wfhGuide.body);
  performFinalAssessment(analysis, tables);
}

await reviewWFHCreation();


