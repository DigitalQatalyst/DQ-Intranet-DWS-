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

async function checkAndAssign() {
  console.log('🔍 Checking Guidelines filter coverage and assigning new guides...\n');

  // Fetch all Guidelines guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Guidelines only
  const guidelines = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  // Find the newly added Agenda & Scheduling Guidelines
  const agendaGuidelines = guidelines.filter(g => 
    (g.title || '').toLowerCase().includes('agenda') || 
    (g.title || '').toLowerCase().includes('scheduling')
  );

  console.log(`📊 Found ${agendaGuidelines.length} Agenda & Scheduling Guidelines\n`);

  // Count services per filter to find those with fewer services
  const guideTypeCounts = {};
  const unitCounts = {};
  const locationCounts = {};
  const categoryCounts = {};

  guidelines.forEach(g => {
    // Count guide types
    const guideType = slugify(g.guide_type || '');
    guideTypeCounts[guideType] = (guideTypeCounts[guideType] || 0) + 1;

    // Count units
    const unit = slugify(g.unit || g.function_area || '');
    if (unit) unitCounts[unit] = (unitCounts[unit] || 0) + 1;

    // Count locations
    const location = (g.location || '').toUpperCase().trim();
    if (location) locationCounts[location] = (locationCounts[location] || 0) + 1;

    // Count categories (from sub_domain)
    const subDomain = slugify(g.sub_domain || '');
    if (subDomain) categoryCounts[subDomain] = (categoryCounts[subDomain] || 0) + 1;
  });

  console.log('📊 Current filter coverage:\n');
  console.log('Guide Types:', guideTypeCounts);
  console.log('Units:', unitCounts);
  console.log('Locations:', locationCounts);
  console.log('Categories:', categoryCounts);

  // Find filters with fewer services (less than 2)
  const lowCoverageGuideTypes = Object.entries(guideTypeCounts)
    .filter(([_, count]) => count < 2)
    .map(([type]) => type);

  const lowCoverageUnits = Object.entries(unitCounts)
    .filter(([_, count]) => count < 2)
    .map(([unit]) => unit);

  const lowCoverageLocations = Object.entries(locationCounts)
    .filter(([_, count]) => count < 2)
    .map(([loc]) => loc);

  console.log('\n📋 Filters with low coverage (< 2 services):');
  console.log(`  Guide Types: ${lowCoverageGuideTypes.length > 0 ? lowCoverageGuideTypes.join(', ') : 'None'}`);
  console.log(`  Units: ${lowCoverageUnits.length > 0 ? lowCoverageUnits.join(', ') : 'None'}`);
  console.log(`  Locations: ${lowCoverageLocations.length > 0 ? lowCoverageLocations.join(', ') : 'None'}`);

  // Update Agenda & Scheduling Guidelines to fill gaps if needed
  if (agendaGuidelines.length > 0) {
    console.log('\n🔄 Updating Agenda & Scheduling Guidelines to fill gaps...\n');
    
    for (const guide of agendaGuidelines) {
      const updates = {};
      let needsUpdate = false;

      // Check if we should update guide_type
      const currentGuideType = slugify(guide.guide_type || '');
      if (lowCoverageGuideTypes.length > 0 && !lowCoverageGuideTypes.includes(currentGuideType)) {
        // Keep current if it's already good, or assign to a low coverage one
        const targetType = lowCoverageGuideTypes[0];
        // Map slug back to proper name
        const typeMap = {
          'best-practice': 'Best Practice',
          'policy': 'Policy',
          'process': 'Process',
          'sop': 'SOP'
        };
        if (typeMap[targetType]) {
          updates.guide_type = typeMap[targetType];
          needsUpdate = true;
        }
      }

      // Check if we should update unit
      const currentUnit = slugify(guide.unit || guide.function_area || '');
      if (lowCoverageUnits.length > 0 && !lowCoverageUnits.includes(currentUnit)) {
        const targetUnit = lowCoverageUnits[0];
        // Map slug back to proper name
        const unitMap = {
          'deals': 'Deals',
          'dq-delivery-accounts': 'DQ Delivery (Accounts)',
          'dq-delivery-deploys': 'DQ Delivery (Deploys)',
          'dq-delivery-designs': 'DQ Delivery (Designs)',
          'finance': 'Finance',
          'hra': 'HRA',
          'intelligence': 'Intelligence',
          'products': 'Products',
          'secdevops': 'SecDevOps',
          'solutions': 'Solutions',
          'stories': 'Stories'
        };
        if (unitMap[targetUnit]) {
          updates.unit = unitMap[targetUnit];
          needsUpdate = true;
        }
      }

      // Check if we should update location
      const currentLocation = (guide.location || '').toUpperCase().trim();
      if (lowCoverageLocations.length > 0 && !lowCoverageLocations.includes(currentLocation)) {
        updates.location = lowCoverageLocations[0];
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`  Updating: ${guide.title}`);
        console.log(`    Changes:`, updates);
        
        const { error: updateError } = await supabase
          .from('guides')
          .update(updates)
          .eq('id', guide.id);

        if (updateError) {
          console.error(`    ❌ Error: ${updateError.message}`);
        } else {
          console.log(`    ✅ Updated successfully`);
        }
      } else {
        console.log(`  ✓ ${guide.title} - already well distributed`);
      }
    }
  }

  console.log('\n✅ Assignment complete!');
}

checkAndAssign().catch(console.error);

