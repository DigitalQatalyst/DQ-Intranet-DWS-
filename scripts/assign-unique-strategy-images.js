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

// Pre-assigned unique images for each guide to ensure variety
const GUIDE_IMAGES = {
  'DQ Journey': '1552664730-d307ca884978',
  'DQ Beliefs': '1522071820081-009f0129c71c',
  'DQ Vision and Mission': '1551288049-bebda4e38f71',
  'DQ Strategy 2021-2030': '1454165804606-c3d57bc86b40',
  'DQ Competencies': '1507003211169-0a1dd7228fbb',
  'DQ Products': '1556742049-0cfed4f6a45d',
  'Agile 6xD (Products)': '1557800636-23f87b1063e4',
  'DQ IT Operation Security Policy': '1521737854947-0b219b6c2c94',
  'IT Security Management Policy': '1553877522-25bcdc54f2de'
};

function getUniqueImageForGuide(guideId, title) {
  // Use pre-assigned image if available
  const photoId = GUIDE_IMAGES[title] || '1552664730-d307ca884978';
  
  // Create unique hash for query parameter
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function assignUniqueImages() {
  console.log('🖼️  Assigning unique images to Strategy guides...\n');

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

  // Check current images and identify duplicates
  const baseImageMap = new Map();
  const guidesToUpdate = [];

  for (const guide of allGuides) {
    const imageUrl = guide.hero_image_url || '';
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http');

    if (!hasImage) {
      console.log(`❌ "${guide.title}" - Missing image`);
      guidesToUpdate.push(guide);
    } else {
      // Extract base URL (without query parameters)
      const baseUrl = imageUrl.split('?')[0];
      
      if (baseImageMap.has(baseUrl)) {
        const existing = baseImageMap.get(baseUrl);
        console.log(`⚠️  "${guide.title}" - Duplicate base image with "${existing.title}"`);
        guidesToUpdate.push(guide);
      } else {
        baseImageMap.set(baseUrl, guide);
        console.log(`✅ "${guide.title}" - Has unique base image`);
      }
    }
  }

  if (guidesToUpdate.length === 0) {
    console.log(`\n✅ All Strategy guides have unique images!`);
    return;
  }

  console.log(`\n\n🔄 Updating ${guidesToUpdate.length} guide(s) with new unique images...\n`);

  for (const guide of guidesToUpdate) {
    const newImageUrl = getUniqueImageForGuide(guide.id, guide.title);
    console.log(`Updating "${guide.title}"...`);
    console.log(`   Old: ${(guide.hero_image_url || 'null').substring(0, 70)}...`);
    console.log(`   New: ${newImageUrl.substring(0, 70)}...`);

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

  const finalBaseMap = new Map();
  let allUnique = true;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http');

    if (!hasImage) {
      console.log(`❌ "${guide.title}" - Still missing image`);
      allUnique = false;
    } else {
      const baseUrl = imageUrl.split('?')[0];
      if (finalBaseMap.has(baseUrl)) {
        const existing = finalBaseMap.get(baseUrl);
        console.log(`⚠️  "${guide.title}" - Still duplicate with "${existing.title}"`);
        allUnique = false;
      } else {
        finalBaseMap.set(baseUrl, guide);
        console.log(`✅ "${guide.title}" - Unique image`);
      }
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have unique images!`);
  } else {
    console.log(`\n⚠️  Some issues remain.`);
  }
}

assignUniqueImages().catch(console.error);

