import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// This script extracts the hardcoded data from the current component
// and stores it in the database as JSON

const guidelineContent = {
  sections: [
    {
      id: "context",
      title: "1. Context",
      order: 1,
      type: "text",
      content: `The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.\n\nIn this context, the \`Company\` refers to DQ whereas \`Devices\` refers to laptops.`
    },
    {
      id: "overview",
      title: "2. Overview",
      order: 2,
      type: "text",
      content: `The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:\n\n- Mitigate Asset Theft.\n- Promote Accountability.\n- Support Seamless Transitions.\n- Optimize Operational Efficiency.`
    },
    {
      id: "purpose-scope",
      title: "3. Purpose and Scope",
      order: 3,
      type: "text",
      content: `### 3.1 Purpose\n\nThe purpose of the Associate Owned Asset Guidelines is to transition to an associate-owned device model at DQ, aimed at mitigating asset theft by departing associates while ensuring accountability, and proper maintenance of devices used for work. These guidelines empower associates with flexible options to use and manage their personal work devices.\n\n### 3.2 Scope\n\nThese guidelines apply to all DQ Associates. They cover the use of personal devices for all company-related work and include procedures for the BYOD, FYOD and HYOD programs.\n\nThe scope also involves clear responsibilities for device acquisition, maintenance, and reporting.`
    },
    {
      id: "core-components",
      title: "4. Core Components",
      order: 4,
      type: "table",
      description: "The Guidelines comprises of three core programs designed to assist associates during the transition:",
      table: {
        title: "Core Components",
        columns: [
          { header: "#", accessor: "number" },
          { header: "Program", accessor: "program" },
          { header: "Description", accessor: "description" }
        ],
        data: [
          {
            number: "01",
            program: "BYOD (Bring Your Own Device)",
            description: "Associates are required to bring their personal devices, including headsets, to work. The devices must meet the minimum technical specifications set by DQ."
          },
          {
            number: "02",
            program: "FYOD (Finance Your Own Device)",
            description: "Associates can apply for the FYOD program to purchase a company's device, with the cost deducted from their monthly salary. The purchase is subject to approval by the company"
          },
          {
            number: "03",
            program: "HYOD (Hold Your Own Device)",
            description: "In emergency cases where a personal device is temporarily unavailable, associates may \"Hold Their Own Device\" by borrowing a company device."
          }
        ]
      }
    },
    {
      id: "roles-responsibilities",
      title: "5. Roles and Responsibilities",
      order: 5,
      type: "text",
      content: "To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:"
    },
    {
      id: "byod",
      title: "5.1 BYOD (Bring Your Own Device)",
      order: 6,
      type: "text",
      content: "Associates in the Bring Your Own Device (BYOD) program are required to use their personal devices, including headsets, for work. These devices must meet the minimum technical standards set by the company."
    }
  ]
};

async function updateDatabase() {
  console.log('📝 Updating Associate Owned Asset Guidelines in database...\n');

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('guides')
      .select('id, slug')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .maybeSingle();

    if (fetchError) {
      console.error('❌ Error fetching guide:', fetchError);
      return;
    }

    const bodyContent = JSON.stringify(guidelineContent);

    if (existing) {
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          body: bodyContent,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('❌ Error updating guide:', updateError);
        return;
      }

      console.log('✅ Successfully updated guide in database!');
      console.log(`   Guide ID: ${existing.id}`);
    } else {
      const { data: newGuide, error: insertError } = await supabase
        .from('guides')
        .insert({
          slug: 'dq-associate-owned-asset-guidelines',
          title: 'DQ Ops | Associate Owned Asset Guidelines',
          summary: 'Guidelines for transitioning to an associate-owned device model at DQ, including BYOD, FYOD, and HYOD programs to mitigate asset theft, promote accountability, and optimize operational efficiency.',
          domain: 'Guidelines',
          guide_type: 'Guideline',
          status: 'Approved',
          body: bodyContent,
          last_updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ Error creating guide:', insertError);
        return;
      }

      console.log('✅ Successfully created guide in database!');
      console.log(`   Guide ID: ${newGuide.id}`);
    }

    console.log(`\n📊 Stored ${guidelineContent.sections.length} sections`);
    console.log('\n⚠️  NOTE: This script only includes the first 6 sections as an example.');
    console.log('   You need to add the remaining sections (BYOD procedures, FYOD, HYOD, etc.)');
    console.log('   to complete the migration.\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateDatabase();
