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

async function createAzureDevOpsTaskGuideline() {
  console.log('📝 Creating Azure DevOps Task | Step by Step Guidelines...\n');

  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'dq-azure-devops-task-guidelines',
      title: 'Azure DevOps Task | Step by Step Guidelines',
      summary: 'Comprehensive guidelines for updating Azure DevOps tasks following DQ standards, including task naming, state management, progress tracking, context definition, and traceability with CIMD items.',
      domain: 'guidelines',
      sub_domain: null,
      guide_type: 'Guideline',
      status: 'Approved',
      hero_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80',
      body: '# Azure DevOps Task | Step by Step Guidelines\n\nVersion 1.0\n\nDate: December 19, 2025',
      last_updated_at: new Date().toISOString()
    })
    .select('id, slug, title, status');

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  console.log('✅ Successfully created Azure DevOps Task Guidelines!');
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Slug: ${data[0].slug}`);
  console.log(`   Title: ${data[0].title}`);
  console.log(`   Status: ${data[0].status}`);
  console.log('\n📋 The guideline uses a custom GuidelinePage component with tables!');
}

createAzureDevOpsTaskGuideline().catch(console.error);


