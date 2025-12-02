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

async function updateCardTitles() {
  console.log('🔄 Updating GHC card titles to match expected names...\n');

  // Update "Strategy & Vision" to "DQ Vision and Mission"
  const { data: visionGuide } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Strategy & Vision%')
    .eq('status', 'Approved')
    .limit(1);

  if (visionGuide && visionGuide.length > 0) {
    console.log(`Updating "${visionGuide[0].title}" to "DQ Vision and Mission"...`);
    const { error } = await supabase
      .from('guides')
      .update({
        title: 'DQ Vision and Mission',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', visionGuide[0].id);

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
    }
  }

  // Update "DQ2.0 Strategic Transition" to "DQ Strategy 2021-2030"
  const { data: strategyGuide } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ2.0 Strategic Transition%')
    .eq('status', 'Approved')
    .limit(1);

  if (strategyGuide && strategyGuide.length > 0) {
    console.log(`\nUpdating "${strategyGuide[0].title}" to "DQ Strategy 2021-2030"...`);
    const { error } = await supabase
      .from('guides')
      .update({
        title: 'DQ Strategy 2021-2030',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', strategyGuide[0].id);

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
    }
  }

  // Verify all cards
  console.log(`\n\n📊 Verifying all GHC service cards:\n`);
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
    const found = ghcGuides.find(g => {
      const title = g.title || '';
      if (cardTitle === 'DQ Products') {
        return title.includes('Products');
      }
      return title === cardTitle;
    });
    
    if (found) {
      console.log(`✅ ${found.title} (sub_domain: ${found.sub_domain})`);
    } else {
      console.log(`❌ ${cardTitle} - NOT FOUND`);
    }
  });
}

updateCardTitles().catch(console.error);

