import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDQProductsImage() {
  console.log('🖼️  Fixing DQ Products image...\n');

  // Get all Strategy guides to check for conflicts
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

  // Find DQ Products guide
  const dqProducts = allGuides.find(g => g.title === 'DQ Products');
  if (!dqProducts) {
    console.log('⚠️  DQ Products guide not found');
    return;
  }

  // Get all existing base image URLs
  const existingBaseUrls = new Set();
  allGuides.forEach(g => {
    if (g.title !== 'DQ Products' && g.hero_image_url) {
      const baseUrl = g.hero_image_url.split('?')[0];
      existingBaseUrls.add(baseUrl);
    }
  });

  // Assign a unique image that's not used by any other guide
  const uniquePhotoIds = [
    '1557800636-23f87b1063e4', // Different from all others
    '1521737854947-0b219b6c2c94',
    '1553877522-25bcdc54f2de',
    '1516321318469-88ce825ef878',
    '1556761175-597af40f565e',
    '1556073709-9fae23b835b2',
    '1557804816-2b21ebcb1977',
    '1559827261-9cbd8d3600a9'
  ];

  let newImageUrl = null;
  for (const photoId of uniquePhotoIds) {
    const testUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80`;
    const baseUrl = testUrl.split('?')[0];
    if (!existingBaseUrls.has(baseUrl)) {
      const hash = createHash('md5').update(`${dqProducts.id}-DQ Products`).digest('hex');
      const uniqueParam = hash.substring(0, 8);
      newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
      break;
    }
  }

  if (!newImageUrl) {
    // Fallback: use a completely different photo ID
    const hash = createHash('md5').update(`${dqProducts.id}-DQ Products-unique`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    newImageUrl = `https://images.unsplash.com/photo-1557800636-23f87b1063e4?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
  }

  console.log(`Updating "DQ Products"...`);
  console.log(`   Old: ${dqProducts.hero_image_url?.substring(0, 70)}...`);
  console.log(`   New: ${newImageUrl.substring(0, 70)}...`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', dqProducts.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Updated successfully`);
  }

  // Final verification
  console.log(`\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  const baseImageMap = new Map();
  let allUnique = true;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    if (imageUrl && imageUrl.startsWith('http')) {
      const baseUrl = imageUrl.split('?')[0];
      if (baseImageMap.has(baseUrl)) {
        const existing = baseImageMap.get(baseUrl);
        console.log(`⚠️  "${guide.title}" - Duplicate with "${existing.title}"`);
        allUnique = false;
      } else {
        baseImageMap.set(baseUrl, guide);
        console.log(`✅ "${guide.title}" - Unique`);
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have unique images!`);
  }
}

fixDQProductsImage().catch(console.error);

