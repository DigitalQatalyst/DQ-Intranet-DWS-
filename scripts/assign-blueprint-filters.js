import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignBlueprintFilters() {
  console.log('📝 Assigning existing Blueprint services to filters...\n');

  // Get all Blueprint guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location, sub_domain')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('No Blueprint guides found');
    return;
  }

  console.log(`Found ${guides.length} Blueprint guides\n`);

  // Distribute services across filters
  // Sub-domains: devops, dbp, dxp, dws, products, projects
  // Units: deals, dq-delivery-accounts, dq-delivery-deploys, dq-delivery-designs, finance, hra, intelligence, products, secdevops, solutions, stories
  // Locations: DXB, NBO, KSA

  const assignments = [
    { guide: 0, subDomains: ['devops'], units: ['secdevops'], locations: ['DXB'] }, // High-Level Architecture
    { guide: 1, subDomains: ['dbp'], units: ['dq-delivery-accounts'], locations: ['DXB'] }, // Low-Level Architecture
    { guide: 2, subDomains: ['dxp'], units: ['dq-delivery-deploys'], locations: ['NBO'] }, // Module Configuration
    { guide: 3, subDomains: ['dws'], units: ['dq-delivery-designs'], locations: ['NBO'] }, // Program Increment Planning
    { guide: 4, subDomains: ['products'], units: ['products'], locations: ['KSA'] }, // Release Readiness
    { guide: 5, subDomains: ['projects'], units: ['deals'], locations: ['DXB'] }, // Admin and User Guides
    { guide: 6, subDomains: ['devops', 'dbp'], units: ['solutions'], locations: ['NBO'] }, // Business Requirement
    { guide: 7, subDomains: ['dxp', 'dws'], units: ['finance'], locations: ['KSA'] }, // Deployment Design
    { guide: 8, subDomains: ['products', 'projects'], units: ['hra'], locations: ['DXB'] }, // Requirement Specification
    { guide: 9, subDomains: ['devops'], units: ['intelligence', 'stories'], locations: ['NBO'] }, // Test Execution
  ];

  for (const assignment of assignments) {
    const guide = guides[assignment.guide];
    if (!guide) continue;

    const subDomains = assignment.subDomains.join(',');
    const units = assignment.units.join(',');
    const locations = assignment.locations.join(',');

    console.log(`Updating "${guide.title}"...`);
    console.log(`   Sub-domains: ${subDomains}`);
    console.log(`   Units: ${units}`);
    console.log(`   Locations: ${locations}`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        sub_domain: subDomains,
        unit: units,
        location: locations
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}\n`);
    } else {
      console.log(`   ✅ Updated successfully\n`);
    }
  }

  // Verify coverage
  console.log('\n🔍 Verifying filter coverage...\n');
  
  const { data: updatedGuides } = await supabase
    .from('guides')
    .select('sub_domain, unit, location')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved');

  const subDomainCounts = {};
  const unitCounts = {};
  const locationCounts = {};

  updatedGuides.forEach(g => {
    (g.sub_domain || '').split(',').forEach(sd => {
      const trimmed = sd.trim().toLowerCase();
      if (trimmed) subDomainCounts[trimmed] = (subDomainCounts[trimmed] || 0) + 1;
    });
    (g.unit || '').split(',').forEach(u => {
      const trimmed = u.trim().toLowerCase();
      if (trimmed) unitCounts[trimmed] = (unitCounts[trimmed] || 0) + 1;
    });
    (g.location || '').split(',').forEach(l => {
      const trimmed = l.trim();
      if (trimmed) locationCounts[trimmed] = (locationCounts[trimmed] || 0) + 1;
    });
  });

  const blueprintSubDomains = ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'];
  const blueprintUnits = ['deals', 'dq-delivery-accounts', 'dq-delivery-deploys', 'dq-delivery-designs', 'finance', 'hra', 'intelligence', 'products', 'secdevops', 'solutions', 'stories'];
  const locations = ['DXB', 'NBO', 'KSA'];

  console.log('Sub-Domain Coverage:');
  blueprintSubDomains.forEach(sd => {
    const count = subDomainCounts[sd] || 0;
    console.log(`   ${sd}: ${count} service(s) ${count > 0 ? '✅' : '❌'}`);
  });

  console.log('\nUnit Coverage:');
  blueprintUnits.forEach(u => {
    const count = unitCounts[u] || 0;
    console.log(`   ${u}: ${count} service(s) ${count > 0 ? '✅' : '❌'}`);
  });

  console.log('\nLocation Coverage:');
  locations.forEach(l => {
    const count = locationCounts[l] || 0;
    console.log(`   ${l}: ${count} service(s) ${count > 0 ? '✅' : '❌'}`);
  });
}

assignBlueprintFilters().catch(console.error);

