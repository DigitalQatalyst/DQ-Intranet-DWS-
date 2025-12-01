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

async function updateProductsBetterImage() {
  console.log('🖼️  Updating DQ Products with better workspace image...\n');

  // Get DQ Products
  const { data: products } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%DQ Products%')
    .single();

  if (!products) {
    console.error('❌ Guide not found');
    return;
  }

  // Get format from working guide
  const { data: working } = await supabase
    .from('guides')
    .select('hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .not('hero_image_url', 'is', null)
    .limit(1)
    .single();

  const workingUrl = working?.hero_image_url || '';
  const params = workingUrl.split('?')[1] || '';
  const baseParams = params.split('&').filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');

  // Try different coding workspace photo IDs
  const photoIds = [
    '1522071820081-009f0129c71c', // Team collaboration/workspace
    '1556761175-597af40f565e',    // Modern workspace
    '1516321318469-88ce825ef878', // Coding setup
    '1461745250184-65c2d6c5ecf5', // Laptop workspace
    '1557804816-2b21ebcb1977'     // Office workspace
  ];

  // Use the first one (team collaboration/workspace)
  const photoId = photoIds[0];
  const hash = createHash('md5').update(`${products.id}-products-workspace-final`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const timestamp = Date.now();
  
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?${baseParams}&u=${uniqueParam}&t=${timestamp}`;

  console.log(`Updating DQ Products image...`);
  console.log(`   Photo ID: ${photoId}`);
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

  console.log(`   ✅ Updated`);

  // Verify
  const { data: updated } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', products.id)
    .single();

  if (updated) {
    console.log(`\n📊 Verification:`);
    console.log(`   Title: ${updated.title}`);
    console.log(`   Image: ${updated.hero_image_url?.substring(0, 120)}...`);
    console.log(`   ✅ Image updated`);
  }

  console.log(`\n✅ DQ Products image updated.`);
}

updateProductsBetterImage().catch(console.error);

