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

// Completely different, creative images for DQ Competencies (HoV) - House of Values
// Using diverse Unsplash photo IDs that represent values, culture, foundation - NOT dark laptop
const creativeImages = [
  // Diverse team handshake/collaboration
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // People hands together/unity
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Modern building/foundation (representing "House")
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Diverse professional team
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Team meeting/collaboration
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

// Using the first option - diverse team handshake/collaboration
const selectedImage = creativeImages[0];

async function updateCompetenciesCreative() {
  console.log('🎨 Updating DQ Competencies with a creative, unique image...\n');
  console.log('   Avoiding dark laptop - using diverse team/collaboration image\n');

  const slug = 'dq-competencies';

  try {
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: selectedImage,
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
      console.log(`   New creative image: ${selectedImage.substring(0, 60)}...`);
      console.log(`\n   Image theme: Diverse team collaboration/values`);
      console.log(`   This is a completely different image from the dark laptop!`);
    } else {
      console.log(`⚠️  Guide not found: ${slug}`);
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

updateCompetenciesCreative().catch(console.error);

