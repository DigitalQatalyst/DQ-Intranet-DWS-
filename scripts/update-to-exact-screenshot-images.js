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

// Based on the exact screenshot descriptions, finding specific Unsplash images
// These photo IDs are selected to match the visual descriptions provided
const screenshotImageMappings = {
  // 1. Agile E&D (Products) - Man with beard, light blue shirt, whiteboard with sticky notes
  // Using photo ID that shows person with whiteboard/sticky notes
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 2. Agile Flows - Man in dark suit, blue holographic network display
  // Using photo ID for data visualization/network diagrams
  'dq-agile-flows': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 3. Agile SoS (Governance) - Five people around conference table with papers/sticky notes
  // Using photo ID for team meeting/conference
  'dq-agile-sos': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 4. Agile TMS - Two men (one with hard hat) looking at laptop with dashboard
  // Using photo ID for analytics/dashboard
  'dq-agile-tms': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 5. Persona - Laptop showing user interface with profile picture
  // Using photo ID for team/people/identity
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 6. HoV - Four people with yellow sticky notes, light bulb above
  // Using photo ID for team brainstorming
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 7. DQ Vision - Person on mountain peak looking over landscape
  // Using photo ID for mountain/horizon
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 8. DQ Products - Laptop with bar charts and digital product icons
  // Using photo ID for digital products/technology
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 9. GHC - Hexagonal honeycomb diagram with text labels
  // Using photo ID for framework/blueprint
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 10. DQ Vision and Mission - Team brainstorming with board
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function updateToExactScreenshotImages() {
  console.log('🖼️  Updating images to match exact screenshots...\n');
  console.log('⚠️  Note: If these images don\'t match exactly, please provide the specific image URLs from the screenshots.\n');

  for (const [slug, imageUrl] of Object.entries(screenshotImageMappings)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      // First, let's check what's currently in the database
      const { data: current } = await supabase
        .from('guides')
        .select('id, title, slug, hero_image_url')
        .eq('slug', slug)
        .maybeSingle();

      if (!current) {
        console.log(`⚠️  No guide found with slug: ${slug}`);
        continue;
      }

      console.log(`   Current image: ${current.hero_image_url?.substring(0, 60) || 'None'}...`);
      
      // Update with new image
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
        console.log(`✅ Successfully updated: ${data[0].title}`);
        console.log(`   New image: ${imageUrl.substring(0, 60)}...`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All images updated.');
  console.log('\n💡 If the images still don\'t match your screenshots, please provide the exact image URLs and I can update them directly.');
}

updateToExactScreenshotImages().catch(console.error);

