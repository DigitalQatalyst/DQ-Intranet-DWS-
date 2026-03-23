import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Converts JSON-formatted guide content to HTML
 */
function convertJsonToHtml(jsonBody) {
  try {
    const content = JSON.parse(jsonBody);
    let html = '';
    
    if (!content.sections || !Array.isArray(content.sections)) {
      console.warn('No sections found in JSON');
      return jsonBody; // Return original if not in expected format
    }
    
    // Sort sections by order
    const sortedSections = content.sections.sort((a, b) => a.order - b.order);
    
    sortedSections.forEach(section => {
      if (section.type === 'text') {
        // Add heading
        html += `<h2 id="${section.id}">${section.title}</h2>\n`;
        
        // Add content (already HTML)
        html += section.content + '\n\n';
        
      } else if (section.type === 'table' && section.table) {
        // Add heading
        html += `<h2 id="${section.id}">${section.title}</h2>\n`;
        
        // Add description if exists
        if (section.description) {
          html += `<p>${section.description}</p>\n`;
        }
        
        // Build table
        html += '<table>\n';
        
        // Table header
        html += '  <thead>\n    <tr>\n';
        section.table.columns.forEach(col => {
          html += `      <th>${col.header}</th>\n`;
        });
        html += '    </tr>\n  </thead>\n';
        
        // Table body
        html += '  <tbody>\n';
        section.table.data.forEach(row => {
          html += '    <tr>\n';
          section.table.columns.forEach(col => {
            const cellValue = row[col.accessor] || '';
            // Convert \n to <br> for line breaks in table cells
            const formattedValue = cellValue.replaceAll(String.raw`\n`, '<br>');
            html += `      <td>${formattedValue}</td>\n`;
          });
          html += '    </tr>\n';
        });
        html += '  </tbody>\n';
        
        html += '</table>\n\n';
      }
    });
    
    return html;
    
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return jsonBody; // Return original if parsing fails
  }
}

async function migrateGuide(slug) {
  console.log(`\n🔄 Converting guide: ${slug}`);
  
  try {
    // Fetch the guide
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', slug)
      .single();
    
    if (fetchError) throw fetchError;
    
    console.log(`   Found: ${guide.title}`);
    
    // Check if already HTML
    if (!guide.body.trim().startsWith('{')) {
      console.log('   ⏭️  Already in HTML format, skipping');
      return;
    }
    
    // Convert JSON to HTML
    const htmlContent = convertJsonToHtml(guide.body);
    
    console.log(`   📝 Converted ${guide.body.length} chars JSON → ${htmlContent.length} chars HTML`);
    
    // Update the guide
    const { error: updateError } = await supabase
      .from('guides')
      .update({ 
        body: htmlContent,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);
    
    if (updateError) throw updateError;
    
    console.log('   ✅ Successfully converted to HTML');
    
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
  }
}

async function migrateAll() {
  console.log('🚀 Starting JSON to HTML migration...\n');
  
  // Migrate the associate-owned-asset-guidelines
  await migrateGuide('dq-associate-owned-asset-guidelines');
  
  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Test the page to verify HTML rendering');
  console.log('2. Check that tables display correctly');
  console.log('3. Verify all sections are visible');
}

migrateAll();
