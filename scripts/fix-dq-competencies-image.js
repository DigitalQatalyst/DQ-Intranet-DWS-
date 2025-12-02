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

async function fixDQCompetenciesImage() {
  console.log('🖼️  Fixing DQ Competencies image with a more relevant one...\n');

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

  // Use a different, more relevant image for competencies/skills
  // This should be an image that clearly shows team, skills, or capabilities
  const betterImageIds = [
    '1522071820081-009f0129c71c', // Team collaboration
    '1552664730-d307ca884978',    // Business/strategy
    '1551288049-bebda4e38f71',    // Planning/strategy
    '1460925895917-afdab827c52f', // Technology/innovation
    '1556742049-0cfed4f6a45d',    // Framework/structure
    '1557800636-23f87b1063e4',    // Team/workplace
    '1521737854947-0b219b6c2c94', // Business meeting
    '1553877522-25bcdc54f2de'     // Strategy/planning
  ];

  // Use team collaboration image (first one) for competencies
  const photoId = '1522071820081-009f0129c71c';
  const hash = createHash('md5').update(`${guide.id}-DQ Competencies-skills`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`Updating "${guide.title}"...`);
  console.log(`   Current: ${guide.hero_image_url || 'null'}`);
  console.log(`   New: ${newImageUrl}`);
  console.log(`   Theme: Team collaboration and skills (more relevant for Competencies)`);

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

  // Verify it was updated
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
    console.log(`   Image is valid: ${updatedGuide.hero_image_url?.startsWith('http') ? '✅' : '❌'}`);
    console.log(`   Image is Unsplash: ${updatedGuide.hero_image_url?.includes('unsplash') ? '✅' : '❌'}`);
  }
}

fixDQCompetenciesImage().catch(console.error);

