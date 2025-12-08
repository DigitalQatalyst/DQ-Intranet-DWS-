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

// Helper function to slugify
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Strategy filter options
const STRATEGY_TYPES = ['journey', 'history', 'initiatives', 'cases', 'references'];
const STRATEGY_FRAMEWORKS = ['ghc', '6xd', 'clients', 'ghc-leader', 'testimonials-insights'];

// Guidelines filter options
const GUIDELINES_CATEGORIES = ['resources', 'policies', 'xds'];

// Blueprints filter options
const BLUEPRINT_FRAMEWORKS = ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'];

async function checkFilterCoverage() {
  console.log('🔍 Checking filter coverage...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, domain, guide_type, sub_domain, unit, function_area, location, status')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log(`📊 Total approved guides: ${guides.length}\n`);

  // Categorize guides
  const strategyGuides = guides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  const guidelinesGuides = guides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  const blueprintGuides = guides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('blueprint') || guideType.includes('blueprint');
  });

  console.log(`📈 Strategy guides: ${strategyGuides.length}`);
  console.log(`📈 Guidelines guides: ${guidelinesGuides.length}`);
  console.log(`📈 Blueprint guides: ${blueprintGuides.length}\n`);

  // Check Strategy Type coverage
  console.log('🎯 STRATEGY TYPE FILTER COVERAGE:');
  const strategyTypeCoverage = {};
  const strategyTypeMatches = {};
  STRATEGY_TYPES.forEach(type => {
    const matching = strategyGuides.filter(g => {
      const subDomain = slugify(g.sub_domain || '');
      const domain = slugify(g.domain || '');
      const guideType = slugify(g.guide_type || '');
      const title = slugify(g.title || '');
      const allText = `${subDomain} ${domain} ${guideType} ${title}`;
      return allText.includes(type) || subDomain === type || subDomain.includes(type);
    });
    strategyTypeCoverage[type] = matching.length;
    strategyTypeMatches[type] = matching;
    console.log(`  ${type}: ${matching.length} guides`);
    if (matching.length === 0) {
      console.log(`    ⚠️  No guides found - needs assignment`);
    }
  });

  // Check Strategy Framework coverage
  console.log('\n🎯 STRATEGY FRAMEWORK FILTER COVERAGE:');
  const strategyFrameworkCoverage = {};
  const strategyFrameworkMatches = {};
  STRATEGY_FRAMEWORKS.forEach(framework => {
    const matching = strategyGuides.filter(g => {
      const subDomain = slugify(g.sub_domain || '');
      const domain = slugify(g.domain || '');
      const guideType = slugify(g.guide_type || '');
      const title = slugify(g.title || '');
      const allText = `${subDomain} ${domain} ${guideType} ${title}`;
      return allText.includes(framework) || 
             (framework === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (framework === 'ghc' && allText.includes('ghc')) ||
             (framework === 'clients' && allText.includes('client')) ||
             (framework === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (framework === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
    strategyFrameworkCoverage[framework] = matching.length;
    strategyFrameworkMatches[framework] = matching;
    console.log(`  ${framework}: ${matching.length} guides`);
    if (matching.length === 0) {
      console.log(`    ⚠️  No guides found - needs assignment`);
    }
  });

  // Check Guidelines Category coverage
  console.log('\n🎯 GUIDELINES CATEGORY FILTER COVERAGE:');
  const guidelinesCategoryCoverage = {};
  const guidelinesCategoryMatches = {};
  GUIDELINES_CATEGORIES.forEach(category => {
    const matching = guidelinesGuides.filter(g => {
      const subDomain = slugify(g.sub_domain || '');
      const domain = slugify(g.domain || '');
      const guideType = slugify(g.guide_type || '');
      const title = slugify(g.title || '');
      const allText = `${subDomain} ${domain} ${guideType} ${title}`;
      return allText.includes(category) ||
             (category === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
             (category === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
             (category === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
    });
    guidelinesCategoryCoverage[category] = matching.length;
    guidelinesCategoryMatches[category] = matching;
    console.log(`  ${category}: ${matching.length} guides`);
    if (matching.length === 0) {
      console.log(`    ⚠️  No guides found - needs assignment`);
    }
  });

  // Check Blueprint Framework coverage
  console.log('\n🎯 BLUEPRINT FRAMEWORK FILTER COVERAGE:');
  const blueprintFrameworkCoverage = {};
  const blueprintFrameworkMatches = {};
  BLUEPRINT_FRAMEWORKS.forEach(framework => {
    const matching = blueprintGuides.filter(g => {
      const subDomain = slugify(g.sub_domain || '');
      const domain = slugify(g.domain || '');
      const guideType = slugify(g.guide_type || '');
      const title = slugify(g.title || '');
      const allText = `${subDomain} ${domain} ${guideType} ${title}`;
      return allText.includes(framework) ||
             (framework === 'devops' && allText.includes('devops')) ||
             (framework === 'dbp' && allText.includes('dbp')) ||
             (framework === 'dxp' && allText.includes('dxp')) ||
             (framework === 'dws' && allText.includes('dws')) ||
             (framework === 'products' && allText.includes('product')) ||
             (framework === 'projects' && allText.includes('project'));
    });
    blueprintFrameworkCoverage[framework] = matching.length;
    blueprintFrameworkMatches[framework] = matching;
    console.log(`  ${framework}: ${matching.length} guides`);
    if (matching.length === 0) {
      console.log(`    ⚠️  No guides found - needs assignment`);
    }
  });

  // Return coverage data for assignment
  return {
    strategyGuides,
    guidelinesGuides,
    blueprintGuides,
    strategyTypeCoverage,
    strategyTypeMatches,
    strategyFrameworkCoverage,
    strategyFrameworkMatches,
    guidelinesCategoryCoverage,
    guidelinesCategoryMatches,
    blueprintFrameworkCoverage,
    blueprintFrameworkMatches
  };
}

async function assignGuidesToFilters() {
  console.log('\n🔄 Assigning guides to empty filter options...\n');

  const coverage = await checkFilterCoverage();

  const updates = [];
  const usedGuideIds = new Set();

  // Helper to find an unused guide
  function findUnusedGuide(guideList, excludeIds = []) {
    return guideList.find(g => !usedGuideIds.has(g.id) && !excludeIds.includes(g.id));
  }

  // Assign Strategy Type filters
  STRATEGY_TYPES.forEach(type => {
    if (coverage.strategyTypeCoverage[type] === 0) {
      const availableGuide = findUnusedGuide(coverage.strategyGuides);
      if (availableGuide) {
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: typeName,
          filter: `Strategy Type: ${type}`
        });
        usedGuideIds.add(availableGuide.id);
      }
    }
  });

  // Assign Strategy Framework filters
  STRATEGY_FRAMEWORKS.forEach(framework => {
    if (coverage.strategyFrameworkCoverage[framework] === 0) {
      const availableGuide = findUnusedGuide(coverage.strategyGuides);
      if (availableGuide) {
        const frameworkName = framework === '6xd' ? '6xD' : 
                             framework === 'ghc-leader' ? 'GHC Leader' :
                             framework === 'testimonials-insights' ? 'Testimonials/Insights' :
                             framework.charAt(0).toUpperCase() + framework.slice(1).replace(/-/g, ' ');
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: frameworkName,
          filter: `Strategy Framework: ${framework}`
        });
        usedGuideIds.add(availableGuide.id);
      }
    }
  });

  // Assign Guidelines Category filters
  GUIDELINES_CATEGORIES.forEach(category => {
    if (coverage.guidelinesCategoryCoverage[category] === 0) {
      const availableGuide = findUnusedGuide(coverage.guidelinesGuides);
      if (availableGuide) {
        const categoryName = category === 'xds' ? 'xDS' : 
                           category.charAt(0).toUpperCase() + category.slice(1);
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: categoryName,
          filter: `Guidelines Category: ${category}`
        });
        usedGuideIds.add(availableGuide.id);
      }
    }
  });

  // Assign Blueprint Framework filters
  BLUEPRINT_FRAMEWORKS.forEach(framework => {
    if (coverage.blueprintFrameworkCoverage[framework] === 0) {
      const availableGuide = findUnusedGuide(coverage.blueprintGuides);
      if (availableGuide) {
        const frameworkName = framework.toUpperCase(); // DBP, DXP, DWS, etc.
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: frameworkName,
          filter: `Blueprint Framework: ${framework}`
        });
        usedGuideIds.add(availableGuide.id);
      }
    }
  });

  if (updates.length === 0) {
    console.log('✅ All filter options already have guides assigned!');
    return;
  }

  console.log(`📝 Found ${updates.length} guides to update:\n`);
  updates.forEach(update => {
    console.log(`  - ${update.title}`);
    console.log(`    Filter: ${update.filter}`);
    console.log(`    New sub_domain: ${update.sub_domain}\n`);
  });

  // Apply updates
  console.log('💾 Applying updates...\n');
  for (const update of updates) {
    const { error } = await supabase
      .from('guides')
      .update({ sub_domain: update.sub_domain })
      .eq('id', update.id);

    if (error) {
      console.error(`❌ Error updating guide ${update.id} (${update.title}):`, error);
    } else {
      console.log(`✅ Updated: ${update.title} -> ${update.filter}`);
    }
  }

  console.log('\n✅ Assignment complete!');
  console.log('\n🔍 Re-checking coverage...\n');
  await checkFilterCoverage();
}

// Run the script
assignGuidesToFilters().catch(console.error);


