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

// Excluded slugs from frontend (as per MarketplacePage.tsx)
const EXCLUDED_SLUGS = ['atp-guidelines', 'agile-working-guidelines', 'client-session-guidelines', 'dbp-support-guidelines'];

const GUIDE_LIST_SELECT = [
  'id',
  'slug',
  'title',
  'summary',
  'hero_image_url',
  'last_updated_at',
  'author_name',
  'author_org',
  'is_editors_pick',
  'download_count',
  'guide_type',
  'domain',
  'function_area',
  'unit',
  'sub_domain',
  'location',
  'status',
  'complexity_level',
].join(',');

async function listFrontendVisibleGuides() {
  console.log('📊 Listing guides visible on the frontend...\n');

  // Get all guides (excluding removed ones)
  let query = supabase
    .from('guides')
    .select(GUIDE_LIST_SELECT);

  EXCLUDED_SLUGS.forEach(slug => {
    query = query.neq('slug', slug);
  });

  const { data: allGuides, error } = await query.order('title', { ascending: true });

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!allGuides || allGuides.length === 0) {
    console.log('No guides found.');
    return;
  }

  console.log(`📚 Total Guides Visible on Frontend: ${allGuides.length}\n`);

  // Group by domain
  const byDomain = {};
  allGuides.forEach(guide => {
    const domain = guide.domain || 'Unknown';
    if (!byDomain[domain]) {
      byDomain[domain] = [];
    }
    byDomain[domain].push(guide);
  });

  // Display by domain
  Object.entries(byDomain)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([domain, guides]) => {
      console.log(`\n📁 ${domain.toUpperCase()} (${guides.length}):`);
      guides
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        .forEach(guide => {
          const status = guide.status || 'No Status';
          const subDomain = guide.sub_domain || 'No Sub-Domain';
          const guideType = guide.guide_type || 'No Type';
          console.log(`   ✓ ${guide.title}`);
          console.log(`     Slug: ${guide.slug}`);
          console.log(`     Status: ${status} | Sub-Domain: ${subDomain} | Type: ${guideType}`);
        });
    });

  // Summary by tab (as they appear in the frontend)
  console.log('\n\n📊 SUMMARY BY FRONTEND TAB:\n');

  // Strategy tab
  const strategyGuides = allGuides.filter(g => 
    (g.domain || '').toLowerCase() === 'strategy' || 
    (g.domain || '').toLowerCase() === 'strategy'
  );
  console.log(`🎯 Strategy Tab: ${strategyGuides.length} guides`);
  strategyGuides.forEach(g => console.log(`   - ${g.title}`));

  // Guidelines tab
  const guidelinesGuides = allGuides.filter(g => 
    (g.domain || '').toLowerCase() === 'guidelines'
  );
  console.log(`\n📋 Guidelines Tab: ${guidelinesGuides.length} guides`);
  guidelinesGuides.forEach(g => console.log(`   - ${g.title}`));

  // Blueprints tab
  const blueprintsGuides = allGuides.filter(g => 
    (g.domain || '').toLowerCase() === 'blueprints'
  );
  console.log(`\n📐 Blueprints Tab: ${blueprintsGuides.length} guides`);
  blueprintsGuides.forEach(g => console.log(`   - ${g.title}`));

  // Other domains
  const otherGuides = allGuides.filter(g => {
    const domain = (g.domain || '').toLowerCase();
    return domain !== 'strategy' && domain !== 'guidelines' && domain !== 'blueprints';
  });
  if (otherGuides.length > 0) {
    console.log(`\n❓ Other Domains: ${otherGuides.length} guides`);
    otherGuides.forEach(g => console.log(`   - ${g.title} (${g.domain})`));
  }

  // Status breakdown
  console.log('\n\n📊 STATUS BREAKDOWN:\n');
  const byStatus = {};
  allGuides.forEach(guide => {
    const status = guide.status || 'No Status';
    if (!byStatus[status]) {
      byStatus[status] = [];
    }
    byStatus[status].push(guide);
  });

  Object.entries(byStatus)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([status, guides]) => {
      console.log(`   ${status}: ${guides.length}`);
    });
}

listFrontendVisibleGuides().catch(console.error);


