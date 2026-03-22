import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_GHC_SUMMARY = `The GHC is your guide to working, learning, and growing at DQ. It helps you collaborate, make smart decisions, and create real value with your team. Think of it as the blueprint for everything we do here at DQ.`;

async function updateGHCSummary() {
  console.log('📝 Updating DQ GHC guide summary...\n');

  try {
    // Find the GHC guide
    const { data: guide, error: findError } = await supabase
      .from('guides')
      .select('id, title, slug, summary')
      .eq('slug', 'dq-ghc')
      .maybeSingle();

    if (findError) {
      console.error('❌ Error finding GHC guide:', findError.message);
      return;
    }

    if (!guide) {
      console.log('⚠️  GHC guide not found with slug "dq-ghc"');
      
      // Try alternative searches
      const { data: alternatives, error: altError } = await supabase
        .from('guides')
        .select('id, title, slug, summary')
        .or('title.ilike.%ghc%,title.ilike.%golden honeycomb%,title.ilike.%competencies%')
        .limit(5);

      if (!altError && alternatives && alternatives.length > 0) {
        console.log('Found possible GHC guides:');
        alternatives.forEach(alt => {
          console.log(`  - ${alt.title} (slug: ${alt.slug}, id: ${alt.id})`);
        });
      }
      return;
    }

    console.log(`Found GHC guide: ${guide.title}`);
    console.log(`Current summary: ${guide.summary?.substring(0, 100)}...`);
    console.log(`\nUpdating to new summary...`);

    // Update the summary
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        summary: NEW_GHC_SUMMARY,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error('❌ Error updating GHC guide:', updateError.message);
      return;
    }

    console.log('✅ Successfully updated GHC guide summary!');
    console.log(`New summary: ${NEW_GHC_SUMMARY}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateGHCSummary().catch(console.error);