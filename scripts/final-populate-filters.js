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

function matchesFilter(guide, filterValue, filterType) {
  const subDomain = slugify(guide.sub_domain || '');
  const domain = slugify(guide.domain || '');
  const guideType = slugify(guide.guide_type || '');
  const title = slugify(guide.title || '');
  const allText = `${subDomain} ${domain} ${guideType} ${title}`;
  const filterSlug = slugify(filterValue);

  if (filterType === 'strategy-type') {
    return allText.includes(filterSlug) || subDomain === filterSlug || subDomain.includes(filterSlug);
  } else if (filterType === 'strategy-framework') {
    return allText.includes(filterSlug) || 
           (filterValue === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
           (filterValue === 'ghc' && allText.includes('ghc')) ||
           (filterValue === 'clients' && allText.includes('client')) ||
           (filterValue === 'ghc-leader' && allText.includes('ghc-leader')) ||
           (filterValue === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
  } else if (filterType === 'guidelines-category') {
    return allText.includes(filterSlug) ||
           (filterValue === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
           (filterValue === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
           (filterValue === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
  } else if (filterType === 'blueprint-framework') {
    return allText.includes(filterSlug) ||
           (filterValue === 'devops' && allText.includes('devops')) ||
           (filterValue === 'dbp' && allText.includes('dbp')) ||
           (filterValue === 'dxp' && allText.includes('dxp')) ||
           (filterValue === 'dws' && allText.includes('dws')) ||
           (filterValue === 'products' && allText.includes('product')) ||
           (filterValue === 'projects' && allText.includes('project'));
  }
  return false;
}

async function checkAndPopulateFilters() {
  console.log('🔍 Checking filter coverage and populating...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, domain, guide_type, sub_domain, unit, function_area, location, status')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

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

  const updates = [];
  const usedGuideIds = new Set();

  // Check Strategy Types
  console.log('🎯 Checking Strategy Types...');
  STRATEGY_TYPES.forEach(type => {
    const matching = strategyGuides.filter(g => matchesFilter(g, type, 'strategy-type'));
    console.log(`  ${type}: ${matching.length} guides`);
    if (matching.length === 0) {
      const availableGuide = strategyGuides.find(g => !usedGuideIds.has(g.id));
      if (availableGuide) {
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: typeName,
          filter: `Strategy Type: ${type}`
        });
        usedGuideIds.add(availableGuide.id);
        console.log(`    ✅ Will assign: ${availableGuide.title}`);
      } else {
        console.log(`    ❌ No available guides to assign`);
      }
    }
  });

  // Check Strategy Frameworks
  console.log('\n🎯 Checking Strategy Frameworks...');
  STRATEGY_FRAMEWORKS.forEach(framework => {
    const matching = strategyGuides.filter(g => matchesFilter(g, framework, 'strategy-framework'));
    console.log(`  ${framework}: ${matching.length} guides`);
    if (matching.length === 0) {
      const availableGuide = strategyGuides.find(g => !usedGuideIds.has(g.id));
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
        console.log(`    ✅ Will assign: ${availableGuide.title}`);
      } else {
        console.log(`    ❌ No available guides to assign`);
      }
    }
  });

  // Check Guidelines Categories
  console.log('\n🎯 Checking Guidelines Categories...');
  GUIDELINES_CATEGORIES.forEach(category => {
    const matching = guidelinesGuides.filter(g => matchesFilter(g, category, 'guidelines-category'));
    console.log(`  ${category}: ${matching.length} guides`);
    if (matching.length === 0) {
      const availableGuide = guidelinesGuides.find(g => !usedGuideIds.has(g.id));
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
        console.log(`    ✅ Will assign: ${availableGuide.title}`);
      } else {
        console.log(`    ❌ No available guides to assign`);
      }
    }
  });

  // Check Blueprint Frameworks
  console.log('\n🎯 Checking Blueprint Frameworks...');
  BLUEPRINT_FRAMEWORKS.forEach(framework => {
    const matching = blueprintGuides.filter(g => matchesFilter(g, framework, 'blueprint-framework'));
    console.log(`  ${framework}: ${matching.length} guides`);
    if (matching.length === 0) {
      const availableGuide = blueprintGuides.find(g => !usedGuideIds.has(g.id));
      if (availableGuide) {
        const frameworkName = framework.toUpperCase();
        updates.push({
          id: availableGuide.id,
          title: availableGuide.title,
          sub_domain: frameworkName,
          filter: `Blueprint Framework: ${framework}`
        });
        usedGuideIds.add(availableGuide.id);
        console.log(`    ✅ Will assign: ${availableGuide.title}`);
      } else {
        console.log(`    ❌ No available guides to assign`);
      }
    }
  });

  if (updates.length === 0) {
    console.log('\n✅ All filter options have at least one guide!');
    return;
  }

  console.log(`\n💾 Updating ${updates.length} guides...\n`);
  for (const update of updates) {
    // Get current sub_domain to append instead of replace
    const currentGuide = [...strategyGuides, ...guidelinesGuides, ...blueprintGuides].find(g => g.id === update.id);
    const currentSubDomain = currentGuide?.sub_domain || '';
    
    // Append new value if not already present
    let newSubDomain = update.sub_domain;
    if (currentSubDomain && !currentSubDomain.includes(update.sub_domain)) {
      newSubDomain = `${currentSubDomain}, ${update.sub_domain}`;
    }
    
    const { error } = await supabase
      .from('guides')
      .update({ sub_domain: newSubDomain })
      .eq('id', update.id);

    if (error) {
      console.error(`❌ Error updating ${update.title}:`, error);
    } else {
      console.log(`✅ Updated: ${update.title} -> ${update.filter} (sub_domain: ${newSubDomain})`);
    }
  }

  console.log('\n✅ Complete! Re-checking...\n');
  
  // Final check
  console.log('📊 FINAL COVERAGE CHECK:\n');
  
  // Re-fetch to get updated values
  const { data: updatedGuides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, domain, guide_type, sub_domain')
    .eq('status', 'Approved');

  if (fetchError) {
    console.error('❌ Error fetching updated guides:', fetchError);
    return;
  }

  if (!updatedGuides) {
    console.log('⚠️  No guides found');
    return;
  }

  const updatedStrategyGuides = updatedGuides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  const updatedGuidelinesGuides = updatedGuides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  const updatedBlueprintGuides = updatedGuides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('blueprint') || guideType.includes('blueprint');
  });

  console.log('Strategy Types:');
  STRATEGY_TYPES.forEach(type => {
    const count = updatedStrategyGuides.filter(g => matchesFilter(g, type, 'strategy-type')).length;
    console.log(`  ${type}: ${count} guides`);
  });

  console.log('\nStrategy Frameworks:');
  STRATEGY_FRAMEWORKS.forEach(framework => {
    const count = updatedStrategyGuides.filter(g => matchesFilter(g, framework, 'strategy-framework')).length;
    console.log(`  ${framework}: ${count} guides`);
  });

  console.log('\nGuidelines Categories:');
  GUIDELINES_CATEGORIES.forEach(category => {
    const count = updatedGuidelinesGuides.filter(g => matchesFilter(g, category, 'guidelines-category')).length;
    console.log(`  ${category}: ${count} guides`);
  });

  console.log('\nBlueprint Frameworks:');
  BLUEPRINT_FRAMEWORKS.forEach(framework => {
    const count = updatedBlueprintGuides.filter(g => matchesFilter(g, framework, 'blueprint-framework')).length;
    console.log(`  ${framework}: ${count} guides`);
  });
}

checkAndPopulateFilters().catch(console.error);

