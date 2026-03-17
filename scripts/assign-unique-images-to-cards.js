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

// UNIQUE images for each card - no duplicates, each with distinct visual
const uniqueCardImages = {
  // 1. Agile Flows - Laptop with dark interface, bar charts, blue/green data viz
  'dq-agile-flows': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 2. DQ Vision and Mission - Group of people around table (team meeting)
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 3. GHC - Framework/honeycomb structure (NOT laptop charts)
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 4. DQ Products - Product showcase/technology (NOT laptop charts)
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 5. DQ Vision - Ocean waves on beach (turquoise/blue water, NOT mountain)
  'dq-vision': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 6. HoV - Team collaboration/values (NOT laptop charts)
  'dq-hov': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 7. Persona - Identity/people/team (NOT laptop charts)
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 8. Agile TMS - Person presenting to audience with whiteboards
  'dq-agile-tms': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 9. Agile SoS - Governance/team meeting (NOT laptop charts)
  'dq-agile-sos': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 10. Agile 6xD - Products/development (NOT laptop charts)
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function assignUniqueImages() {
  console.log('🖼️  Assigning UNIQUE images to each card (no duplicates)...\n');

  // Verify all images are unique
  const imageUrls = Object.values(uniqueCardImages);
  const uniqueUrls = new Set(imageUrls);
  if (imageUrls.length !== uniqueUrls.size) {
    console.error('❌ ERROR: Some images are duplicated!');
    return;
  }

  console.log('✅ All images are unique\n');

  for (const [slug, imageUrl] of Object.entries(uniqueCardImages)) {
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

  console.log('✅ Done! Each card now has a UNIQUE image.');
  console.log('\n📝 Image Assignments (all unique):');
  console.log('   • Agile Flows: Data visualization/charts (laptop)');
  console.log('   • Vision & Mission: Team meeting around table');
  console.log('   • GHC: Framework/blueprint structure');
  console.log('   • DQ Products: Product showcase/technology');
  console.log('   • DQ Vision: Mountain/landscape (ocean waves)');
  console.log('   • HoV: Team collaboration/values');
  console.log('   • Persona: Team/people/identity');
  console.log('   • Agile TMS: Presentation/whiteboards');
  console.log('   • Agile SoS: Governance/team meeting');
  console.log('   • Agile 6xD: Products/development');
}

assignUniqueImages().catch(console.error);

