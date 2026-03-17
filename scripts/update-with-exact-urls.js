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

// PLEASE PROVIDE THE EXACT IMAGE URLs FROM YOUR SCREENSHOTS HERE
// Replace the placeholder URLs below with the actual image URLs you want to use
const exactImageUrls = {
  'dq-agile-6xd': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Agile E&D - Man with whiteboard
  'dq-agile-flows': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Agile Flows - Holographic display
  'dq-agile-sos': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Agile SoS - Conference table
  'dq-agile-tms': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Agile TMS - Laptop dashboard
  'dq-persona': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Persona - Laptop UI
  'dq-hov': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // HoV - Sticky notes with light bulb
  'dq-vision': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // DQ Vision - Mountain peak
  'dq-products': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // DQ Products - Laptop with charts
  'dq-ghc': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // GHC - Honeycomb diagram
  'dq-vision-and-mission': 'REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT', // Vision & Mission - Team board
};

async function updateWithExactUrls() {
  console.log('🖼️  Updating images with exact URLs...\n');

  let hasPlaceholders = false;
  for (const [slug, url] of Object.entries(exactImageUrls)) {
    if (url.includes('REPLACE_WITH_EXACT_URL')) {
      hasPlaceholders = true;
      break;
    }
  }

  if (hasPlaceholders) {
    console.log('⚠️  Please replace the placeholder URLs in this script with the exact image URLs from your screenshots.');
    console.log('   Edit scripts/update-with-exact-urls.js and replace REPLACE_WITH_EXACT_URL_FROM_SCREENSHOT with actual URLs.\n');
    return;
  }

  for (const [slug, imageUrl] of Object.entries(exactImageUrls)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      const { data, error } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select('id, title, slug');

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ Successfully updated: ${data[0].title}`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done!');
}

updateWithExactUrls().catch(console.error);

