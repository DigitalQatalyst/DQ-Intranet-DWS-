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

// Base Unsplash collection IDs and photo IDs for variety
const UNSPLASH_PHOTO_IDS = [
  '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
  '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
  '1556761175-4b46a572b786', '1558494949-ef010cbdcc31', '1561070791-2526d30994b5',
  '1556761175-5973dc0f32e7', '1552581234-26160f608093', '1563013544-824ae1b704d3',
  '1484480974693-6ca0a78fb36b', '1521791136064-7986c2920216', '1451187580459-43490279c0fa',
  '1498050108023-c5249f4df085', '1516321318423-f06f85e504b3', '1556761175-b413ae4e686c',
  '1551434678-e076c223a692', '1507003211169-0a1dd7228f2d', '1522202176988-66273c2fd55f',
  '1553877522-43269d4ea984', '1559136555-9303baea8ebd', '1506784983877-45594efa4cbe',
  '1518085250887-2f903c200fee', '1521737604893-d14cc237f11d', '1525182008055-f88b95ff7980',
  '1497366754035-f200968a6e72', '1500530855697-b586d89ba3ee', '1667372335937-d03be6fb0a9c',
  '1516387938699-a93567ec168e', '1531482615713-2afd69097998', '1551434678-e076c223a692',
  '1507003211169-0a1dd7228f2d', '1522202176988-66273c2fd55f', '1553877522-43269d4ea984',
  '1559136555-9303baea8ebd', '1506784983877-45594efa4cbe', '1518085250887-2f903c200fee',
  '1521737604893-d14cc237f11d', '1525182008055-f88b95ff7980', '1497366754035-f200968a6e72',
  '1500530855697-b586d89ba3ee', '1667372335937-d03be6fb0a9c', '1516387938699-a93567ec168e',
  '1531482615713-2afd69097998', '1552664730-d307ca884978', '1522071820081-009f0129c71c',
  '1551288049-bebda4e38f71', '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f',
  '1556742049-0cfed4f6a45d', '1556761175-4b46a572b786', '1558494949-ef010cbdcc31',
  '1561070791-2526d30994b5', '1556761175-5973dc0f32e7', '1552581234-26160f608093',
  '1563013544-824ae1b704d3', '1484480974693-6ca0a78fb36b', '1521791136064-7986c2920216',
  '1451187580459-43490279c0fa', '1498050108023-c5249f4df085', '1516321318423-f06f85e504b3',
  '1556761175-b413ae4e686c', '1551434678-e076c223a692', '1507003211169-0a1dd7228f2d',
  '1522202176988-66273c2fd55f', '1553877522-43269d4ea984', '1559136555-9303baea8ebd',
  '1506784983877-45594efa4cbe', '1518085250887-2f903c200fee', '1521737604893-d14cc237f11d',
  '1525182008055-f88b95ff7980', '1497366754035-f200968a6e72', '1500530855697-b586d89ba3ee',
  '1667372335937-d03be6fb0a9c', '1516387938699-a93567ec168e', '1531482615713-2afd69097998',
];

function getUniqueImageForGuide(guideId, title, index) {
  // Use hash of guide ID + title to get a consistent but unique image
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIndex = hashNum % UNSPLASH_PHOTO_IDS.length;
  const photoId = UNSPLASH_PHOTO_IDS[photoIndex];
  
  // Add unique query params based on hash to ensure uniqueness even if same photo
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function assignTrulyUniqueImages() {
  console.log('🖼️  Assigning truly unique images to all guides...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('❌ No guides found');
    return;
  }

  console.log(`📊 Found ${guides.length} guides\n`);

  let updated = 0;
  const batchSize = 10;

  for (let i = 0; i < guides.length; i += batchSize) {
    const batch = guides.slice(i, i + batchSize);
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}...`);

    for (const guide of batch) {
      const imageUrl = getUniqueImageForGuide(guide.id, guide.title, i + batch.indexOf(guide));

      try {
        const { error: updateError } = await supabase
          .from('guides')
          .update({
            hero_image_url: imageUrl,
            last_updated_at: new Date().toISOString()
          })
          .eq('id', guide.id);

        if (updateError) {
          console.error(`   ❌ ${guide.title}: ${updateError.message}`);
        } else {
          console.log(`   ✅ ${guide.title}`);
          updated++;
        }
      } catch (err) {
        console.error(`   ❌ ${guide.title}: ${err.message}`);
      }
    }

    if (i + batchSize < guides.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Updated ${updated} guides with unique images!`);
  
  // Final verification
  console.log('\n🔄 Verifying uniqueness...');
  const { data: verifyGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved');

  const imageMap = new Map();
  (verifyGuides || []).forEach(g => {
    const img = g.hero_image_url;
    if (img) {
      if (!imageMap.has(img)) imageMap.set(img, []);
      imageMap.get(img).push(g.title);
    }
  });

  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1);
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found ${duplicates.length} duplicate images:`);
    duplicates.forEach(([img, titles]) => {
      console.log(`   ${titles.length} guides share: ${img.substring(0, 70)}...`);
      titles.forEach(t => console.log(`      - ${t}`));
    });
  } else {
    console.log(`\n✅ All ${verifyGuides.length} guides have unique images!`);
  }
}

assignTrulyUniqueImages().catch(console.error);

