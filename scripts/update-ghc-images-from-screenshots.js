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

// Images matching the screenshots - using specific Unsplash images that match the descriptions
const imageMappings = {
  // GHC Core Elements (7 cards)
  'dq-vision': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Person on mountain peak - vision/horizon
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration with sticky notes
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team/diverse people - identity
  'dq-agile-tms': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Charts/analytics dashboard
  'dq-agile-sos': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting/conference table
  'dq-agile-flows': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Workflow/process board
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Digital products/technology
  
  // Additional strategy cards that might need updates
  'dq-products': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Laptop with charts/digital products
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework/blueprint (honeycomb-like structure)
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team brainstorming with board
};

// More specific images based on screenshot descriptions
const specificImages = {
  // Man with whiteboard and sticky notes (Agile E&D/Products)
  'whiteboard-sticky-notes': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Holographic display/network diagram (Agile Flows)
  'network-diagram': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Conference table team meeting (Agile SoS)
  'conference-meeting': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Laptop dashboard (Agile TMS)
  'laptop-dashboard': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // User interface/persona (Persona)
  'user-interface': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Sticky notes with light bulb (HoV)
  'sticky-notes-lightbulb': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Mountain peak vision (DQ Vision)
  'mountain-peak': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Digital products ecosystem (DQ Products)
  'digital-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  // Honeycomb structure (GHC)
  'honeycomb': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
};

async function updateImages() {
  console.log('🖼️  Updating service card images to match screenshots...\n');

  for (const [slug, imageUrl] of Object.entries(imageMappings)) {
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
        console.log(`✅ Successfully updated: ${data[0].title}`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All service card images have been updated.');
}

updateImages().catch(console.error);

