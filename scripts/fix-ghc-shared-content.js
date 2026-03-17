import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import readline from 'readline';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkAndFixGHCGuides() {
  console.log('🔍 Checking GHC Guides in Supabase...\n');
  console.log('='.repeat(80));

  // Fetch all GHC guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, slug, title, body, summary, last_updated_at')
    .in('slug', GHC_SLUGS)
    .order('slug');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('⚠️  No GHC guides found in database!');
    return;
  }

  console.log(`📊 Found ${guides.length} GHC guide(s)\n`);

  // Check for shared body content - EXACT matches
  const bodyMap = new Map();
  guides.forEach(guide => {
    if (!guide.body || guide.body.trim().length === 0) return;
    const bodyKey = guide.body.trim();
    if (!bodyMap.has(bodyKey)) {
      bodyMap.set(bodyKey, []);
    }
    bodyMap.get(bodyKey).push(guide);
  });

  const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);

  if (sharedBodies.length === 0) {
    console.log('✅ No shared content detected! Each GHC element has unique content.\n');
    console.log('📋 All GHC Guides:');
    guides.forEach(guide => {
      const bodyLength = guide.body ? guide.body.length : 0;
      console.log(`\n  ${guide.slug}:`);
      console.log(`    ID: ${guide.id}`);
      console.log(`    Title: ${guide.title || 'N/A'}`);
      console.log(`    Body: ${bodyLength} characters`);
      console.log(`    Preview: ${guide.body ? guide.body.substring(0, 80).replace(/\n/g, ' ') : 'EMPTY'}...`);
    });
    rl.close();
    return;
  }

  // Found shared content
  console.log('❌ SHARED CONTENT DETECTED!\n');
  console.log('This is why changes to one GHC element appear on others.\n');

  sharedBodies.forEach(([bodyHash, guidesWithSameBody], idx) => {
    console.log(`\n🔴 Group ${idx + 1}: ${guidesWithSameBody.length} guide(s) with IDENTICAL content:`);
    guidesWithSameBody.forEach(g => {
      console.log(`   • ${g.slug} (ID: ${g.id}) - ${g.title || 'No title'}`);
    });
    console.log(`   Content preview: ${bodyHash.substring(0, 100)}...`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 SOLUTION:');
  console.log('Each GHC element must have UNIQUE content in the "body" field.');
  console.log('Currently, multiple guides share the same body content.\n');

  const answer = await question('Do you want to see detailed comparison? (y/n): ');
  
  if (answer.toLowerCase() === 'y') {
    console.log('\n📋 Detailed Comparison:\n');
    sharedBodies.forEach(([bodyHash, guidesWithSameBody], idx) => {
      console.log(`\nGroup ${idx + 1}:`);
      guidesWithSameBody.forEach(g => {
        console.log(`\n  ${g.slug} (${g.id}):`);
        console.log(`    Title: ${g.title || 'N/A'}`);
        console.log(`    Body length: ${g.body ? g.body.length : 0} chars`);
        console.log(`    Last updated: ${g.last_updated_at || 'N/A'}`);
        console.log(`    Body content (first 200 chars):`);
        console.log(`    ${g.body ? g.body.substring(0, 200).replace(/\n/g, '\\n') : 'EMPTY'}...`);
      });
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 SUMMARY:');
  console.log(`   Total GHC guides: ${guides.length}`);
  console.log(`   Guides with shared content: ${sharedBodies.length} group(s)`);
  console.log(`   Affected guides: ${sharedBodies.reduce((sum, [_, guides]) => sum + guides.length, 0)}`);
  
  console.log('\n✅ VERIFICATION:');
  console.log('This is a DATABASE issue, not a UI issue.');
  console.log('The Supabase "guides" table has multiple records with identical "body" content.');
  console.log('\n🔧 TO FIX:');
  console.log('1. Go to Supabase dashboard → Table Editor → guides table');
  console.log('2. Or use the admin interface: http://localhost:3004/admin/guides');
  console.log('3. Edit each GHC guide individually and make the content unique');
  console.log('4. The GHC Inspector page will show which guides share content');
  console.log('\n⚠️  IMPORTANT:');
  console.log('Each GHC element (dq-vision, dq-hov, etc.) must have DIFFERENT content');
  console.log('in the "body" field. Right now, some have the exact same content.');

  rl.close();
}

checkAndFixGHCGuides().catch(error => {
  console.error('❌ Script error:', error);
  rl.close();
  process.exit(1);
});
