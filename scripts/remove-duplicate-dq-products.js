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

async function removeDuplicateDQProducts() {
  console.log('🔄 Removing duplicate DQ Products guides...\n');

  // Get all "DQ Products" guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%DQ Products%')
    .order('id');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} "DQ Products" guide(s):\n`);
  allGuides.forEach((g, i) => {
    console.log(`${i + 1}. ID: ${g.id}`);
    console.log(`   Title: ${g.title}`);
    console.log(`   Unit: ${g.unit || 'null'}`);
    console.log(`   Location: ${g.location || 'null'}`);
    console.log('');
  });

  if (allGuides.length <= 1) {
    console.log('✅ No duplicates found. Only one guide exists.');
    return;
  }

  // Keep the one in "Products" unit if it exists, otherwise keep the first one
  const guideInProducts = allGuides.find(g => (g.unit || '').toLowerCase() === 'products');
  const guideToKeep = guideInProducts || allGuides[0];
  const guidesToDelete = allGuides.filter(g => g.id !== guideToKeep.id);

  console.log(`\n📋 Keeping: "${guideToKeep.title}" (ID: ${guideToKeep.id})`);
  console.log(`   Unit: ${guideToKeep.unit || 'null'}`);
  console.log(`📋 Deleting ${guidesToDelete.length} duplicate(s):\n`);

  for (const guide of guidesToDelete) {
    console.log(`Deleting "${guide.title}" (ID: ${guide.id})`);
    console.log(`   Unit: ${guide.unit || 'null'}`);
    console.log(`   Location: ${guide.location || 'null'}`);
    
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

  // Ensure the kept guide is in Products unit
  if (guideToKeep.unit?.toLowerCase() !== 'products') {
    console.log(`\n🔄 Moving kept guide to Products unit...`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'Products',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideToKeep.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated to Products unit`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: remaining } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%DQ Products%');

  console.log(`Remaining "DQ Products" guide(s): ${remaining?.length || 0}`);
  remaining?.forEach((g, i) => {
    console.log(`   ${i + 1}. "${g.title}"`);
    console.log(`      Unit: ${g.unit || 'null'}`);
    console.log(`      Location: ${g.location || 'null'}`);
  });

  console.log(`\n✅ Duplicates removed. Only one "DQ Products" guide remains.`);
}

removeDuplicateDQProducts().catch(console.error);

