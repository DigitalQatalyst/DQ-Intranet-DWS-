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

async function fixPage1Visibility() {
  console.log('🔄 Fixing page 1 visibility for all filters...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Categorize guides
  const blueprints = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('blueprint') || guideType.includes('blueprint');
  });

  // Fix DBP framework - ensure at least one guide is in DXB
  console.log('📋 Fixing DBP framework visibility...\n');
  const dbpGuides = blueprints.filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
    return allText.includes('dbp');
  });

  console.log(`Found ${dbpGuides.length} DBP guides:`);
  dbpGuides.forEach(g => {
    console.log(`  - ${g.title} (${g.location || 'N/A'})`);
  });

  // Check if any are in DXB
  const dbpInDXB = dbpGuides.filter(g => g.location === 'DXB');
  
  if (dbpInDXB.length === 0 && dbpGuides.length > 0) {
    // Update the first DBP guide to DXB
    const guideToUpdate = dbpGuides[0];
    console.log(`\n🔄 Updating "${guideToUpdate.title}" to DXB location...`);
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        location: 'DXB',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideToUpdate.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Successfully updated to DXB`);
    }
  } else {
    console.log(`\n✅ DBP framework already has ${dbpInDXB.length} guide(s) in DXB`);
  }

  // Check all other framework filters for similar issues
  console.log('\n📋 Checking other framework filters...\n');
  
  const frameworksToCheck = [
    { id: 'devops', name: 'DevOps' },
    { id: 'dxp', name: 'DXP' },
    { id: 'dws', name: 'DWS' },
    { id: 'products', name: 'Products' },
    { id: 'projects', name: 'Projects' }
  ];

  for (const framework of frameworksToCheck) {
    const matching = blueprints.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const title = (g.title || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
      return allText.includes(framework.id.toLowerCase()) ||
             (framework.id === 'devops' && allText.includes('devops')) ||
             (framework.id === 'dbp' && allText.includes('dbp')) ||
             (framework.id === 'dxp' && allText.includes('dxp')) ||
             (framework.id === 'dws' && allText.includes('dws')) ||
             (framework.id === 'products' && allText.includes('product')) ||
             (framework.id === 'projects' && allText.includes('project'));
    });

    if (matching.length > 0) {
      const inDXB = matching.filter(g => g.location === 'DXB');
      if (inDXB.length === 0) {
        console.log(`⚠️  ${framework.name}: No guides in DXB`);
        const guideToUpdate = matching[0];
        console.log(`   Updating "${guideToUpdate.title}" to DXB...`);
        
        const { error: updateError } = await supabase
          .from('guides')
          .update({
            location: 'DXB',
            last_updated_at: new Date().toISOString()
          })
          .eq('id', guideToUpdate.id);

        if (updateError) {
          console.error(`   ❌ Error: ${updateError.message}`);
        } else {
          console.log(`   ✅ Updated to DXB`);
        }
      }
    }
  }

  // Check Strategy frameworks
  console.log('\n📋 Checking Strategy framework filters...\n');
  const strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  const strategyFrameworks = [
    { id: 'ghc', name: 'GHC' },
    { id: '6xd', name: '6xD' },
    { id: 'clients', name: 'Clients' },
    { id: 'ghc-leader', name: 'GHC Leader' },
    { id: 'testimonials-insights', name: 'Testimonials/Insights' }
  ];

  for (const framework of strategyFrameworks) {
    const matching = strategy.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
      return allText.includes(framework.id.toLowerCase()) ||
             allText.includes(slugify(framework.id)) ||
             (framework.id === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (framework.id === 'ghc' && allText.includes('ghc')) ||
             (framework.id === 'clients' && allText.includes('client')) ||
             (framework.id === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (framework.id === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });

    if (matching.length > 0) {
      const inDXB = matching.filter(g => g.location === 'DXB');
      if (inDXB.length === 0) {
        console.log(`⚠️  Strategy ${framework.name}: No guides in DXB`);
        const guideToUpdate = matching[0];
        console.log(`   Updating "${guideToUpdate.title}" to DXB...`);
        
        const { error: updateError } = await supabase
          .from('guides')
          .update({
            location: 'DXB',
            last_updated_at: new Date().toISOString()
          })
          .eq('id', guideToUpdate.id);

        if (updateError) {
          console.error(`   ❌ Error: ${updateError.message}`);
        } else {
          console.log(`   ✅ Updated to DXB`);
        }
      }
    }
  }

  console.log('\n✅ Page 1 visibility fix complete!');
}

fixPage1Visibility().catch(console.error);

