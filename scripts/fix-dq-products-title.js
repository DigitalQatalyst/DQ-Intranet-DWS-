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

async function fixDQProductsTitle() {
  console.log('🔄 Updating "DQ Products: Overview" to "DQ Products"...\n');

  const { data: productsGuide } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ Products%Overview%')
    .eq('status', 'Approved')
    .limit(1);

  if (productsGuide && productsGuide.length > 0) {
    console.log(`Updating "${productsGuide[0].title}" to "DQ Products"...`);
    const { error } = await supabase
      .from('guides')
      .update({
        title: 'DQ Products',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', productsGuide[0].id);

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
    }
  } else {
    console.log('⚠️  DQ Products guide not found');
  }

  // Final verification
  console.log(`\n📊 Final GHC service cards list:\n`);
  const { data: allGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain')
    .eq('status', 'Approved');

  const requiredCards = [
    'DQ Journey',
    'DQ Beliefs',
    'DQ Vision and Mission',
    'DQ Strategy 2021-2030',
    'DQ Competencies',
    'DQ Products'
  ];

  const ghcGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return subDomain.includes('ghc') && !subDomain.includes('ghc-leader');
  });

  requiredCards.forEach(cardTitle => {
    const found = ghcGuides.find(g => g.title === cardTitle);
    if (found) {
      console.log(`✅ ${found.title} (sub_domain: ${found.sub_domain})`);
    } else {
      console.log(`❌ ${cardTitle} - NOT FOUND`);
    }
  });
}

fixDQProductsTitle().catch(console.error);

