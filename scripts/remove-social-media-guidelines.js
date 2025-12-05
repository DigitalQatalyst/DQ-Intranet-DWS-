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

async function removeSocialMediaGuidelines() {
  console.log('🗑️  Removing DQ Social Media Guidelines...\n');

  // Find all guides with "Social Media Guidelines" in title
  const { data: guides, error: findError } = await supabase
    .from('guides')
    .select('id, title, domain, guide_type')
    .eq('status', 'Approved')
    .ilike('title', '%Social Media Guidelines%');

  if (findError) {
    console.error('❌ Error finding guides:', findError);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('❌ No guides found');
    return;
  }

  console.log(`Found ${guides.length} guide(s) with "Social Media Guidelines":\n`);
  guides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}" (ID: ${g.id})`);
    console.log(`   Domain: ${g.domain || 'null'}`);
    console.log(`   Guide Type: ${g.guide_type || 'null'}`);
  });

  // Delete all of them
  console.log(`\n🗑️  Deleting ${guides.length} guide(s)...\n`);
  for (const guide of guides) {
    console.log(`Deleting "${guide.title}"...`);
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', guide.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted`);
    }
  }

  console.log(`\n✅ All "DQ Social Media Guidelines" guides have been removed from Guidelines.`);
}

removeSocialMediaGuidelines().catch(console.error);
