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

async function listGuidelinesTabGuides() {
  console.log('📋 Listing guides visible on the Guidelines tab...\n');

  // According to MarketplacePage.tsx line 658-667:
  // For Guidelines tab: if domain filter is set, use it; otherwise fetch all and filter client-side
  // Client-side filtering will exclude Strategy/Blueprint/Testimonial guides
  // Default status filter: Approved (line 650)

  // Get all approved guides (excluding removed ones)
  let query = supabase
    .from('guides')
    .select('id, slug, title, summary, domain, sub_domain, guide_type, status')
    .eq('status', 'Approved');

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

  // Filter for Guidelines tab: exclude Strategy, Blueprint, and Testimonial domains
  // Based on MarketplacePage.tsx logic: client-side filtering excludes Strategy/Blueprint/Testimonial
  const guidelinesTabGuides = allGuides.filter(guide => {
    const domain = (guide.domain || '').toLowerCase();
    const guideType = (guide.guide_type || '').toLowerCase();
    
    // Exclude Strategy, Blueprint, and Testimonial
    if (domain.includes('strategy') || domain.includes('blueprint') || domain.includes('testimonial')) {
      return false;
    }
    if (guideType.includes('strategy') || guideType.includes('blueprint') || guideType.includes('testimonial')) {
      return false;
    }
    
    // Include guides with domain = 'guidelines' or no domain
    return domain === 'guidelines' || domain === '' || !domain;
  });

  console.log(`📚 Total Guides on Guidelines Tab: ${guidelinesTabGuides.length}\n`);

  // Group by sub_domain
  const bySubDomain = {};
  guidelinesTabGuides.forEach(guide => {
    const subDomain = guide.sub_domain || 'No Sub-Domain';
    if (!bySubDomain[subDomain]) {
      bySubDomain[subDomain] = [];
    }
    bySubDomain[subDomain].push(guide);
  });

  // Display by sub_domain
  Object.entries(bySubDomain)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([subDomain, guides]) => {
      console.log(`\n📁 ${subDomain} (${guides.length}):`);
      guides
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        .forEach(guide => {
          const guideType = guide.guide_type || 'No Type';
          console.log(`   ✓ ${guide.title}`);
          console.log(`     Slug: ${guide.slug} | Type: ${guideType}`);
        });
    });

  // List all guides
  console.log('\n\n📋 ALL GUIDELINES TAB GUIDES:\n');
  guidelinesTabGuides.forEach((guide, index) => {
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`   Domain: ${guide.domain || 'None'} | Sub-Domain: ${guide.sub_domain || 'None'} | Type: ${guide.guide_type || 'None'}`);
    if (guide.summary) {
      const summary = guide.summary.length > 100 ? guide.summary.substring(0, 100) + '...' : guide.summary;
      console.log(`   Summary: ${summary}`);
    }
    console.log('');
  });
}

listGuidelinesTabGuides().catch(console.error);


