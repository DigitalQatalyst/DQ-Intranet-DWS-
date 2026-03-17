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

async function finalVerify() {
  console.log('🔍 Final verification of WFH Guidelines...\n');

  const { data: guide, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guide) {
    console.log('❌ Guide not found');
    return;
  }

  console.log('✅ Guide found in database');
  console.log(`   Title: ${guide.title}`);
  console.log(`   Status: ${guide.status}`);
  console.log(`   Domain: ${guide.domain}`);
  console.log(`   Last Updated: ${guide.last_updated_at}`);
  
  // Count feature boxes
  const featureBoxes = (guide.body?.match(/<div class="feature-box">/g) || []).length;
  const tables = (guide.body?.match(/\|.*\|/g) || []).length;
  const sections = (guide.body?.match(/##\s+[^\n]+/g) || []).length;
  
  console.log(`\n📊 Content Structure:`);
  console.log(`   Feature boxes: ${featureBoxes}`);
  console.log(`   Sections (H2): ${sections}`);
  console.log(`   Table rows: ${Math.floor(tables / 3)} (estimated)`);
  
  // Check if it has the tables
  const hasCoreComponentsTable = guide.body?.includes('| # | Program | Description |');
  const hasRolesTable = guide.body?.includes('| Key Steps | Description |');
  
  console.log(`\n📋 Tables:`);
  console.log(`   Core Components table: ${hasCoreComponentsTable ? '✅' : '❌'}`);
  console.log(`   Roles & Responsibilities table: ${hasRolesTable ? '✅' : '❌'}`);
  
  // Show section list
  const sectionMatches = guide.body?.match(/##\s+([^\n]+)/g) || [];
  console.log(`\n📑 Sections found:`);
  sectionMatches.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.replace('## ', '').trim()}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('FULL CONTENT (for verification):');
  console.log('='.repeat(80));
  console.log(guide.body);
}

finalVerify().catch(console.error);


