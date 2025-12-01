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

async function fixCompetenciesFormat() {
  console.log('🖼️  Fixing DQ Competencies image to match working format...\n');

  const { data: competencies, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Use the EXACT same format as working images
  // Format: https://images.unsplash.com/photo-{photoId}?w=800&h=400&fit=crop&q=80&u={unique}
  const photoId = '1521737854947-0b219b6c2c94'; // Business meeting image
  
  // Create unique hash for the u parameter (matching working format)
  const hash = createHash('md5').update(`${competencies.id}-DQ Competencies`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Match EXACT format of working images
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`Updating "DQ Competencies"...`);
  console.log(`   Current: ${competencies.hero_image_url || 'null'}`);
  console.log(`   New: ${newImageUrl}`);
  console.log(`   Format: Matches working image format exactly`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', competencies.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Updated successfully`);
  }

  // Verify
  console.log(`\n📊 Verification:`);
  const { data: updated } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', competencies.id)
    .single();

  if (updated) {
    console.log(`   Title: ${updated.title}`);
    console.log(`   Image URL: ${updated.hero_image_url}`);
    console.log(`   Has correct format: ${updated.hero_image_url?.includes('&u=') ? '✅' : '❌'}`);
    console.log(`   Matches working pattern: ${updated.hero_image_url?.match(/w=800&h=400&fit=crop&q=80&u=[a-z0-9]+/) ? '✅' : '❌'}`);
  }

  console.log(`\n✅ DQ Competencies image now matches the exact format of working images!`);
  console.log(`💡 Please refresh your browser to see the image.`);
}

fixCompetenciesFormat().catch(console.error);

