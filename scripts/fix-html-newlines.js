import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixNewlines() {
  console.log('🔧 Fixing HTML newlines...\n');

  try {
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (fetchError) throw fetchError;

    console.log(`Found: ${guide.title}`);
    console.log(`Current length: ${guide.body.length} characters`);

    // Replace literal \n with actual newlines
    let fixedHtml = guide.body.replaceAll('\\n', '\n');
    
    // Also clean up any double newlines
    fixedHtml = fixedHtml.replaceAll('\n\n\n', '\n\n');
    
    console.log(`Fixed length: ${fixedHtml.length} characters`);
    console.log('\nFirst 500 chars after fix:');
    console.log('---');
    console.log(fixedHtml.substring(0, 500));
    console.log('---');

    // Update the database
    const { error: updateError } = await supabase
      .from('guides')
      .update({ 
        body: fixedHtml,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) throw updateError;

    console.log('\n✅ Successfully fixed newlines in HTML');
    console.log('   The content should now render properly');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixNewlines();
