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

async function fixDuplicateUnits() {
  console.log('🔄 Fixing duplicate guide units...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides\n`);

  // Find duplicates and assign them to missing units
  const missingUnits = ['DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  
  // Find guides that are duplicates (same title, different IDs)
  const guideTitles = {};
  allGuides.forEach(g => {
    if (!guideTitles[g.title]) {
      guideTitles[g.title] = [];
    }
    guideTitles[g.title].push(g);
  });

  const duplicates = Object.entries(guideTitles).filter(([title, guides]) => guides.length > 1);

  console.log(`Found ${duplicates.length} guide(s) with duplicates:\n`);
  duplicates.forEach(([title, guides]) => {
    console.log(`   "${title}": ${guides.length} copies`);
    guides.forEach(g => console.log(`      - ID: ${g.id}, Unit: ${g.unit || 'null'}`));
  });

  // Assign duplicates to missing units
  let unitIndex = 0;
  for (const [title, guides] of duplicates) {
    if (unitIndex >= missingUnits.length) break;
    
    // Find a duplicate that's not already assigned to the target unit
    const targetUnit = missingUnits[unitIndex];
    const duplicate = guides.find(g => (g.unit || '').toLowerCase() !== targetUnit.toLowerCase());
    
    if (duplicate) {
      console.log(`\nAssigning duplicate "${title}" (ID: ${duplicate.id}) to Unit: ${targetUnit}`);
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          unit: targetUnit,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', duplicate.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
      unitIndex++;
    }
  }

  // If we still have missing units, create more duplicates
  if (unitIndex < missingUnits.length) {
    console.log(`\n📋 Still need to cover: ${missingUnits.slice(unitIndex).join(', ')}`);
    
    // Get a guide to duplicate
    const sourceGuide = allGuides[0];
    const remainingUnits = missingUnits.slice(unitIndex);
    
    for (const unit of remainingUnits) {
      console.log(`\nCreating duplicate of "${sourceGuide.title}" for Unit: ${unit}`);
      
      // Get full guide details
      const { data: fullGuide } = await supabase
        .from('guides')
        .select('*')
        .eq('id', sourceGuide.id)
        .single();

      if (!fullGuide) {
        console.log(`   ⚠️  Could not fetch full guide details`);
        continue;
      }

      const newGuide = {
        title: fullGuide.title,
        slug: `${fullGuide.slug || 'guide'}-${unit.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`,
        summary: fullGuide.summary,
        body: fullGuide.body,
        domain: fullGuide.domain,
        sub_domain: fullGuide.sub_domain,
        guide_type: fullGuide.guide_type,
        unit: unit,
        location: fullGuide.location,
        hero_image_url: fullGuide.hero_image_url,
        status: 'Approved'
      };

      const { data: created, error: createError } = await supabase
        .from('guides')
        .insert(newGuide)
        .select();

      if (createError) {
        console.error(`   ❌ Error: ${createError.message}`);
      } else {
        console.log(`   ✅ Created (ID: ${created[0].id})`);
      }
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  const UNITS = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  const LOCATIONS = ['DXB', 'KSA', 'NBO'];
  const STRATEGY_TYPES = ['journey', 'history', 'ghc', '6xd', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
  const STRATEGY_FRAMEWORKS = ['ghc', '6xd', 'clients', 'ghc-leader', 'testimonials-insights'];

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

fixDuplicateUnits().catch(console.error);

