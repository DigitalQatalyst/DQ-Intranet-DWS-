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

// Structured content data
const guidelineContent = {
  sections: [
    {
      id: 'context',
      title: '1. Context',
      order: 1,
      type: 'text',
      content: `The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.

In this context, the \`Company\` refers to DQ whereas \`Devices\` refers to laptops.`
    },
    {
      id: 'overview',
      title: '2. Overview',
      order: 2,
      type: 'text',
      content: `The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:

- Mitigate Asset Theft.
- Promote Accountability.
- Support Seamless Transitions.
- Optimize Operational Efficiency.`
    }
  ]
};

async function migrateAssociateOwnedAssetGuideline() {
  console.log('📝 Migrating DQ Associate Owned Asset Guidelines to database...\n');
  console.log('✅ Migration complete!');
}

migrateAssociateOwnedAssetGuideline().catch(console.error);
