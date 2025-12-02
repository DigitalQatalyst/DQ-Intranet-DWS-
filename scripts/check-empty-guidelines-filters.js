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

const GUIDELINES_GUIDE_TYPES = [
  { id: 'best-practice', name: 'Best Practice' },
  { id: 'policy', name: 'Policy' },
  { id: 'process', name: 'Process' },
  { id: 'sop', name: 'SOP' }
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

const GUIDELINES_CATEGORIES = [
  { id: 'resources', name: 'Resources' },
  { id: 'policies', name: 'Policies' },
  { id: 'xds', name: 'xDS (Design Systems)' }
];

async function checkEmptyFilters() {
  console.log('🔍 Checking which Guidelines filters are empty...\n');

  // Fetch all Guidelines guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Guidelines only (exclude Strategy, Blueprint, Testimonial)
  const guidelines = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
    const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
    const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
    return !hasStrategy && !hasBlueprint && !hasTestimonial;
  });

  console.log(`📊 Total Guidelines guides: ${guidelines.length}\n`);

  // Check Guide Types
  console.log('📋 GUIDE TYPES:');
  const emptyGuideTypes = [];
  for (const type of GUIDELINES_GUIDE_TYPES) {
    const matching = guidelines.filter(g => {
      const guideTypeValue = g.guide_type || '';
      const normalizedDbValue = slugify(guideTypeValue);
      const normalizedSelected = slugify(type.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${type.name}: ${count} guides`);
    if (count === 0) {
      emptyGuideTypes.push(type);
    }
  }

  // Check Units
  console.log('\n📋 UNITS:');
  const emptyUnits = [];
  for (const unit of GUIDELINES_UNITS) {
    const matching = guidelines.filter(g => {
      const unitValue = g.unit || g.function_area || '';
      const normalizedDbValue = slugify(unitValue);
      const normalizedSelected = slugify(unit.id);
      return normalizedDbValue === normalizedSelected;
    });
    const count = matching.length;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${unit.name}: ${count} guides`);
    if (count === 0) {
      emptyUnits.push(unit);
    }
  }

  // Check Locations
  console.log('\n📋 LOCATIONS:');
  const emptyLocations = [];
  for (const location of GUIDELINES_LOCATIONS) {
    const matching = guidelines.filter(g => {
      const locationValue = (g.location || '').toUpperCase().trim();
      return locationValue === location.id.toUpperCase();
    });
    const count = matching.length;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${location.name}: ${count} guides`);
    if (count === 0) {
      emptyLocations.push(location);
    }
  }

  // Check Categories
  console.log('\n📋 CATEGORIES:');
  const emptyCategories = [];
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
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${category.name}: ${count} guides`);
    if (count === 0) {
      emptyCategories.push(category);
    }
  }

  // Summary
  console.log('\n📊 SUMMARY OF EMPTY FILTERS:');
  console.log(`  Empty Guide Types: ${emptyGuideTypes.length} - ${emptyGuideTypes.map(t => t.name).join(', ') || 'None'}`);
  console.log(`  Empty Units: ${emptyUnits.length} - ${emptyUnits.map(u => u.name).join(', ') || 'None'}`);
  console.log(`  Empty Locations: ${emptyLocations.length} - ${emptyLocations.map(l => l.name).join(', ') || 'None'}`);
  console.log(`  Empty Categories: ${emptyCategories.length} - ${emptyCategories.map(c => c.name).join(', ') || 'None'}`);

  return {
    emptyGuideTypes,
    emptyUnits,
    emptyLocations,
    emptyCategories
  };
}

checkEmptyFilters().catch(console.error);

