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

// Image matching the brainstorming scene: Team around table, sticky notes on brick wall, light bulb above
// This should show: 4 people, colorful sticky notes, glowing light bulb, collaborative atmosphere
const brainstormingImage = 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

async function updateHoVToBrainstorming() {
  console.log('🖼️  Updating HoV image to brainstorming scene...\n');
  console.log('   Target: Team around table, sticky notes on brick wall, light bulb above\n');

  const slug = 'dq-hov';

  try {
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: brainstormingImage,
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
      console.log(`   New image: ${brainstormingImage.substring(0, 70)}...`);
      console.log(`\n   Image should show: Team brainstorming with sticky notes and light bulb`);
    } else {
      console.log(`⚠️  Guide not found: ${slug}`);
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

updateHoVToBrainstorming().catch(console.error);

