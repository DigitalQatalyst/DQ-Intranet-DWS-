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

async function findMissingImages() {
  console.log('🔍 Finding guides with missing or placeholder images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Find guides with no image or placeholder
  const missingImages = (guides || []).filter(g => {
    const img = g.hero_image_url;
    return !img || 
           img.trim() === '' || 
           img.includes('/image.png') ||
           img.includes('placeholder') ||
           !img.startsWith('http');
  });

  console.log(`📊 Total guides: ${guides.length}`);
  console.log(`📊 Guides with missing/placeholder images: ${missingImages.length}\n`);

  if (missingImages.length > 0) {
    console.log('⚠️  Guides missing images:\n');
    missingImages.forEach((g, index) => {
      console.log(`${index + 1}. ${g.title}`);
      console.log(`   Current: ${g.hero_image_url || 'No image'}`);
      console.log('');
    });
  } else {
    console.log('✅ All guides have images!');
  }

  return missingImages;
}

findMissingImages().catch(console.error);

