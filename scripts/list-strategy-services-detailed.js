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

async function listStrategyServicesDetailed() {
  console.log('📋 Listing Strategy Services (Detailed)...\n');

  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, domain, sub_domain, status')
    .eq('domain', 'strategy')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Total Strategy Services: ${data.length}\n`);

  // Competencies (HoV) - Main service + 12 Guiding Values
  const competenciesMain = data.filter(g => 
    g.slug === 'dq-competencies' || 
    g.slug === 'dq-hov' ||
    g.title?.toLowerCase().includes('dq competencies') ||
    (g.title?.toLowerCase().includes('competencies') && !g.slug?.includes('ghc'))
  );

  const guidingValues = data.filter(g => 
    g.slug?.includes('competencies-emotional-intelligence') ||
    g.slug?.includes('competencies-growth-mindset') ||
    g.slug?.includes('competencies-purpose') ||
    g.slug?.includes('competencies-perceptive') ||
    g.slug?.includes('competencies-proactive') ||
    g.slug?.includes('competencies-perseverance') ||
    g.slug?.includes('competencies-precision') ||
    g.slug?.includes('competencies-customer') ||
    g.slug?.includes('competencies-learning') ||
    g.slug?.includes('competencies-collaboration') ||
    g.slug?.includes('competencies-responsibility') ||
    g.slug?.includes('competencies-trust')
  );

  // GHC services - Main GHC + 7 core elements
  const ghcMain = data.filter(g => 
    g.slug === 'dq-ghc' || 
    g.title?.toLowerCase().includes('golden honeycomb') ||
    (g.title?.toLowerCase().includes('ghc') && !g.slug?.includes('competencies'))
  );

  const ghcCoreElements = data.filter(g => 
    g.slug === 'dq-vision' ||
    g.slug === 'dq-hov' ||
    g.slug === 'dq-persona' ||
    g.slug === 'dq-agile-tms' ||
    g.slug === 'dq-agile-sos' ||
    g.slug === 'dq-agile-flows' ||
    g.slug === 'dq-agile-6xd'
  );

  console.log('=== Competencies (HoV) Services ===\n');
  console.log('Main Service:');
  competenciesMain.forEach((g, idx) => {
    console.log(`  ${idx + 1}. ${g.title} (${g.slug})`);
  });

  console.log('\n12 Guiding Values:');
  if (guidingValues.length === 0) {
    console.log('  (None found in database)');
  } else {
    guidingValues.forEach((g, idx) => {
      console.log(`  ${idx + 1}. ${g.title} (${g.slug})`);
    });
  }

  console.log(`\nTotal Competencies (HoV) Services: ${competenciesMain.length + guidingValues.length}\n`);

  console.log('=== GHC Services ===\n');
  console.log('Main GHC Service:');
  ghcMain.forEach((g, idx) => {
    console.log(`  ${idx + 1}. ${g.title} (${g.slug})`);
  });

  console.log('\n7 GHC Core Elements:');
  if (ghcCoreElements.length === 0) {
    console.log('  (None found in database)');
  } else {
    ghcCoreElements.forEach((g, idx) => {
      console.log(`  ${idx + 1}. ${g.title} (${g.slug})`);
    });
  }

  console.log(`\nTotal GHC Services: ${ghcMain.length + ghcCoreElements.length}\n`);

  // Show all strategy services for reference
  console.log('=== All Strategy Services (for reference) ===');
  data.forEach((g, idx) => {
    console.log(`${idx + 1}. ${g.title} (${g.slug})`);
  });
}

listStrategyServicesDetailed().catch(console.error);


