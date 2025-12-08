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

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  
  // Different image categories for variety
  const photoIds = [
    // Business/Strategy images
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
    '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878', '1556761175-597af40f565e',
    '1556073709-9fae23b835b2', '1557804816-2b21ebcb1977', '1559827261-9cbd8d3600a9',
    // Technology/Digital images
    '1460925895917-afdab827c52f', '1551288049-bebda4e38f71', '1552664730-d307ca884978',
    '1454165804606-c3d57bc86b40', '1556742049-0cfed4f6a45d', '1557800636-23f87b1063e4',
    '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de', '1507003211169-0a1dd7228fbb',
    '1516321318469-88ce825ef878', '1556761175-597af40f565e', '1556073709-9fae23b835b2',
    '1557804816-2b21ebcb1977', '1559827261-9cbd8d3600a9', '1553877522-25bcdc54f2de',
    // Team/Collaboration images
    '1522071820081-009f0129c71c', '1551288049-bebda4e38f71', '1552664730-d307ca884978',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
  ];
  
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 8);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function fixStrategyGuideImages() {
  console.log('🖼️  Fixing Strategy guide images...\n');

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

  // Check for duplicates and missing images
  const imageMap = new Map();
  const guidesToUpdate = [];

  for (const guide of allGuides) {
    const imageUrl = guide.hero_image_url;
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http');

    if (!hasImage) {
      console.log(`❌ "${guide.title}" - Missing image`);
      guidesToUpdate.push({ guide, reason: 'missing' });
    } else {
      // Check for duplicates
      if (imageMap.has(imageUrl)) {
        const existingGuide = imageMap.get(imageUrl);
        console.log(`⚠️  "${guide.title}" - Duplicate image with "${existingGuide.title}"`);
        guidesToUpdate.push({ guide, reason: 'duplicate', existing: existingGuide });
      } else {
        imageMap.set(imageUrl, guide);
        console.log(`✅ "${guide.title}" - Has unique image`);
      }
    }
  }

  if (guidesToUpdate.length === 0) {
    console.log(`\n✅ All Strategy guides have unique images!`);
    return;
  }

  console.log(`\n\n🔄 Updating ${guidesToUpdate.length} guide(s) with new unique images...\n`);

  for (const { guide, reason, existing } of guidesToUpdate) {
    const newImageUrl = getUniqueImage(guide.id, guide.title);
    console.log(`Updating "${guide.title}"...`);
    if (reason === 'duplicate') {
      console.log(`   Old image: ${guide.hero_image_url?.substring(0, 60)}...`);
      console.log(`   (Was duplicate of "${existing.title}")`);
    } else {
      console.log(`   Old image: ${guide.hero_image_url || 'null'}`);
    }
    console.log(`   New image: ${newImageUrl.substring(0, 60)}...`);

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

  const finalImageMap = new Map();
  let allUnique = true;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url;
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http');

    if (!hasImage) {
      console.log(`❌ "${guide.title}" - Still missing image`);
      allUnique = false;
    } else if (finalImageMap.has(imageUrl)) {
      const existing = finalImageMap.get(imageUrl);
      console.log(`⚠️  "${guide.title}" - Still duplicate with "${existing.title}"`);
      allUnique = false;
    } else {
      finalImageMap.set(imageUrl, guide);
      console.log(`✅ "${guide.title}" - Has unique image`);
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have unique images!`);
  } else {
    console.log(`\n⚠️  Some issues remain.`);
  }
}

fixStrategyGuideImages().catch(console.error);

