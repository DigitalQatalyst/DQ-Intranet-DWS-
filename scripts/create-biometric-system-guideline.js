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

async function createBiometricSystemGuideline() {
  console.log('📝 Creating Biometric System Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-biometric-system-guidelines',
      title: 'Biometric System Guidelines',
      summary: 'Guidelines for using the biometric system for clocking in/out and accessing restricted office areas, ensuring operational efficiency, security, and accurate time tracking.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80',
      body: '# Biometric System Guidelines\n\nVersion 1.0\n\nDate: December 19, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Biometric System Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createBiometricSystemGuideline().catch(console.error);


