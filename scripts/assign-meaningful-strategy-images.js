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

// Meaningful images for each guide based on their content
const MEANINGFUL_IMAGES = {
  'DQ Journey': {
    photoId: '1552664730-d307ca884978', // Business growth, journey, path
    description: 'Journey and growth imagery'
  },
  'DQ Beliefs': {
    photoId: '1522071820081-009f0129c71c', // Team collaboration, values
    description: 'Team and values imagery'
  },
  'DQ Vision and Mission': {
    photoId: '1551288049-bebda4e38f71', // Vision, strategy, planning
    description: 'Vision and strategy imagery'
  },
  'DQ Strategy 2021-2030': {
    photoId: '1454165804606-c3d57bc86b40', // Timeline, roadmap, planning
    description: 'Timeline and roadmap imagery'
  },
  'DQ Competencies': {
    photoId: '1507003211169-0a1dd7228fbb', // Skills, capabilities, team
    description: 'Skills and capabilities imagery'
  },
  'DQ Products': {
    photoId: '1460925895917-afdab827c52f', // Technology, products, innovation
    description: 'Technology and products imagery'
  },
  'Agile 6xD (Products)': {
    photoId: '1556742049-0cfed4f6a45d', // Framework, structure, digital transformation
    description: 'Framework and structure imagery'
  }
};

function getMeaningfulImage(guideId, title) {
  const imageConfig = MEANINGFUL_IMAGES[title];
  
  if (!imageConfig) {
    // Fallback to hash-based selection
    const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
    const hashNum = parseInt(hash.substring(0, 8), 16);
    const fallbackIds = [
      '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71'
    ];
    const photoId = fallbackIds[hashNum % fallbackIds.length];
    const uniqueParam = hash.substring(0, 8);
    return {
      url: `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`,
      description: 'Fallback image'
    };
  }

  // Create unique hash for query parameter to ensure uniqueness
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  return {
    url: `https://images.unsplash.com/photo-${imageConfig.photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`,
    description: imageConfig.description
  };
}

async function assignMeaningfulImages() {
  console.log('🖼️  Assigning meaningful images to Strategy guides...\n');

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

  for (const guide of allGuides) {
    const imageInfo = getMeaningfulImage(guide.id, guide.title);
    
    console.log(`Updating "${guide.title}"...`);
    console.log(`   Current: ${(guide.hero_image_url || 'null').substring(0, 70)}...`);
    console.log(`   New: ${imageInfo.url.substring(0, 70)}...`);
    console.log(`   Theme: ${imageInfo.description}`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageInfo.url,
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
        console.log(`⚠️  "${guide.title}" - Duplicate with "${existing.title}"`);
        allUnique = false;
      } else {
        baseImageMap.set(baseUrl, guide);
        const imageInfo = MEANINGFUL_IMAGES[guide.title];
        console.log(`✅ "${guide.title}" - ${imageInfo ? imageInfo.description : 'Unique image'}`);
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have meaningful, unique images!`);
  } else {
    console.log(`\n⚠️  Some issues remain.`);
  }
}

assignMeaningfulImages().catch(console.error);

