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

async function checkForumGuidelines() {
  console.log('🔍 Checking Forum Guidelines details...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('*')
    .ilike('title', '%Forum Guidelines%')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log(`📊 Found ${guides?.length || 0} Forum Guidelines entries:\n`);

  if (guides && guides.length > 0) {
    guides.forEach((guide, index) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Entry ${index + 1}:`);
      console.log(`${'='.repeat(80)}`);
      console.log(`ID: ${guide.id}`);
      console.log(`Title: ${guide.title}`);
      console.log(`Summary: ${guide.summary || 'N/A'}`);
      console.log(`Body Length: ${guide.body ? guide.body.length : 0} characters`);
      console.log(`Guide Type: ${guide.guide_type || 'N/A'}`);
      console.log(`Domain: ${guide.domain || 'N/A'}`);
      console.log(`Sub-Domain: ${guide.sub_domain || 'N/A'}`);
      console.log(`Unit: ${guide.unit || 'N/A'}`);
      console.log(`Location: ${guide.location || 'N/A'}`);
      console.log(`Status: ${guide.status || 'N/A'}`);
      console.log(`Created At: ${guide.created_at || 'N/A'}`);
      console.log(`Updated At: ${guide.updated_at || 'N/A'}`);
      
      if (guide.body) {
        console.log(`\nBody Preview (first 500 chars):`);
        console.log(guide.body.substring(0, 500) + '...');
      }
    });
  } else {
    console.log('❌ No Forum Guidelines found');
  }
}

checkForumGuidelines().catch(console.error);

