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

const REQUIRED_CARDS = [
  'DQ Journey',
  'DQ Beliefs',
  'DQ Vision and Mission',
  'DQ Strategy 2021-2030',
  'DQ Competencies',
  'DQ Products'
];

async function removeIrrelevantGuides() {
  console.log('🧹 Removing irrelevant guides from GHC...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Find guides that have 'ghc' in sub_domain but are not in required list
  const irrelevantGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const hasGHC = subDomain.includes('ghc');
    const isGHCLeader = subDomain.includes('ghc-leader') || subDomain.includes('ghc leader');
    const isRequired = REQUIRED_CARDS.includes(g.title);
    
    // Include if it has 'ghc' but is not a required card (and handle GHC Leader separately)
    return hasGHC && !isRequired && !isGHCLeader;
  });

  // Also check for guides with "GHC Leader" that might be showing up
  const ghcLeaderGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return (subDomain.includes('ghc-leader') || subDomain.includes('ghc leader')) && 
           !REQUIRED_CARDS.includes(g.title);
  });

  const allIrrelevant = [...irrelevantGuides, ...ghcLeaderGuides];

  if (allIrrelevant.length === 0) {
    console.log('✅ No irrelevant guides found under GHC!');
    return;
  }

  console.log(`Found ${allIrrelevant.length} irrelevant guide(s):\n`);

  for (const guide of allIrrelevant) {
    console.log(`⚠️  "${guide.title}"`);
    console.log(`   ID: ${guide.id}`);
    console.log(`   Current sub_domain: ${guide.sub_domain || 'null'}`);
    
    // Remove 'ghc' from sub_domain, but keep other values
    const currentSubDomain = guide.sub_domain || '';
    const parts = currentSubDomain.split(',').map(s => s.trim());
    const newParts = parts.filter(s => {
      const lower = s.toLowerCase();
      return lower !== 'ghc' && !lower.includes('ghc-leader') && !lower.includes('ghc leader');
    });
    
    const newSubDomain = newParts.length > 0 ? newParts.join(',') : null;
    
    console.log(`   New sub_domain: ${newSubDomain || 'null'}`);
    
    // If it's "GHC Leader", we should keep it as is (it's a different category)
    // But if it has both 'ghc' and other values, remove 'ghc'
    if (currentSubDomain.toLowerCase().includes('ghc-leader') || 
        currentSubDomain.toLowerCase().includes('ghc leader')) {
      console.log(`   ℹ️  This is a GHC Leader guide, keeping as is (different category)`);
      continue;
    }
    
    if (newSubDomain !== currentSubDomain) {
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: newSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Removed 'ghc' from sub_domain`);
      }
    }
    console.log('');
  }

  // Final check
  console.log(`\n📊 Final GHC guides (excluding GHC Leader):\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain')
    .eq('status', 'Approved');

  const finalGHCGuides = (finalGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const hasGHC = subDomain.includes('ghc');
    const isGHCLeader = subDomain.includes('ghc-leader') || subDomain.includes('ghc leader');
    return hasGHC && !isGHCLeader;
  });

  console.log(`Found ${finalGHCGuides.length} guide(s):\n`);
  finalGHCGuides.forEach(g => {
    const isRequired = REQUIRED_CARDS.includes(g.title);
    const status = isRequired ? '✅' : '❌';
    console.log(`${status} ${g.title} (sub_domain: ${g.sub_domain})`);
  });

  const onlyRequired = finalGHCGuides.every(g => REQUIRED_CARDS.includes(g.title));
  const allRequiredPresent = REQUIRED_CARDS.every(card => 
    finalGHCGuides.some(g => g.title === card)
  );

  if (onlyRequired && allRequiredPresent && finalGHCGuides.length === 6) {
    console.log(`\n✅ Perfect! Only the 6 required GHC service cards are present.`);
  } else {
    console.log(`\n⚠️  Still need to clean up.`);
  }
}

removeIrrelevantGuides().catch(console.error);

