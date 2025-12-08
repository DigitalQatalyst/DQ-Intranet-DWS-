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

async function removeNonDQGuidelines() {
  console.log('🗑️  Removing non-DQ Guidelines...\n');

  // Get all guides in Guidelines domain
  const { data: allGuides, error: findError } = await supabase
    .from('guides')
    .select('id, title, slug, domain')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved');

  if (findError) {
    console.error('❌ Error finding guides:', findError);
    return;
  }

  if (!allGuides || allGuides.length === 0) {
    console.log('No guides found');
    return;
  }

  // Identify non-DQ guides (those without "DQ" in title)
  const nonDQGuides = allGuides.filter(g => {
    const title = (g.title || '').toLowerCase();
    return !title.includes('dq') && !title.includes('digital qatalyst');
  });

  console.log(`Found ${nonDQGuides.length} non-DQ guide(s) in Guidelines domain:\n`);
  nonDQGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}" (ID: ${g.id})`);
  });

  if (nonDQGuides.length === 0) {
    console.log('\n✅ No non-DQ guides found to remove.');
    return;
  }

  // Delete all non-DQ guides
  console.log(`\n🗑️  Deleting ${nonDQGuides.length} guide(s)...\n`);
  for (const guide of nonDQGuides) {
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

  console.log(`\n✅ All non-DQ Guidelines have been removed.`);
}

removeNonDQGuidelines().catch(console.error);

