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

// Images for the missing cards
const MISSING_CARDS = {
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Lighthouse
  'dq-products': 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product showcase
  'dq-competencies': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Hands together
};

async function updateMissingCards() {
  console.log('🔍 Checking and updating missing cards...\n');

  for (const [slug, imageUrl] of Object.entries(MISSING_CARDS)) {
    const { data, error } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url, status')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`❌ Error checking ${slug}:`, error.message);
      continue;
    }

    if (!data) {
      console.log(`⚠️  ${slug}: NOT FOUND`);
      continue;
    }

    const currentPhotoId = data.hero_image_url?.match(/photo-([^?]+)/)?.[1] || 'none';
    const newPhotoId = imageUrl.match(/photo-([^?]+)/)?.[1];

    console.log(`📋 ${data.title} (${data.slug}) [${data.status}]`);
    console.log(`   Current: ${currentPhotoId.substring(0, 30)}...`);

    // Update
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateError) {
      console.error(`❌ Error updating:`, updateError.message);
    } else {
      console.log(`✅ Updated to: ${newPhotoId?.substring(0, 30)}...\n`);
    }
  }

  console.log('✅ Done!');
}

updateMissingCards().catch(console.error);

