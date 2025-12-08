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

// All filter definitions
const STRATEGY_UNITS = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
];

const STRATEGY_LOCATIONS = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
];

const STRATEGY_TYPES = [
  { id: 'journey', name: 'Journey' },
  { id: 'history', name: 'History' },
  { id: 'initiatives', name: 'Initiatives' },
  { id: 'cases', name: 'Cases' },
  { id: 'references', name: 'References' }
];

const STRATEGY_FRAMEWORKS = [
  { id: 'ghc', name: 'GHC' },
  { id: '6xd', name: '6xD (Digital Framework)' },
  { id: 'clients', name: 'Clients' },
  { id: 'ghc-leader', name: 'GHC Leader' },
  { id: 'testimonials-insights', name: 'Testimonials/Insights' }
];

const GUIDELINES_UNITS = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
];

const GUIDELINES_LOCATIONS = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
];

const GUIDELINES_GUIDE_TYPES = [
  { id: 'best-practice', name: 'Best Practice' },
  { id: 'policy', name: 'Policy' },
  { id: 'process', name: 'Process' },
  { id: 'sop', name: 'SOP' }
];

const GUIDELINES_CATEGORIES = [
  { id: 'resources', name: 'Resources' },
  { id: 'policies', name: 'Policies' },
  { id: 'xds', name: 'xDS (Design Systems)' }
];

const BLUEPRINT_UNITS = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
];

const BLUEPRINT_LOCATIONS = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
];

const BLUEPRINT_GUIDE_TYPES = [
  { id: 'best-practice', name: 'Best Practice' },
  { id: 'policy', name: 'Policy' },
  { id: 'process', name: 'Process' },
  { id: 'sop', name: 'SOP' }
];

const BLUEPRINT_FRAMEWORKS = [
  { id: 'devops', name: 'DevOps' },
  { id: 'dbp', name: 'DBP' },
  { id: 'dxp', name: 'DXP' },
  { id: 'dws', name: 'DWS' },
  { id: 'products', name: 'Products' },
  { id: 'projects', name: 'Projects' }
];

const TESTIMONIAL_CATEGORIES = [
  { id: 'journey-transformation-story', name: 'Journey / Transformation Story' },
  { id: 'case-study', name: 'Case Study' },
  { id: 'leadership-reflection', name: 'Leadership Reflection' },
  { id: 'client-partner-reference', name: 'Client / Partner Reference' },
  { id: 'team-employee-experience', name: 'Team / Employee Experience' },
  { id: 'milestone-achievement', name: 'Milestone / Achievement' }
];

