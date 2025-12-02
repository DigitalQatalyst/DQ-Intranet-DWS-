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

async function findAllNonDQGuides() {
  console.log('🔍 Finding all non-DQ guides...\n');

  // Search for specific guides from images
  const searchTerms = [
    'Visual Assets for Social Media',
    'Stakeholder Catalog',
    'Proposal & Projects Commercial',
    'Client Session',
    'Blueprint Management',
    'Leave Guidelines',
    'Scrum',
    'Azure DevOps'
  ];

  const allGuides = [];
  
  for (const term of searchTerms) {
    const { data: guides, error } = await supabase
      .from('guides')
      .select('id, title, slug, domain, guide_type, unit, summary')
      .eq('status', 'Approved')
      .ilike('title', `%${term}%`);

    if (!error && guides) {
      allGuides.push(...guides);
    }
  }

  // Remove duplicates
  const uniqueGuides = Array.from(new Map(allGuides.map(g => [g.id, g])).values());

  console.log(`Found ${uniqueGuides.length} guide(s) matching search terms:\n`);
  uniqueGuides.forEach((g, i) => {
    const isDQ = (g.title || '').toLowerCase().includes('dq') || 
                 (g.title || '').toLowerCase().includes('digital qatalyst');
    console.log(`${i + 1}. "${g.title}" ${isDQ ? '✓ DQ' : '✗ NON-DQ'}`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Slug: ${g.slug || 'null'}`);
    console.log(`   Domain: ${g.domain || 'null'}`);
    console.log(`   Guide Type: ${g.guide_type || 'null'}`);
    console.log(`   Unit: ${g.unit || 'null'}`);
    console.log('');
  });

  // Identify non-DQ guides
  const nonDQGuides = uniqueGuides.filter(g => {
    const title = (g.title || '').toLowerCase();
    return !title.includes('dq') && !title.includes('digital qatalyst');
  });

  console.log(`\n📋 Non-DQ Guides to Remove (${nonDQGuides.length}):\n`);
  nonDQGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}" (${g.domain})`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Slug: ${g.slug || 'null'}`);
  });
}

findAllNonDQGuides().catch(console.error);

