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

function slugify(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function assignGHCLeader() {
  console.log('🔍 Finding Strategy guide to assign to GHC Leader framework...\n');

  // Fetch all Strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain, guide_type, unit, location')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Strategy guides
  const strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`📊 Found ${strategy.length} Strategy guides\n`);

  // Find a guide that doesn't already have ghc-leader in sub_domain
  // Prefer guides that mention leadership, GHC, or are general strategy guides
  let candidate = null;
  
  // First, try to find one that mentions leadership or GHC
  for (const guide of strategy) {
    const title = (guide.title || '').toLowerCase();
    const subDomain = (guide.sub_domain || '').toLowerCase();
    
    if ((title.includes('leader') || title.includes('ghc')) && !subDomain.includes('ghc-leader')) {
      candidate = guide;
      break;
    }
  }

  // If no leadership/GHC guide found, pick a general strategy guide
  if (!candidate) {
    for (const guide of strategy) {
      const subDomain = (guide.sub_domain || '').toLowerCase();
      if (!subDomain.includes('ghc-leader')) {
        candidate = guide;
        break;
      }
    }
  }

  if (!candidate) {
    console.log('❌ No suitable Strategy guide found');
    return;
  }

  console.log(`✅ Selected guide: ${candidate.title}`);
  console.log(`   Current sub_domain: ${candidate.sub_domain || 'N/A'}`);
  console.log(`   Unit: ${candidate.unit || 'N/A'}`);
  console.log(`   Location: ${candidate.location || 'N/A'}\n`);

  // Append ghc-leader to sub_domain (don't overwrite existing values)
  const currentSubDomain = (candidate.sub_domain || '').trim();
  let newSubDomain = '';
  
  if (currentSubDomain) {
    // Check if ghc-leader is already there
    if (currentSubDomain.toLowerCase().includes('ghc-leader')) {
      console.log('⚠️  Guide already has ghc-leader in sub_domain');
      return;
    }
    // Append with comma separator
    newSubDomain = `${currentSubDomain}, ghc-leader`;
  } else {
    newSubDomain = 'ghc-leader';
  }

  console.log(`🔄 Updating sub_domain to: ${newSubDomain}`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      sub_domain: newSubDomain,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', candidate.id);

  if (updateError) {
    console.error(`❌ Error updating: ${updateError.message}`);
    return;
  }

  console.log(`\n✅ Successfully assigned "${candidate.title}" to GHC Leader framework filter!`);
  console.log(`\n📊 Verification:`);
  console.log(`   The guide will now match the "GHC Leader" framework filter`);
  console.log(`   It will also continue to match its existing filters`);
}

assignGHCLeader().catch(console.error);

