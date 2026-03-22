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

async function findAllStrategyRelatedServices() {
  console.log('📋 Finding All Strategy-Related Services...\n');

  // Get all guides regardless of domain or status
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('slug, title, domain, sub_domain, status, guide_type')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Competencies (HoV) related
  const competenciesRelated = allGuides.filter(g => 
    g.slug?.includes('competencies') || 
    g.slug?.includes('hov') ||
    g.title?.toLowerCase().includes('competencies') ||
    g.title?.toLowerCase().includes('house of values') ||
    g.title?.toLowerCase().includes('emotional intelligence') ||
    g.title?.toLowerCase().includes('growth mindset') ||
    g.title?.toLowerCase().includes('purpose') && g.slug?.includes('competencies') ||
    g.title?.toLowerCase().includes('perceptive') ||
    g.title?.toLowerCase().includes('proactive') ||
    g.title?.toLowerCase().includes('perseverance') ||
    g.title?.toLowerCase().includes('precision') ||
    g.title?.toLowerCase().includes('customer') && g.slug?.includes('competencies') ||
    g.title?.toLowerCase().includes('learning') && g.slug?.includes('competencies') ||
    g.title?.toLowerCase().includes('collaboration') && g.slug?.includes('competencies') ||
    g.title?.toLowerCase().includes('responsibility') && g.slug?.includes('competencies') ||
    g.title?.toLowerCase().includes('trust') && g.slug?.includes('competencies')
  );

  // GHC related
  const ghcRelated = allGuides.filter(g => 
    g.slug?.includes('ghc') || 
    g.title?.toLowerCase().includes('ghc') ||
    g.title?.toLowerCase().includes('golden honeycomb') ||
    g.slug === 'dq-vision' ||
    g.slug === 'dq-hov' ||
    g.slug === 'dq-persona' ||
    g.slug === 'dq-agile-tms' ||
    g.slug === 'dq-agile-sos' ||
    g.slug === 'dq-agile-flows' ||
    g.slug === 'dq-agile-6xd' ||
    g.sub_domain === 'ghc'
  );

  console.log('=== Competencies (HoV) Services ===\n');
  if (competenciesRelated.length === 0) {
    console.log('  (None found)');
  } else {
    competenciesRelated.forEach((g, idx) => {
      console.log(`${idx + 1}. ${g.title}`);
      console.log(`   Slug: ${g.slug}`);
      console.log(`   Domain: ${g.domain || 'N/A'}`);
      console.log(`   Status: ${g.status || 'N/A'}`);
      console.log(`   Type: ${g.guide_type || 'N/A'}\n`);
    });
  }

  console.log(`\nTotal: ${competenciesRelated.length}\n`);

  console.log('=== GHC Services ===\n');
  if (ghcRelated.length === 0) {
    console.log('  (None found)');
  } else {
    ghcRelated.forEach((g, idx) => {
      console.log(`${idx + 1}. ${g.title}`);
      console.log(`   Slug: ${g.slug}`);
      console.log(`   Domain: ${g.domain || 'N/A'}`);
      console.log(`   Sub-domain: ${g.sub_domain || 'N/A'}`);
      console.log(`   Status: ${g.status || 'N/A'}`);
      console.log(`   Type: ${g.guide_type || 'N/A'}\n`);
    });
  }

  console.log(`\nTotal: ${ghcRelated.length}`);
}

findAllStrategyRelatedServices().catch(console.error);


