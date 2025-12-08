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

async function useConfirmedWorkingImages() {
  console.log('🖼️  Using confirmed working photo IDs for DQ Beliefs and DQ Competencies...\n');

  // Get guides that are confirmed to have working images (ones that display correctly)
  const { data: workingGuides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .in('title', ['DQ Journey', 'DQ Products', 'DQ Vision and Mission', 'DQ Strategy 2021-2030'])
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('Confirmed working photo IDs (from guides that display correctly):\n');
  const workingPhotoIds = new Set();
  workingGuides?.forEach(g => {
    const match = g.hero_image_url?.match(/photo-([a-z0-9-]+)/);
    if (match) {
      workingPhotoIds.add(match[1]);
      console.log(`   ✅ ${g.title}: ${match[1]}`);
    }
  });

  // Get DQ Beliefs and DQ Competencies
  const { data: targetGuides, error: targetError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .in('title', ['DQ Beliefs', 'DQ Competencies'])
    .order('title');

  if (targetError) {
    console.error('❌ Error:', targetError);
    return;
  }

  // Available photo IDs that should work (different from working ones)
  const availablePhotoIds = [
    '1553877522-25bcdc54f2de',    // Strategy/planning
    '1521737854947-0b219b6c2c94', // Business meeting
    '1516321318469-88ce825ef878', // Collaboration
    '1556761175-597af40f565e',    // Team work
    '1556073709-9fae23b835b2',    // Business
    '1557804816-2b21ebcb1977',    // Office
    '1507003211169-0a1dd7228fbb'  // Skills
  ];

  // Find photo IDs not used by working guides
  const unusedPhotoIds = availablePhotoIds.filter(id => !workingPhotoIds.has(id));

  console.log(`\n📋 Available unused photo IDs: ${unusedPhotoIds.length}`);
  unusedPhotoIds.forEach(id => console.log(`   - ${id}`));

  // Assign images
  const assignments = {
    'DQ Beliefs': unusedPhotoIds[0] || availablePhotoIds[0],
    'DQ Competencies': unusedPhotoIds[1] || availablePhotoIds[1]
  };

  console.log(`\n🔄 Updating images...\n`);

  for (const guide of targetGuides || []) {
    const photoId = assignments[guide.title];
    if (!photoId) {
      console.log(`⚠️  No photo ID assigned for ${guide.title}`);
      continue;
    }

    // Use exact format from working guide
    const workingGuide = workingGuides?.[0];
    const workingUrl = workingGuide?.hero_image_url || '';
    const workingParams = workingUrl.split('?')[1] || '';
    const baseParams = workingParams.split('&').filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');
    
    const hash = createHash('md5').update(`${guide.id}-${guide.title}`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?${baseParams}&u=${uniqueParam}`;

    console.log(`Updating "${guide.title}"...`);
    console.log(`   Photo ID: ${photoId}`);
    console.log(`   URL: ${newImageUrl.substring(0, 80)}...`);

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

  // Final check
  console.log(`\n📊 Final status:\n`);
  const { data: final } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .in('title', ['DQ Beliefs', 'DQ Competencies'])
    .order('title');

  final?.forEach(g => {
    const match = g.hero_image_url?.match(/photo-([a-z0-9-]+)/);
    console.log(`✅ ${g.title}: Photo ID ${match ? match[1] : 'unknown'}`);
    console.log(`   URL: ${g.hero_image_url?.substring(0, 90)}...`);
  });

  console.log(`\n✅ Both guides updated with unique images using confirmed working format.`);
}

useConfirmedWorkingImages().catch(console.error);

