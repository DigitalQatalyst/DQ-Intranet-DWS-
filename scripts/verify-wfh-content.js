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

async function verifyWFHContent() {
  console.log('🔍 Verifying WFH Guidelines content...\n');

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

  console.log('Current content in database:');
  console.log('='.repeat(80));
  console.log(guide.body);
  console.log('='.repeat(80));

  // Check for potential issues
  console.log('\n🔍 Checking for issues:');
  
  // Check table syntax
  const tableMatches = guide.body.match(/\|.*\|/g);
  console.log(`   Tables found: ${tableMatches ? tableMatches.length : 0} lines with |`);
  
  // Check for HTML in markdown
  const htmlTags = guide.body.match(/<[^>]+>/g);
  console.log(`   HTML tags: ${htmlTags ? htmlTags.length : 0}`);
  
  // Check feature boxes
  const openBoxes = (guide.body.match(/<div class="feature-box">/g) || []).length;
  const closeBoxes = (guide.body.match(/<\/div>/g) || []).length;
  console.log(`   Feature boxes: ${openBoxes} open, ${closeBoxes} close`);
  console.log(`   Balanced: ${openBoxes === closeBoxes ? '✅' : '❌'}`);
  
  // Check for special characters that might break
  const hasBrTags = guide.body.includes('<br>');
  console.log(`   Has <br> tags: ${hasBrTags ? '✅' : '❌'}`);
}

verifyWFHContent().catch(console.error);


