#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const khUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const khKey = process.env.KNOWLEDGE_HUB_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;
const khClient = createClient(khUrl, khKey);

console.log('🚀 Starting news migration to Knowledge Hub Supabase...');
console.log('');

// Read and parse the news data file
function loadNewsData() {
  try {
    const newsFilePath = join(__dirname, 'src/data/media/news.ts');
    const fileContent = readFileSync(newsFilePath, 'utf-8');
    
    // Extract the NEWS array from the file
    const newsArrayMatch = fileContent.match(/export const NEWS: NewsItem\[\] = (\[[\s\S]*?\]);/);
    if (!newsArrayMatch) {
      throw new Error('Could not find NEWS array in file');
    }
    
    // Use eval to parse the array (safe since it's our own code)
    const NEWS = eval(newsArrayMatch[1]);
    return NEWS;
  } catch (error) {
    console.error('❌ Failed to load news data:', error.message);
    console.log('');
    console.log('💡 Alternative: Copy news data manually or use the SQL script approach');
    process.exit(1);
  }
}

async function migrateNews() {
  try {
    const NEWS = loadNewsData();
    console.log(`📊 Found ${NEWS.length} news items to migrate`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const newsItem of NEWS) {
      try {
        // Map news item to guides table structure
        const guideData = {
          id: newsItem.id,
          slug: newsItem.id,
          title: newsItem.title,
          description: newsItem.excerpt,
          summary: newsItem.excerpt,
          type: newsItem.type, // 'Announcement', 'Thought Leadership', etc.
          category: newsItem.department || newsItem.domain || 'News',
          status: 'Approved',
          date: newsItem.date,
          image_url: newsItem.image || null,
          source: newsItem.newsSource || newsItem.byline || newsItem.author,
          author_name: newsItem.author,
          tags: newsItem.tags || [],
          news_type: newsItem.newsType || null,
          focus_area: newsItem.focusArea || null,
          content: newsItem.content || null,
          reading_time: newsItem.readingTime || null,
          location: newsItem.location || null,
          format: newsItem.format || null,
          audio_url: newsItem.audioUrl || null,
        };

        // Insert into guides table
        const { error } = await khClient
          .from('guides')
          .upsert(guideData, { onConflict: 'id' });

        if (error) {
          console.error(`❌ Failed to migrate: ${newsItem.title}`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
          errors.push({ title: newsItem.title, error: error.message });
        } else {
          console.log(`✅ Migrated: ${newsItem.title}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exception migrating: ${newsItem.title}`);
        console.error(`   Error: ${err.message}`);
        errorCount++;
        errors.push({ title: newsItem.title, error: err.message });
      }
    }

    console.log('');
    console.log('========================================');
    console.log('📊 Migration Summary');
    console.log('========================================');
    console.log(`✅ Successfully migrated: ${successCount} items`);
    console.log(`❌ Failed: ${errorCount} items`);
    
    if (errors.length > 0) {
      console.log('');
      console.log('Errors:');
      errors.forEach(err => {
        console.log(`  - ${err.title}: ${err.error}`);
      });
    }

    console.log('');
    console.log('🎉 Migration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Verify data in Supabase dashboard');
    console.log('2. Update Media Center page to fetch from Supabase');
    console.log('3. Test both Home page and Media Center page');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateNews();
