import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTestimonials() {
  console.log('Checking for testimonials...\n');

  try {
    // Check all testimonials
    const { data, error } = await supabase
      .from('guides')
      .select('id, title, domain, guide_type, status')
      .or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('✗ No testimonials found in database.');
      console.log('\nYou need to add testimonials first.');
      return;
    }

    console.log(`✓ Found ${data.length} testimonial(s):\n`);
    data.forEach((t, i) => {
      console.log(`${i + 1}. ${t.title}`);
      console.log(`   - Domain: ${t.domain}`);
      console.log(`   - Guide Type: ${t.guide_type}`);
      console.log(`   - Status: ${t.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

checkTestimonials();

