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

async function checkBlueprintFilters() {
  console.log('🔍 Checking Blueprint filters coverage...\n');

  // Get all Blueprint guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location, sub_domain, guide_type')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${guides.length} Blueprint guides\n`);

  // Blueprint filter options from code
  const blueprintSubDomains = ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'];
  const blueprintUnits = ['deals', 'dq-delivery-accounts', 'dq-delivery-deploys', 'dq-delivery-designs', 'finance', 'hra', 'intelligence', 'products', 'secdevops', 'solutions', 'stories'];
  const locations = ['DXB', 'NBO', 'Global', 'Remote'];

  // Check sub_domain coverage
  console.log('📋 Sub-Domain Coverage:');
  const subDomainCounts = {};
  guides.forEach(g => {
    const subDomains = (g.sub_domain || '').split(',').map(s => s.trim().toLowerCase());
    subDomains.forEach(sd => {
      if (sd) subDomainCounts[sd] = (subDomainCounts[sd] || 0) + 1;
    });
  });

  blueprintSubDomains.forEach(sd => {
    const count = subDomainCounts[sd.toLowerCase()] || 0;
    console.log(`   ${sd}: ${count} service(s) ${count === 0 ? '❌' : '✅'}`);
  });

  // Check unit coverage
  console.log('\n📋 Unit Coverage:');
  const unitCounts = {};
  guides.forEach(g => {
    const unit = (g.unit || '').toLowerCase();
    if (unit) unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  });

  blueprintUnits.forEach(unit => {
    const count = unitCounts[unit.toLowerCase()] || 0;
    console.log(`   ${unit}: ${count} service(s) ${count === 0 ? '❌' : '✅'}`);
  });

  // Check location coverage
  console.log('\n📋 Location Coverage:');
  const locationCounts = {};
  guides.forEach(g => {
    const locs = (g.location || '').split(',').map(l => l.trim());
    locs.forEach(loc => {
      if (loc) locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
  });

  locations.forEach(loc => {
    const count = locationCounts[loc] || 0;
    console.log(`   ${loc}: ${count} service(s) ${count === 0 ? '❌' : '✅'}`);
  });

  // Summary
  console.log('\n📊 Summary:');
  const emptySubDomains = blueprintSubDomains.filter(sd => !subDomainCounts[sd.toLowerCase()]);
  const emptyUnits = blueprintUnits.filter(u => !unitCounts[u.toLowerCase()]);
  const emptyLocations = locations.filter(l => !locationCounts[l]);

  console.log(`   Empty Sub-Domains: ${emptySubDomains.length} (${emptySubDomains.join(', ') || 'none'})`);
  console.log(`   Empty Units: ${emptyUnits.length} (${emptyUnits.join(', ') || 'none'})`);
  console.log(`   Empty Locations: ${emptyLocations.length} (${emptyLocations.join(', ') || 'none'})`);
}

checkBlueprintFilters().catch(console.error);

