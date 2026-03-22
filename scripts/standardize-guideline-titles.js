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

const titleUpdates = [
  {
    slug: 'dq-associate-owned-asset-guidelines',
    oldTitle: 'DQ Ops | Associate Owned Asset Guidelines',
    newTitle: 'DQ Associate Owned Asset Guidelines',
    bodyUpdate: {
      oldHeader: '# DQ Ops | Associate Owned Asset Guidelines',
      newHeader: '# DQ Associate Owned Asset Guidelines'
    }
  },
  {
    slug: 'dq-wr-attendance-punctuality-policy',
    oldTitle: 'Working Room (WR) Attendance & Punctuality Policy',
    newTitle: 'DQ Working Room Attendance & Punctuality Policy',
    bodyUpdate: {
      oldHeader: '# Working Room (WR) Attendance & Punctuality Policy',
      newHeader: '# DQ Working Room Attendance & Punctuality Policy'
    }
  },
  {
    slug: 'dq-biometric-system-guidelines',
    oldTitle: 'Biometric System Guidelines',
    newTitle: 'DQ Biometric System Guidelines',
    bodyUpdate: {
      oldHeader: '# Biometric System Guidelines',
      newHeader: '# DQ Biometric System Guidelines'
    }
  },
  {
    slug: 'dq-azure-devops-task-guidelines',
    oldTitle: 'Azure DevOps Task | Step by Step Guidelines',
    newTitle: 'DQ Azure DevOps Task Guidelines',
    bodyUpdate: {
      oldHeader: '# Azure DevOps Task | Step by Step Guidelines',
      newHeader: '# DQ Azure DevOps Task Guidelines'
    }
  },
  {
    slug: 'dq-deals-bd-guidelines',
    oldTitle: 'DQ Deals | BD Guidelines',
    newTitle: 'DQ Deals BD Guidelines',
    bodyUpdate: {
      oldHeader: '# DQ Deals | BD Guidelines',
      newHeader: '# DQ Deals BD Guidelines'
    }
  }
];

async function standardizeGuidelineTitles() {
  console.log('📝 Standardizing guideline titles to start with "DQ"...\n');

  for (const update of titleUpdates) {
    // First, get the current body to update it
    const { data: currentData, error: fetchError } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', update.slug)
      .single();

    if (fetchError) {
      console.error(`❌ Error fetching ${update.slug}:`, fetchError);
      continue;
    }

    // Update body header if it exists
    let newBody = currentData?.body || '';
    if (update.bodyUpdate && newBody.includes(update.bodyUpdate.oldHeader)) {
      newBody = newBody.replace(update.bodyUpdate.oldHeader, update.bodyUpdate.newHeader);
    }

    // Update title and body
    const { data, error } = await supabase
      .from('guides')
      .update({
        title: update.newTitle,
        body: newBody
      })
      .eq('slug', update.slug)
      .select('id, slug, title');

    if (error) {
      console.error(`❌ Error updating ${update.slug}:`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${update.oldTitle}`);
      console.log(`   → ${update.newTitle}`);
    } else {
      console.log(`⚠️  Not found: ${update.slug} (${update.oldTitle})`);
    }
  }

  console.log('\n✅ Standardization complete!');
}

standardizeGuidelineTitles().catch(console.error);

