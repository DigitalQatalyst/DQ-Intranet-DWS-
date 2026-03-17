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

// The dark laptop/charts image that's being overused
const darkLaptopImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71';

// List of GHC core element slugs
const ghcSlugs = [
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
  'dq-products',
  'dq-ghc',
  'dq-vision-and-mission',
];

// Completely unique images for each card - NO dark laptop image except for Agile Flows
const uniqueImages = {
  // Only Agile Flows should have the dark laptop/charts image
  'dq-agile-flows': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // All others get completely different images
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting
  
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework/blueprint
  
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product showcase
  
  'dq-vision': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ocean waves
  
  'dq-hov': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team/people
  
  'dq-agile-tms': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Presentation
  
  'dq-agile-sos': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team planning/governance
  
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Development/planning
};

async function checkAndFixDuplicates() {
  console.log('🔍 Checking for duplicate dark laptop images...\n');

  // First, check current state
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, slug, hero_image_url')
    .in('slug', ghcSlugs);

  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError);
    return;
  }

  // Count how many are using the dark laptop image
  const darkLaptopCount = guides?.filter(g => 
    g.hero_image_url?.includes('photo-1551288049-bebda4e38f71')
  ).length || 0;

  console.log(`📊 Found ${darkLaptopCount} cards using the dark laptop image`);
  console.log(`   Total cards checked: ${guides?.length || 0}\n`);

  if (darkLaptopCount > 1) {
    console.log('⚠️  Multiple cards are using the same dark laptop image!');
    console.log('   Cards with dark laptop image:');
    guides?.filter(g => g.hero_image_url?.includes('photo-1551288049-bebda4e38f71'))
      .forEach(g => console.log(`   - ${g.title} (${g.slug})`));
    console.log('');
  }

  // Now update all to use unique images
  console.log('🖼️  Updating all cards to use unique images...\n');

  for (const [slug, imageUrl] of Object.entries(uniqueImages)) {
    const guide = guides?.find(g => g.slug === slug);
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`);
      continue;
    }

    // Skip if already has the correct unique image
    if (guide.hero_image_url === imageUrl) {
      console.log(`✓ ${guide.title} already has correct unique image`);
      continue;
    }

    console.log(`📋 Updating: ${guide.title}`);
    console.log(`   From: ${guide.hero_image_url?.substring(0, 60) || 'None'}...`);
    
    try {
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated to: ${imageUrl.substring(0, 60)}...`);
      }
    } catch (err) {
      console.error(`   ❌ Unexpected error:`, err);
    }
    
    console.log('');
  }

  // Verify final state
  console.log('🔍 Verifying final state...\n');
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('title, slug, hero_image_url')
    .in('slug', ghcSlugs);

  const finalDarkLaptopCount = finalGuides?.filter(g => 
    g.hero_image_url?.includes('photo-1551288049-bebda4e38f71')
  ).length || 0;

  console.log(`📊 Final count: ${finalDarkLaptopCount} card(s) using dark laptop image`);
  if (finalDarkLaptopCount === 1) {
    const darkLaptopCard = finalGuides?.find(g => 
      g.hero_image_url?.includes('photo-1551288049-bebda4e38f71')
    );
    console.log(`   ✓ Only ${darkLaptopCard?.title} uses it (as intended)`);
  }

  // Check for any duplicates
  const imageUrlCounts = {};
  finalGuides?.forEach(g => {
    const url = g.hero_image_url || '';
    imageUrlCounts[url] = (imageUrlCounts[url] || 0) + 1;
  });

  const duplicates = Object.entries(imageUrlCounts).filter(([url, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found ${duplicates.length} duplicate image(s):`);
    duplicates.forEach(([url, count]) => {
      const cards = finalGuides?.filter(g => g.hero_image_url === url).map(g => g.title);
      console.log(`   ${count}x: ${url.substring(0, 60)}...`);
      console.log(`      Used by: ${cards?.join(', ')}`);
    });
  } else {
    console.log('\n✅ All images are unique!');
  }
}

checkAndFixDuplicates().catch(console.error);

