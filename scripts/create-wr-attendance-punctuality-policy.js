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

async function createWRAttendancePunctualityPolicy() {
  console.log('📝 Creating Working Room (WR) Attendance & Punctuality Policy...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-wr-attendance-punctuality-policy',
      title: 'Working Room (WR) Attendance & Punctuality Policy',
      summary: 'Mandatory attendance and punctuality requirements for Daily Online Working Room (WR) sessions and physical office attendance, establishing execution discipline and eliminating productivity losses from late arrivals.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Policy',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&q=80',
      body: '# Working Room (WR) Attendance & Punctuality Policy\n\nVersion 1.0\n\nDate: December 19, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created WR Attendance & Punctuality Policy!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The policy uses a custom GuidelinePage component with tables!');
}

createWRAttendancePunctualityPolicy().catch(console.error);


