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

async function fixDuplicateSubdomains() {
  console.log('🔄 Fixing duplicate guide sub_domains...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Find guides with missing or empty sub_domain
  const guidesNeedingSubDomain = allGuides.filter(g => !g.sub_domain || g.sub_domain.trim() === '');

  console.log(`Found ${guidesNeedingSubDomain.length} guide(s) with missing sub_domain:\n`);
  guidesNeedingSubDomain.forEach(g => {
    console.log(`   "${g.title}" (ID: ${g.id}) - Unit: ${g.unit || 'null'}`);
  });

  // Get the original guides to copy sub_domain from
  const originalGuides = allGuides.filter(g => g.sub_domain && g.sub_domain.trim() !== '');

  // Update duplicates to have the same sub_domain as their originals
  for (const guide of guidesNeedingSubDomain) {
    // Find the original guide with the same title
    const original = originalGuides.find(og => og.title === guide.title);
    
    if (original && original.sub_domain) {
      console.log(`\nUpdating "${guide.title}" (ID: ${guide.id})`);
      console.log(`   Setting sub_domain to: ${original.sub_domain}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: original.sub_domain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
    } else {
      // If no original found, assign a default based on title
      let defaultSubDomain = 'journey';
      if (guide.title.includes('6xD') || guide.title.includes('6xd')) {
        defaultSubDomain = 'digital-framework,6xd';
      } else if (guide.title.includes('GHC') || guide.title.includes('Competencies') || guide.title.includes('Products')) {
        defaultSubDomain = 'ghc';
      }
      
      console.log(`\nUpdating "${guide.title}" (ID: ${guide.id})`);
      console.log(`   Setting default sub_domain to: ${defaultSubDomain}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: defaultSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  const STRATEGY_TYPES = ['journey', 'history', 'ghc', '6xd', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
  const STRATEGY_FRAMEWORKS = ['ghc', '6xd', 'clients', 'ghc-leader', 'testimonials-insights'];
  const UNITS = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  const LOCATIONS = ['DXB', 'KSA', 'NBO'];

  let allCovered = true;

  console.log('Strategy Types:');
  STRATEGY_TYPES.forEach(type => {
    const hasMatch = finalGuides?.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(type) || 
             (type === '6xd' && subDomain.includes('digital-framework')) ||
             (type === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader'));
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${type}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nFrameworks:');
  STRATEGY_FRAMEWORKS.forEach(fw => {
    const hasMatch = finalGuides?.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(fw.toLowerCase()) ||
             (fw === '6xd' && (subDomain.includes('6xd') || subDomain.includes('digital-framework'))) ||
             (fw === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader')) ||
             (fw === 'ghc-leader' && subDomain.includes('ghc-leader')) ||
             (fw === 'testimonials-insights' && (subDomain.includes('testimonial') || subDomain.includes('insight')));
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${fw}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nUnits:');
  UNITS.forEach(unit => {
    const hasMatch = finalGuides?.some(g => (g.unit || '').toLowerCase() === unit.toLowerCase());
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${unit}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nLocations:');
  LOCATIONS.forEach(loc => {
    const hasMatch = finalGuides?.some(g => (g.location || '').toLowerCase() === loc.toLowerCase());
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${loc}`);
    if (!hasMatch) allCovered = false;
  });

  if (allCovered) {
    console.log(`\n✅ SUCCESS! All Strategy filters now have at least one service for testing!`);
    console.log(`\n📊 Total Strategy guides: ${finalGuides?.length || 0}`);
  } else {
    console.log(`\n⚠️  Some filters still need services.`);
  }
}

fixDuplicateSubdomains().catch(console.error);

