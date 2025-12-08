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

function getUniqueImageUrl(photoId, title) {
  const hash = createHash('md5').update(`${title}-${Date.now()}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${Date.now()}`;
}

async function fixTestimonialsDuplicateImages() {
  console.log('🖼️  Fixing duplicate images for testimonial guides...\n');

  const guides = [
    {
      id: 'b7a233de-1e92-48c3-a30e-dca36657e2f0',
      title: 'Digital Transformation Journey: From Legacy Systems to Cloud-First',
      photoId: '1551288049-bebda4e38f71' // Transformation/journey theme
    },
    {
      id: 'a07ae7b0-0171-4d5e-932d-16bbda9728f3',
      title: 'Celebrating 100 Successful Deployments: A Milestone in Excellence',
      photoId: '1518770660439-4636190af475' // Success/achievement theme
    },
    {
      id: 'd4bafbb9-088e-48f6-b2ad-1b9f9713c2d4',
      title: 'Client Success Story: Financial Services Digital Innovation',
      photoId: '1522071820081-009f0129c71c' // Business/success theme
    }
  ];

  for (const guide of guides) {
    console.log(`Updating "${guide.title}"...`);
    
    const imageUrl = getUniqueImageUrl(guide.photoId, guide.title);
    
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
      console.log(`   ✅ Updated with unique image`);
      console.log(`   Photo ID: ${guide.photoId}\n`);
    }
  }

  console.log('✅ All testimonial guides now have unique images!');
}

fixTestimonialsDuplicateImages().catch(console.error);

