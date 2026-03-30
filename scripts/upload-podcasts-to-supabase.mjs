/**
 * Uploads all podcast .m4a files from public/Podcasts/ to Supabase Storage.
 * Creates the 'podcasts' bucket if it doesn't exist.
 *
 * Run with: node scripts/upload-podcasts-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const SUPABASE_URL = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
// Uses service role key for storage admin access
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';
const BUCKET_NAME = 'podcasts';
const PODCASTS_DIR = join(process.cwd(), 'public', 'Podcasts');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✅ Created bucket: ${BUCKET_NAME}`);
  } else {
    console.log(`✅ Bucket already exists: ${BUCKET_NAME}`);
  }
}

async function uploadFiles() {
  const files = readdirSync(PODCASTS_DIR).filter(f => extname(f) === '.m4a');

  if (files.length === 0) {
    console.error('❌ No .m4a files found in public/Podcasts/');
    process.exit(1);
  }

  console.log(`\nUploading ${files.length} files...\n`);

  for (const filename of files) {
    const filePath = join(PODCASTS_DIR, filename);
    const fileBuffer = readFileSync(filePath);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: 'audio/mp4',
        upsert: true, // overwrite if already exists
      });

    if (error) {
      console.error(`❌ Failed: ${filename} — ${error.message}`);
    } else {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
      console.log(`✅ ${filename}`);
      console.log(`   → ${data.publicUrl}\n`);
    }
  }
}

async function main() {
  console.log('🎙️  Podcast Upload Script\n');
  await ensureBucket();
  await uploadFiles();
  console.log('\nDone. Copy the URLs above into the news_blogs table audio_url column.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
