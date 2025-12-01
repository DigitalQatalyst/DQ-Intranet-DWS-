import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlueprintImages() {
  console.log('🖼️  Checking Blueprint images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('No guides found');
    return;
  }

  console.log(`Found ${guides.length} Blueprint guide(s):\n`);
  guides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   Image: ${g.hero_image_url || 'No image'}`);
    console.log('');
  });
}

checkBlueprintImages().catch(console.error);

