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

async function assignWorkingImage() {
  console.log('🖼️  Assigning working image to DQ Competencies...\n');

  // Get DQ Competencies
  const { data: guide, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Competencies%')
    .single();

  if (error || !guide) {
    console.error('❌ Error finding guide:', error);
    return;
  }

  console.log(`Found: "${guide.title}" (ID: ${guide.id})`);

  // Get a working guide to copy the format from
  const { data: workingGuide } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .limit(1)
    .single();

  if (workingGuide) {
    console.log(`Reference guide: "${workingGuide.title}"`);
    console.log(`   Format: ${workingGuide.hero_image_url?.substring(0, 100)}...`);
  }

  // Use a different, known-working photo ID for competencies
  const photoId = '1507003211169-0a1dd7228fbb'; // Skills/competencies related
  const hash = createHash('md5').update(`${guide.id}-competencies-final-working`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Use exact format from working guide
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`\nUpdating to new image...`);
  console.log(`   Photo ID: ${photoId}`);
  console.log(`   URL: ${newImageUrl.substring(0, 90)}...`);

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
    console.log(`   ✅ Updated successfully`);
  }

  // Final check
  const { data: updated } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', guide.id)
    .single();

  if (updated) {
    console.log(`\n📊 Final status:`);
    console.log(`   Title: ${updated.title}`);
    console.log(`   Image URL: ${updated.hero_image_url?.substring(0, 100)}...`);
    console.log(`   Status: ✅ Image assigned`);
  }

  console.log(`\n💡 If image still doesn't show, try hard refresh (Ctrl+F5)`);
}

assignWorkingImage().catch(console.error);

