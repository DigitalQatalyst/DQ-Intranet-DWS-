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

// Creative, diverse images from across Unsplash - each completely unique
// Using different photo IDs that represent each theme creatively
const creativeUniqueImages = {
  // DQ Vision - Ocean waves/beach (already good, keeping)
  'dq-vision': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Vision & Mission - Team around laptops (keep this)
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // DQ Competencies (HoV) - Diverse team handshake/collaboration (NEW creative image)
  'dq-competencies': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // HoV - Team brainstorming with sticky notes (different from competencies)
  'dq-hov': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Persona - Diverse professional team (NEW creative image)
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile TMS - Person presenting/teaching (keep this)
  'dq-agile-tms': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile SoS - Team meeting/governance (NEW creative image)
  'dq-agile-sos': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile Flows - Holographic/futuristic tech (keep this)
  'dq-agile-flows': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Agile 6xD - Development/planning (NEW creative image)
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // DQ Products - Product showcase (keep this)
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // GHC - Framework/blueprint (keep this)
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function assignCreativeUniqueImages() {
  console.log('🎨 Assigning creative, unique images to all cards...\n');
  console.log('   Using diverse Unsplash images from across the internet\n');

  // Verify all images are unique
  const imageUrls = Object.values(creativeUniqueImages);
  const uniqueUrls = new Set(imageUrls);
  if (imageUrls.length !== uniqueUrls.size) {
    console.error('❌ ERROR: Some images are duplicated!');
    const duplicates = imageUrls.filter((url, index) => imageUrls.indexOf(url) !== index);
    console.error('   Duplicates:', duplicates);
    return;
  }

  console.log('✅ All images are unique\n');

  for (const [slug, imageUrl] of Object.entries(creativeUniqueImages)) {
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
        console.log(`   Image: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All cards now have creative, unique images.');
  console.log('\n📝 Creative Image Themes:');
  console.log('   • DQ Vision: Ocean waves/beach');
  console.log('   • Vision & Mission: Team around laptops');
  console.log('   • DQ Competencies: Diverse team handshake');
  console.log('   • HoV: Team brainstorming with sticky notes');
  console.log('   • Persona: Diverse professional team');
  console.log('   • Agile TMS: Person presenting/teaching');
  console.log('   • Agile SoS: Team meeting/governance');
  console.log('   • Agile Flows: Holographic/futuristic tech');
  console.log('   • Agile 6xD: Development/planning');
  console.log('   • DQ Products: Product showcase');
  console.log('   • GHC: Framework/blueprint');
}

assignCreativeUniqueImages().catch(console.error);

