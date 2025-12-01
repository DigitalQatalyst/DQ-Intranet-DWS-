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

// Guidelines to check from the image
const GUIDELINES_TO_CHECK = [
  'Forum Guidelines',
  'DQ Agenda & Scheduling Guidelines',
  'Agenda & Scheduling Guidelines',
  'Scheduling Guidelines',
  'DQ Functional Tracker Guidelines',
  'Functional Tracker Guidelines',
  'DQ L24 Working Rooms Guidelines',
  'L24 Working Rooms Guidelines',
  'Working Rooms Guidelines',
  'RAID Guidelines'
];

async function checkGuidelines() {
  console.log('🔍 Checking for guidelines in the database...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body, guide_type, domain, unit, location, sub_domain, status')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log(`📊 Total approved guides: ${guides.length}\n`);

  const found = [];
  const notFound = [];

  for (const guidelineName of GUIDELINES_TO_CHECK) {
    const matching = (guides || []).filter(g => {
      const title = (g.title || '').toLowerCase();
      const searchTerm = guidelineName.toLowerCase();
      // Check if title contains the search term or vice versa
      return title.includes(searchTerm) || searchTerm.includes(title);
    });

    if (matching.length > 0) {
      found.push({ searchTerm: guidelineName, matches: matching });
    } else {
      notFound.push(guidelineName);
    }
  }

  // Display found guidelines
  if (found.length > 0) {
    console.log('✅ FOUND GUIDELINES:\n');
    found.forEach(({ searchTerm, matches }) => {
      console.log(`📄 "${searchTerm}":`);
      matches.forEach(g => {
        console.log(`  - Title: ${g.title}`);
        console.log(`    Guide Type: ${g.guide_type || 'N/A'}`);
        console.log(`    Domain: ${g.domain || 'N/A'}`);
        console.log(`    Sub-Domain: ${g.sub_domain || 'N/A'}`);
        console.log(`    Unit: ${g.unit || 'N/A'}`);
        console.log(`    Location: ${g.location || 'N/A'}`);
        console.log(`    Summary: ${g.summary ? (g.summary.substring(0, 150) + '...') : 'N/A'}`);
        console.log('');
      });
    });
  }

  // Display not found guidelines
  if (notFound.length > 0) {
    console.log('❌ NOT FOUND GUIDELINES:\n');
    notFound.forEach(name => {
      console.log(`  - ${name}`);
    });
    console.log('');
  }

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`  ✅ Found: ${found.length} unique guideline types`);
  console.log(`  ❌ Not Found: ${notFound.length} guideline types`);
  console.log(`  📄 Total matches: ${found.reduce((sum, f) => sum + f.matches.length, 0)} guides\n`);

  // Also search for any guides with related keywords
  console.log('🔍 Searching for guides with related keywords...\n');
  const keywords = ['forum', 'agenda', 'scheduling', 'tracker', 'raid', 'working rooms', 'l24'];
  const relatedGuides = (guides || []).filter(g => {
    const title = (g.title || '').toLowerCase();
    return keywords.some(keyword => title.includes(keyword));
  });

  if (relatedGuides.length > 0) {
    console.log(`Found ${relatedGuides.length} guides with related keywords:\n`);
    relatedGuides.forEach(g => {
      console.log(`  - ${g.title}`);
      console.log(`    Guide Type: ${g.guide_type || 'N/A'}`);
      console.log(`    Domain: ${g.domain || 'N/A'}`);
      console.log(`    Unit: ${g.unit || 'N/A'}`);
      console.log('');
    });
  } else {
    console.log('No guides found with related keywords');
  }
}

checkGuidelines().catch(console.error);


