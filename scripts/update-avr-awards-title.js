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

async function updateAVRAwardsTitle() {
  console.log('📝 Updating AVR Awards Guidelines title...\n');

  // First, get the current body to update it
  const { data: currentData, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-avr-awards-guidelines')
    .single();

  if (fetchError) {
    console.error('❌ Error fetching guideline:', fetchError);
    return;
  }

  // Update body header if it exists
  let newBody = currentData?.body || '';
  if (newBody.includes('# The AVR Awards Guidelines')) {
    newBody = newBody.replace('# The AVR Awards Guidelines', '# DQ AVR Awards Guidelines');
  }

  // Update title and body
  const { data, error } = await supabase
    .from('guides')
    .update({
      title: 'DQ AVR Awards Guidelines',
      body: newBody
    })
    .eq('slug', 'dq-avr-awards-guidelines')
    .select('id, slug, title');

  if (error) {
    console.error('❌ Error updating guideline:', error);
  } else if (data && data.length > 0) {
    console.log('✅ Updated: The AVR Awards Guidelines');
    console.log('   → DQ AVR Awards Guidelines');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Slug: ${data[0].slug}`);
  } else {
    console.log('⚠️  Guideline not found: dq-avr-awards-guidelines');
  }

  console.log('\n✅ Update complete!');
}

updateAVRAwardsTitle().catch(console.error);

