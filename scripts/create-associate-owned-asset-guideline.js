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

async function createAssociateOwnedAssetGuideline() {
  console.log('📝 Creating DQ Ops | Associate Owned Asset Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-associate-owned-asset-guidelines',
      title: 'DQ Ops | Associate Owned Asset Guidelines',
      summary: 'Guidelines for transitioning to an associate-owned device model at DQ, including BYOD, FYOD, and HYOD programs to mitigate asset theft, promote accountability, and optimize operational efficiency.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80',
      body: '# DQ Ops | Associate Owned Asset Guidelines\n\nVersion 1.8\n\nDate: December 19, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Associate Owned Asset Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createAssociateOwnedAssetGuideline().catch(console.error);


