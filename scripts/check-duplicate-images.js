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

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Group by image URL
  const imageMap = new Map();
  
  (guides || []).forEach(g => {
    const imageUrl = g.hero_image_url;
    if (imageUrl) {
      if (!imageMap.has(imageUrl)) {
        imageMap.set(imageUrl, []);
      }
      imageMap.get(imageUrl).push(g);
    }
  });

  // Find duplicates
  const duplicates = [];
  imageMap.forEach((guides, imageUrl) => {
    if (guides.length > 1) {
      duplicates.push({ imageUrl, guides });
    }
  });

  console.log(`📊 Total guides: ${guides.length}`);
  console.log(`📊 Unique images: ${imageMap.size}`);
  console.log(`📊 Duplicate images: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.log('⚠️  Found duplicate images:\n');
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. Image URL: ${dup.imageUrl}`);
      console.log(`   Used by ${dup.guides.length} guides:`);
      dup.guides.forEach(g => {
        console.log(`      - ${g.title}`);
      });
      console.log('');
    });
  } else {
    console.log('✅ All guides have unique images!');
  }

  return duplicates;
}

checkDuplicates().catch(console.error);

