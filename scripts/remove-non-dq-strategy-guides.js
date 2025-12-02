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

// Valid DQ Strategy guides that should be kept
const VALID_DQ_STRATEGY_GUIDES = [
  'DQ Journey',
  'DQ Beliefs',
  'DQ Vision and Mission',
  'DQ Strategy 2021-2030',
  'DQ Competencies',
  'DQ Products',
  'Agile 6xD (Products)',
  'DQ IT Operation Security Policy',
  'IT Security Management Policy',
  'DQ Content Strategy',
  'Product Strategy Overview',
  'Solutions Strategy Framework',
  'Risk Management Policy',
  'Product Roadmap Planning'
];

async function removeNonDQStrategyGuides() {
  console.log('🔍 Identifying and removing non-DQ Strategy guides...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body, sub_domain, domain')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Found ${allGuides.length} Strategy guides\n`);

  const guidesToRemove = [];
  const guidesToKeep = [];

  for (const guide of allGuides) {
    const title = guide.title || '';
    const summary = (guide.summary || '').toLowerCase();
    const body = (guide.body || '').toLowerCase();
    const titleLower = title.toLowerCase();

    // Check if it's in the valid list
    if (VALID_DQ_STRATEGY_GUIDES.includes(title)) {
      guidesToKeep.push(guide);
      continue;
    }

    // Check if it contains DQ-specific content
    const hasDQContent = titleLower.includes('dq') || 
                         titleLower.includes('digital qatalyst') ||
                         summary.includes('dq') ||
                         summary.includes('digital qatalyst') ||
                         summary.includes('digitalqatalyst') ||
                         body.includes('dq') ||
                         body.includes('digital qatalyst') ||
                         body.includes('digitalqatalyst');

    // Check if it's a valid DQ Strategy category guide
    const isDQStrategyCategory = titleLower.includes('journey') ||
                                  titleLower.includes('beliefs') ||
                                  titleLower.includes('vision') ||
                                  titleLower.includes('mission') ||
                                  titleLower.includes('strategy 2021') ||
                                  titleLower.includes('competencies') ||
                                  titleLower.includes('6xd') ||
                                  titleLower.includes('ghc') ||
                                  summary.includes('journey') ||
                                  summary.includes('beliefs') ||
                                  summary.includes('vision') ||
                                  summary.includes('mission') ||
                                  summary.includes('competencies') ||
                                  summary.includes('6xd') ||
                                  summary.includes('ghc');

    if (hasDQContent || isDQStrategyCategory) {
      guidesToKeep.push(guide);
      console.log(`✅ KEEP: "${title}" - Contains DQ content`);
    } else {
      guidesToRemove.push(guide);
      console.log(`❌ REMOVE: "${title}" - No DQ content`);
      console.log(`   Summary: ${(guide.summary || '').substring(0, 80)}...`);
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`   Total Strategy guides: ${allGuides.length}`);
  console.log(`   Guides to keep: ${guidesToKeep.length}`);
  console.log(`   Guides to remove: ${guidesToRemove.length}`);

  if (guidesToRemove.length === 0) {
    console.log(`\n✅ All Strategy guides are DQ-related!`);
    return;
  }

  console.log(`\n\n🗑️  Removing ${guidesToRemove.length} non-DQ Strategy guide(s)...\n`);

  for (const guide of guidesToRemove) {
    console.log(`Deleting "${guide.title}"...`);
    
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', guide.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted successfully`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, domain')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  console.log(`Remaining Strategy guides: ${finalGuides?.length || 0}\n`);
  finalGuides?.forEach(g => {
    console.log(`   ✅ ${g.title}`);
  });

  console.log(`\n✅ Cleanup complete! Only DQ-related Strategy guides remain.`);
}

removeNonDQStrategyGuides().catch(console.error);

