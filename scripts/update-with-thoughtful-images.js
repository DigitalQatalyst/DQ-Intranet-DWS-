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

// Thoughtful image selections based on screenshot descriptions
// Using specific Unsplash photo IDs that best match the visual descriptions
const thoughtfulImages = {
  // 1. Agile E&D (Products) - Man with whiteboard and sticky notes
  // Photo showing person with whiteboard/sticky notes/planning
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 2. Agile Flows - Man in dark suit, blue holographic network display
  // Photo showing data visualization/network diagrams/blue tech display
  'dq-agile-flows': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 3. Agile SoS (Governance) - Five people around conference table
  // Photo showing team meeting/conference table collaboration
  'dq-agile-sos': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 4. Agile TMS - Two men with laptop showing dashboard
  // Photo showing people with laptop/analytics/dashboard
  'dq-agile-tms': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 5. Persona - Laptop showing user interface with profile
  // Photo showing laptop/computer screen/user interface
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 6. HoV - Four people with sticky notes and light bulb
  // Photo showing team brainstorming with sticky notes/ideas
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 7. DQ Vision - Person on mountain peak looking over landscape
  // Photo showing mountain peak/horizon/vision perspective
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 8. DQ Products - Laptop with bar charts and digital product icons
  // Photo showing laptop with charts/digital products/technology
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 9. GHC - Hexagonal honeycomb diagram
  // Photo showing framework/blueprint/geometric structure
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 10. DQ Vision and Mission - Team brainstorming with board
  // Photo showing team collaboration/planning/vision board
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function updateWithThoughtfulImages() {
  console.log('🖼️  Updating images with thoughtful selections based on screenshot descriptions...\n');

  for (const [slug, imageUrl] of Object.entries(thoughtfulImages)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      const { data, error } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select('id, title, slug, hero_image_url');

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        const guide = data[0];
        console.log(`✅ Updated: ${guide.title}`);
        console.log(`   Image URL: ${guide.hero_image_url?.substring(0, 70)}...`);
        
        // Check if image actually changed
        if (guide.hero_image_url === imageUrl) {
          console.log(`   ✓ Image matches target`);
        }
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All images updated.');
  console.log('\n📝 Image Theme Assignments:');
  console.log('   • Agile 6xD: Team with whiteboard/sticky notes');
  console.log('   • Agile Flows: Data visualization/network diagrams');
  console.log('   • Agile SoS: Team meeting/conference collaboration');
  console.log('   • Agile TMS: Analytics/dashboard on laptop');
  console.log('   • Persona: Team/people representing identity');
  console.log('   • HoV: Team brainstorming with sticky notes');
  console.log('   • DQ Vision: Mountain peak/horizon landscape');
  console.log('   • DQ Products: Digital products/technology');
  console.log('   • GHC: Framework/blueprint structure');
  console.log('   • Vision & Mission: Team collaboration/planning');
  console.log('\n💡 If you want different images, you can:');
  console.log('   1. Generate new images with ChatGPT/DALL-E');
  console.log('   2. Upload them to a hosting service');
  console.log('   3. Provide the URLs and I can update them');
}

updateWithThoughtfulImages().catch(console.error);

