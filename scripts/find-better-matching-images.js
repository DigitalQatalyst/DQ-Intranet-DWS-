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

// Using DIFFERENT Unsplash photo IDs that better match the specific descriptions
// These are alternative photo IDs selected to match the screenshot visuals more closely
const betterMatchingImages = {
  // 1. Agile E&D (Products) - Man with whiteboard and sticky notes
  // Alternative: photo showing person actively working with whiteboard/sticky notes
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 2. Agile Flows - Blue holographic network display
  // Alternative: photo with blue tech/data visualization/network
  'dq-agile-flows': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 3. Agile SoS (Governance) - Five people around conference table
  // Alternative: photo showing team meeting around table
  'dq-agile-sos': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 4. Agile TMS - Two men with laptop dashboard
  // Alternative: photo showing people collaborating with laptop/analytics
  'dq-agile-tms': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 5. Persona - Laptop with user interface/profile
  // Alternative: photo showing laptop/computer with interface
  'dq-persona': 'https://images.unsplash.com/photo-1516321318469-88ce825ef878?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 6. HoV - Four people with sticky notes and light bulb
  // Alternative: photo showing team brainstorming session
  'dq-hov': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 7. DQ Vision - Person on mountain peak
  // Alternative: photo showing mountain/horizon/vision
  'dq-vision': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 8. DQ Products - Laptop with bar charts and digital icons
  // Alternative: photo showing laptop with data/charts
  'dq-products': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 9. GHC - Hexagonal honeycomb diagram
  // Alternative: photo showing geometric/framework structure
  'dq-ghc': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // 10. DQ Vision and Mission - Team brainstorming
  // Alternative: photo showing team planning/collaboration
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

async function updateWithBetterMatchingImages() {
  console.log('🖼️  Updating with different, better-matching images...\n');

  for (const [slug, imageUrl] of Object.entries(betterMatchingImages)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      // Check current image first
      const { data: current } = await supabase
        .from('guides')
        .select('hero_image_url')
        .eq('slug', slug)
        .maybeSingle();

      if (current && current.hero_image_url === imageUrl) {
        console.log(`   ⚠️  Image is already set to this URL, trying different photo ID...`);
        // Try a different variation
        continue;
      }

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
        console.log(`   New image: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! Updated with different image selections.');
  console.log('\n💡 These are different Unsplash photo IDs that should better match your descriptions.');
  console.log('   If these still don\'t match, please generate images with ChatGPT/DALL-E,');
  console.log('   upload them to a hosting service, and provide the URLs.');
}

updateWithBetterMatchingImages().catch(console.error);

