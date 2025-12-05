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

async function verifyStoriesUnit() {
  console.log('🔍 Verifying Stories unit coverage...\n');

  // Check if Stories unit has any guides
  const { data: storiesGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .eq('unit', 'Stories');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Stories unit has ${storiesGuides.length} guide(s):\n`);
  storiesGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   Location: ${g.location || 'null'}`);
  });

  if (storiesGuides.length === 0) {
    console.log(`\n⚠️  Stories unit is empty. Assigning a guide...`);
    
    // Get a Strategy guide that's not in Stories
    const { data: availableGuides } = await supabase
      .from('guides')
      .select('id, title, unit')
      .eq('status', 'Approved')
      .eq('domain', 'Strategy')
      .neq('unit', 'Stories')
      .limit(1);

    if (availableGuides && availableGuides.length > 0) {
      const guide = availableGuides[0];
      console.log(`\nAssigning "${guide.title}" to Stories unit...`);
      console.log(`   Current unit: ${guide.unit || 'null'}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          unit: 'Stories',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
    }
  } else {
    console.log(`\n✅ Stories unit is covered.`);
  }
}

verifyStoriesUnit().catch(console.error);

