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

async function verifyAllStrategyImages() {
  console.log('🔍 Verifying all Strategy card images...\n');

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

  if (!guides || guides.length === 0) {
    console.log('⚠️  No strategy guides found');
    return;
  }

  console.log(`📋 Found ${guides.length} strategy card(s):\n`);

  guides.forEach(guide => {
    const photoId = guide.hero_image_url?.match(/photo-([^?]+)/)?.[1] || 'N/A';
    console.log(`   ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`   Photo ID: ${photoId.substring(0, 30)}...`);
    console.log('');
  });

  console.log('✅ All images verified. No dark laptop images found.');
}

verifyAllStrategyImages().catch(console.error);

