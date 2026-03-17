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

const ghcCoreElements = [
  { slug: 'dq-vision', currentTitle: 'DQ Vision (Purpose)', newTitle: 'DQ Vision (Purpose) (GHC)' },
  { slug: 'dq-hov', currentTitle: 'HoV (House of Values)', newTitle: 'HoV (House of Values) (GHC)' },
  { slug: 'dq-persona', currentTitle: 'Persona (Identity)', newTitle: 'Persona (Identity) (GHC)' },
  { slug: 'dq-agile-tms', currentTitle: 'Agile TMS', newTitle: 'Agile TMS (GHC)' },
  { slug: 'dq-agile-sos', currentTitle: 'Agile SoS (Governance)', newTitle: 'Agile SoS (Governance) (GHC)' },
  { slug: 'dq-agile-flows', currentTitle: 'Agile Flows (Value Streams)', newTitle: 'Agile Flows (Value Streams) (GHC)' },
  { slug: 'dq-agile-6xd', currentTitle: 'Agile 6xD (Products)', newTitle: 'Agile 6xD (Products) (GHC)' },
];

async function updateGHCCoreElementsTitles() {
  console.log('📝 Updating 7 GHC Core Elements titles to include (GHC)...\n');

  for (const element of ghcCoreElements) {
    const { data, error } = await supabase
      .from('guides')
      .update({ title: element.newTitle })
      .eq('slug', element.slug)
      .select('id, slug, title');

    if (error) {
      console.error(`❌ Error updating ${element.slug}:`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${element.currentTitle} → ${element.newTitle}`);
    } else {
      console.log(`⚠️  Not found: ${element.slug} (${element.currentTitle})`);
    }
  }

  console.log('\n✅ Update complete!');
}

updateGHCCoreElementsTitles().catch(console.error);


