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

const PAGE_SIZE = 9;

// All filter definitions
const STRATEGY_FRAMEWORKS = [
  { id: 'ghc', name: 'GHC' },
  { id: '6xd', name: '6xD (Digital Framework)' },
  { id: 'clients', name: 'Clients' },
  { id: 'ghc-leader', name: 'GHC Leader' },
  { id: 'testimonials-insights', name: 'Testimonials/Insights' }
];

const BLUEPRINT_FRAMEWORKS = [
  { id: 'devops', name: 'DevOps' },
  { id: 'dbp', name: 'DBP' },
  { id: 'dxp', name: 'DXP' },
  { id: 'dws', name: 'DWS' },
  { id: 'products', name: 'Products' },
  { id: 'projects', name: 'Projects' }
];

const LOCATIONS = ['DXB', 'KSA', 'NBO'];

async function checkAllFilters() {
  console.log('🔍 Checking all filters to ensure services appear on page 1...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, sub_domain, domain, last_updated_at, download_count, is_editors_pick')
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

  const issues = [];

  // Check Strategy Framework filters
  console.log('📋 Checking Strategy Framework filters...\n');
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

    if (matching.length > 0) {
      // Check if they're all in the same location
      const locations = [...new Set(matching.map(g => g.location).filter(Boolean))];
      
      // If all are in one location, check if that location has guides on page 1
      if (locations.length === 1 && matching.length <= PAGE_SIZE) {
        // All guides are in one location - this is fine if they fit on page 1
        if (matching.length > PAGE_SIZE) {
          issues.push({
            feature: 'Strategy',
            filter: `Framework: ${framework.name}`,
            problem: `${matching.length} guides but only ${PAGE_SIZE} fit on page 1`,
            guides: matching.map(g => ({ title: g.title, location: g.location }))
          });
        }
      } else if (locations.length > 1) {
        // Guides are in multiple locations - need to ensure at least one is in each major location
        const locationCounts = {};
        locations.forEach(loc => {
          locationCounts[loc] = matching.filter(g => g.location === loc).length;
        });
        
        // Check if DXB has guides (most common default)
        if (!locationCounts['DXB'] || locationCounts['DXB'] === 0) {
          issues.push({
            feature: 'Strategy',
            filter: `Framework: ${framework.name}`,
            problem: 'No guides in DXB location',
            guides: matching.map(g => ({ title: g.title, location: g.location }))
          });
        }
      }
    }
  }

  // Check Blueprint Framework filters
  console.log('📋 Checking Blueprint Framework filters...\n');
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

    if (matching.length > 0) {
      const locations = [...new Set(matching.map(g => g.location).filter(Boolean))];
      
      if (matching.length > 0) {
        const locationCounts = {};
        locations.forEach(loc => {
          locationCounts[loc] = matching.filter(g => g.location === loc).length;
        });
        
        if (locations.length === 1 && matching.length > PAGE_SIZE) {
          issues.push({
            feature: 'Blueprints',
            filter: `Framework: ${framework.name}`,
            problem: `${matching.length} guides but only ${PAGE_SIZE} fit on page 1`,
            guides: matching.map(g => ({ title: g.title, location: g.location }))
          });
        } else if (locations.length > 1 && (!locationCounts['DXB'] || locationCounts['DXB'] === 0)) {
          issues.push({
            feature: 'Blueprints',
            filter: `Framework: ${framework.name}`,
            problem: 'No guides in DXB location',
            guides: matching.map(g => ({ title: g.title, location: g.location }))
          });
        }
      }
    }
  }

  // Summary
  console.log('\n📊 SUMMARY:\n');
  if (issues.length === 0) {
    console.log('✅ All filters have services that appear on page 1!');
  } else {
    console.log(`⚠️  Found ${issues.length} potential issues:\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.feature} - ${issue.filter}`);
      console.log(`   Problem: ${issue.problem}`);
      console.log(`   Affected guides: ${issue.guides.length}`);
      issue.guides.slice(0, 3).forEach(g => {
        console.log(`     - ${g.title} (${g.location || 'N/A'})`);
      });
      if (issue.guides.length > 3) {
        console.log(`     ... and ${issue.guides.length - 3} more`);
      }
      console.log('');
    });
  }

  return issues;
}

checkAllFilters().catch(console.error);

