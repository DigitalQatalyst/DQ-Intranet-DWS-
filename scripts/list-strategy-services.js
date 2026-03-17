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

async function listStrategyServices() {
  console.log('📋 Listing Strategy Services...\n');

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

  // Filter Competencies (HoV) services
  const competencies = data.filter(g => 
    g.slug?.includes('competencies') || 
    g.slug?.includes('hov') || 
    g.title?.toLowerCase().includes('competencies') ||
    g.title?.toLowerCase().includes('house of values')
  );

  // Filter GHC services
  const ghc = data.filter(g => 
    g.slug?.includes('ghc') || 
    g.title?.toLowerCase().includes('ghc') ||
    g.title?.toLowerCase().includes('golden honeycomb') ||
    g.slug === 'dq-vision' ||
    g.slug === 'dq-persona' ||
    g.slug === 'dq-agile-tms' ||
    g.slug === 'dq-agile-sos' ||
    g.slug === 'dq-agile-flows' ||
    g.slug === 'dq-agile-6xd'
  );

  console.log('=== Competencies (HoV) Services ===');
  console.log(`Total: ${competencies.length}\n`);
  competencies.forEach((g, idx) => {
    console.log(`${idx + 1}. ${g.title}`);
    console.log(`   Slug: ${g.slug}`);
    console.log(`   Sub-domain: ${g.sub_domain || 'N/A'}\n`);
  });

  console.log('\n=== GHC Services ===');
  console.log(`Total: ${ghc.length}\n`);
  ghc.forEach((g, idx) => {
    console.log(`${idx + 1}. ${g.title}`);
    console.log(`   Slug: ${g.slug}`);
    console.log(`   Sub-domain: ${g.sub_domain || 'N/A'}\n`);
  });
}

listStrategyServices().catch(console.error);


