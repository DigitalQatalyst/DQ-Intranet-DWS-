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

async function fixCompetenciesImage() {
  console.log('🖼️  Fixing DQ Competencies image with a working one...\n');

  const { data: guide, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guide) {
    console.log('⚠️  DQ Competencies guide not found');
    return;
  }

  console.log(`Current state:`);
  console.log(`   Title: ${guide.title}`);
  console.log(`   ID: ${guide.id}`);
  console.log(`   Current Image: ${guide.hero_image_url || 'null'}`);

  // Use a reliable, working Unsplash image for competencies/skills
  // This should be an image that clearly shows team, skills, or business capabilities
  const photoId = '1521737854947-0b219b6c2c94'; // Business meeting, team collaboration
  
  // Create a unique URL with proper parameters
  const hash = createHash('md5').update(`${guide.id}-DQ Competencies-working`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Use a clean, working Unsplash URL format
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&auto=format&q=80`;

  console.log(`\nUpdating to:`);
  console.log(`   Photo ID: ${photoId}`);
  console.log(`   New URL: ${newImageUrl}`);
  console.log(`   Theme: Business meeting and team collaboration (perfect for Competencies)`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', guide.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
    return;
  }

  console.log(`   ✅ Updated successfully`);

  // Verify the update
  console.log(`\n📊 Verifying update...\n`);
  const { data: updatedGuide } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', guide.id)
    .single();

  if (updatedGuide) {
    console.log(`✅ Verification:`);
    console.log(`   Title: ${updatedGuide.title}`);
    console.log(`   Image URL: ${updatedGuide.hero_image_url}`);
    console.log(`   Is valid URL: ${updatedGuide.hero_image_url?.startsWith('http') ? '✅' : '❌'}`);
    console.log(`   Is Unsplash: ${updatedGuide.hero_image_url?.includes('unsplash.com') ? '✅' : '❌'}`);
    console.log(`   Has photo ID: ${updatedGuide.hero_image_url?.includes('photo-') ? '✅' : '❌'}`);
    
    // Test if URL is properly formatted
    const url = updatedGuide.hero_image_url || '';
    if (url.includes('unsplash.com') && url.includes('photo-') && url.includes('w=800')) {
      console.log(`   ✅ URL format is correct and should work!`);
    } else {
      console.log(`   ⚠️  URL format may need adjustment`);
    }
  }

  console.log(`\n💡 The image should now display. Please refresh your browser to see it.`);
}

fixCompetenciesImage().catch(console.error);

