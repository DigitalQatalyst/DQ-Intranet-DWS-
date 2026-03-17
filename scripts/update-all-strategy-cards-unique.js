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

// UNIQUE images for ALL strategy cards - NO duplicates, NO dark laptops
const UNIQUE_IMAGES = {
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain/horizon
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Lighthouse
  'dq-competencies': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hands together
  'dq-hov': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tree with roots
  'dq-persona': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Diverse mosaic
  'dq-agile-tms': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Person teaching
  'dq-agile-sos': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Chessboard
  'dq-agile-flows': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Flowing water
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product dev
  'dq-products': 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product showcase
  'dq-ghc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Honeycomb
};

async function updateAllStrategyCardsUnique() {
  console.log('🔄 Updating ALL strategy cards with unique images (including Draft status)...\n');

  try {
    // Get ALL strategy guides regardless of status
    const { data: guides, error } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url, status')
      .eq('domain', 'Strategy')
      .order('title');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (!guides || guides.length === 0) {
      console.log('⚠️  No guides found');
      return;
    }

    console.log(`📋 Found ${guides.length} strategy card(s):\n`);

    // Show current state
    guides.forEach(guide => {
      const photoId = guide.hero_image_url?.match(/photo-([^?]+)/)?.[1] || 'none';
      console.log(`   ${guide.title} (${guide.slug}) [${guide.status}]`);
      console.log(`   Current: ${photoId.substring(0, 30)}...`);
    });

    console.log('\n🔄 Updating with unique images...\n');

    // Update each card
    for (const guide of guides) {
      const uniqueImage = UNIQUE_IMAGES[guide.slug];
      
      if (!uniqueImage) {
        console.log(`⚠️  No image defined for: ${guide.slug} - SKIPPING`);
        continue;
      }

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: uniqueImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`❌ Error updating ${guide.title}:`, updateError.message);
      } else {
        const photoId = uniqueImage.match(/photo-([^?]+)/)?.[1];
        console.log(`✅ ${guide.title}: ${photoId?.substring(0, 30)}...`);
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...\n');
    const { data: verifyGuides } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('domain', 'Strategy');

    const imageCounts = new Map();
    verifyGuides?.forEach(guide => {
      if (!guide.hero_image_url) return;
      const photoId = guide.hero_image_url.match(/photo-([^?]+)/)?.[1];
      if (!photoId) return;
      imageCounts.set(photoId, (imageCounts.get(photoId) || 0) + 1);
    });

    const duplicates = Array.from(imageCounts.entries()).filter(([_, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log(`❌ Still have duplicates:`);
      duplicates.forEach(([photoId, count]) => {
        const cards = verifyGuides?.filter(g => g.hero_image_url?.includes(photoId));
        console.log(`   Photo ${photoId.substring(0, 20)}... used ${count} times:`);
        cards?.forEach(c => console.log(`     - ${c.title}`));
      });
    } else {
      console.log('✅ SUCCESS! All cards have unique images!');
    }

  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

updateAllStrategyCardsUnique().catch(console.error);

