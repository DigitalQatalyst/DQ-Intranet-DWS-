import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const GHC_SLUGS = [
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
];

async function checkGHCGuides() {
  console.log('🔍 Checking GHC guides for duplicates and data issues...\n');

  // Fetch all GHC guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, slug, title, body, last_updated_at')
    .in('slug', GHC_SLUGS);

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('⚠️  No GHC guides found in database');
    return;
  }

  console.log(`📊 Found ${guides.length} GHC guide(s)\n`);

  // Check for duplicate slugs
  const slugCounts = {};
  guides.forEach(guide => {
    slugCounts[guide.slug] = (slugCounts[guide.slug] || 0) + 1;
  });

  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log('❌ DUPLICATE SLUGS FOUND:');
    duplicates.forEach(([slug, count]) => {
      console.log(`   - "${slug}": ${count} records`);
      const dupGuides = guides.filter(g => g.slug === slug);
      dupGuides.forEach(g => {
        console.log(`     • ID: ${g.id}, Title: ${g.title}`);
      });
    });
    console.log('');
  } else {
    console.log('✅ No duplicate slugs found\n');
  }

  // Check for missing slugs
  const foundSlugs = new Set(guides.map(g => g.slug));
  const missingSlugs = GHC_SLUGS.filter(slug => !foundSlugs.has(slug));
  if (missingSlugs.length > 0) {
    console.log('⚠️  MISSING SLUGS:');
    missingSlugs.forEach(slug => console.log(`   - ${slug}`));
    console.log('');
  }

  // Check for shared/identical body content
  console.log('🔍 Checking for shared body content...\n');
  const bodyMap = new Map();
  guides.forEach(guide => {
    const bodyHash = guide.body ? guide.body.substring(0, 100) : 'EMPTY';
    if (!bodyMap.has(bodyHash)) {
      bodyMap.set(bodyHash, []);
    }
    bodyMap.get(bodyHash).push(guide);
  });

  const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);
  if (sharedBodies.length > 0) {
    console.log('⚠️  SHARED BODY CONTENT DETECTED:');
    sharedBodies.forEach(([hash, guidesWithSameBody]) => {
      console.log(`\n   Content preview: "${hash.substring(0, 80)}..."`);
      console.log(`   Found in ${guidesWithSameBody.length} guide(s):`);
      guidesWithSameBody.forEach(g => {
        console.log(`     • ${g.slug} (${g.title}) - ID: ${g.id}`);
      });
    });
    console.log('');
  } else {
    console.log('✅ No shared body content detected\n');
  }

  // Display all GHC guides
  console.log('📋 All GHC Guides:');
  console.log('─'.repeat(80));
  guides.forEach(guide => {
    const bodyLength = guide.body ? guide.body.length : 0;
    const bodyPreview = guide.body ? guide.body.substring(0, 60).replace(/\n/g, ' ') : 'EMPTY';
    console.log(`\nSlug: ${guide.slug}`);
    console.log(`Title: ${guide.title}`);
    console.log(`ID: ${guide.id}`);
    console.log(`Body length: ${bodyLength} chars`);
    console.log(`Body preview: ${bodyPreview}...`);
    console.log(`Last updated: ${guide.last_updated_at || 'N/A'}`);
  });
  console.log('\n' + '─'.repeat(80));

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Total GHC guides: ${guides.length}`);
  console.log(`   Expected: ${GHC_SLUGS.length}`);
  console.log(`   Duplicate slugs: ${duplicates.length}`);
  console.log(`   Missing slugs: ${missingSlugs.length}`);
  console.log(`   Shared body content: ${sharedBodies.length} group(s)`);
}

checkGHCGuides().catch(console.error);
