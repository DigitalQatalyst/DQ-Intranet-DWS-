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

// SUPER CREATIVE, DIVERSE images - completely different visual styles
// Each represents the theme in a unique, creative way
const superCreativeImages = {
  // DQ Vision - Mountain peak with horizon (vision/strategic planning)
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Vision & Mission - Lighthouse (mission/purpose/guidance)
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // DQ Competencies - Interconnected gears/puzzle (competencies working together)
  'dq-competencies': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // HoV - Tree with deep roots (foundation/values)
  'dq-hov': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Persona - Diverse mosaic of people (identity/diversity)
  'dq-persona': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile TMS - Person teaching/presenting (training/mentoring)
  'dq-agile-tms': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile SoS - Chessboard (governance/strategy)
  'dq-agile-sos': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile Flows - Flowing water/river (fluidity/adaptability)
  'dq-agile-flows': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile 6xD - Product development/workshop (products/development)
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // DQ Products - Modern product showcase/display
  'dq-products': 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // GHC - Honeycomb/hexagonal pattern (honeycomb structure)
  'dq-ghc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function assignSuperCreativeImages() {
  console.log('🎨 Assigning SUPER CREATIVE, diverse images from across the internet...\n');
  console.log('   Each image is completely unique with different visual styles\n');

  // Verify all images are unique
  const imageUrls = Object.values(superCreativeImages);
  const uniqueUrls = new Set(imageUrls);
  if (imageUrls.length !== uniqueUrls.size) {
    console.error('❌ ERROR: Some images are duplicated!');
    return;
  }

  console.log('✅ All images are unique\n');

  for (const [slug, imageUrl] of Object.entries(superCreativeImages)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      const { data, error } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select('id, title, slug');

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ Updated: ${data[0].title}`);
        console.log(`   Creative image: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All cards now have SUPER CREATIVE, unique images.\n');
  console.log('📝 Creative Image Themes (completely different styles):');
  console.log('   🏔️  DQ Vision: Mountain peak with horizon');
  console.log('   🗼 Vision & Mission: Lighthouse (guidance/purpose)');
  console.log('   ⚙️  DQ Competencies: Interconnected gears');
  console.log('   🌳 HoV: Tree with deep roots (foundation)');
  console.log('   👥 Persona: Diverse mosaic of people');
  console.log('   🎓 Agile TMS: Person teaching/presenting');
  console.log('   ♟️  Agile SoS: Chessboard (governance)');
  console.log('   🌊 Agile Flows: Flowing water (fluidity)');
  console.log('   🛠️  Agile 6xD: Product development workshop');
  console.log('   📦 DQ Products: Modern product showcase');
  console.log('   🍯 GHC: Honeycomb pattern (structure)');
}

assignSuperCreativeImages().catch(console.error);

