import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
  console.log('🔍 Debugging HTML rendering issue...\n');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (error) throw error;

    console.log('✅ Guide found:');
    console.log(`   Title: ${data.title}`);
    console.log(`   Body length: ${data.body?.length || 0} characters`);
    console.log(`   Body type: ${typeof data.body}`);
    
    if (!data.body) {
      console.log('\n❌ PROBLEM: Body is empty or null!');
      return;
    }
    
    const firstChars = data.body.substring(0, 100);
    console.log(`\n📄 First 100 characters:`);
    console.log(`   "${firstChars}"`);
    
    // Check format
    const startsWithHtml = firstChars.trim().startsWith('<');
    const startsWithJson = firstChars.trim().startsWith('{');
    
    console.log(`\n📊 Format Detection:`);
    console.log(`   Starts with '<': ${startsWithHtml}`);
    console.log(`   Starts with '{': ${startsWithJson}`);
    
    if (startsWithHtml) {
      console.log('\n✅ Content is HTML format');
      console.log('   Frontend should render it with dangerouslySetInnerHTML');
    } else if (startsWithJson) {
      console.log('\n⚠️  Content is still JSON format');
      console.log('   Need to run: node scripts/convert-json-to-html.js');
    } else {
      console.log('\n⚠️  Unknown format');
      console.log('   First character:', firstChars.charAt(0));
    }
    
    // Show full content for inspection
    console.log(`\n📝 Full content (first 1000 chars):`);
    console.log('---');
    console.log(data.body.substring(0, 1000));
    console.log('---');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debug();
