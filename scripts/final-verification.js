import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalVerification() {
  console.log('🎯 Final Verification\n');
  console.log('='.repeat(60));

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (error) throw error;

    // Check 1: Content exists
    console.log('\n✅ CHECK 1: Content Exists');
    console.log(`   Title: ${data.title}`);
    console.log(`   Body length: ${data.body.length} characters`);
    console.log(`   Status: ${data.body.length > 0 ? 'PASS ✓' : 'FAIL ✗'}`);

    // Check 2: HTML format
    console.log('\n✅ CHECK 2: HTML Format');
    const isHtml = data.body.trim().startsWith('<');
    const isJson = data.body.trim().startsWith('{');
    console.log(`   Starts with '<': ${isHtml}`);
    console.log(`   Starts with '{': ${isJson}`);
    console.log(`   Status: ${isHtml && !isJson ? 'PASS ✓' : 'FAIL ✗'}`);

    // Check 3: Proper structure
    console.log('\n✅ CHECK 3: HTML Structure');
    const h2Count = (data.body.match(/<h2/g) || []).length;
    const pCount = (data.body.match(/<p>/g) || []).length;
    const tableCount = (data.body.match(/<table>/g) || []).length;
    console.log(`   Headings (h2): ${h2Count}`);
    console.log(`   Paragraphs (p): ${pCount}`);
    console.log(`   Tables: ${tableCount}`);
    console.log(`   Status: ${h2Count >= 18 && pCount > 0 && tableCount >= 7 ? 'PASS ✓' : 'FAIL ✗'}`);

    // Check 4: No escape sequences
    console.log('\n✅ CHECK 4: No Literal Escape Sequences');
    const hasLiteralNewlines = data.body.includes('\\n');
    console.log(`   Contains literal \\n: ${hasLiteralNewlines}`);
    console.log(`   Status: ${hasLiteralNewlines ? 'FAIL ✗' : 'PASS ✓'}`);

    // Check 5: IDs for navigation
    console.log('\n✅ CHECK 5: Navigation IDs');
    const hasIds = data.body.includes('id="context"') && 
                   data.body.includes('id="overview"') &&
                   data.body.includes('id="core-components"');
    console.log(`   Has section IDs: ${hasIds}`);
    console.log(`   Status: ${hasIds ? 'PASS ✓' : 'FAIL ✗'}`);

    // Overall status
    const allPassed = data.body.length > 0 && 
                      isHtml && !isJson && 
                      h2Count >= 18 && pCount > 0 && tableCount >= 7 &&
                      !hasLiteralNewlines &&
                      hasIds;

    console.log('\n' + '='.repeat(60));
    console.log('\n🎯 OVERALL STATUS');
    console.log('='.repeat(60));
    
    if (allPassed) {
      console.log('\n✅ ALL CHECKS PASSED!');
      console.log('\n🎉 The page is ready to display content correctly.');
      console.log('\nWhat to expect:');
      console.log('  • 18 sections with headings');
      console.log('  • Properly formatted paragraphs');
      console.log('  • 7 tables with styling');
      console.log('  • Working navigation');
      console.log('  • Professional appearance');
      console.log('\n📝 Next step: Refresh the page in your browser');
    } else {
      console.log('\n⚠️  SOME CHECKS FAILED');
      console.log('\nPlease review the failed checks above.');
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

finalVerification();
