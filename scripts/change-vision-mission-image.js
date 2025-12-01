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

async function changeVisionMissionImage() {
  console.log('🖼️  Changing DQ Vision and Mission to a more appropriate image...\n');

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

  // Get existing base image URLs (excluding DQ Vision and Mission)
  const existingBaseUrls = new Set();
  allGuides.forEach(g => {
    if (g.title !== 'DQ Vision and Mission' && g.hero_image_url) {
      const baseUrl = g.hero_image_url.split('?')[0];
      existingBaseUrls.add(baseUrl);
    }
  });

  console.log(`Found ${existingBaseUrls.size} existing unique images\n`);

  // Better image options for Vision and Mission - something about vision, goals, future, purpose
  const visionMissionPhotoIds = [
    '1454165804606-c3d57bc86b40', // Planning, roadmap, vision
    '1553877522-25bcdc54f2de',    // Strategy, vision board
    '1516321318469-88ce825ef878', // Vision, goals, planning
    '1556761175-597af40f565e',    // Team vision, collaboration
    '1556073709-9fae23b835b2',    // Business vision, strategy
    '1557804816-2b21ebcb1977',     // Vision, future planning
    '1559827261-9cbd8d3600a9'     // Vision, mission, purpose
  ];

  const dqVisionMission = allGuides.find(g => g.title === 'DQ Vision and Mission');
  if (!dqVisionMission) {
    console.log('⚠️  DQ Vision and Mission guide not found');
    return;
  }

  let newImageUrl = null;
  let selectedPhotoId = null;

  // Find first available photo ID that's not already used
  for (const photoId of visionMissionPhotoIds) {
    const testBaseUrl = `https://images.unsplash.com/photo-${photoId}`;
    if (!existingBaseUrls.has(testBaseUrl)) {
      selectedPhotoId = photoId;
      const hash = createHash('md5').update(`${dqVisionMission.id}-DQ Vision and Mission-vision`).digest('hex');
      const uniqueParam = hash.substring(0, 8);
      newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
      break;
    }
  }

  if (!newImageUrl) {
    // Use the first one with a very unique hash
    selectedPhotoId = visionMissionPhotoIds[0];
    const hash = createHash('md5').update(`${dqVisionMission.id}-${Date.now()}-vision-mission-purpose`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    newImageUrl = `https://images.unsplash.com/photo-${selectedPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
  }

  console.log(`Updating "DQ Vision and Mission"...`);
  console.log(`   Current: ${dqVisionMission.hero_image_url?.substring(0, 70)}...`);
  console.log(`   New Photo ID: ${selectedPhotoId}`);
  console.log(`   New URL: ${newImageUrl.substring(0, 70)}...`);
  console.log(`   Theme: Vision, mission, purpose, goals, strategic direction`);
  console.log(`   (Replacing dashboard/data visualization with vision/mission imagery)`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', dqVisionMission.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Updated successfully`);
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
        console.log(`✅ "${guide.title}" - Unique image`);
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ DQ Vision and Mission now has an appropriate vision/mission image!`);
  }
}

changeVisionMissionImage().catch(console.error);

