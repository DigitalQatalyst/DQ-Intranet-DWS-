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

async function removeStrategyCards() {
  console.log('🗑️  Removing strategy cards...\n');

  const titlesToRemove = [
    'Agile 6xD (Products)',
    'DQ Beliefs',
    'DQ Strategy 2021-2030',
    'DQ Journey'
  ];

  for (const title of titlesToRemove) {
    try {
      // Find the guide
      const { data: guide, error: findError } = await supabase
        .from('guides')
        .select('id, slug, title, status')
        .ilike('title', `%${title}%`)
        .maybeSingle();

      if (findError) {
        console.error(`❌ Error finding ${title}:`, findError.message);
        continue;
      }

      if (!guide) {
        console.log(`⚠️  ${title} not found`);
        continue;
      }

      // Update status to 'Draft' or delete it
      // Option 1: Change status to Draft (safer, can be restored)
      const { error: updateError } = await supabase
        .from('guides')
        .update({ status: 'Draft' })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`❌ Error updating ${title}:`, updateError.message);
      } else {
        console.log(`✅ Removed ${title} (slug: ${guide.slug}) - Status set to Draft`);
      }

      // Option 2: Uncomment to delete instead
      // const { error: deleteError } = await supabase
      //   .from('guides')
      //   .delete()
      //   .eq('id', guide.id);
      // 
      // if (deleteError) {
      //   console.error(`❌ Error deleting ${title}:`, deleteError.message);
      // } else {
      //   console.log(`✅ Deleted ${title} (slug: ${guide.slug})`);
      // }
    } catch (error) {
      console.error(`❌ Error processing ${title}:`, error.message);
    }
  }

  console.log('\n✅ Done!');
}

removeStrategyCards().catch(console.error);

