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

function slugify(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function check6xDFramework() {
  console.log('🔍 Checking 6xD (Digital Framework) filter...\n');

  // Fetch all Strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain, guide_type, unit, location')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Strategy guides
  const strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`📊 Total Strategy guides: ${strategy.length}\n`);

  // Check which guides match 6xD framework
  const matching6xD = strategy.filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
    
    // Check various 6xD patterns
    const has6xd = allText.includes('6xd') || 
                   allText.includes('digital-framework') ||
                   allText.includes('digital framework') ||
                   subDomain.includes('6xd') ||
                   subDomain.includes('digital-framework');
    
    return has6xd;
  });

  console.log(`📋 Guides matching 6xD framework: ${matching6xD.length}\n`);

  if (matching6xD.length === 0) {
    console.log('❌ No guides found matching 6xD framework!');
    console.log('\n🔍 Checking all Strategy guides sub_domain values:\n');
    strategy.forEach(g => {
      console.log(`   - ${g.title}`);
      console.log(`     sub_domain: ${g.sub_domain || 'N/A'}`);
      console.log(`     domain: ${g.domain || 'N/A'}`);
      console.log(`     guide_type: ${g.guide_type || 'N/A'}`);
      console.log('');
    });
  } else {
    matching6xD.forEach(g => {
      console.log(`✅ ${g.title}`);
      console.log(`   sub_domain: ${g.sub_domain || 'N/A'}`);
      console.log(`   domain: ${g.domain || 'N/A'}`);
      console.log(`   guide_type: ${g.guide_type || 'N/A'}`);
      console.log(`   unit: ${g.unit || 'N/A'}`);
      console.log(`   location: ${g.location || 'N/A'}`);
      console.log('');
    });
  }

  // Check what the filter is actually looking for
  console.log('\n🔍 Filter matching logic:');
  console.log('   Looking for: "6xd", "digital-framework", or "digital framework"');
  console.log('   In fields: sub_domain, domain, guide_type');
}

check6xDFramework().catch(console.error);

