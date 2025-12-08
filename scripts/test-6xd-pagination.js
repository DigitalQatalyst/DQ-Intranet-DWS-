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

async function test6xDPagination() {
  console.log('🔍 Testing 6xD filter pagination...\n');

  // Fetch all Strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain, guide_type, unit, location, last_updated_at, download_count, is_editors_pick')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Strategy guides
  let strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`📊 Total Strategy guides: ${strategy.length}\n`);

  // Apply 6xD framework filter (simulating the client-side filter)
  const strategyFrameworks = ['6xd'];
  strategy = strategy.filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
    
    return strategyFrameworks.some(selectedFramework => {
      const normalizedSelected = slugify(selectedFramework);
      return allText.includes(selectedFramework.toLowerCase()) ||
             allText.includes(normalizedSelected) ||
             (selectedFramework === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (selectedFramework === 'ghc' && allText.includes('ghc')) ||
             (selectedFramework === 'clients' && allText.includes('client')) ||
             (selectedFramework === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (selectedFramework === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
  });

  console.log(`✅ After 6xD filter: ${strategy.length} guides\n`);

  // Apply sorting (default sort)
  strategy.sort((a, b) => {
    const aPick = Number(a.is_editors_pick) || 0;
    const bPick = Number(b.is_editors_pick) || 0;
    if (bPick !== aPick) return bPick - aPick;
    
    const aDownloads = a.download_count || 0;
    const bDownloads = b.download_count || 0;
    if (bDownloads !== aDownloads) return bDownloads - aDownloads;
    
    const aDate = new Date(a.last_updated_at || 0).getTime();
    const bDate = new Date(b.last_updated_at || 0).getTime();
    return bDate - aDate;
  });

  console.log('📄 Sorted results (first 9 would be on page 1):\n');
  strategy.forEach((g, index) => {
    console.log(`${index + 1}. ${g.title}`);
    console.log(`   Location: ${g.location || 'N/A'}`);
    console.log(`   Editor's Pick: ${g.is_editors_pick || false}`);
    console.log(`   Downloads: ${g.download_count || 0}`);
    console.log(`   Last Updated: ${g.last_updated_at || 'N/A'}`);
    console.log('');
  });

  const pageSize = 9;
  const page1 = strategy.slice(0, pageSize);
  console.log(`\n📊 Page 1 (first ${pageSize} guides):`);
  page1.forEach((g, index) => {
    console.log(`   ${index + 1}. ${g.title} (${g.location || 'N/A'})`);
  });

  if (strategy.length > pageSize) {
    console.log(`\n⚠️  ${strategy.length - pageSize} guides are on page 2+`);
  } else {
    console.log(`\n✅ All ${strategy.length} guides fit on page 1`);
  }
}

test6xDPagination().catch(console.error);

