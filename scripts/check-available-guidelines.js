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

// Excluded slugs from frontend
const EXCLUDED_SLUGS = ['atp-guidelines', 'agile-working-guidelines', 'client-session-guidelines', 'dbp-support-guidelines'];

async function checkAvailableGuidelines() {
  console.log('📋 Checking all guidelines in database...\n');

  // Get ALL guides (including drafts)
  let query = supabase
    .from('guides')
    .select('id, slug, title, summary, domain, sub_domain, guide_type, status')
    .order('title', { ascending: true });

  EXCLUDED_SLUGS.forEach(slug => {
    query = query.neq('slug', slug);
  });

  const { data: allGuides, error } = await query;

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!allGuides || allGuides.length === 0) {
    console.log('No guides found.');
    return;
  }

  // Separate by domain
  const guidelinesDomain = allGuides.filter(g => 
    (g.domain || '').toLowerCase() === 'guidelines'
  );

  const otherDomains = allGuides.filter(g => 
    (g.domain || '').toLowerCase() !== 'guidelines'
  );

  console.log(`\n📚 GUIDELINES DOMAIN (${guidelinesDomain.length}):`);
  console.log('='.repeat(60));
  
  guidelinesDomain.forEach(guide => {
    const status = guide.status || 'No Status';
    const subDomain = guide.sub_domain || 'No Sub-Domain';
    const guideType = guide.guide_type || 'No Type';
    const statusIcon = status === 'Approved' ? '✅' : '📝';
    console.log(`${statusIcon} ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`   Status: ${status} | Sub-Domain: ${subDomain} | Type: ${guideType}`);
    console.log('');
  });

  // Show other domains that might be candidates
  console.log(`\n📊 OTHER DOMAINS (${otherDomains.length}):`);
  console.log('='.repeat(60));
  
  const byDomain = {};
  otherDomains.forEach(guide => {
    const domain = guide.domain || 'Unknown';
    if (!byDomain[domain]) {
      byDomain[domain] = [];
    }
    byDomain[domain].push(guide);
  });

  Object.entries(byDomain)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([domain, guides]) => {
      console.log(`\n${domain.toUpperCase()} (${guides.length}):`);
      guides.forEach(guide => {
        const status = guide.status || 'No Status';
        const statusIcon = status === 'Approved' ? '✅' : '📝';
        console.log(`   ${statusIcon} ${guide.title} (${guide.slug})`);
      });
    });

  // Summary
  console.log('\n\n📊 SUMMARY:');
  console.log('='.repeat(60));
  console.log(`Total Guidelines Domain: ${guidelinesDomain.length}`);
  console.log(`   - Approved: ${guidelinesDomain.filter(g => g.status === 'Approved').length}`);
  console.log(`   - Draft: ${guidelinesDomain.filter(g => g.status === 'Draft').length}`);
  console.log(`\nCurrently showing on Guidelines tab: ${guidelinesDomain.filter(g => g.status === 'Approved').length}`);
  console.log(`\nPotential to add (if approved): ${guidelinesDomain.filter(g => g.status === 'Draft').length} draft guidelines`);
}

checkAvailableGuidelines().catch(console.error);


