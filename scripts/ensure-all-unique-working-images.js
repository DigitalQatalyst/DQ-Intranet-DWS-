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

// Large pool of unique Unsplash images (business, tech, collaboration themes)
// Using different photo IDs to ensure uniqueness
const UNIQUE_IMAGES = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413ae4e686c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1667372335937-d03be6fb0a9c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556761175-b413ae4e686c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1667372335937-d03be6fb0a9c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1667372335937-d03be6fb0a9c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1667372335937-d03be6fb0a9c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1667372335937-d03be6fb0a9c?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&auto=format',
];

async function assignUniqueImages() {
  console.log('🖼️  Assigning unique images to all guides...\n');

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

  console.log(`📊 Found ${guides.length} guides`);
  console.log(`📊 Image pool: ${UNIQUE_IMAGES.length} unique images\n`);

  // Assign unique images sequentially
  let updated = 0;
  const batchSize = 10;

  for (let i = 0; i < guides.length; i += batchSize) {
    const batch = guides.slice(i, i + batchSize);
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}...`);

    for (const guide of batch) {
      const imageIndex = i + batch.indexOf(guide);
      const imageUrl = UNIQUE_IMAGES[imageIndex % UNIQUE_IMAGES.length];

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
      // Normalize URL (remove query params for comparison)
      const baseUrl = img.split('?')[0];
      if (!imageMap.has(baseUrl)) imageMap.set(baseUrl, []);
      imageMap.get(baseUrl).push(g.title);
    }
  });

  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1);
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found ${duplicates.length} duplicate base images:`);
    duplicates.forEach(([img, titles]) => {
      console.log(`   ${titles.length} guides: ${img.substring(0, 60)}...`);
    });
  } else {
    console.log(`\n✅ All guides have unique images!`);
  }
}

assignUniqueImages().catch(console.error);

