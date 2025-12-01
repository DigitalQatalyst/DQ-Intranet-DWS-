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

async function fixCompetenciesImage() {
  console.log('🖼️  Fixing DQ Competencies image...\n');

  // Get DQ Competencies guide
  const { data: guide, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Competencies%')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guide) {
    console.log('❌ DQ Competencies guide not found');
    return;
  }

  console.log(`Found: "${guide.title}" (ID: ${guide.id})`);
  console.log(`Current image: ${guide.hero_image_url || 'null'}\n`);

  // Generate unique image URL
  const hash = createHash('md5').update(`${guide.id}-DQ-Competencies-unique`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Use a relevant photo ID for competencies/skills
  const photoId = '1521737854947-0b219b6c2c94'; // Business/competencies image
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`Updating image URL...`);
  console.log(`   New URL: ${newImageUrl.substring(0, 80)}...`);

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
    console.log(`   ✅ Image updated successfully`);
  }

  // Verify
  const { data: updated } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', guide.id)
    .single();

  if (updated) {
    const isValid = updated.hero_image_url && updated.hero_image_url.startsWith('http');
    console.log(`\n📊 Verification:`);
    console.log(`   Image URL: ${updated.hero_image_url?.substring(0, 90)}...`);
    console.log(`   Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
  }

  console.log(`\n✅ DQ Competencies now has an image.`);
}

fixCompetenciesImage().catch(console.error);

