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

async function fixCompetenciesVisionImages() {
  console.log('🖼️  Fixing DQ Competencies and DQ Vision and Mission images...\n');

  // Get all Strategy guides to check for conflicts
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

  // Get existing base image URLs to avoid duplicates
  const existingBaseUrls = new Set();
  allGuides.forEach(g => {
    if (g.hero_image_url) {
      const baseUrl = g.hero_image_url.split('?')[0];
      existingBaseUrls.add(baseUrl);
    }
  });

  // Better images that make sense for each guide
  const imageAssignments = {
    'DQ Competencies': {
      photoId: '1521737854947-0b219b6c2c94', // Business meeting, team collaboration, skills
      description: 'Team collaboration and business meeting (relevant for Competencies)',
      reason: 'Shows team working together, which relates to competencies and skills'
    },
    'DQ Vision and Mission': {
      photoId: '1552664730-d307ca884978', // Vision, future, goals, strategy planning
      description: 'Vision and strategic planning (relevant for Vision and Mission)',
      reason: 'Shows strategic vision and planning, which relates to vision and mission'
    }
  };

  for (const [title, config] of Object.entries(imageAssignments)) {
    const guide = allGuides.find(g => g.title === title);
    
    if (!guide) {
      console.log(`⚠️  "${title}" guide not found`);
      continue;
    }

    // Check if this photo ID is already used
    const testBaseUrl = `https://images.unsplash.com/photo-${config.photoId}`;
    if (existingBaseUrls.has(testBaseUrl)) {
      console.log(`⚠️  Photo ID ${config.photoId} is already used, finding alternative...`);
      // Use alternative photo IDs
      const alternatives = {
        'DQ Competencies': ['1553877522-25bcdc54f2de', '1516321318469-88ce825ef878', '1556761175-597af40f565e'],
        'DQ Vision and Mission': ['1454165804606-c3d57bc86b40', '1551288049-bebda4e38f71', '1556742049-0cfed4f6a45d']
      };
      
      let foundAlternative = false;
      for (const altPhotoId of alternatives[title]) {
        const altBaseUrl = `https://images.unsplash.com/photo-${altPhotoId}`;
        if (!existingBaseUrls.has(altBaseUrl)) {
          config.photoId = altPhotoId;
          foundAlternative = true;
          break;
        }
      }
      
      if (!foundAlternative) {
        console.log(`   ⚠️  Could not find alternative, using original`);
      }
    }

    const hash = createHash('md5').update(`${guide.id}-${title}-fixed`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newImageUrl = `https://images.unsplash.com/photo-${config.photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

    console.log(`Updating "${title}"...`);
    console.log(`   Current: ${(guide.hero_image_url || 'null').substring(0, 70)}...`);
    console.log(`   New Photo ID: ${config.photoId}`);
    console.log(`   New URL: ${newImageUrl.substring(0, 70)}...`);
    console.log(`   ${config.description}`);
    console.log(`   Reason: ${config.reason}`);

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
    console.log('');
  }

  // Final verification
  console.log(`\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  const baseImageMap = new Map();
  let allUnique = true;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    if (imageUrl && imageUrl.startsWith('http')) {
      const baseUrl = imageUrl.split('?')[0];
      if (baseImageMap.has(baseUrl)) {
        const existing = baseImageMap.get(baseUrl);
        console.log(`⚠️  "${guide.title}" - DUPLICATE with "${existing.title}"`);
        allUnique = false;
      } else {
        baseImageMap.set(baseUrl, guide);
        const hasImage = imageUrl.includes('unsplash') && imageUrl.includes('photo-');
        const status = hasImage ? '✅' : '❌';
        console.log(`${status} "${guide.title}" - ${hasImage ? 'Has image' : 'Missing/invalid image'}`);
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have unique, relevant images!`);
  }
}

fixCompetenciesVisionImages().catch(console.error);

