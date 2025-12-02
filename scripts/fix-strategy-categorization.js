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

async function fixCategorization() {
  console.log('🔄 Fixing Strategy guide categorization...\n');

  // Fix Leave Guidelines - it shouldn't be in Strategy
  const { data: leaveGuide } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved')
    .limit(1);

  if (leaveGuide && leaveGuide.length > 0) {
    const guide = leaveGuide[0];
    if (guide.sub_domain === 'journey' || guide.domain === 'Strategy') {
      console.log(`🔄 Fixing "${guide.title}" - removing from Strategy...`);
      
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

  // Check current Strategy guides
  const { data: allGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain, guide_type')
    .eq('status', 'Approved');

  const strategy = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`\n📊 Current Strategy guides: ${strategy.length}\n`);
  console.log('📋 Categorized by sub_domain:\n');
  
  const bySubDomain = {};
  strategy.forEach(g => {
    const subDomain = g.sub_domain || 'uncategorized';
    if (!bySubDomain[subDomain]) bySubDomain[subDomain] = [];
    bySubDomain[subDomain].push(g);
  });

  Object.entries(bySubDomain).forEach(([subDomain, guides]) => {
    console.log(`${subDomain}: ${guides.length} guides`);
    guides.forEach(g => console.log(`   - ${g.title}`));
    console.log('');
  });

  // Check which Strategy categories need guides
  const requiredCategories = ['journey', 'history', 'ghc', 'digital-framework', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
  
  console.log('📋 Required Strategy categories and their status:\n');
  requiredCategories.forEach(cat => {
    const matching = strategy.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(cat) || 
             (cat === 'digital-framework' && subDomain.includes('6xd')) ||
             (cat === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader'));
    });
    const status = matching.length > 0 ? '✅' : '❌';
    console.log(`${status} ${cat}: ${matching.length} guides`);
    if (matching.length > 0) {
      matching.forEach(g => console.log(`      - ${g.title}`));
    }
  });
}

fixCategorization().catch(console.error);

