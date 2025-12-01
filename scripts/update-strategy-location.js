/**
 * Set the location of all strategy guides to 'NBO'
 * Run with: node scripts/update-strategy-location.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  try {
    console.log('🔄 Updating strategy guides to location = NBO...');

    const updatedGuides = [];

    const { data: byGuideType, error: typeError } = await supabase
      .from('guides')
      .update({ location: 'NBO' })
      .ilike('guide_type', '%Strategy%')
      .select('id, title', { count: 'exact' });

    if (typeError) {
      console.error('❌ Update failed (guide_type):', typeError);
      process.exit(1);
    }

    if (Array.isArray(byGuideType)) {
      updatedGuides.push(...byGuideType);
    }

    const { data: byDomain, error: domainError } = await supabase
      .from('guides')
      .update({ location: 'NBO' })
      .ilike('domain', '%Strategy%')
      .select('id, title', { count: 'exact' });

    if (domainError) {
      console.error('❌ Update failed (domain):', domainError);
      process.exit(1);
    }

    if (Array.isArray(byDomain)) {
      updatedGuides.push(
        ...byDomain.filter(
          (guide) => !updatedGuides.some((existing) => existing.id === guide.id)
        )
      );
    }

    const count = updatedGuides.length;
    console.log(`✅ Updated ${count} guides:`);
    updatedGuides.forEach((guide) => {
      console.log(`  • ${guide.title} (${guide.id})`);
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

run().then(() => {
  // Ensure Node exits when finished.
  process.exit(0);
});

