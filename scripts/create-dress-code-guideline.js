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

async function createDressCodeGuideline() {
  console.log('📝 Creating DQ Dress Code Guideline...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-dress-code-guideline',
      title: 'DQ Dress Code Guideline',
      summary: 'Comprehensive dress code guidelines ensuring professional appearance while maintaining flexibility and comfort for DQ associates.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop&q=80',
      body: '# DQ Dress Code Guideline\n\nVersion 1.0\n\nDate: September 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Dress Code Guideline!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createDressCodeGuideline().catch(console.error);


