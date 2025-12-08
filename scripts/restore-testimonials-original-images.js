import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreOriginalImages() {
  console.log('🔄 Restoring original testimonial images...\n');

  // Get all testimonials
  const { data: testimonials, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%')
    .order('last_updated_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!testimonials || testimonials.length === 0) {
    console.log('❌ No testimonials found');
    return;
  }

  console.log(`Found ${testimonials.length} testimonial(s)\n`);

  // Get format from working guide
  const { data: working } = await supabase
    .from('guides')
    .select('hero_image_url')
    .eq('status', 'Approved')
    .not('hero_image_url', 'is', null)
    .ilike('hero_image_url', '%unsplash%')
    .limit(1)
    .single();

  const workingUrl = working?.hero_image_url || '';
  const params = workingUrl.split('?')[1] || '';
  const baseParams = params.split('&').filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');

  // Restore the original duplicate image (1500530855697-b586d89ba3ee) for the 3 that had it
  const originalDuplicatePhotoId = '1500530855697-b586d89ba3ee';
  
  // The 3 testimonials that originally had the duplicate image
  const titlesToRestore = [
    'Digital Transformation Journey: From Legacy Systems to Cloud-First',
    'Client Success Story: Financial Services Digital Innovation',
    'Celebrating 100 Successful Deployments: A Milestone in Excellence'
  ];

  console.log('🔄 Restoring original images...\n');

  for (const testimonial of testimonials) {
    if (titlesToRestore.includes(testimonial.title)) {
      // Restore to original duplicate image
      const hash = createHash('md5').update(`${testimonial.id}-original`).digest('hex');
      const uniqueParam = hash.substring(0, 8);
      const timestamp = Date.now();
      
      const originalImageUrl = `https://images.unsplash.com/photo-${originalDuplicatePhotoId}?${baseParams}&u=${uniqueParam}&t=${timestamp}`;

      console.log(`Restoring "${testimonial.title}"...`);
      console.log(`   Photo ID: ${originalDuplicatePhotoId}`);
      console.log(`   URL: ${originalImageUrl.substring(0, 100)}...`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: originalImageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', testimonial.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Restored`);
      }
    }
  }

  console.log(`\n✅ Original testimonial images restored.`);
}

restoreOriginalImages().catch(console.error);

