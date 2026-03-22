import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please ensure .env file has:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  VITE_SUPABASE_ANON_KEY=...');
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

async function inspectGHCGuides() {
  console.log('🔍 Inspecting GHC Guides in Supabase Database...\n');
  console.log('='.repeat(80));

  // Fetch all GHC guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, slug, title, body, summary, hero_image_url, last_updated_at, status, domain, guide_type')
    .in('slug', GHC_SLUGS)
    .order('slug');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('⚠️  No GHC guides found in database!');
    console.log('\nExpected slugs:', GHC_SLUGS.join(', '));
    return;
  }

  console.log(`\n📊 Found ${guides.length} GHC guide(s) in database\n`);

  // Check for duplicates
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
    console.log('⚠️  MISSING SLUGS (not found in database):');
    missingSlugs.forEach(slug => console.log(`   - ${slug}`));
    console.log('');
  }

  // Display detailed information for each guide
  console.log('\n📋 DETAILED GUIDE INFORMATION:');
  console.log('='.repeat(80));
  
  guides.forEach((guide, index) => {
    console.log(`\n${index + 1}. ${guide.slug.toUpperCase()}`);
    console.log('─'.repeat(80));
    console.log(`   ID:          ${guide.id}`);
    console.log(`   Title:       ${guide.title || '(no title)'}`);
    console.log(`   Status:      ${guide.status || 'N/A'}`);
    console.log(`   Domain:      ${guide.domain || 'N/A'}`);
    console.log(`   Guide Type:  ${guide.guide_type || 'N/A'}`);
    console.log(`   Last Updated: ${guide.last_updated_at || 'N/A'}`);
    console.log(`   Hero Image:  ${guide.hero_image_url ? 'Yes' : 'No'}`);
    
    // Body content analysis
    const bodyLength = guide.body ? guide.body.length : 0;
    const bodyPreview = guide.body 
      ? guide.body.substring(0, 100).replace(/\n/g, ' ').trim()
      : 'EMPTY';
    
    console.log(`   Body Length: ${bodyLength} characters`);
    console.log(`   Body Preview: ${bodyPreview}${bodyLength > 100 ? '...' : ''}`);
    
    // Summary
    const summaryLength = guide.summary ? guide.summary.length : 0;
    console.log(`   Summary:     ${summaryLength > 0 ? `${summaryLength} chars` : 'None'}`);
    
    // Check if body content is identical to other guides
    const sameBodyGuides = guides.filter(g => 
      g.id !== guide.id && 
      g.body && 
      guide.body && 
      g.body === guide.body
    );
    
    if (sameBodyGuides.length > 0) {
      console.log(`   ⚠️  WARNING: Body content is IDENTICAL to:`);
      sameBodyGuides.forEach(g => {
        console.log(`      - ${g.slug} (ID: ${g.id})`);
      });
    }
  });

  // Check for shared body content
  console.log('\n\n🔍 CHECKING FOR SHARED BODY CONTENT:');
  console.log('='.repeat(80));
  
  const bodyMap = new Map();
  guides.forEach(guide => {
    if (!guide.body) return;
    
    // Create a hash of the body content (first 500 chars for comparison)
    const bodyHash = guide.body.substring(0, 500);
    if (!bodyMap.has(bodyHash)) {
      bodyMap.set(bodyHash, []);
    }
    bodyMap.get(bodyHash).push(guide);
  });

  const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);
  if (sharedBodies.length > 0) {
    console.log('\n⚠️  SHARED BODY CONTENT DETECTED:');
    sharedBodies.forEach(([hash, guidesWithSameBody]) => {
      console.log(`\n   Content preview: "${hash.substring(0, 80)}..."`);
      console.log(`   Found in ${guidesWithSameBody.length} guide(s):`);
      guidesWithSameBody.forEach(g => {
        console.log(`     • ${g.slug} (${g.title}) - ID: ${g.id}`);
      });
    });
  } else {
    console.log('\n✅ No shared body content detected - each guide has unique content');
  }

  // Summary
  console.log('\n\n📊 SUMMARY:');
  console.log('='.repeat(80));
  console.log(`   Total GHC guides found: ${guides.length}`);
  console.log(`   Expected:               ${GHC_SLUGS.length}`);
  console.log(`   Missing:                ${missingSlugs.length}`);
  console.log(`   Duplicate slugs:       ${duplicates.length}`);
  console.log(`   Shared body content:   ${sharedBodies.length} group(s)`);
  
  if (missingSlugs.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('   The following GHC elements are missing from the database:');
    missingSlugs.forEach(slug => console.log(`     - ${slug}`));
    console.log('\n   You may need to create these guides in Supabase.');
  }
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('   There are duplicate slugs in the database.');
    console.log('   Each GHC element should have a unique slug.');
    console.log('   Please check and remove duplicates in Supabase.');
  }
  
  if (sharedBodies.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('   Some GHC elements share the same body content.');
    console.log('   Each element should have unique content.');
    console.log('   Please update the content in Supabase to make each unique.');
  }
  
  if (missingSlugs.length === 0 && duplicates.length === 0 && sharedBodies.length === 0) {
    console.log('\n✅ Database looks good! All GHC elements are properly configured.');
  }
  
  console.log('\n' + '='.repeat(80));
}

inspectGHCGuides().catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});
