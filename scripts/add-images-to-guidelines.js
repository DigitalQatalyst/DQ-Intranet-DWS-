import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Professional image URLs for each guideline
const GUIDELINE_IMAGES = {
  'Forum Guidelines': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80', // Collaboration/meeting
  'Agenda & Scheduling Guidelines': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop&q=80', // Calendar/scheduling
  'Functional Tracker Guidelines': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80', // Dashboard/tracking
  'L24 Working Rooms Guidelines': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80', // Workspace/collaboration
  'RAID Guidelines': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&q=80' // Risk management/business
};

async function addImagesToGuidelines() {
  console.log('🖼️  Adding images to Guidelines...\n');

  // Fetch all Guidelines guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .or('domain.ilike.%Guidelines%,domain.is.null');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Guidelines only (exclude Strategy, Blueprint, Testimonial)
  const guidelines = (guides || []).filter(g => {
    const title = (g.title || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    
    // Check if it's a Guidelines guide
    const isStrategy = domain.includes('strategy') || guideType.includes('strategy') || title.includes('strategy');
    const isBlueprint = domain.includes('blueprint') || guideType.includes('blueprint') || title.includes('blueprint');
    const isTestimonial = domain.includes('testimonial') || guideType.includes('testimonial') || title.includes('testimonial');
    
    return !isStrategy && !isBlueprint && !isTestimonial;
  });

  console.log(`📊 Found ${guidelines.length} Guidelines guides\n`);

  let updated = 0;
  let skipped = 0;

  for (const guide of guidelines) {
    const title = guide.title || '';
    
    // Find matching image
    let imageUrl = null;
    for (const [key, url] of Object.entries(GUIDELINE_IMAGES)) {
      if (title.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
        imageUrl = url;
        break;
      }
    }

    // If no specific match, use a default Guidelines image
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80'; // General guidelines/documentation
    }

    // Only update if it doesn't already have an image or has placeholder
    const currentImage = guide.hero_image_url;
    const hasPlaceholder = !currentImage || currentImage.includes('/image.png') || currentImage === '';
    
    if (hasPlaceholder) {
      console.log(`🔄 Updating: ${title}`);
      console.log(`   Current: ${currentImage || 'No image'}`);
      console.log(`   New: ${imageUrl}`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Successfully updated`);
        updated++;
      }
    } else {
      console.log(`⏭️  Skipping: ${title} (already has image: ${currentImage})`);
      skipped++;
    }
    console.log('');
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Updated: ${updated} guides`);
  console.log(`   Skipped: ${skipped} guides (already have images)`);
}

addImagesToGuidelines().catch(console.error);

