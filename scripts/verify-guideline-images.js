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

async function verifyImages() {
  console.log('🔍 Verifying guideline images...\n');

  // Fetch all Guidelines guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Guidelines only
  const guidelines = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || title.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || title.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || title.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  console.log(`📊 Checking ${guidelines.length} Guidelines guides:\n`);

  let withImages = 0;
  let withoutImages = 0;
  let brokenImages = 0;

  for (const guide of guidelines) {
    const imageUrl = guide.hero_image_url;
    const hasImage = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('/image.png');
    const isBroken = imageUrl && (imageUrl.includes('unsplash.coom') || imageUrl.includes('unsplashh') || imageUrl.includes('unsplaash') || imageUrl.includes('unsplash..'));

    if (isBroken) {
      console.log(`⚠️  ${guide.title}`);
      console.log(`   Broken URL: ${imageUrl}`);
      brokenImages++;
    } else if (hasImage) {
      console.log(`✅ ${guide.title}`);
      console.log(`   Image: ${imageUrl}`);
      withImages++;
    } else {
      console.log(`❌ ${guide.title}`);
      console.log(`   No image`);
      withoutImages++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ With images: ${withImages}`);
  console.log(`   ❌ Without images: ${withoutImages}`);
  console.log(`   ⚠️  Broken URLs: ${brokenImages}`);
}

verifyImages().catch(console.error);

