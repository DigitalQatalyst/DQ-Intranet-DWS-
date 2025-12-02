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

async function check6xDFiltering() {
  console.log('🔍 Checking 6xD (Digital Framework) filtering...\n');

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

  // Check which guides match 6xD filter
  const matching6xD = strategy.filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
    
    return allText.includes('6xd') || 
           allText.includes('digital-framework') ||
           (allText.includes('6xd') || allText.includes('digital-framework'));
  });

  console.log(`✅ Guides matching 6xD filter: ${matching6xD.length}\n`);
  
  if (matching6xD.length > 0) {
    console.log('Matching guides:');
    matching6xD.forEach((g, index) => {
      console.log(`\n${index + 1}. ${g.title}`);
      console.log(`   ID: ${g.id}`);
      console.log(`   Sub-Domain: ${g.sub_domain || 'N/A'}`);
      console.log(`   Domain: ${g.domain || 'N/A'}`);
      console.log(`   Guide Type: ${g.guide_type || 'N/A'}`);
      console.log(`   Unit: ${g.unit || 'N/A'}`);
      console.log(`   Location: ${g.location || 'N/A'}`);
    });
  } else {
    console.log('❌ No guides match the 6xD filter!');
    console.log('\nChecking all Strategy guides for 6xD/digital-framework references:');
    strategy.forEach(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const title = (g.title || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType} ${title}`;
      
      if (allText.includes('6xd') || allText.includes('digital') || allText.includes('framework')) {
        console.log(`\n   ${g.title}`);
        console.log(`   Sub-Domain: ${g.sub_domain || 'N/A'}`);
        console.log(`   Domain: ${g.domain || 'N/A'}`);
        console.log(`   Guide Type: ${g.guide_type || 'N/A'}`);
      }
    });
  }
}

check6xDFiltering().catch(console.error);

