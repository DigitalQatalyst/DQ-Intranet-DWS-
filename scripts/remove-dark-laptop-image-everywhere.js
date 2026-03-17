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

// The dark laptop image URL pattern to remove
const DARK_LAPTOP_PATTERNS = [
  '1556761175-597af40f565e', // The specific photo ID
  '1556761175-5973dc0f32e7', // Similar dark laptop images
];

// Replacement images - contextually relevant, NOT dark laptops
const REPLACEMENT_IMAGES = {
  'dq-competencies': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team values
  'dq-vision': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Vision/horizon
  'default': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Diverse team
};

async function removeDarkLaptopImageEverywhere() {
  console.log('🔍 Searching for and removing dark laptop images everywhere...\n');

  try {
    // Find all guides with dark laptop images
    const allGuides = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .not('hero_image_url', 'is', null);

    if (!allGuides.data) {
      console.log('⚠️  No guides found');
      return;
    }

    const darkLaptopGuides = allGuides.data.filter(guide => {
      if (!guide.hero_image_url) return false;
      return DARK_LAPTOP_PATTERNS.some(pattern => 
        guide.hero_image_url.includes(pattern)
      );
    });

    if (darkLaptopGuides.length === 0) {
      console.log('✅ No dark laptop images found!');
      return;
    }

    console.log(`❌ Found ${darkLaptopGuides.length} card(s) with dark laptop image:\n`);
    darkLaptopGuides.forEach(guide => {
      console.log(`   - ${guide.title} (${guide.slug})`);
    });

    console.log('\n🔄 Replacing with contextually relevant images...\n');

    // Replace each one
    for (const guide of darkLaptopGuides) {
      const replacementImage = REPLACEMENT_IMAGES[guide.slug] || REPLACEMENT_IMAGES['default'];
      
      const { error } = await supabase
        .from('guides')
        .update({
          hero_image_url: replacementImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (error) {
        console.error(`❌ Error updating ${guide.title}:`, error.message);
      } else {
        console.log(`✅ Replaced: ${guide.title}`);
        console.log(`   New image: ${replacementImage.substring(0, 60)}...`);
      }
    }

    console.log('\n✅ Done! Dark laptop image removed from all cards.');
    
    // Verify removal
    const verify = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .not('hero_image_url', 'is', null);

    const remaining = verify.data?.filter(guide => {
      if (!guide.hero_image_url) return false;
      return DARK_LAPTOP_PATTERNS.some(pattern => 
        guide.hero_image_url.includes(pattern)
      );
    });

    if (remaining && remaining.length > 0) {
      console.log(`\n⚠️  Warning: ${remaining.length} card(s) still have dark laptop image:`);
      remaining.forEach(guide => {
        console.log(`   - ${guide.title} (${guide.slug})`);
      });
    } else {
      console.log('\n✅ Verified: No dark laptop images remaining!');
    }

  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

removeDarkLaptopImageEverywhere().catch(console.error);

