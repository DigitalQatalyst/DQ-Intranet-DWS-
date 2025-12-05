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
  console.log('🔍 Checking Forum Guidelines in database...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('*')
    .ilike('title', '%Forum Guidelines%')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log(`📊 Found ${guides.length} Forum Guidelines entries:\n`);

  guides.forEach((guide, index) => {
    console.log(`Entry ${index + 1}:`);
    console.log(`  ID: ${guide.id}`);
    console.log(`  Title: ${guide.title}`);
    console.log(`  Slug: ${guide.slug || 'N/A'}`);
    console.log(`  Guide Type: ${guide.guide_type || 'N/A'}`);
    console.log(`  Domain: ${guide.domain || 'N/A'}`);
    console.log(`  Sub-Domain: ${guide.sub_domain || 'N/A'}`);
    console.log(`  Unit: ${guide.unit || guide.function_area || 'N/A'}`);
    console.log(`  Location: ${guide.location || 'N/A'}`);
    console.log(`  Status: ${guide.status || 'N/A'}`);
    console.log(`  Summary Length: ${guide.summary ? guide.summary.length : 0} characters`);
    console.log(`  Body Length: ${guide.body ? guide.body.length : 0} characters`);
    console.log(`  Summary Preview: ${guide.summary ? guide.summary.substring(0, 200) + '...' : 'N/A'}`);
    console.log('');
  });

  return guides;
}

checkForumGuidelines().catch(console.error);


