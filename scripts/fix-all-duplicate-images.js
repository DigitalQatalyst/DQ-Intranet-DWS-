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

// UNIQUE images for each card - NO duplicates, NO dark laptops
const UNIQUE_IMAGES = {
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain/horizon - vision
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Lighthouse - mission
  'dq-competencies': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hands together - values
  'dq-hov': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tree with roots - foundation
  'dq-persona': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Diverse mosaic - identity
  'dq-agile-tms': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Person teaching - TMS
  'dq-agile-sos': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Chessboard - governance
  'dq-agile-flows': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Flowing water - flows
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product development
  'dq-products': 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product showcase
  'dq-ghc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Honeycomb pattern
};

async function fixAllDuplicateImages() {
  console.log('🔍 Finding and fixing ALL duplicate images...\n');

  try {
    // Get all strategy guides
    const { data: guides, error } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('domain', 'Strategy')
      .eq('status', 'Approved');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (!guides || guides.length === 0) {
      console.log('⚠️  No guides found');
      return;
    }

    console.log(`📋 Found ${guides.length} strategy card(s)\n`);

    // Check for duplicates
    const imageMap = new Map();
    const duplicates = [];

    guides.forEach(guide => {
      if (!guide.hero_image_url) return;
      
      const photoId = guide.hero_image_url.match(/photo-([^?]+)/)?.[1];
      if (!photoId) return;

      if (imageMap.has(photoId)) {
        duplicates.push({
          guide,
          photoId,
          duplicateOf: imageMap.get(photoId)
        });
      } else {
        imageMap.set(photoId, guide.title);
      }
    });

    if (duplicates.length > 0) {
      console.log(`❌ Found ${duplicates.length} duplicate image(s):\n`);
      duplicates.forEach(dup => {
        console.log(`   - ${dup.guide.title} (${dup.guide.slug})`);
        console.log(`     Duplicates: ${dup.duplicateOf}`);
        console.log(`     Photo ID: ${dup.photoId.substring(0, 30)}...\n`);
      });
    } else {
      console.log('✅ No duplicates found in current database\n');
    }

    // Update ALL cards with unique images
    console.log('🔄 Updating ALL cards with unique, contextually relevant images...\n');

    for (const guide of guides) {
      const uniqueImage = UNIQUE_IMAGES[guide.slug];
      
      if (!uniqueImage) {
        console.log(`⚠️  No unique image defined for: ${guide.slug}`);
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
        console.log(`✅ Updated: ${guide.title}`);
        console.log(`   Photo ID: ${photoId?.substring(0, 30)}...\n`);
      }
    }

    // Verify no duplicates remain
    console.log('🔍 Verifying no duplicates remain...\n');
    const { data: verifyGuides } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('domain', 'Strategy')
      .eq('status', 'Approved');

    const verifyMap = new Map();
    const remainingDuplicates = [];

    verifyGuides?.forEach(guide => {
      if (!guide.hero_image_url) return;
      const photoId = guide.hero_image_url.match(/photo-([^?]+)/)?.[1];
      if (!photoId) return;

      if (verifyMap.has(photoId)) {
        remainingDuplicates.push({
          title: guide.title,
          slug: guide.slug,
          duplicateOf: verifyMap.get(photoId)
        });
      } else {
        verifyMap.set(photoId, guide.title);
      }
    });

    if (remainingDuplicates.length > 0) {
      console.log(`❌ Still have ${remainingDuplicates.length} duplicate(s):`);
      remainingDuplicates.forEach(dup => {
        console.log(`   - ${dup.title} duplicates ${dup.duplicateOf}`);
      });
    } else {
      console.log('✅ SUCCESS! All cards now have unique images!');
      console.log('\n📝 Image assignments:');
      Object.entries(UNIQUE_IMAGES).forEach(([slug, url]) => {
        const photoId = url.match(/photo-([^?]+)/)?.[1];
        console.log(`   ${slug}: ${photoId?.substring(0, 30)}...`);
      });
    }

  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

fixAllDuplicateImages().catch(console.error);

