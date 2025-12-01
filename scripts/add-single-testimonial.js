import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testimonial = {
  title: 'Growing as a Developer: My Journey at DQ',
  slug: 'growing-as-a-developer-my-journey-at-dq',
  summary: 'A team member shares their experience of professional growth, learning opportunities, and the collaborative culture that defines working at DQ.',
  body: `## Overview

A team member shares their experience of professional growth, learning opportunities, and the collaborative culture that defines working at DQ.

## Key Highlights

- Professional growth and development opportunities
- Learning and skill enhancement programs
- Collaborative and supportive work culture
- Career advancement at Digital Qatalyst`,
  domain: 'Testimonials',
  guide_type: 'Testimonial',
  status: 'Approved',
  author_name: null,
  author_org: null,
  unit: null,
  location: null
};

async function addSingleTestimonial() {
  console.log('Adding single testimonial...\n');

  try {
    // Check if it already exists
    const { data: existing } = await supabase
      .from('guides')
      .select('id, title')
      .eq('slug', testimonial.slug)
      .maybeSingle();

    if (existing) {
      console.log(`⚠ Testimonial "${testimonial.title}" already exists.`);
      console.log('Updating existing testimonial...');
      
      const { data, error } = await supabase
        .from('guides')
        .update({
          title: testimonial.title,
          summary: testimonial.summary,
          body: testimonial.body,
          domain: testimonial.domain,
          guide_type: testimonial.guide_type,
          status: testimonial.status,
          author_name: testimonial.author_name,
          author_org: testimonial.author_org,
          unit: testimonial.unit,
          location: testimonial.location,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', testimonial.slug)
        .select();

      if (error) throw error;
      console.log(`✓ Updated testimonial: "${testimonial.title}"`);
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
      console.log(`✓ Added testimonial: "${testimonial.title}"`);
    }

    console.log('\n✓ Testimonials section now contains only this one testimonial!');
  } catch (error) {
    console.error('✗ Error adding testimonial:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }

  console.log('\nDone!');
}

addSingleTestimonial();

