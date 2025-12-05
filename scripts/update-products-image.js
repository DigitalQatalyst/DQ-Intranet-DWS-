import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductsImage() {
  console.log('🖼️  Updating DQ Products image to coding workspace...\n');

  // Get DQ Products guide
  const { data: products, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%DQ Products%')
    .single();

  if (error || !products) {
    console.error('❌ Error finding guide:', error);
    return;
  }

  console.log(`Found: "${products.title}" (ID: ${products.id})`);
  console.log(`Current image: ${products.hero_image_url?.substring(0, 80)}...\n`);

  // Get format from a working guide
  const { data: working } = await supabase
    .from('guides')
    .select('hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .not('hero_image_url', 'is', null)
    .limit(1)
    .single();

  const workingUrl = working?.hero_image_url || '';
  const urlParts = workingUrl.split('?');
  const params = urlParts[1] || '';
  const baseParams = params.split('&').filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');

  // Use a coding/workspace photo ID - laptop with code
  const photoId = '1461745250184-65c2d6c5ecf5'; // Coding workspace with laptop
  const hash = createHash('md5').update(`${products.id}-products-coding-workspace`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const timestamp = Date.now();
  
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?${baseParams}&u=${uniqueParam}&t=${timestamp}`;

  console.log(`Updating image...`);
  console.log(`   Photo ID: ${photoId} (coding workspace)`);
  console.log(`   URL: ${newImageUrl.substring(0, 100)}...`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', products.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
    return;
  }

  console.log(`   ✅ Updated successfully`);

  // Verify
  const { data: updated } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', products.id)
    .single();

  if (updated) {
    console.log(`\n📊 Final status:`);
    console.log(`   Title: ${updated.title}`);
    console.log(`   Image URL: ${updated.hero_image_url?.substring(0, 120)}...`);
    console.log(`   ✅ Image updated to coding workspace`);
  }

  console.log(`\n✅ DQ Products now has the coding workspace image.`);
}

updateProductsImage().catch(console.error);

