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

async function checkAllForDuplicates() {
  console.log('🔍 Checking ALL strategy cards for duplicate images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, slug, hero_image_url, status')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📋 Found ${guides?.length || 0} strategy card(s) total\n`);

  // Group by image photo ID
  const imageMap = new Map();

  guides?.forEach(guide => {
    if (!guide.hero_image_url) return;
    const pid = guide.hero_image_url.match(/photo-([^?]+)/)?.[1];
    if (!pid) return;

    if (!imageMap.has(pid)) {
      imageMap.set(pid, []);
    }
    imageMap.get(pid).push(guide);
  });

  // Find duplicates
  const duplicates = Array.from(imageMap.entries())
    .filter(([_, cards]) => cards.length > 1);

  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate image(s):\n`);
    duplicates.forEach(([pid, cards]) => {
      console.log(`   Photo ID: ${pid.substring(0, 30)}...`);
      console.log(`   Used by ${cards.length} card(s):`);
      cards.forEach(card => {
        console.log(`     - ${card.title} (${card.slug}) [${card.status}]`);
      });
      console.log('');
    });
  } else {
    console.log('✅ NO DUPLICATES FOUND!\n');
    console.log('All cards have unique images:');
    guides?.forEach(guide => {
      const pid = guide.hero_image_url?.match(/photo-([^?]+)/)?.[1] || 'none';
      console.log(`   ${guide.title}: ${pid.substring(0, 30)}...`);
    });
  }
}

checkAllForDuplicates().catch(console.error);

