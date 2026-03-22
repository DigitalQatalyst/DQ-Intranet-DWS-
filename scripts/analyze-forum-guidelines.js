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

async function analyzeForumGuidelines() {
  console.log('📋 Analyzing DQ Forum Guidelines documentation structure...\n');

  const { data: guide, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', 'forum-guidelines')
    .maybeSingle();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guide) {
    console.log('❌ Guide not found');
    return;
  }

  console.log('='.repeat(80));
  console.log('GUIDE METADATA');
  console.log('='.repeat(80));
  console.log(`Title: ${guide.title}`);
  console.log(`Slug: ${guide.slug}`);
  console.log(`Domain: ${guide.domain}`);
  console.log(`Sub-Domain: ${guide.sub_domain || 'None'}`);
  console.log(`Guide Type: ${guide.guide_type || 'None'}`);
  console.log(`Status: ${guide.status}`);
  console.log(`Summary: ${guide.summary || 'None'}`);
  console.log(`Hero Image: ${guide.hero_image_url || 'None'}`);

  if (!guide.body) {
    console.log('\n❌ No body content found');
    return;
  }

  console.log('\n' + '='.repeat(80));
  console.log('FULL BODY CONTENT');
  console.log('='.repeat(80));
  console.log(guide.body);

  console.log('\n' + '='.repeat(80));
  console.log('STRUCTURE ANALYSIS');
  console.log('='.repeat(80));

  const body = guide.body;
  const lines = body.split('\n');

  // Count feature boxes
  const featureBoxCount = (body.match(/<div class="feature-box">/g) || []).length;
  const closingBoxCount = (body.match(/<\/div>/g) || []).length;
  
  console.log(`\n📦 Feature Boxes:`);
  console.log(`   Opening tags: ${featureBoxCount}`);
  console.log(`   Closing tags: ${closingBoxCount}`);
  console.log(`   Balanced: ${featureBoxCount === closingBoxCount ? '✅' : '❌'}`);

  // Extract sections
  const sections = [];
  let currentSection = null;
  let inFeatureBox = false;
  let featureBoxContent = '';

  lines.forEach((line, index) => {
    if (line.includes('<div class="feature-box">')) {
      inFeatureBox = true;
      featureBoxContent = '';
    } else if (line.includes('</div>') && inFeatureBox) {
      inFeatureBox = false;
      if (featureBoxContent.trim()) {
        sections.push({
          content: featureBoxContent.trim(),
          lineStart: index - featureBoxContent.split('\n').length + 1,
          lineEnd: index
        });
      }
      featureBoxContent = '';
    } else if (inFeatureBox) {
      featureBoxContent += line + '\n';
      
      // Check for headings
      if (line.trim().startsWith('## ')) {
        const title = line.replace('## ', '').trim();
        if (currentSection) {
          sections[sections.length - 1].title = currentSection.title;
        }
        currentSection = { title, line: index + 1 };
      } else if (line.trim().startsWith('### ')) {
        const title = line.replace('### ', '').trim();
        if (currentSection) {
          currentSection.subtitle = title;
        }
      }
    }
  });

  // Re-analyze to get section titles properly
  const sectionMatches = body.match(/<div class="feature-box">\s*\n\s*(##\s+[^\n]+)/g);
  console.log(`\n📑 Sections Found: ${sections.length}`);
  
  sections.forEach((section, index) => {
    const headingMatch = section.content.match(/^##\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1] : 'No heading';
    const bulletPoints = (section.content.match(/^-\s+.+$/gm) || []).length;
    const numberedList = (section.content.match(/^\d+\.\s+.+$/gm) || []).length;
    
    console.log(`\n   Section ${index + 1}: ${heading}`);
    console.log(`   - Content length: ${section.content.length} chars`);
    console.log(`   - Bullet points: ${bulletPoints}`);
    console.log(`   - Numbered items: ${numberedList}`);
    console.log(`   - Lines: ${section.lineStart} to ${section.lineEnd}`);
  });

  // Analyze markdown structure
  console.log(`\n📝 Markdown Structure:`);
  const h1Count = (body.match(/^#\s+/gm) || []).length;
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  const h3Count = (body.match(/^###\s+/gm) || []).length;
  const bulletCount = (body.match(/^-\s+/gm) || []).length;
  const numberedCount = (body.match(/^\d+\.\s+/gm) || []).length;
  
  console.log(`   H1 (# ): ${h1Count}`);
  console.log(`   H2 (## ): ${h2Count}`);
  console.log(`   H3 (### ): ${h3Count}`);
  console.log(`   Bullet points (- ): ${bulletCount}`);
  console.log(`   Numbered lists (1. ): ${numberedCount}`);

  // Show each feature box content
  console.log('\n' + '='.repeat(80));
  console.log('DETAILED SECTION BREAKDOWN');
  console.log('='.repeat(80));

  const featureBoxRegex = /<div class="feature-box">\s*\n([\s\S]*?)\n\s*<\/div>/g;
  let match;
  let sectionNum = 1;
  
  while ((match = featureBoxRegex.exec(body)) !== null) {
    const sectionContent = match[1].trim();
    const headingMatch = sectionContent.match(/^##\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1] : 'No heading';
    
    console.log(`\n📦 Feature Box ${sectionNum}: ${heading}`);
    console.log('-'.repeat(78));
    console.log(sectionContent);
    console.log('-'.repeat(78));
    sectionNum++;
  }

  // Overall documentation pattern
  console.log('\n' + '='.repeat(80));
  console.log('DOCUMENTATION PATTERN SUMMARY');
  console.log('='.repeat(80));
  console.log(`
📋 Documentation Structure:
   1. Main H1 title: "${guide.title}"
   2. Multiple feature boxes, each containing:
      - An H2 section heading (##)
      - Content (bullet points, paragraphs, or lists)
   3. Each feature box is self-contained and visually separated
   4. Content is concise and action-oriented
   5. Uses bullet points for key information
   
📐 Format Pattern:
   - Wraps content in <div class="feature-box"> tags
   - Uses ## for section headings
   - Uses - for bullet points
   - Keeps sections short and focused
   - No nested feature boxes
   - Clean, scannable structure
  `);
}

analyzeForumGuidelines().catch(console.error);


