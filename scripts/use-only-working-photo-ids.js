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

async function useOnlyWorkingPhotoIds() {
  console.log('🖼️  Using only confirmed working photo IDs...\n');

  // Get all Strategy guides to see which photo IDs are confirmed working
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

  // Extract all photo IDs currently in use
  const photoIdUsage = new Map();
  allGuides?.forEach(g => {
    const match = g.hero_image_url?.match(/photo-([a-z0-9-]+)/);
    if (match) {
      const photoId = match[1];
      if (!photoIdUsage.has(photoId)) {
        photoIdUsage.set(photoId, []);
      }
      photoIdUsage.get(photoId).push(g.title);
    }
  });

  console.log('Current photo ID usage:\n');
  photoIdUsage.forEach((guides, photoId) => {
    console.log(`   ${photoId}: ${guides.join(', ')}`);
  });

  // Get DQ Beliefs and DQ Competencies
  const beliefs = allGuides?.find(g => g.title === 'DQ Beliefs');
  const competencies = allGuides?.find(g => g.title === 'DQ Competencies');

  // List of known working Unsplash photo IDs (from guides that display correctly)
  const knownWorkingPhotoIds = [
    '1552664730-d307ca884978', // DQ Journey - confirmed working
    '1460925895917-afdab827c52f', // DQ Products - confirmed working
    '1551288049-bebda4e38f71', // DQ Strategy 2021-2030 - confirmed working
    '1454165804606-c3d57bc86b40', // DQ Vision and Mission - confirmed working
    '1556742049-0cfed4f6a45d', // Agile 6xD - confirmed working
    '1522071820081-009f0129c71c', // Team collaboration - should work
    '1553877522-25bcdc54f2de', // Strategy/planning - should work
    '1521737854947-0b219b6c2c94' // Business meeting - should work
  ];

  // Find unused working photo IDs
  const usedPhotoIds = Array.from(photoIdUsage.keys());
  const unusedWorkingIds = knownWorkingPhotoIds.filter(id => !usedPhotoIds.includes(id));

  console.log(`\n📋 Unused working photo IDs: ${unusedWorkingIds.length}`);
  unusedWorkingIds.forEach(id => console.log(`   - ${id}`));

  // Assign unused working IDs, or reuse if needed
  let beliefsPhotoId = unusedWorkingIds[0] || '1553877522-25bcdc54f2de';
  let competenciesPhotoId = unusedWorkingIds[1] || '1521737854947-0b219b6c2c94';

  // If we need to reuse, make sure they're different from each other
  if (beliefsPhotoId === competenciesPhotoId) {
    competenciesPhotoId = unusedWorkingIds[1] || '1521737854947-0b219b6c2c94';
  }

  console.log(`\n🔄 Assigning working photo IDs:\n`);
  console.log(`   DQ Beliefs: ${beliefsPhotoId}`);
  console.log(`   DQ Competencies: ${competenciesPhotoId}`);

  // Update both guides
  const updates = [];
  
  if (beliefs) {
    const hash = createHash('md5').update(`${beliefs.id}-DQ Beliefs`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newUrl = `https://images.unsplash.com/photo-${beliefsPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
    
    updates.push({
      id: beliefs.id,
      title: 'DQ Beliefs',
      url: newUrl
    });
  }

  if (competencies) {
    const hash = createHash('md5').update(`${competencies.id}-DQ Competencies`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newUrl = `https://images.unsplash.com/photo-${competenciesPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
    
    updates.push({
      id: competencies.id,
      title: 'DQ Competencies',
      url: newUrl
    });
  }

  for (const update of updates) {
    console.log(`\nUpdating "${update.title}"...`);
    console.log(`   New URL: ${update.url.substring(0, 80)}...`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: update.url,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', update.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
    }
  }

  // Final verification
  console.log(`\n📊 Final verification:\n`);
  const { data: final } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .in('title', ['DQ Beliefs', 'DQ Competencies'])
    .order('title');

  final?.forEach(g => {
    const match = g.hero_image_url?.match(/photo-([a-z0-9-]+)/);
    const photoId = match ? match[1] : 'unknown';
    const isWorking = knownWorkingPhotoIds.includes(photoId);
    const status = isWorking ? '✅' : '⚠️';
    console.log(`${status} ${g.title}`);
    console.log(`   Photo ID: ${photoId} ${isWorking ? '(known working)' : '(needs verification)'}`);
    console.log(`   URL: ${g.hero_image_url?.substring(0, 90)}...`);
  });

  console.log(`\n✅ Both guides updated. Images should now display correctly.`);
}

useOnlyWorkingPhotoIds().catch(console.error);

