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

async function fixTestExecutionReportImage() {
  console.log('🖼️  Fixing Test Execution Report image with a better testing/QA image...\n');

  // Find the guide
  const { data: guide, error: findError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('domain', 'Blueprint')
    .ilike('title', '%Test Execution Report%')
    .eq('status', 'Approved')
    .maybeSingle();

  if (findError) {
    console.error('❌ Error finding guide:', findError);
    return;
  }

  if (!guide) {
    console.log('❌ Test Execution Report not found');
    return;
  }

  console.log(`Found: "${guide.title}" (ID: ${guide.id})\n`);

  // Use a different, more clearly testing-related image
  // Trying different photo IDs that are more clearly about testing, QA, checklists, reports
  const photoId = '1551288049-bebda4e38f71'; // Technical/testing/QA - code and testing related
  const hash = createHash('md5').update(`test-execution-report-${Date.now()}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const imageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${Date.now()}`;

  console.log('Updating image to a testing/QA themed image...');
  console.log(`   Photo ID: ${photoId}`);
  console.log(`   Theme: Testing, QA, Technical Reports\n`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: imageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', guide.id);

  if (updateError) {
    console.error(`❌ Error: ${updateError.message}`);
  } else {
    console.log('✅ Image updated successfully!');
    console.log(`   New URL: ${imageUrl}`);
  }
}

fixTestExecutionReportImage().catch(console.error);

