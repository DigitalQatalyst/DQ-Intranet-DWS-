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

const POTENTIALLY_INVALID = [
  'Account Growth Planning',
  'Account Management Strategy',
  'Deployment Excellence Guide',
  'Deployment Strategy Framework',
  'Design Process Optimization',
  'Design Strategy Overview',
  'Product Roadmap Planning',
  'Product Strategy Overview',
  'Solutions Strategy Framework'
];

async function checkRemainingGuidesContent() {
  console.log('🔍 Checking content of potentially non-DQ guides...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const guidesToCheck = (allGuides || []).filter(g => 
    POTENTIALLY_INVALID.includes(g.title)
  );

  const guidesToRemove = [];

  for (const guide of guidesToCheck) {
    const title = guide.title || '';
    const summary = (guide.summary || '').toLowerCase();
    const body = (guide.body || '').toLowerCase();
    
    const hasDQ = summary.includes('dq') || 
                  summary.includes('digital qatalyst') ||
                  body.includes('dq') ||
                  body.includes('digital qatalyst') ||
                  body.includes('digitalqatalyst');

    console.log(`\n📋 ${title}`);
    console.log(`   Summary: ${(guide.summary || '').substring(0, 100)}...`);
    console.log(`   Has DQ content: ${hasDQ ? '✅ YES' : '❌ NO'}`);
    
    if (!hasDQ) {
      console.log(`   ⚠️  Will be removed - No DQ content found`);
      guidesToRemove.push(guide);
    } else {
      console.log(`   ✅ Will be kept - Contains DQ content`);
    }
  }

  if (guidesToRemove.length > 0) {
    console.log(`\n\n🗑️  Removing ${guidesToRemove.length} guide(s) with no DQ content...\n`);
    
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
  } else {
    console.log(`\n✅ All guides contain DQ content!`);
  }

  // Final count
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  console.log(`\n📊 Final Strategy guides count: ${finalGuides?.length || 0}`);
}

checkRemainingGuidesContent().catch(console.error);

