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

async function fixCompetenciesUniqueImage() {
  console.log('🖼️  Assigning unique image to DQ Competencies...\n');

  // Get all Strategy guides to check what images are already used
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

  // Get existing photo IDs to avoid duplicates
  const usedPhotoIds = new Set();
  allGuides.forEach(g => {
    if (g.hero_image_url) {
      const match = g.hero_image_url.match(/photo-([a-z0-9-]+)/);
      if (match) {
        usedPhotoIds.add(match[1]);
      }
    }
  });

  console.log(`Found ${usedPhotoIds.size} used photo IDs:`);
  usedPhotoIds.forEach(id => console.log(`   - ${id}`));

  // Available unique photo IDs for competencies (business meeting, skills, team)
  const availablePhotoIds = [
    '1521737854947-0b219b6c2c94', // Business meeting
    '1553877522-25bcdc54f2de',    // Strategy/planning
    '1516321318469-88ce825ef878', // Collaboration
    '1556761175-597af40f565e',    // Team work
    '1556073709-9fae23b835b2',    // Business
    '1557804816-2b21ebcb1977',    // Office
    '1559827261-9cbd8d3600a9'      // Team
  ];

  // Find first available photo ID
  let selectedPhotoId = null;
  for (const photoId of availablePhotoIds) {
    if (!usedPhotoIds.has(photoId)) {
      selectedPhotoId = photoId;
      break;
    }
  }

  if (!selectedPhotoId) {
    // If all are used, use the first one with a very unique hash
    selectedPhotoId = availablePhotoIds[0];
    console.log(`\n⚠️  All photo IDs are used, using ${selectedPhotoId} with unique hash`);
  } else {
    console.log(`\n✅ Selected unused photo ID: ${selectedPhotoId}`);
  }

  // Get DQ Competencies
  const { data: competencies, error: compError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (compError) {
    console.error('❌ Error:', compError);
    return;
  }

  // Create unique image URL
  const hash = createHash('md5').update(`${competencies.id}-DQ Competencies-unique`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const newImageUrl = `https://images.unsplash.com/photo-${selectedPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`\nUpdating "DQ Competencies"...`);
  console.log(`   Current: ${competencies.hero_image_url?.substring(0, 70)}...`);
  console.log(`   New Photo ID: ${selectedPhotoId}`);
  console.log(`   New URL: ${newImageUrl.substring(0, 70)}...`);
  console.log(`   Theme: Business meeting and team capabilities (unique from DQ Beliefs)`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', competencies.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Updated successfully`);
  }

  // Final verification - check all images are unique
  console.log(`\n📊 Final verification - All Strategy guide images:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  const photoIdMap = new Map();
  let allUnique = true;

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    if (imageUrl && imageUrl.includes('unsplash')) {
      const match = imageUrl.match(/photo-([a-z0-9-]+)/);
      if (match) {
        const photoId = match[1];
        if (photoIdMap.has(photoId)) {
          const existing = photoIdMap.get(photoId);
          console.log(`⚠️  "${guide.title}" - DUPLICATE photo ID with "${existing.title}"`);
          console.log(`   Photo ID: ${photoId}`);
          allUnique = false;
        } else {
          photoIdMap.set(photoId, guide);
          console.log(`✅ "${guide.title}" - Unique photo ID: ${photoId}`);
        }
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides now have unique images!`);
  } else {
    console.log(`\n⚠️  Some duplicates found.`);
  }
}

fixCompetenciesUniqueImage().catch(console.error);

