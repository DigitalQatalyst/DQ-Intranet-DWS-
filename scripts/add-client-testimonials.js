import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testimonials = [
  {
    title: 'DFSA Client Testimonial',
    slug: 'dfsa-client-testimonial',
    summary: 'DQ was able to establish a practical transformation design and to realise this through an agile implementation. The results are moving DFSA towards a provider of intuitive services and provide a basis for AI and data-driven regulation.',
    body: `## Overview

DQ was able to establish a practical transformation design and to realise this through an agile implementation. The results are moving DFSA towards a provider of intuitive services and provide a basis for AI and data-driven regulation.

## Key Highlights

- Practical transformation design
- Agile implementation approach
- Moving towards intuitive services
- Foundation for AI and data-driven regulation`,
    domain: 'Testimonials',
    guide_type: 'Testimonial',
    author_name: 'Waleed Saeed Al Awadhi',
    author_org: 'DFSA',
    status: 'Approved',
    unit: 'DFSA',
    location: 'UAE'
  },
  {
    title: 'ADIB Client Testimonial',
    slug: 'adib-client-testimonial',
    summary: 'We worked with DQ to bring the ADIB EA function back into the heart of business technology decision making. DQ was able to bring a whole set of new perspectives on practical approaches to EA-driven transformation.',
    body: `## Overview

We worked with DQ to bring the ADIB EA function back into the heart of business technology decision making. DQ was able to bring a whole set of new perspectives on practical approaches to EA-driven transformation.

## Key Highlights

- Enterprise Architecture function integration
- Business technology decision making
- Practical approaches to EA-driven transformation
- New perspectives on transformation`,
    domain: 'Testimonials',
    guide_type: 'Testimonial',
    author_name: 'Kamran Sheikh',
    author_org: 'ADIB',
    status: 'Approved',
    unit: 'ADIB',
    location: 'UAE'
  },
  {
    title: 'Khalifa Fund Client Testimonial',
    slug: 'khalifa-fund-client-testimonial',
    summary: 'DQ designed and implemented a multi-sided marketplace concept that stands to revitalise SME growth and expansion in Abu Dhabi. The approach was highly distinctive and enabled us to connect business vision with practical reality in through one integrated transformation strategy.',
    body: `## Overview

DQ designed and implemented a multi-sided marketplace concept that stands to revitalise SME growth and expansion in Abu Dhabi. The approach was highly distinctive and enabled us to connect business vision with practical reality in through one integrated transformation strategy.

## Key Highlights

- Multi-sided marketplace concept
- SME growth and expansion support
- Distinctive approach
- Integrated transformation strategy`,
    domain: 'Testimonials',
    guide_type: 'Testimonial',
    author_name: 'Ali Al Jasmi',
    author_org: 'Khalifa Fund',
    status: 'Approved',
    unit: 'Khalifa Fund',
    location: 'UAE'
  }
];

async function addClientTestimonials() {
  console.log('Adding client testimonials...\n');

  for (const testimonial of testimonials) {
    try {
      // Check if it already exists
      const { data: existing } = await supabase
        .from('guides')
        .select('id, title')
        .eq('slug', testimonial.slug)
        .maybeSingle();

      if (existing) {
        console.log(`⚠ Testimonial "${testimonial.title}" already exists. Updating...`);
        
        const { data, error } = await supabase
          .from('guides')
          .update({
            ...testimonial,
            last_updated_at: new Date().toISOString()
          })
          .eq('slug', testimonial.slug)
          .select();

        if (error) throw error;
        console.log(`✓ Updated: "${testimonial.title}"`);
      } else {
        const { data, error } = await supabase
          .from('guides')
          .insert({
            ...testimonial,
            id: crypto.randomUUID(),
            last_updated_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;
        console.log(`✓ Added: "${testimonial.title}"`);
      }
    } catch (error) {
      console.error(`✗ Error with ${testimonial.title}:`, error.message);
    }
  }

  console.log('\n✓ All testimonials processed!');
  console.log('\nDone!');
}

addClientTestimonials();
