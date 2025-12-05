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

async function checkDQCompetenciesImage() {
  console.log('🔍 Checking DQ Competencies image...\n');

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

  console.log(`Guide: ${guide.title}`);
  console.log(`ID: ${guide.id}`);
  console.log(`Current Image URL: ${guide.hero_image_url || 'null'}`);
  
  const imageUrl = guide.hero_image_url || '';
  const isValid = imageUrl && 
                  imageUrl !== '/image.png' && 
                  !imageUrl.includes('placeholder') &&
                  imageUrl.startsWith('http') &&
                  imageUrl.includes('unsplash');

  if (!isValid) {
    console.log(`\n❌ Image is invalid or missing!`);
    console.log(`   Current value: ${imageUrl || 'null'}`);
  } else {
    console.log(`\n✅ Image URL looks valid`);
    console.log(`   URL: ${imageUrl}`);
    
    // Check if it's the expected meaningful image
    if (imageUrl.includes('1507003211169-0a1dd7228fbb')) {
      console.log(`   ✅ This is the skills/capabilities image`);
    } else {
      console.log(`   ⚠️  This might not be the right image`);
    }
  }

  // Check all Strategy guides for comparison
  console.log(`\n\n📊 All Strategy guide images for comparison:\n`);
  const { data: allGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  allGuides?.forEach(g => {
    const img = g.hero_image_url || 'null';
    const isValid = img && img.startsWith('http') && img.includes('unsplash');
    const status = isValid ? '✅' : '❌';
    console.log(`${status} ${g.title}`);
    console.log(`   ${img.substring(0, 80)}...`);
  });
}

checkDQCompetenciesImage().catch(console.error);

