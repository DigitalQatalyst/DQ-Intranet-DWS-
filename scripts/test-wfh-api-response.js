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

async function testAPIResponse() {
  console.log('🧪 Testing WFH Guidelines API response...\n');

  const { data: guide, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (error) {
    console.error('❌ Error fetching guide:', error);
    return;
  }

  if (!guide) {
    console.log('❌ Guide not found');
    return;
  }

  // Simulate what the API does
  try {
    const apiResponse = {
      id: guide.id,
      slug: guide.slug,
      title: guide.title,
      summary: guide.summary,
      heroImageUrl: guide.hero_image_url,
      body: guide.body,
      status: guide.status,
    };

    // Try to stringify like the API does
    const json = JSON.stringify(apiResponse);
    console.log('✅ JSON serialization successful');
    console.log(`   Body length: ${guide.body?.length || 0} characters`);
    console.log(`   JSON length: ${json.length} characters`);
    
    // Check for potential issues
    const hasUnescapedQuotes = guide.body?.includes('"') && !guide.body?.includes('\\"');
    const hasNewlines = guide.body?.includes('\n');
    const hasSpecialChars = guide.body?.match(/[^\x20-\x7E\n\r\t]/);
    
    console.log('\n🔍 Content analysis:');
    console.log(`   Has unescaped quotes: ${hasUnescapedQuotes ? '⚠️' : '✅'}`);
    console.log(`   Has newlines: ${hasNewlines ? '✅' : '❌'}`);
    console.log(`   Has special characters: ${hasSpecialChars ? '⚠️' : '✅'}`);
    
    // Check table syntax
    const tableRows = guide.body?.match(/\|.*\|/g) || [];
    console.log(`   Table rows: ${tableRows.length}`);
    
    // Show first 500 chars of body
    console.log('\n📄 First 500 characters of body:');
    console.log(guide.body?.substring(0, 500) || 'No body');
    
  } catch (err) {
    console.error('❌ JSON serialization failed:', err?.message || err);
    console.error('   Error details:', err);
  }
}

testAPIResponse().catch(console.error);

