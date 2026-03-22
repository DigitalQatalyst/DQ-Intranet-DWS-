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

async function createATPStopScansGuideline() {
  console.log('📝 Creating DQ Guidelines | ATP Stop Scans Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-atp-stop-scans-guidelines',
      title: 'DQ Guidelines | ATP Stop Scans Guidelines',
      summary: 'Monthly performance assessment utilizing the SFIA (0-7) Rating Matrix against the TMS 7S Tenets (Specify, Socialize, Share, Scrum, Structure, Succeed, and Speed-up) for structured associate performance reviews.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&q=80',
      body: '# DQ Guidelines | ATP Stop Scans Guidelines\n\nVersion 0.1\n\nDate: October 14, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created ATP Stop Scans Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createATPStopScansGuideline().catch(console.error);


