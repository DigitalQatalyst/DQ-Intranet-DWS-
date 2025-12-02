import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testimonialCard = {
  id: crypto.randomUUID(),
  title: 'Client Testimonials',
  slug: 'client-testimonials',
  summary:
    'Highlights from DFSA, ADIB, and Khalifa Fund showcasing how Digital Qatalyst engagements accelerate transformation outcomes.',
  body: `## Featured Clients

### DFSA
DQ established a practical transformation design and delivered it through agile implementation, setting the foundation for intuitive services and data-driven regulation.

### ADIB
Repositioned the Enterprise Architecture function at the heart of technology decision making, introducing pragmatic approaches for EA-driven transformation.

### Khalifa Fund
Designed a multi-sided marketplace concept that unlocks SME growth across Abu Dhabi and connects vision with delivery in one transformation strategy.

## Why It Matters

- Proof of value across regulatory, banking, and investment ecosystems.
- Demonstrates the repeatability of DQ delivery patterns.
- Helps new partners visualise expected outcomes before committing to a program.`,
  domain: 'Testimonials',
  guide_type: 'Testimonial',
  status: 'Approved',
  last_updated_at: new Date().toISOString(),
  author_name: 'Digital Qatalyst',
  author_org: 'Client Success Office',
  location: 'UAE'
};

async function createClientTestimonialsCard() {
  console.log('Creating single Client Testimonials service card...\n');
  try {
    const { data: existing } = await supabase
      .from('guides')
      .select('id')
      .eq('slug', testimonialCard.slug)
      .maybeSingle();

    if (existing) {
      console.log('Card already exists, updating content...');
      const { error } = await supabase
        .from('guides')
        .update({ ...testimonialCard, last_updated_at: new Date().toISOString() })
        .eq('slug', testimonialCard.slug);
      if (error) throw error;
      console.log('✓ Updated Client Testimonials card\n');
    } else {
      const { error } = await supabase.from('guides').insert(testimonialCard);
      if (error) throw error;
      console.log('✓ Created Client Testimonials card\n');
    }
  } catch (error) {
    console.error('Error creating service card:', error.message);
    process.exit(1);
  }
  console.log('Done!');
}

createClientTestimonialsCard();

