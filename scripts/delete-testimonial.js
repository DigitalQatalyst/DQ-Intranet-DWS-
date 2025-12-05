import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteTestimonial() {
  console.log('Deleting testimonial...\n');

  try {
    // Find the testimonial
    const { data: testimonial, error: fetchError } = await supabase
      .from('guides')
      .select('id, title')
      .eq('slug', 'growing-as-a-developer-my-journey-at-dq')
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!testimonial) {
      console.log('No testimonial found to delete.');
      return;
    }

    console.log(`Found testimonial: "${testimonial.title}"`);

    // Delete it
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', testimonial.id);

    if (deleteError) {
      throw deleteError;
    }

    console.log(`✓ Successfully deleted testimonial: "${testimonial.title}"`);
    console.log('\n✓ Testimonials section is now empty!');
  } catch (error) {
    console.error('✗ Error deleting testimonial:', error.message);
  }

  console.log('\nDone!');
}

deleteTestimonial();

