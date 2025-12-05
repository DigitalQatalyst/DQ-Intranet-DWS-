/**
 * Inspect guides in Supabase to verify strategy-related locations.
 * Run with: node scripts/check-guides-locations.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function run() {
  try {
    console.log('📊 Fetching guides for strategy/domain/tag checks...\n');

    const { data, error } = await supabase
      .from('guides')
      .select('id, title, domain, guide_type, location');

    if (error) {
      console.error('❌ Query failed:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('No guides found.');
      return;
    }

    const strategyGuides = [];
    const testimonialGuides = [];

    data.forEach((guide) => {
      const domain = (guide.domain || '').toLowerCase();
      const guideType = (guide.guide_type || '').toLowerCase();
      const isStrategy =
        domain.includes('strategy') || guideType.includes('strategy');

      const isTestimonial =
        domain.includes('testimonial') || guideType.includes('testimonial');

      if (isStrategy) {
        strategyGuides.push(guide);
      }

      if (isTestimonial) {
        testimonialGuides.push(guide);
      }
    });

    console.log(`Strategy guides: ${strategyGuides.length}`);
    strategyGuides.forEach((guide) => {
      console.log(`  • ${guide.title} | domain=${guide.domain} | type=${guide.guide_type} | location=${guide.location}`);
    });

    console.log('\nTestimonials guides:', testimonialGuides.length);
    testimonialGuides.forEach((guide) => {
      console.log(`  • ${guide.title} | domain=${guide.domain} | type=${guide.guide_type} | location=${guide.location}`);
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

run().then(() => process.exit(0));

