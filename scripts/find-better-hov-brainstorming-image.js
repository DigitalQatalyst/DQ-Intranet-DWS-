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

// Trying different Unsplash photo IDs that might match the brainstorming scene better
// Scene: 4 people around table, sticky notes on brick wall, glowing light bulb above
const brainstormingOptions = [
  'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Current
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team with sticky notes
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team planning
  'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting
];

// Using the second option which might better match the sticky notes scene
const selectedImage = brainstormingOptions[1];

async function updateHoVImage() {
  console.log('🖼️  Updating HoV to better match brainstorming scene...\n');
  console.log('   Looking for: 4 people, table, sticky notes on brick wall, light bulb\n');

  const slug = 'dq-hov';

  try {
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: selectedImage,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('id, title, slug');

    if (error) {
      console.error(`❌ Error updating:`, error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Updated: ${data[0].title}`);
      console.log(`   Image: ${selectedImage.substring(0, 70)}...`);
      console.log(`\n   If this still doesn't match, here are other options to try:`);
      brainstormingOptions.forEach((url, i) => {
        if (url !== selectedImage) {
          console.log(`   Option ${i + 1}: ${url.substring(0, 60)}...`);
        }
      });
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

updateHoVImage().catch(console.error);

