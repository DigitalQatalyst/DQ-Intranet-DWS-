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

async function finalVerification() {
  console.log('🔍 Final verification of GHC service cards...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Get guides that should be under GHC (not GHC Leader)
  const ghcGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    // Include guides with 'ghc' but exclude 'ghc-leader' or 'ghc leader'
    const hasGHC = subDomain.includes('ghc');
    const isGHCLeader = subDomain.includes('ghc-leader') || 
                        subDomain.includes('ghc leader') ||
                        subDomain === 'ghc leader';
    return hasGHC && !isGHCLeader;
  });

  console.log(`📊 Found ${ghcGuides.length} guides under GHC (excluding GHC Leader):\n`);

  let allGood = true;

  for (const cardTitle of REQUIRED_CARDS) {
    const guide = ghcGuides.find(g => g.title === cardTitle);
    
    if (guide) {
      const hasImage = guide.hero_image_url && 
                      guide.hero_image_url !== '/image.png' && 
                      !guide.hero_image_url.includes('placeholder') &&
                      guide.hero_image_url.startsWith('http');
      
      const status = hasImage ? '✅' : '❌';
      console.log(`${status} ${guide.title}`);
      console.log(`   Image: ${hasImage ? '✅ Present' : '❌ Missing'}`);
      console.log(`   Sub-Domain: ${guide.sub_domain || 'null'}`);
      
      if (!hasImage) {
        allGood = false;
      }
    } else {
      console.log(`❌ ${cardTitle} - NOT FOUND`);
      allGood = false;
    }
    console.log('');
  }

  // Check for any other guides under GHC that shouldn't be there
  const otherGuides = ghcGuides.filter(g => !REQUIRED_CARDS.includes(g.title));
  if (otherGuides.length > 0) {
    console.log(`\n⚠️  Found ${otherGuides.length} additional guide(s) under GHC that are not in the required list:\n`);
    otherGuides.forEach(g => {
      console.log(`   - ${g.title} (ID: ${g.id})`);
      console.log(`     Sub-Domain: ${g.sub_domain}`);
    });
    allGood = false;
  }

  if (allGood && otherGuides.length === 0) {
    console.log(`\n✅ All 6 required GHC service cards are properly configured with images!`);
  } else {
    console.log(`\n⚠️  Some issues need to be addressed.`);
  }
}

finalVerification().catch(console.error);

