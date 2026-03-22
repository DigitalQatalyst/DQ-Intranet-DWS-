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

async function createAssetMaintenanceGuideline() {
  console.log('📝 Creating DQ Asset Maintenance, Repair and Disposal Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-asset-maintenance-repair-disposal-guidelines',
      title: 'DQ Asset Maintenance, Repair and Disposal Guidelines',
      summary: 'Comprehensive guidelines for maintaining, repairing, and disposing of company assets, ensuring proper use, accountability, and operational efficiency.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&q=80',
      body: '# DQ Asset Maintenance, Repair and Disposal Guidelines\n\nVersion 1.3\n\nDate: September 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Asset Maintenance Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createAssetMaintenanceGuideline().catch(console.error);


