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

async function checkActualImages() {
  console.log('🔍 Checking actual images in database...\n');

  // Check the specific guides shown in the images
  const guideTitles = [
    'IT Security Management Policy',
    'Visual Assets for Social Media — Design Rules',
    'DQ Forum Guidelines',
    'Blueprint: DQ Scrum Guidelines'
  ];

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain, guide_type')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log('📋 Checking specific guides from images:\n');
  
  for (const title of guideTitles) {
    const matching = (guides || []).filter(g => 
      (g.title || '').toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes((g.title || '').toLowerCase())
    );

    if (matching.length > 0) {
      matching.forEach(g => {
        console.log(`📄 ${g.title}`);
        console.log(`   ID: ${g.id}`);
        console.log(`   hero_image_url: ${g.hero_image_url || 'NULL/EMPTY'}`);
        console.log(`   Domain: ${g.domain || 'N/A'}`);
        console.log(`   Guide Type: ${g.guide_type || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log(`❌ Not found: ${title}\n`);
    }
  }

  // Check all guides for null/empty images
  console.log('\n📊 Checking all guides for image issues:\n');
  const noImage = (guides || []).filter(g => !g.hero_image_url || g.hero_image_url.trim() === '');
  const placeholderImage = (guides || []).filter(g => g.hero_image_url && g.hero_image_url.includes('/image.png'));

  console.log(`   Guides with no image: ${noImage.length}`);
  if (noImage.length > 0) {
    noImage.forEach(g => console.log(`      - ${g.title}`));
  }

  console.log(`\n   Guides with placeholder: ${placeholderImage.length}`);
  if (placeholderImage.length > 0) {
    placeholderImage.forEach(g => console.log(`      - ${g.title}`));
  }

  console.log(`\n   Total guides: ${guides.length}`);
  console.log(`   Guides with valid images: ${guides.length - noImage.length - placeholderImage.length}`);
}

checkActualImages().catch(console.error);

