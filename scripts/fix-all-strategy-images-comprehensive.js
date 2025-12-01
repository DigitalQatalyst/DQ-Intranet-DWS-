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

// Comprehensive image assignments - each guide gets a unique, relevant image
const IMAGE_ASSIGNMENTS = {
  'DQ Journey': {
    photoId: '1552664730-d307ca884978', // Journey, path, growth, business evolution
    description: 'Business journey and growth'
  },
  'DQ Beliefs': {
    photoId: '1522071820081-009f0129c71c', // Team values, collaboration, principles
    description: 'Team values and collaboration'
  },
  'DQ Vision and Mission': {
    photoId: '1454165804606-c3d57bc86b40', // Vision board, strategic planning, goals
    description: 'Vision board and strategic planning'
  },
  'DQ Strategy 2021-2030': {
    photoId: '1551288049-bebda4e38f71', // Timeline, roadmap, strategic planning
    description: 'Timeline and roadmap planning'
  },
  'DQ Competencies': {
    photoId: '1521737854947-0b219b6c2c94', // Business meeting, team skills, capabilities
    description: 'Business meeting and team capabilities'
  },
  'DQ Products': {
    photoId: '1460925895917-afdab827c52f', // Technology, products, innovation
    description: 'Technology and product innovation'
  },
  'Agile 6xD (Products)': {
    photoId: '1556742049-0cfed4f6a45d', // Framework, structure, digital transformation
    description: 'Framework and digital structure'
  }
};

async function fixAllStrategyImages() {
  console.log('🖼️  Fixing ALL Strategy guide images comprehensively...\n');

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

  // Update all guides with proper images
  let successCount = 0;
  let errorCount = 0;

  for (const guide of allGuides) {
    const imageConfig = IMAGE_ASSIGNMENTS[guide.title];
    
    if (!imageConfig) {
      console.log(`⚠️  "${guide.title}" - No image assignment found, skipping`);
      continue;
    }

    // Create unique hash for this specific guide
    const hash = createHash('md5').update(`${guide.id}-${guide.title}-final-fix`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newImageUrl = `https://images.unsplash.com/photo-${imageConfig.photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

    console.log(`Updating "${guide.title}"...`);
    console.log(`   Photo ID: ${imageConfig.photoId}`);
    console.log(`   Theme: ${imageConfig.description}`);
    console.log(`   URL: ${newImageUrl.substring(0, 70)}...`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Updated successfully`);
      successCount++;
    }
    console.log('');
  }

  console.log(`\n📊 Update Summary:`);
  console.log(`   Successfully updated: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);

  // Comprehensive final verification
  console.log(`\n\n🔍 Comprehensive Final Verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  const baseImageMap = new Map();
  let allGood = true;
  let missingCount = 0;
  let duplicateCount = 0;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    
    // Check if image exists and is valid
    const hasImage = imageUrl && 
                    imageUrl !== '/image.png' && 
                    !imageUrl.includes('placeholder') &&
                    imageUrl.startsWith('http') &&
                    imageUrl.includes('unsplash') &&
                    imageUrl.includes('photo-');

    if (!hasImage) {
      console.log(`❌ "${guide.title}" - MISSING OR INVALID IMAGE`);
      console.log(`   Current value: ${imageUrl || 'null'}`);
      missingCount++;
      allGood = false;
    } else {
      // Check for duplicates
      const baseUrl = imageUrl.split('?')[0];
      if (baseImageMap.has(baseUrl)) {
        const existing = baseImageMap.get(baseUrl);
        console.log(`⚠️  "${guide.title}" - DUPLICATE with "${existing.title}"`);
        console.log(`   Base URL: ${baseUrl}`);
        duplicateCount++;
        allGood = false;
      } else {
        baseImageMap.set(baseUrl, guide);
        const imageConfig = IMAGE_ASSIGNMENTS[guide.title];
        console.log(`✅ "${guide.title}"`);
        console.log(`   Image: ${imageUrl.substring(0, 70)}...`);
        if (imageConfig) {
          console.log(`   Theme: ${imageConfig.description}`);
        }
      }
    }
    console.log('');
  }

  console.log(`\n📊 Final Status:`);
  console.log(`   Total guides: ${finalGuides?.length || 0}`);
  console.log(`   Missing images: ${missingCount}`);
  console.log(`   Duplicates: ${duplicateCount}`);
  console.log(`   Valid unique images: ${baseImageMap.size}`);

  if (allGood && missingCount === 0 && duplicateCount === 0) {
    console.log(`\n✅ SUCCESS! All Strategy guides have unique, relevant images!`);
  } else {
    console.log(`\n⚠️  Issues found. Please review above.`);
  }
}

fixAllStrategyImages().catch(console.error);

