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

async function fixStrategyContent() {
  console.log('🔄 Fixing Strategy guide content and categorization...\n');

  // Fix Leave Guidelines - move to Guidelines
  const { data: leaveGuide } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved')
    .limit(1);

  if (leaveGuide && leaveGuide.length > 0) {
    const guide = leaveGuide[0];
    console.log(`🔄 Fixing "${guide.title}"...`);
    
    const { error } = await supabase
      .from('guides')
      .update({
        domain: 'Guidelines',
        sub_domain: 'resources',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Moved to Guidelines`);
    }
  }

  // Fix DQ Social Media Guidelines - move to Guidelines
  const { data: socialGuide } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .ilike('title', '%Social Media%')
    .eq('status', 'Approved')
    .limit(1);

  if (socialGuide && socialGuide.length > 0) {
    const guide = socialGuide[0];
    if (guide.domain === 'Strategy' || guide.sub_domain === 'history') {
      console.log(`🔄 Fixing "${guide.title}"...`);
      
      const { error } = await supabase
        .from('guides')
        .update({
          domain: 'Guidelines',
          sub_domain: 'resources',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Moved to Guidelines`);
      }
    }
  }

  console.log('\n✅ Categorization fixes complete!');
  console.log('\n📋 Next steps:');
  console.log('   - Update Strategy guides to reflect actual DQ content');
  console.log('   - Ensure each Strategy category (Journey, History, GHC, 6xD, etc.) has proper DQ content');
}

fixStrategyContent().catch(console.error);

