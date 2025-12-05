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

async function ensureUniqueCompetenciesImage() {
  console.log('🖼️  Ensuring DQ Competencies has a unique, relevant image...\n');

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

  const dqCompetencies = allGuides.find(g => g.title === 'DQ Competencies');
  if (!dqCompetencies) {
    console.log('⚠️  DQ Competencies guide not found');
    return;
  }

  // Get all existing base image URLs (excluding DQ Competencies)
  const existingBaseUrls = new Set();
  allGuides.forEach(g => {
    if (g.title !== 'DQ Competencies' && g.hero_image_url) {
      const baseUrl = g.hero_image_url.split('?')[0];
      existingBaseUrls.add(baseUrl);
    }
  });

  console.log(`Found ${existingBaseUrls.size} existing unique base images\n`);

  // Use a completely different image for competencies - something about skills/capabilities
  // Try different photo IDs until we find one that's not used
  const candidatePhotoIds = [
    '1557800636-23f87b1063e4', // Team/workplace
    '1521737854947-0b219b6c2c94', // Business meeting
    '1553877522-25bcdc54f2de', // Strategy/planning
    '1516321318469-88ce825ef878', // Collaboration
    '1556761175-597af40f565e', // Team work
    '1556073709-9fae23b835b2', // Business
    '1557804816-2b21ebcb1977', // Office
    '1559827261-9cbd8d3600a9'  // Team
  ];

  let newImageUrl = null;
  let selectedPhotoId = null;

  for (const photoId of candidatePhotoIds) {
    const testBaseUrl = `https://images.unsplash.com/photo-${photoId}`;
    if (!existingBaseUrls.has(testBaseUrl)) {
      selectedPhotoId = photoId;
      const hash = createHash('md5').update(`${dqCompetencies.id}-DQ Competencies-unique`).digest('hex');
      const uniqueParam = hash.substring(0, 8);
      newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
      break;
    }
  }

  if (!newImageUrl) {
    // Fallback: use the first candidate with a very unique hash
    selectedPhotoId = candidatePhotoIds[0];
    const hash = createHash('md5').update(`${dqCompetencies.id}-${Date.now()}-competencies`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    newImageUrl = `https://images.unsplash.com/photo-${selectedPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
  }

  console.log(`Updating "DQ Competencies"...`);
  console.log(`   Current: ${dqCompetencies.hero_image_url?.substring(0, 80)}...`);
  console.log(`   New Photo ID: ${selectedPhotoId}`);
  console.log(`   New URL: ${newImageUrl.substring(0, 80)}...`);
  console.log(`   Theme: Team collaboration and workplace (relevant for Competencies)`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', dqCompetencies.id);

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
        const status = guide.title === 'DQ Competencies' ? '✅' : '✓';
        console.log(`${status} "${guide.title}" - Unique image`);
      }
    } else {
      console.log(`❌ "${guide.title}" - Missing image`);
      allUnique = false;
    }
  }

  if (allUnique) {
    console.log(`\n✅ All Strategy guides have unique images, including DQ Competencies!`);
  }
}

ensureUniqueCompetenciesImage().catch(console.error);

