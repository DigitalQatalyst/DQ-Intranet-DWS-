import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTestimonial() {
  console.log('Checking testimonial in database...\n');

  try {
    // Check by slug
    const { data: bySlug, error: slugError } = await supabase
      .from('guides')
      .select('*')
      .eq('slug', 'growing-as-a-developer-my-journey-at-dq')
      .maybeSingle();

    if (slugError) {
      console.error('Error checking by slug:', slugError);
    } else if (bySlug) {
      console.log('✓ Found by slug:');
      console.log(JSON.stringify(bySlug, null, 2));
    } else {
      console.log('✗ Not found by slug');
    }

    // Check by domain
    const { data: byDomain, error: domainError } = await supabase
      .from('guides')
      .select('*')
      .ilike('domain', '%Testimonial%');

    if (domainError) {
      console.error('Error checking by domain:', domainError);
    } else {
      console.log(`\n✓ Found ${byDomain?.length || 0} testimonials by domain:`);
      if (byDomain && byDomain.length > 0) {
        byDomain.forEach((t, i) => {
          console.log(`  ${i + 1}. ${t.title} (domain: ${t.domain}, guide_type: ${t.guide_type}, status: ${t.status})`);
        });
      }
    }

    // Check by guide_type
    const { data: byType, error: typeError } = await supabase
      .from('guides')
      .select('*')
      .ilike('guide_type', '%Testimonial%');

    if (typeError) {
      console.error('Error checking by guide_type:', typeError);
    } else {
      console.log(`\n✓ Found ${byType?.length || 0} testimonials by guide_type:`);
      if (byType && byType.length > 0) {
        byType.forEach((t, i) => {
          console.log(`  ${i + 1}. ${t.title} (domain: ${t.domain}, guide_type: ${t.guide_type}, status: ${t.status})`);
        });
      }
    }

    // Check all guides to see what's there
    const { data: allGuides, error: allError } = await supabase
      .from('guides')
      .select('id, title, domain, guide_type, status')
      .limit(10);

    if (allError) {
      console.error('Error fetching all guides:', allError);
    } else {
      console.log(`\n✓ Total guides in database: ${allGuides?.length || 0}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

checkTestimonial();

