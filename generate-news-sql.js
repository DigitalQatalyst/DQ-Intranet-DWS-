#!/usr/bin/env node

/**
 * This script generates SQL INSERT statements from news.ts
 * Run: node generate-news-sql.js > db/supabase/06_insert_news_data.sql
 */

import { readFileSync, writeFileSync } from 'fs';

console.log('-- =====================================================');
console.log('-- Insert News Data into Knowledge Hub');
console.log('-- =====================================================');
console.log('-- Generated from src/data/media/news.ts');
console.log('-- Run this in Knowledge Hub Supabase SQL Editor');
console.log('-- =====================================================');
console.log('');

// Read the news file
const newsContent = readFileSync('./src/data/media/news.ts', 'utf-8');

// Extract news items using regex
const newsItemsMatch = newsContent.match(/export const NEWS: NewsItem\[\] = \[([\s\S]*?)\];/);

if (!newsItemsMatch) {
  console.error('Could not find NEWS array');
  process.exit(1);
}

// Parse individual news items
const newsArrayContent = newsItemsMatch[1];
const newsItems = [];

// Split by object boundaries
const itemMatches = newsArrayContent.split(/\n  \{/).filter(s => s.trim());

itemMatches.forEach((itemStr, index) => {
  try {
    // Add back the opening brace
    const fullItem = (index === 0 ? '' : '{') + itemStr;
    
    // Extract fields using regex
    const id = fullItem.match(/id: ['"]([^'"]+)['"]/)?.[1];
    const title = fullItem.match(/title: ['"]([^'"]+)['"]/)?.[1]?.replace(/'/g, "''");
    const type = fullItem.match(/type: ['"]([^'"]+)['"]/)?.[1];
    const date = fullItem.match(/date: ['"]([^'"]+)['"]/)?.[1];
    const author = fullItem.match(/author: ['"]([^'"]+)['"]/)?.[1]?.replace(/'/g, "''");
    const excerpt = fullItem.match(/excerpt:\s*['"]([^'"]+)['"]/)?.[1]?.replace(/'/g, "''");
    const image = fullItem.match(/image: ['"]([^'"]+)['"]/)?.[1];
    const department = fullItem.match(/department: ['"]([^'"]+)['"]/)?.[1];
    const location = fullItem.match(/location: ['"]([^'"]+)['"]/)?.[1];
    const newsType = fullItem.match(/newsType: ['"]([^'"]+)['"]/)?.[1];
    const newsSource = fullItem.match(/newsSource: ['"]([^'"]+)['"]/)?.[1];
    const focusArea = fullItem.match(/focusArea: ['"]([^'"]+)['"]/)?.[1];
    const readingTime = fullItem.match(/readingTime: ['"]([^'"]+)['"]/)?.[1];
    const format = fullItem.match(/format: ['"]([^'"]+)['"]/)?.[1];
    
    // Extract tags array
    const tagsMatch = fullItem.match(/tags: \[(.*?)\]/s);
    let tags = null;
    if (tagsMatch) {
      const tagsList = tagsMatch[1].match(/['"]([^'"]+)['"]/g);
      if (tagsList) {
        tags = "ARRAY[" + tagsList.join(', ') + "]";
      }
    }
    
    // Extract content (multiline)
    const contentMatch = fullItem.match(/content: `([\s\S]*?)`[,\s]*\}/);
    let content = null;
    if (contentMatch) {
      content = contentMatch[1].replace(/'/g, "''").trim();
    }
    
    if (id && title) {
      newsItems.push({
        id, title, type, date, author, excerpt, image,
        department, location, newsType, newsSource, focusArea,
        readingTime, format, tags, content
      });
    }
  } catch (err) {
    console.error(`-- Error parsing item: ${err.message}`);
  }
});

console.log(`-- Found ${newsItems.length} news items to insert`);
console.log('');

// Generate INSERT statements
newsItems.forEach((item, index) => {
  console.log(`-- ${index + 1}. ${item.title}`);
  console.log(`INSERT INTO public.guides (`);
  console.log(`  id, slug, title, description, type, category, status, date,`);
  console.log(`  image_url, source, author_name, tags, news_type, focus_area,`);
  console.log(`  reading_time, location, format, content`);
  console.log(`) VALUES (`);
  console.log(`  '${item.id}',`);
  console.log(`  '${item.id}',`);
  console.log(`  '${item.title}',`);
  console.log(`  ${item.excerpt ? `'${item.excerpt}'` : 'NULL'},`);
  console.log(`  ${item.type ? `'${item.type}'` : 'NULL'},`);
  console.log(`  ${item.department ? `'${item.department}'` : 'NULL'},`);
  console.log(`  'Approved',`);
  console.log(`  ${item.date ? `'${item.date}'` : 'NULL'},`);
  console.log(`  ${item.image ? `'${item.image}'` : 'NULL'},`);
  console.log(`  ${item.newsSource ? `'${item.newsSource}'` : 'NULL'},`);
  console.log(`  ${item.author ? `'${item.author}'` : 'NULL'},`);
  console.log(`  ${item.tags || 'NULL'},`);
  console.log(`  ${item.newsType ? `'${item.newsType}'` : 'NULL'},`);
  console.log(`  ${item.focusArea ? `'${item.focusArea}'` : 'NULL'},`);
  console.log(`  ${item.readingTime ? `'${item.readingTime}'` : 'NULL'},`);
  console.log(`  ${item.location ? `'${item.location}'` : 'NULL'},`);
  console.log(`  ${item.format ? `'${item.format}'` : 'NULL'},`);
  console.log(`  ${item.content ? `'${item.content}'` : 'NULL'}`);
  console.log(`);`);
  console.log('');
});

console.log('-- =====================================================');
console.log(`-- ✅ Generated ${newsItems.length} INSERT statements`);
console.log('-- =====================================================');
