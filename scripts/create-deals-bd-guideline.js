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

async function createDealsBDGuideline() {
  console.log('📝 Creating DQ Deals | BD Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-deals-bd-guidelines',
      title: 'DQ Deals | BD Guidelines',
      summary: 'Comprehensive guidelines for Business Development activities from Lead to Opportunity and Opportunity to Order, ensuring clear lead qualification, structured opportunity development, and predictable deal progression.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80',
      body: '# DQ Deals | BD Guidelines\n\nVersion 0.1\n\nDate: December 16, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Deals | BD Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createDealsBDGuideline().catch(console.error);


