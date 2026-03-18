import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update guides to categorize them under "journey" or "history" sub_domain
 * 
 * Journey: Vision and Mission related guides
 * History: Guides about where DQ began, DQ origin, DQ history
 */
// Helper function to fetch guides by slug
async function fetchGuidesBySlug(slugs) {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title, sub_domain, domain')
    .in('slug', slugs);

  if (error) {
    console.error('Error fetching by slug:', error);
    return [];
  }
  return data || [];
}

// Helper function to fetch guides by title keywords
async function fetchGuidesByTitle(keywords) {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title, sub_domain, domain')
    .or(keywords.map(title => `title.ilike.%${title}%`).join(','));

  if (error) {
    console.error('Error fetching by title:', error);
    return [];
  }
  return data || [];
}

// Helper function to fetch guides by keywords in title and summary
async function fetchGuidesByKeywords(keywords) {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title, sub_domain, domain, summary')
    .or(keywords.map(keyword =>
      `title.ilike.%${keyword}%,summary.ilike.%${keyword}%`
    ).join(','));

  if (error) {
    console.error('Error fetching by keywords:', error);
    return [];
  }
  return data || [];
}

// Helper function to fetch guides by slug pattern
async function fetchGuidesBySlugPattern(pattern) {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title, sub_domain, domain')
    .ilike('slug', pattern);

  if (error) {
    console.error('Error fetching by slug pattern:', error);
    return [];
  }
  return data || [];
}

// Helper function to deduplicate guides by ID
function deduplicateGuides(guides) {
  return guides.filter((guide, index, self) =>
    index === self.findIndex(g => g.id === guide.id)
  );
}

// Helper function to update guide sub_domain
async function updateGuideSubDomain(guide, newSubDomain) {
  const { error } = await supabase
    .from('guides')
    .update({ sub_domain: newSubDomain })
    .eq('id', guide.id);

  if (error) {
    console.error(`   ❌ Failed to update ${guide.title}:`, error);
    return false;
  } else {
    console.log(`   ✅ Updated ${guide.title}: sub_domain = "${newSubDomain}"`);
    return true;
  }
}

// Helper function to process guides for a specific sub_domain
async function processGuidesForSubDomain(guides, subDomainName) {
  let updatedCount = 0;

  for (const guide of guides) {
    const currentSubDomain = guide.sub_domain || '';
    const subDomains = currentSubDomain.split(',').map(s => s.trim()).filter(Boolean);

    if (subDomains.includes(subDomainName)) {
      console.log(`   ⏭️  ${guide.title} already has "${subDomainName}" in sub_domain`);
    } else {
      subDomains.push(subDomainName);
      const newSubDomain = subDomains.join(',');

      const success = await updateGuideSubDomain(guide, newSubDomain);
      if (success) updatedCount++;
    }
  }

  return updatedCount;
}

/**
 * Update guides to categorize them under "journey" or "history" sub_domain
 *
 * Journey: Vision and Mission related guides
 * History: Guides about where DQ began, DQ origin, DQ history
 */
async function updateStrategySubdomains() {
  console.log('🔍 Searching for guides to categorize...\n');

  try {
    // 1. Find Vision and Mission guides - categorize as "journey"
    console.log('📋 Step 1: Finding Vision & Mission guides for "journey" category...');

    const visionMissionSlugs = [
      'dq-vision-and-mission', 'dq-vision-mission', 'dq-vision',
      'dq-mission', 'vision-and-mission', 'vision-mission'
    ];
    const visionMissionTitles = ['vision', 'mission', 'dq vision', 'dq mission'];

    const guidesBySlug = await fetchGuidesBySlug(visionMissionSlugs);
    const guidesByTitle = await fetchGuidesByTitle(visionMissionTitles);
    const allVisionMissionGuides = deduplicateGuides([...guidesBySlug, ...guidesByTitle]);

    console.log(`   Found ${allVisionMissionGuides.length} Vision/Mission guide(s):`);
    allVisionMissionGuides.forEach(guide => {
      console.log(`   - ${guide.title} (${guide.slug})`);
    });

    const journeyUpdatedCount = await processGuidesForSubDomain(allVisionMissionGuides, 'journey');

    // 2. Find History guides - categorize as "history"
    console.log('\n📋 Step 2: Finding History guides for "history" category...');

    const historyKeywords = [
      'where dq began', 'dq began', 'dq origin', 'dq history', 'dq founding',
      'dq started', 'dq beginning', 'how dq started', 'dq story', 'dq evolution'
    ];

    const historyGuides = await fetchGuidesByKeywords(historyKeywords);
    const historyBySlug = await fetchGuidesBySlugPattern('%history%');
    const allHistoryGuides = deduplicateGuides([...historyGuides, ...historyBySlug]);

    console.log(`   Found ${allHistoryGuides.length} History guide(s):`);
    allHistoryGuides.forEach(guide => {
      console.log(`   - ${guide.title} (${guide.slug})`);
    });

    const historyUpdatedCount = await processGuidesForSubDomain(allHistoryGuides, 'history');

    console.log('\n✅ Update complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Vision/Mission guides updated: ${journeyUpdatedCount}`);
    console.log(`   - History guides updated: ${historyUpdatedCount}`);

  } catch (error) {
    console.error('❌ Error updating guides:', error);
    process.exit(1);
  }
}

// Run the update
await updateStrategySubdomains();

