import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTestimonialsImages() {
  console.log('🖼️  Checking Testimonials images...\n');

  // Find testimonial guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, guide_type, domain')
    .or('guide_type.ilike.%testimonial%,title.ilike.%testimonial%,title.ilike.%success story%,title.ilike.%client%')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('No testimonial guides found');
    return;
  }

  console.log(`Found ${guides.length} testimonial-related guide(s):\n`);

  // Group by image URL
  const imageGroups = {};
  guides.forEach(g => {
    const imgUrl = g.hero_image_url || 'No image';
    if (!imageGroups[imgUrl]) {
      imageGroups[imgUrl] = [];
    }
    imageGroups[imgUrl].push(g);
  });

  // Find duplicates
  const duplicates = Object.entries(imageGroups).filter(([url, guides]) => guides.length > 1);

  if (duplicates.length > 0) {
    console.log('⚠️  Found duplicate images:\n');
    duplicates.forEach(([url, guideList]) => {
      console.log(`Image: ${url.substring(0, 100)}...`);
      console.log(`   Used by ${guideList.length} guide(s):`);
      guideList.forEach(g => {
        console.log(`   - "${g.title}" (ID: ${g.id})`);
      });
      console.log('');
    });
  } else {
    console.log('✅ No duplicate images found');
  }

  // Show the 3 specific guides mentioned
  const specificTitles = [
    'Digital Transformation Journey: From Legacy Systems to Cloud-First',
    'Celebrating 100 Successful Deployments',
    'Client Success Story: Financial Services Digital Innovation'
  ];

  console.log('\n📋 Checking specific guides:\n');
  specificTitles.forEach(title => {
    const guide = guides.find(g => g.title.includes(title.split(':')[0]) || g.title.includes(title.split('—')[0]));
    if (guide) {
      console.log(`"${guide.title}"`);
      console.log(`   Image: ${guide.hero_image_url || 'No image'}`);
      console.log('');
    }
  });
}

checkTestimonialsImages().catch(console.error);

