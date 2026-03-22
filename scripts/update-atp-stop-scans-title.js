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

async function updateATPStopScansTitle() {
  console.log('📝 Updating ATP Stop Scans Guidelines title...\n');

  // First, get the current body to update it
  const { data: currentData, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-atp-stop-scans-guidelines')
    .single();

  if (fetchError) {
    console.error('❌ Error fetching guideline:', fetchError);
    return;
  }

  // Update body header if it exists
  let newBody = currentData?.body || '';
  if (newBody.includes('# DQ Guidelines | ATP Stop Scans Guidelines')) {
    newBody = newBody.replace('# DQ Guidelines | ATP Stop Scans Guidelines', '# DQ ATP Stop Scans Guidelines');
  }

  // Update title and body
  const { data, error } = await supabase
    .from('guides')
    .update({
      title: 'DQ ATP Stop Scans Guidelines',
      body: newBody
    })
    .eq('slug', 'dq-atp-stop-scans-guidelines')
    .select('id, slug, title');

  if (error) {
    console.error('❌ Error updating guideline:', error);
  } else if (data && data.length > 0) {
    console.log('✅ Updated: DQ Guidelines | ATP Stop Scans Guidelines');
    console.log('   → DQ ATP Stop Scans Guidelines');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Slug: ${data[0].slug}`);
  } else {
    console.log('⚠️  Guideline not found: dq-atp-stop-scans-guidelines');
  }

  console.log('\n✅ Update complete!');
}

updateATPStopScansTitle().catch(console.error);

