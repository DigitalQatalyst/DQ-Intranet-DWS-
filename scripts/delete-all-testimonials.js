import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteAllTestimonials() {
  console.log('Deleting all testimonial service cards...\n');

  try {
    // First, find all testimonials
    const { data: testimonials, error: fetchError } = await supabase
      .from('guides')
      .select('id, title, domain, guide_type')
      .or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');

    if (fetchError) {
      throw fetchError;
    }

    if (!testimonials || testimonials.length === 0) {
      console.log('No testimonials found to delete.');
      return;
    }

    console.log(`Found ${testimonials.length} testimonials to delete:`);
    testimonials.forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.title} (${t.domain || t.guide_type})`);
    });

    // Delete all testimonials
    const testimonialIds = testimonials.map(t => t.id);
    
    const { data, error } = await supabase
      .from('guides')
      .delete()
      .in('id', testimonialIds);

    if (error) {
      throw error;
    }

    console.log(`\n✓ Successfully deleted ${testimonials.length} testimonial(s)!`);
  } catch (error) {
    console.error('✗ Error deleting testimonials:', error.message);
  }

  console.log('\nDone!');
}

deleteAllTestimonials();

