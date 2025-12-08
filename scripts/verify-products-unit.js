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

async function verifyProductsUnit() {
  console.log('🔍 Verifying Products unit coverage...\n');

  // Check if Products unit has any guides
  const { data: productsGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .eq('unit', 'Products');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Products unit has ${productsGuides.length} guide(s):\n`);
  productsGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   Location: ${g.location || 'null'}`);
  });

  if (productsGuides.length === 0) {
    console.log(`\n⚠️  Products unit is empty. Assigning a guide...`);
    
    // Get a Strategy guide that's not in Products
    const { data: availableGuides } = await supabase
      .from('guides')
      .select('id, title, unit')
      .eq('status', 'Approved')
      .eq('domain', 'Strategy')
      .neq('unit', 'Products')
      .limit(1);

    if (availableGuides && availableGuides.length > 0) {
      const guide = availableGuides[0];
      console.log(`\nAssigning "${guide.title}" to Products unit...`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          unit: 'Products',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
    }
  } else {
    console.log(`\n✅ Products unit is covered.`);
  }
}

verifyProductsUnit().catch(console.error);