async function checkAllFilters() {
  console.log('🔍 Thoroughly checking all filters for empty options...\n');

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
  const strategy = [];
  const guidelines = [];
  const blueprints = [];
  const testimonials = [];

  (guides || []).forEach(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const title = (g.title || '').toLowerCase();

    if (domain.includes('strategy') || guideType.includes('strategy')) {
      strategy.push(g);
    } else if (domain.includes('blueprint') || guideType.includes('blueprint')) {
      blueprints.push(g);
    } else if (domain.includes('testimonial') || guideType.includes('testimonial')) {
      testimonials.push(g);
    } else {
      guidelines.push(g);
    }
  });

  console.log(`📊 Total guides: ${guides.length}`);
  console.log(`   Strategy: ${strategy.length}`);
  console.log(`   Guidelines: ${guidelines.length}`);
  console.log(`   Blueprints: ${blueprints.length}`);
  console.log(`   Testimonials: ${testimonials.length}\n`);

  const emptyFilters = {
    strategy: { units: [], locations: [], types: [], frameworks: [] },
    guidelines: { units: [], locations: [], guideTypes: [], categories: [] },
    blueprints: { units: [], locations: [], guideTypes: [], frameworks: [] },
    testimonials: { categories: [] }
  };

  // Check Strategy filters
  console.log('📋 STRATEGY FILTERS:');
  console.log('   Units:');
  for (const unit of STRATEGY_UNITS) {
    const matching = strategy.filter(g => {
      const unitValue = g.unit || g.function_area || '';
      const normalizedDbValue = slugify(unitValue);
      const normalizedSelected = slugify(unit.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${unit.name}: 0 guides`);
      emptyFilters.strategy.units.push(unit);
    } else {
      console.log(`      ✅ ${unit.name}: ${count} guides`);
    }
  }

  console.log('   Locations:');
  for (const location of STRATEGY_LOCATIONS) {
    const matching = strategy.filter(g => {
      const locationValue = (g.location || '').toUpperCase().trim();
      return locationValue === location.id.toUpperCase();
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${location.name}: 0 guides`);
      emptyFilters.strategy.locations.push(location);
    } else {
      console.log(`      ✅ ${location.name}: ${count} guides`);
    }
  }

  console.log('   Strategy Types:');
  for (const type of STRATEGY_TYPES) {
    const matching = strategy.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(type.id.toLowerCase()) || 
             type.id.toLowerCase().includes(subDomain) ||
             slugify(subDomain) === slugify(type.id);
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${type.name}: 0 guides`);
      emptyFilters.strategy.types.push(type);
    } else {
      console.log(`      ✅ ${type.name}: ${count} guides`);
    }
  }

  console.log('   Frameworks:');
  for (const framework of STRATEGY_FRAMEWORKS) {
    const matching = strategy.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
      const normalizedSelected = slugify(framework.id);
      return allText.includes(framework.id.toLowerCase()) ||
             allText.includes(normalizedSelected) ||
             (framework.id === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (framework.id === 'ghc' && allText.includes('ghc')) ||
             (framework.id === 'clients' && allText.includes('client')) ||
             (framework.id === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (framework.id === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${framework.name}: 0 guides`);
      emptyFilters.strategy.frameworks.push(framework);
    } else {
      console.log(`      ✅ ${framework.name}: ${count} guides`);
    }
  }

  // Check Guidelines filters
  console.log('\n📋 GUIDELINES FILTERS:');
  console.log('   Units:');
  for (const unit of GUIDELINES_UNITS) {
    const matching = guidelines.filter(g => {
      const unitValue = g.unit || g.function_area || '';
      const normalizedDbValue = slugify(unitValue);
      const normalizedSelected = slugify(unit.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${unit.name}: 0 guides`);
      emptyFilters.guidelines.units.push(unit);
    } else {
      console.log(`      ✅ ${unit.name}: ${count} guides`);
    }
  }

  console.log('   Locations:');
  for (const location of GUIDELINES_LOCATIONS) {
    const matching = guidelines.filter(g => {
      const locationValue = (g.location || '').toUpperCase().trim();
      return locationValue === location.id.toUpperCase();
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${location.name}: 0 guides`);
      emptyFilters.guidelines.locations.push(location);
    } else {
      console.log(`      ✅ ${location.name}: ${count} guides`);
    }
  }

  console.log('   Guide Types:');
  for (const type of GUIDELINES_GUIDE_TYPES) {
    const matching = guidelines.filter(g => {
      const guideTypeValue = g.guide_type || '';
      const normalizedDbValue = slugify(guideTypeValue);
      const normalizedSelected = slugify(type.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${type.name}: 0 guides`);
      emptyFilters.guidelines.guideTypes.push(type);
    } else {
      console.log(`      ✅ ${type.name}: ${count} guides`);
    }
  }

  console.log('   Categories:');
  for (const category of GUIDELINES_CATEGORIES) {
    const matching = guidelines.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const title = (g.title || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
      const normalizedSelected = slugify(category.id);
      return allText.includes(category.id.toLowerCase()) ||
             allText.includes(normalizedSelected) ||
             (category.id === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
             (category.id === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
             (category.id === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${category.name}: 0 guides`);
      emptyFilters.guidelines.categories.push(category);
    } else {
      console.log(`      ✅ ${category.name}: ${count} guides`);
    }
  }

  // Check Blueprints filters
  console.log('\n📋 BLUEPRINTS FILTERS:');
  console.log('   Units:');
  for (const unit of BLUEPRINT_UNITS) {
    const matching = blueprints.filter(g => {
      const unitValue = g.unit || g.function_area || '';
      const normalizedDbValue = slugify(unitValue);
      const normalizedSelected = slugify(unit.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${unit.name}: 0 guides`);
      emptyFilters.blueprints.units.push(unit);
    } else {
      console.log(`      ✅ ${unit.name}: ${count} guides`);
    }
  }

  console.log('   Locations:');
  for (const location of BLUEPRINT_LOCATIONS) {
    const matching = blueprints.filter(g => {
      const locationValue = (g.location || '').toUpperCase().trim();
      return locationValue === location.id.toUpperCase();
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${location.name}: 0 guides`);
      emptyFilters.blueprints.locations.push(location);
    } else {
      console.log(`      ✅ ${location.name}: ${count} guides`);
    }
  }

  console.log('   Guide Types:');
  for (const type of BLUEPRINT_GUIDE_TYPES) {
    const matching = blueprints.filter(g => {
      const guideTypeValue = g.guide_type || '';
      const normalizedDbValue = slugify(guideTypeValue);
      const normalizedSelected = slugify(type.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${type.name}: 0 guides`);
      emptyFilters.blueprints.guideTypes.push(type);
    } else {
      console.log(`      ✅ ${type.name}: ${count} guides`);
    }
  }

  console.log('   Frameworks:');
  for (const framework of BLUEPRINT_FRAMEWORKS) {
    const matching = blueprints.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const guideType = (g.guide_type || '').toLowerCase();
      const title = (g.title || '').toLowerCase();
      const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
      const normalizedSelected = slugify(framework.id);
      return allText.includes(framework.id.toLowerCase()) ||
             allText.includes(normalizedSelected) ||
             (framework.id === 'devops' && allText.includes('devops')) ||
             (framework.id === 'dbp' && allText.includes('dbp')) ||
             (framework.id === 'dxp' && allText.includes('dxp')) ||
             (framework.id === 'dws' && allText.includes('dws')) ||
             (framework.id === 'products' && allText.includes('product')) ||
             (framework.id === 'projects' && allText.includes('project'));
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${framework.name}: 0 guides`);
      emptyFilters.blueprints.frameworks.push(framework);
    } else {
      console.log(`      ✅ ${framework.name}: ${count} guides`);
    }
  }

  // Check Testimonials filters
  console.log('\n📋 TESTIMONIALS FILTERS:');
  console.log('   Categories:');
  for (const category of TESTIMONIAL_CATEGORIES) {
    const matching = testimonials.filter(g => {
      const guideTypeValue = g.guide_type || '';
      const normalizedDbValue = slugify(guideTypeValue);
      const normalizedSelected = slugify(category.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    if (count === 0) {
      console.log(`      ❌ ${category.name}: 0 guides`);
      emptyFilters.testimonials.categories.push(category);
    } else {
      console.log(`      ✅ ${category.name}: ${count} guides`);
    }
  }

  // Summary
  console.log('\n📊 SUMMARY OF EMPTY FILTERS:\n');
  
  const totalEmpty = 
    emptyFilters.strategy.units.length + emptyFilters.strategy.locations.length + 
    emptyFilters.strategy.types.length + emptyFilters.strategy.frameworks.length +
    emptyFilters.guidelines.units.length + emptyFilters.guidelines.locations.length +
    emptyFilters.guidelines.guideTypes.length + emptyFilters.guidelines.categories.length +
    emptyFilters.blueprints.units.length + emptyFilters.blueprints.locations.length +
    emptyFilters.blueprints.guideTypes.length + emptyFilters.blueprints.frameworks.length +
    emptyFilters.testimonials.categories.length;

  if (totalEmpty === 0) {
    console.log('✅ All filters have at least one service!');
  } else {
    console.log(`⚠️  Found ${totalEmpty} empty filter options:\n`);
    
    if (emptyFilters.strategy.units.length > 0 || emptyFilters.strategy.locations.length > 0 || 
        emptyFilters.strategy.types.length > 0 || emptyFilters.strategy.frameworks.length > 0) {
      console.log('STRATEGY:');
      if (emptyFilters.strategy.units.length > 0) console.log(`   Units: ${emptyFilters.strategy.units.map(u => u.name).join(', ')}`);
      if (emptyFilters.strategy.locations.length > 0) console.log(`   Locations: ${emptyFilters.strategy.locations.map(l => l.name).join(', ')}`);
      if (emptyFilters.strategy.types.length > 0) console.log(`   Types: ${emptyFilters.strategy.types.map(t => t.name).join(', ')}`);
      if (emptyFilters.strategy.frameworks.length > 0) console.log(`   Frameworks: ${emptyFilters.strategy.frameworks.map(f => f.name).join(', ')}`);
    }

    if (emptyFilters.guidelines.units.length > 0 || emptyFilters.guidelines.locations.length > 0 || 
        emptyFilters.guidelines.guideTypes.length > 0 || emptyFilters.guidelines.categories.length > 0) {
      console.log('\nGUIDELINES:');
      if (emptyFilters.guidelines.units.length > 0) console.log(`   Units: ${emptyFilters.guidelines.units.map(u => u.name).join(', ')}`);
      if (emptyFilters.guidelines.locations.length > 0) console.log(`   Locations: ${emptyFilters.guidelines.locations.map(l => l.name).join(', ')}`);
      if (emptyFilters.guidelines.guideTypes.length > 0) console.log(`   Guide Types: ${emptyFilters.guidelines.guideTypes.map(t => t.name).join(', ')}`);
      if (emptyFilters.guidelines.categories.length > 0) console.log(`   Categories: ${emptyFilters.guidelines.categories.map(c => c.name).join(', ')}`);
    }

    if (emptyFilters.blueprints.units.length > 0 || emptyFilters.blueprints.locations.length > 0 || 
        emptyFilters.blueprints.guideTypes.length > 0 || emptyFilters.blueprints.frameworks.length > 0) {
      console.log('\nBLUEPRINTS:');
      if (emptyFilters.blueprints.units.length > 0) console.log(`   Units: ${emptyFilters.blueprints.units.map(u => u.name).join(', ')}`);
      if (emptyFilters.blueprints.locations.length > 0) console.log(`   Locations: ${emptyFilters.blueprints.locations.map(l => l.name).join(', ')}`);
      if (emptyFilters.blueprints.guideTypes.length > 0) console.log(`   Guide Types: ${emptyFilters.blueprints.guideTypes.map(t => t.name).join(', ')}`);
      if (emptyFilters.blueprints.frameworks.length > 0) console.log(`   Frameworks: ${emptyFilters.blueprints.frameworks.map(f => f.name).join(', ')}`);
    }

    if (emptyFilters.testimonials.categories.length > 0) {
      console.log('\nTESTIMONIALS:');
      console.log(`   Categories: ${emptyFilters.testimonials.categories.map(c => c.name).join(', ')}`);
    }
  }
}

checkAllFilters().catch(console.error);

