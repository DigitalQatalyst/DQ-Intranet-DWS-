import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('🔍 Verifying HTML content...\n');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (error) throw error;

    console.log('✅ Guide found in database:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   Title: ${data.title}`);
    console.log(`   Content length: ${data.body.length} characters`);
    
    // Check if it's HTML
    const isHtml = data.body.trim().startsWith('<');
    const isJson = data.body.trim().startsWith('{');
    
    console.log(`\n📊 Content Format:`);
    console.log(`   Is HTML: ${isHtml ? '✅ Yes' : '❌ No'}`);
    console.log(`   Is JSON: ${isJson ? '⚠️  Yes (needs migration)' : '✅ No'}`);
    
    if (isHtml) {
      // Count HTML elements
      const h2Count = (data.body.match(/<h2/g) || []).length;
      const tableCount = (data.body.match(/<table/g) || []).length;
      const pCount = (data.body.match(/<p/g) || []).length;
      
      console.log(`\n📋 HTML Structure:`);
      console.log(`   Headings (h2): ${h2Count}`);
      console.log(`   Tables: ${tableCount}`);
      console.log(`   Paragraphs: ${pCount}`);
      
      // Show first 500 characters
      console.log(`\n📄 Content Preview (first 500 chars):`);
      console.log('   ' + data.body.substring(0, 500).replaceAll('\n', '\n   '));
      
      console.log('\n✅ VERIFICATION COMPLETE');
      console.log('\n🎯 Status:');
      console.log('   ✓ Content is in HTML format');
      console.log('   ✓ Ready for frontend rendering');
      console.log('   ✓ No JSON parsing needed');
      
      console.log('\n📝 Frontend will render:');
      console.log(`   - ${h2Count} sections with headings`);
      console.log(`   - ${tableCount} tables`);
      console.log(`   - ${pCount} paragraphs`);
      console.log('   - All content directly as HTML');
    } else if (isJson) {
      console.log('\n⚠️  Content is still in JSON format');
      console.log('   Run: node scripts/convert-json-to-html.js');
    } else {
      console.log('\n⚠️  Unknown content format');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verify();
