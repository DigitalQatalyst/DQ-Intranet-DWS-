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

async function checkAllStrategyGuides() {
  console.log('🔍 Checking all Strategy guides by category...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const strategy = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    return domain === 'strategy';
  });

  console.log(`📊 Total Strategy guides: ${strategy.length}\n`);

  // Group by category
  const categories = {
    journey: [],
    ghc: [],
    '6xd': [],
    history: [],
    initiatives: [],
    clients: [],
    'ghc-leader': [],
    cases: [],
    references: [],
    uncategorized: []
  };

  strategy.forEach(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    let categorized = false;

    if (subDomain.includes('journey')) {
      categories.journey.push(g);
      categorized = true;
    }
    if (subDomain.includes('ghc') && !subDomain.includes('ghc-leader')) {
      categories.ghc.push(g);
      categorized = true;
    }
    if (subDomain.includes('6xd') || subDomain.includes('digital-framework')) {
      categories['6xd'].push(g);
      categorized = true;
    }
    if (subDomain.includes('history')) {
      categories.history.push(g);
      categorized = true;
    }
    if (subDomain.includes('initiatives')) {
      categories.initiatives.push(g);
      categorized = true;
    }
    if (subDomain.includes('clients')) {
      categories.clients.push(g);
      categorized = true;
    }
    if (subDomain.includes('ghc-leader')) {
      categories['ghc-leader'].push(g);
      categorized = true;
    }
    if (subDomain.includes('cases')) {
      categories.cases.push(g);
      categorized = true;
    }
    if (subDomain.includes('references')) {
      categories.references.push(g);
      categorized = true;
    }

    if (!categorized) {
      categories.uncategorized.push(g);
    }
  });

  Object.entries(categories).forEach(([category, guides]) => {
    if (guides.length > 0) {
      console.log(`\n📋 ${category.toUpperCase()}: ${guides.length} guides`);
      guides.forEach(g => console.log(`   - ${g.title} (sub_domain: ${g.sub_domain})`));
    }
  });
}

checkAllStrategyGuides().catch(console.error);

