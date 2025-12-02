import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyTestimonialQuery() {
  console.log('Verifying testimonial query matches MarketplacePage logic...\n');

  try {
    // Simulate the exact query from MarketplacePage
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

    console.log(`✓ Query returned ${count || 0} testimonial(s):`);
    if (data && data.length > 0) {
      data.forEach((t, i) => {
        console.log(`\n  ${i + 1}. ${t.title}`);
        console.log(`     - Domain: ${t.domain}`);
        console.log(`     - Guide Type: ${t.guide_type}`);
        console.log(`     - Status: ${t.status}`);
        console.log(`     - Slug: ${t.slug}`);
      });
    } else {
      console.log('  No testimonials found!');
      
      // Check what's actually in the database
      const { data: allData } = await supabase
        .from('guides')
        .select('title, domain, guide_type, status')
        .or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
      
      console.log(`\n  But found ${allData?.length || 0} testimonials without status filter:`);
      if (allData && allData.length > 0) {
        allData.forEach((t, i) => {
          console.log(`    ${i + 1}. ${t.title} (status: ${t.status})`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

verifyTestimonialQuery();

