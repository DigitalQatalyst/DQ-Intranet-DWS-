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

// Original Forum Guidelines content
const ORIGINAL_SUMMARY = 'SOP for creating, moderating and resolving forum threads.';

const ORIGINAL_BODY = `## Purpose
Keep forums constructive, searchable, and resolved.

## Creating a Thread
- Clear title and context
- One question per thread

## Moderation
- Tag correctly; merge duplicates
- Move off-topic posts
- Enforce code of conduct

## Resolution
- Mark accepted answer
- Summarize solution for future search

## Escalation
- Abuse → report to moderators; severe issues → HR/Legal`;

async function revertForumGuidelines() {
  console.log('🔄 Reverting Forum Guidelines to original version...\n');

  // Fetch existing Forum Guidelines
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, domain')
    .ilike('title', '%Forum Guidelines%')
    .eq('status', 'Approved');

  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('❌ No Forum Guidelines found to revert');
    return;
  }

  console.log(`📊 Found ${guides.length} Forum Guidelines entries to revert\n`);

  // Revert each entry
  for (const guide of guides) {
    console.log(`\n🔄 Reverting: ${guide.title} (ID: ${guide.id})`);

    // Determine original domain - one was N/A (should be Guidelines), one was Blueprint
    const shouldBeGuidelines = !guide.domain || guide.domain === 'N/A' || guide.domain.toLowerCase() !== 'blueprint';
    const originalDomain = shouldBeGuidelines ? null : 'Blueprint'; // null means it was N/A originally

    const updateData = {
      summary: ORIGINAL_SUMMARY,
      body: ORIGINAL_BODY,
      domain: originalDomain,
      guide_type: 'Policy',
      sub_domain: shouldBeGuidelines ? 'resources' : null,
      last_updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('guides')
      .update(updateData)
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error reverting: ${updateError.message}`);
    } else {
      console.log(`   ✅ Successfully reverted`);
      console.log(`   - Summary: ${ORIGINAL_SUMMARY}`);
      console.log(`   - Body length: ${ORIGINAL_BODY.length} characters`);
      console.log(`   - Domain: ${originalDomain || 'N/A'}`);
    }
  }

  console.log('\n✅ Forum Guidelines reverted to original!');
}

revertForumGuidelines().catch(console.error);

