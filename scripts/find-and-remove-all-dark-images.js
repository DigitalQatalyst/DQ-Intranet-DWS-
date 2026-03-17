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

// All possible dark laptop/charts image patterns
const DARK_LAPTOP_PATTERNS = [
  '1556761175-597af40f565e',
  '1556761175-5973dc0f32e7',
  '1556761175-4b46a572b786',
  // Removed 1551288049-bebda4e38f71 - keeping it as it's a planning board, not dark laptop
];

// Contextually relevant replacement images - NO dark laptops
const REPLACEMENT_IMAGES = {
  'dq-competencies': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team hands together
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  'dq-vision': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Vision/horizon
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Strategic planning
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Diverse team
  'dq-agile-tms': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Person presenting/teaching
  'dq-agile-sos': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Governance
  'dq-agile-flows': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Flow diagram
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product dev
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Products
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework
  'default': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team handshake
};

async function findAndRemoveAllDarkImages() {
  console.log('🔍 Finding ALL cards with dark laptop/charts images...\n');

  try {
    // Get all strategy guides
    const { data: allGuides, error } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url, domain')
      .eq('domain', 'Strategy')
      .not('hero_image_url', 'is', null);

    if (error) {
      console.error('❌ Error fetching guides:', error.message);
      return;
    }

    if (!allGuides || allGuides.length === 0) {
      console.log('⚠️  No strategy guides found');
      return;
    }

    console.log(`📋 Checking ${allGuides.length} strategy guide(s)...\n`);

    const darkImageGuides = [];
    
    // Check each guide
    for (const guide of allGuides) {
      if (!guide.hero_image_url) continue;
      
      // Check if it matches any dark laptop pattern
      const hasDarkImage = DARK_LAPTOP_PATTERNS.some(pattern => 
        guide.hero_image_url.includes(pattern)
      );
      
      if (hasDarkImage) {
        darkImageGuides.push(guide);
        console.log(`❌ Found dark image: ${guide.title} (${guide.slug})`);
        console.log(`   Image: ${guide.hero_image_url.substring(0, 70)}...`);
      }
    }

    if (darkImageGuides.length === 0) {
      console.log('✅ No dark laptop images found in strategy guides!');
      return;
    }

    console.log(`\n🔄 Replacing ${darkImageGuides.length} dark image(s)...\n`);

    // Replace each one
    for (const guide of darkImageGuides) {
      const replacementImage = REPLACEMENT_IMAGES[guide.slug] || REPLACEMENT_IMAGES['default'];
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: replacementImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`❌ Error updating ${guide.title}:`, updateError.message);
      } else {
        console.log(`✅ Replaced: ${guide.title}`);
        console.log(`   New: ${replacementImage.substring(0, 60)}...`);
      }
    }

    console.log('\n✅ Done! All dark laptop images removed.');
    console.log('\n📝 Please refresh your browser (Ctrl+F5) to see the changes.');

  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

findAndRemoveAllDarkImages().catch(console.error);

