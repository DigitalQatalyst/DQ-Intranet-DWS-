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

// All cards with their unique images - ensuring NO duplicates
const uniqueCardImages = {
  // Vision and Mission - Team collaboration around laptops
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // DQ Competencies (HoV) - Different from Vision & Mission
  'dq-competencies': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team brainstorming with sticky notes
  
  // All other cards with unique images
  'dq-vision': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ocean waves
  'dq-hov': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Different team collaboration
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team/people
  'dq-agile-tms': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Presentation
  'dq-agile-sos': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team planning
  'dq-agile-flows': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Holographic/tech
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Development
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Products
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework
};

async function fixDuplicates() {
  console.log('🔍 Checking for duplicate images...\n');

  // Check current state
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, slug, hero_image_url')
    .in('slug', Object.keys(uniqueCardImages));

  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError);
    return;
  }

  // Find duplicates
  const imageUrlMap = new Map();
  guides?.forEach(guide => {
    const url = guide.hero_image_url || '';
    if (!imageUrlMap.has(url)) {
      imageUrlMap.set(url, []);
    }
    imageUrlMap.get(url).push(guide);
  });

  const duplicates = Array.from(imageUrlMap.entries()).filter(([url, cards]) => cards.length > 1 && url);
  
  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} duplicate image(s):\n`);
    duplicates.forEach(([url, cards]) => {
      console.log(`   Image: ${url.substring(0, 60)}...`);
      console.log(`   Used by:`);
      cards.forEach(card => console.log(`     - ${card.title} (${card.slug})`));
      console.log('');
    });
  } else {
    console.log('✅ No duplicates found!\n');
  }

  // Update all to ensure uniqueness
  console.log('🖼️  Updating all cards to ensure unique images...\n');

  for (const [slug, imageUrl] of Object.entries(uniqueCardImages)) {
    const guide = guides?.find(g => g.slug === slug);
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`);
      continue;
    }

    // Skip if already correct
    if (guide.hero_image_url === imageUrl) {
      console.log(`✓ ${guide.title} already has correct unique image`);
      continue;
    }

    console.log(`📋 Updating: ${guide.title}`);
    
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
        console.log(`   ✅ Updated to unique image`);
      }
    } catch (err) {
      console.error(`   ❌ Unexpected error:`, err);
    }
    
    console.log('');
  }

  // Final verification
  console.log('🔍 Final verification...\n');
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('title, slug, hero_image_url')
    .in('slug', Object.keys(uniqueCardImages));

  const finalImageUrlMap = new Map();
  finalGuides?.forEach(guide => {
    const url = guide.hero_image_url || '';
    if (!finalImageUrlMap.has(url)) {
      finalImageUrlMap.set(url, []);
    }
    finalImageUrlMap.get(url).push(guide);
  });

  const finalDuplicates = Array.from(finalImageUrlMap.entries()).filter(([url, cards]) => cards.length > 1 && url);
  
  if (finalDuplicates.length > 0) {
    console.log(`❌ Still have duplicates:`);
    finalDuplicates.forEach(([url, cards]) => {
      console.log(`   ${cards.map(c => c.title).join(', ')} all use the same image`);
    });
  } else {
    console.log('✅ All images are now unique!');
    console.log('\n📝 Image assignments:');
    finalGuides?.forEach(guide => {
      console.log(`   • ${guide.title}: ${guide.hero_image_url?.substring(0, 50) || 'None'}...`);
    });
  }
}

fixDuplicates().catch(console.error);

