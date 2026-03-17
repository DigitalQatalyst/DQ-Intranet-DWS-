const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jmhtrffmxjxhoxpesubv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGFiYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTk5NzAsImV4cCI6MTc3MDYyNDc3MH0.zRr4o_ub7N9nWGhsFuGTuCOOk7o6eBFh8liNBmagZZE'
);

async function getHOVContent() {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dq-hov')
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (data && data.body) {
      console.log('HOV Content Preview:');
      console.log(data.body.substring(0, 2000));
      
      // Look for progress bars or completion indicators
      if (data.body.includes('progress') || data.body.includes('completion') || data.body.includes('percentage')) {
        console.log('\n=== Found progress-related content ===');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

getHOVContent();
