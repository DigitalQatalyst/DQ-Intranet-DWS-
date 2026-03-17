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

async function finalVerifyNoDuplicates() {
  console.log('🔍 Final verification - checking for duplicate images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, slug, hero_image_url')
    .eq('domain', 'Strategy')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📋 Checking ${guides?.length || 0} approved strategy cards...\n`);

  // Group by image photo ID
  const imageGroups = new Map();

  guides?.forEach(guide => {
    if (!guide.hero_image_url) return;
    const photoId = guide.hero_image_url.match(/photo-([^?]+)/)?.[1];
    if (!photoId) return;

    if (!imageGroups.has(photoId)) {
      imageGroups.set(photoId, []);
    }
    imageGroups.get(photoId).push(guide);
  });

  // Find duplicates
  const duplicates = Array.from(imageGroups.entries())
    .filter(([_, cards]) => cards.length > 1);

  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate image(s):\n`);
    duplicates.forEach(([photoId, cards]) => {
      console.log(`   Photo ID: ${photoId.substring(0, 30)}...`);
      console.log(`   Used by ${cards.length} card(s):`);
      cards.forEach(card => {
        console.log(`     - ${card.title} (${card.slug})`);
      });
      console.log('');
    });
  } else {
    console.log('✅ SUCCESS! All cards have unique images!\n');
    console.log('📝 Image assignments:');
    guides?.forEach(guide => {
      const photoId = guide.hero_image_url?.match(/photo-([^?]+)/)?.[1] || 'none';
      console.log(`   ${guide.title}: ${photoId.substring(0, 30)}...`);
    });
  }
}

finalVerifyNoDuplicates().catch(console.error);

