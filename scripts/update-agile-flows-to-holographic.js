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

// Image matching: Man in dark suit with blue holographic/futuristic data interface
// Scene: Person interacting with glowing blue holographic display, data visualizations, futuristic tech
// Trying different photo ID that might show holographic/AR interface
const holographicImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Alternative options for holographic/futuristic tech scenes
const alternativeImages = [
  'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tech/network
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Technology
  'https://images.unsplash.com/photo-1516321318469-88ce825ef878?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Digital interface
];

async function updateAgileFlowsToHolographic() {
  console.log('🖼️  Updating Agile Flows image to holographic display scene...\n');
  console.log('   Target: Man in dark suit with blue holographic data interface\n');

  const slug = 'dq-agile-flows';

  try {
    // Check current image
    const { data: current } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('slug', slug)
      .maybeSingle();

    if (!current) {
      console.log(`⚠️  Guide not found: ${slug}`);
      return;
    }

    console.log(`📋 Current: ${current.title}`);
    console.log(`   Current image: ${current.hero_image_url?.substring(0, 70) || 'None'}...\n`);

    // Update to holographic image
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: holographicImage,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('id, title, slug, hero_image_url');

    if (error) {
      console.error(`❌ Error updating:`, error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully updated: ${data[0].title}`);
      console.log(`   New image: ${holographicImage.substring(0, 70)}...`);
      console.log(`\n   Image should show: Man with blue holographic/futuristic data interface`);
      console.log(`   If this doesn't match, here are alternatives to try:`);
      alternativeImages.forEach((url, i) => {
        console.log(`   ${i + 1}. ${url.substring(0, 60)}...`);
      });
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

updateAgileFlowsToHolographic().catch(console.error);

