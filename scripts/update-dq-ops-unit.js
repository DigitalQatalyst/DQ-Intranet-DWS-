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

// Guidelines that should have "DQ Ops" as their unit
const dqOpsGuidelines = [
  {
    slug: 'dq-associate-owned-asset-guidelines',
    title: 'DQ Associate Owned Asset Guidelines'
  }
  // Add more DQ Ops guidelines here as needed
];

async function updateDQOpsUnit() {
  console.log('📝 Updating guidelines to have "DQ Ops" as unit...\n');

  for (const guideline of dqOpsGuidelines) {
    const { data, error } = await supabase
      .from('guides')
      .update({
        unit: 'DQ Ops',
        function_area: 'DQ Ops' // Also set function_area for consistency
      })
      .eq('slug', guideline.slug)
      .select('id, slug, title, unit, function_area');

    if (error) {
      console.error(`❌ Error updating ${guideline.slug}:`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${guideline.title}`);
      console.log(`   Unit: ${data[0].unit}`);
      console.log(`   Function Area: ${data[0].function_area}`);
    } else {
      console.log(`⚠️  Not found: ${guideline.slug} (${guideline.title})`);
    }
  }

  console.log('\n✅ Update complete!');
  console.log('\n📋 Guidelines with "DQ Ops" unit will now appear in the unit filter.');
}

updateDQOpsUnit().catch(console.error);

