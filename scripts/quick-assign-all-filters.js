import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickAssign() {
  console.log('🔄 Quick assignment to all filters...\n');

  // Get all Strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${guides.length} guides\n`);

  // Units - distribute across all units
  const units = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  console.log('Assigning units...');
  for (let i = 0; i < units.length && i < guides.length; i++) {
    await supabase
      .from('guides')
      .update({
        unit: units[i],
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guides[i].id);
  }

  // Locations - distribute
  const locations = ['DXB', 'KSA', 'NBO'];
  console.log('Assigning locations...');
  for (let i = 0; i < locations.length && i < guides.length; i++) {
    await supabase
      .from('guides')
      .update({
        location: locations[i],
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guides[i].id);
  }

  // Strategy Types - append to sub_domain
  const strategyTypes = ['history', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
  console.log('Assigning strategy types...');
  for (let i = 0; i < strategyTypes.length && i < guides.length; i++) {
    const current = guides[i].sub_domain || '';
    const newSubDomain = current ? `${current},${strategyTypes[i]}` : strategyTypes[i];
    await supabase
      .from('guides')
      .update({
        sub_domain: newSubDomain,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guides[i].id);
  }

  // Frameworks - append to sub_domain
  const frameworks = ['clients', 'ghc-leader', 'testimonials-insights'];
  console.log('Assigning frameworks...');
  for (let i = 0; i < frameworks.length && i < guides.length; i++) {
    const current = guides[i].sub_domain || '';
    const newSubDomain = current ? `${current},${frameworks[i]}` : frameworks[i];
    await supabase
      .from('guides')
      .update({
        sub_domain: newSubDomain,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guides[i].id);
  }

  console.log('\n✅ Quick assignment complete!');
  console.log('All filters should now have services.');
}

quickAssign().catch(console.error);
