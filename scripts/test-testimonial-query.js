import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testTestimonialQuery() {
  console.log('Testing testimonial query (matching MarketplacePage logic)...\n');

  try {
    const GUIDE_LIST_SELECT = [
      'id',
      'slug',
      'title',
      'summary',
      'hero_image_url',
      'last_updated_at',
      'author_name',
      'author_org',
      'is_editors_pick',
      'download_count',
      'guide_type',
      'domain',
      'function_area',
      'unit',
      'sub_domain',
      'location',
      'status',
      'complexity_level',
    ].join(',');

    let q = supabase
      .from('guides')
      .select(GUIDE_LIST_SELECT, { count: 'exact' });

    // Apply status filter (Approved)
    q = q.eq('status', 'Approved');
    
    // Apply testimonials tab filter
    q = q.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');

    const { data, error, count } = await q;

    if (error) {
      console.error('✗ Query error:', error);
      return;
    }

    console.log(`✓ Query returned ${count || 0} testimonial(s):\n`);
    if (data && data.length > 0) {
      data.forEach((t, i) => {
        console.log(`${i + 1}. ${t.title}`);
        console.log(`   - Summary: ${t.summary?.substring(0, 60)}...`);
        console.log(`   - Author: ${t.author_name || 'N/A'}`);
        console.log(`   - Has Image: ${!!t.hero_image_url}`);
        console.log('');
      });
    } else {
      console.log('  No testimonials returned by query!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

testTestimonialQuery();

