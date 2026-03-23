import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Using URL:', supabaseUrl);
console.log('Using Service Role Key:', supabaseKey ? 'Yes' : 'No');

const supabase = createClient(supabaseUrl, supabaseKey);

const content = {
  sections: [
    {
      id: "context",
      title: "1. Context",
      order: 1,
      type: "text",
      content: "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.\\n\\nIn this context, the `Company` refers to DQ whereas `Devices` refers to laptops."
    },
    {
      id: "overview",
      title: "2. Overview",
      order: 2,
      type: "text",
      content: "The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:\\n\\n<ul class='list-disc pl-6 space-y-2'><li>Mitigate Asset Theft.</li><li>Promote Accountability.</li><li>Support Seamless Transitions.</li><li>Optimize Operational Efficiency.</li></ul>"
    }
  ]
};

async function update() {
  try {
    // First, let's see what guides exist
    const { data: guides } = await supabase
      .from('guides')
      .select('id, slug, title')
      .ilike('slug', '%associate%');

    console.log('\nGuides with "associate" in slug:');
    console.log(guides);

    if (guides && guides.length > 0) {
      const guide = guides[0];
      console.log(`\nUpdating guide: ${guide.slug}`);
      
      const { data, error } = await supabase
        .from('guides')
        .update({ body: JSON.stringify(content) })
        .eq('id', guide.id)
        .select();

      if (error) {
        console.error('Update error:', error);
      } else {
        console.log('✅ Update successful!');
        console.log('Updated data:', data);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

update();
