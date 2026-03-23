import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function improveHtmlStructure(html) {
  let improved = html;
  
  // Find text between </h2> and next <h2> or <table> or <ul>
  // Wrap it in <p> tags if not already wrapped
  improved = improved.replaceAll(
    /(<\/h2>)\s*([^<][^<]*)/g,
    (match, closingTag, text) => {
      // Clean up the text
      const cleanText = text.trim();
      if (cleanText && !cleanText.startsWith('<')) {
        return `${closingTag}\n<p>${cleanText}</p>\n`;
      }
      return match;
    }
  );
  
  // Wrap standalone text paragraphs (text followed by double newline)
  improved = improved.replaceAll(
    /\n\n([^<][^<]+)\n\n/g,
    '\n\n<p>$1</p>\n\n'
  );
  
  return improved;
}

async function improve() {
  console.log('🔧 Improving HTML structure...\n');

  try {
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (fetchError) throw fetchError;

    console.log(`Found: ${guide.title}`);
    console.log(`Current length: ${guide.body.length} characters`);

    const improvedHtml = improveHtmlStructure(guide.body);
    
    console.log(`Improved length: ${improvedHtml.length} characters`);
    console.log('\nFirst 800 chars after improvement:');
    console.log('---');
    console.log(improvedHtml.substring(0, 800));
    console.log('---');

    // Update the database
    const { error: updateError } = await supabase
      .from('guides')
      .update({ 
        body: improvedHtml,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) throw updateError;

    console.log('\n✅ Successfully improved HTML structure');
    console.log('   Content should now render with proper paragraphs');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

improve();
