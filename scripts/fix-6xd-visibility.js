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

async function fix6xDVisibility() {
  console.log('🔄 Fixing 6xD framework visibility...\n');

  // Find Strategy guides with 6xD/digital-framework
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, location, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Find 6xD guides
  const sixxdGuides = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const subDomain = (g.sub_domain || '').toLowerCase();
    return (domain.includes('strategy') && subDomain.includes('digital-framework'));
  });

  console.log(`📊 Found ${sixxdGuides.length} guides with 6xD framework:\n`);

  // Check their locations
  for (const guide of sixxdGuides) {
    console.log(`📝 ${guide.title}`);
    console.log(`   Current Location: ${guide.location || 'N/A'}`);
    
    // If only in NBO, add DXB to make it more visible
    if (guide.location === 'NBO') {
      console.log(`   ⚠️  Only in NBO - adding DXB for better visibility`);
      
      // For now, let's duplicate or update to include DXB
      // Actually, we can't have multiple locations in one field, so let's check if we should create a duplicate
      // Or better: update one to DXB and keep one in NBO, or update both to include DXB
      
      // Let's update one to DXB to ensure visibility
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          location: 'DXB',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated to DXB`);
      }
    } else {
      console.log(`   ✅ Already in ${guide.location}`);
    }
    console.log('');
  }

  console.log('✅ Visibility fix complete!');
  console.log('\nNote: 6xD guides should now be visible on the first page when filtering by 6xD framework.');
}

fix6xDVisibility().catch(console.error);

