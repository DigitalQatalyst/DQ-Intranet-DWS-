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

async function verifyImageURLs() {
  console.log('🔍 Verifying Strategy guide image URLs...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides:\n`);

  const imageMap = new Map();
  const baseImageMap = new Map(); // Track base URLs without query params

  for (const guide of allGuides) {
    const imageUrl = guide.hero_image_url || '';
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http');

    console.log(`${guide.title}:`);
    console.log(`   Image URL: ${imageUrl || 'null'}`);
    
    if (!hasImage) {
      console.log(`   Status: ❌ Missing or invalid image`);
    } else {
      // Extract base URL (without query parameters)
      const baseUrl = imageUrl.split('?')[0];
      
      if (imageMap.has(imageUrl)) {
        const existing = imageMap.get(imageUrl);
        console.log(`   Status: ⚠️  EXACT DUPLICATE with "${existing.title}"`);
      } else if (baseImageMap.has(baseUrl)) {
        const existing = baseImageMap.get(baseUrl);
        console.log(`   Status: ⚠️  SAME BASE IMAGE as "${existing.title}" (different query params)`);
      } else {
        console.log(`   Status: ✅ Unique`);
        imageMap.set(imageUrl, guide);
        baseImageMap.set(baseUrl, guide);
      }
    }
    console.log('');
  }

  // Check for duplicates
  const duplicates = [];
  const baseDuplicates = [];
  
  for (const guide of allGuides) {
    const imageUrl = guide.hero_image_url || '';
    if (imageUrl && imageUrl.startsWith('http')) {
      const baseUrl = imageUrl.split('?')[0];
      const existing = baseImageMap.get(baseUrl);
      if (existing && existing.id !== guide.id) {
        if (!baseDuplicates.find(d => d.includes(guide.title) || d.includes(existing.title))) {
          baseDuplicates.push(`${guide.title} and ${existing.title}`);
        }
      }
    }
  }

  if (baseDuplicates.length > 0) {
    console.log(`\n⚠️  Found ${baseDuplicates.length} pair(s) with same base image:\n`);
    baseDuplicates.forEach(pair => console.log(`   - ${pair}`));
    console.log(`\n🔄 These need to be updated with different images.`);
  } else {
    console.log(`\n✅ All images are unique!`);
  }
}

verifyImageURLs().catch(console.error);

