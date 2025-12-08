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

async function addCacheBusting() {
  console.log('🔄 Adding cache-busting parameters to all Strategy guide images...\n');

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

  console.log(`Found ${allGuides.length} Strategy guides\n`);

  const timestamp = Date.now();

  for (const guide of allGuides) {
    const currentUrl = guide.hero_image_url || '';
    
    if (!currentUrl || !currentUrl.includes('unsplash')) {
      console.log(`⚠️  "${guide.title}" - Skipping (no valid image URL)`);
      continue;
    }

    // Extract photo ID from current URL
    const photoIdMatch = currentUrl.match(/photo-([a-z0-9-]+)/);
    if (!photoIdMatch) {
      console.log(`⚠️  "${guide.title}" - Could not extract photo ID`);
      continue;
    }

    const photoId = photoIdMatch[1];
    
    // Create new unique hash with timestamp for cache busting
    const hash = createHash('md5').update(`${guide.id}-${guide.title}-${timestamp}`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    
    // New URL with cache-busting parameter
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${timestamp}`;

    console.log(`Updating "${guide.title}"...`);
    console.log(`   Old: ${currentUrl.substring(0, 70)}...`);
    console.log(`   New: ${newImageUrl.substring(0, 70)}...`);
    console.log(`   Cache-busting: Added timestamp parameter (t=${timestamp})`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated with cache-busting parameter`);
    }
    console.log('');
  }

  console.log(`\n✅ All Strategy guide images updated with cache-busting parameters!`);
  console.log(`💡 The browser will now fetch fresh images. Please refresh your browser.`);
}

addCacheBusting().catch(console.error);

