import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findNonDQGuidelines() {
  console.log('🔍 Finding non-DQ Guidelines...\n');

  // Get all Guidelines
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, slug, domain, guide_type, unit, summary')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!allGuides || allGuides.length === 0) {
    console.log('No guides found');
    return;
  }

  console.log(`Found ${allGuides.length} guide(s) in Guidelines domain:\n`);

  // Identify non-DQ guides (those without "DQ" in title)
  const nonDQGuides = allGuides.filter(g => {
    const title = (g.title || '').toLowerCase();
    return !title.includes('dq') && !title.includes('digital qatalyst');
  });

  console.log(`📋 Non-DQ Guidelines (${nonDQGuides.length}):\n`);
  nonDQGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Slug: ${g.slug || 'null'}`);
    console.log(`   Guide Type: ${g.guide_type || 'null'}`);
    console.log(`   Unit: ${g.unit || 'null'}`);
    console.log(`   Summary: ${(g.summary || '').substring(0, 80)}...`);
    console.log('');
  });

  // Also check for specific slugs mentioned in code
  const specificSlugs = ['scrum-guidelines', 'leave-guidelines', 'azure-devops-task-guidelines'];
  console.log(`\n🔍 Checking for specific slugs mentioned in code:\n`);
  for (const slug of specificSlugs) {
    const found = allGuides.find(g => (g.slug || '').toLowerCase() === slug);
    if (found) {
      console.log(`✓ Found: "${found.title}" (slug: ${found.slug})`);
    } else {
      console.log(`✗ Not found: ${slug}`);
    }
  }
}

findNonDQGuidelines().catch(console.error);

