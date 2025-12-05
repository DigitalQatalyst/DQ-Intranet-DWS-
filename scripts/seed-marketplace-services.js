import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Dynamic import of TypeScript mock data
let mockFinancialServices = [];
let mockNonFinancialServices = [];

try {
  // Use dynamic import with .ts extension (works with tsx/ts-node)
  const mockDataModule = await import('../src/utils/mockMarketplaceData.ts');
  mockFinancialServices = mockDataModule.mockFinancialServices || [];
  mockNonFinancialServices = mockDataModule.mockNonFinancialServices || [];
} catch (e) {
  console.error('❌ Error importing mock data:', e.message);
  console.error('💡 Make sure to run with: npx tsx scripts/seed-marketplace-services.js');
  console.error('   Or use: npm run db:seed-services (which uses tsx)');
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Transform financial service to database format
 */
function transformFinancialService(service) {
  return {
    id: service.id,
    marketplace_type: 'financial',
    title: service.title,
    description: service.description,
    category: service.category || null,
    service_type: service.serviceType || null,
    business_stage: service.businessStage || null,
    delivery_mode: null,
    amount: service.amount || null,
    duration: service.duration || null,
    interest_rate: service.interestRate || null,
    eligibility: service.eligibility || null,
    price: null,
    provider: {
      name: service.provider?.name || '',
      logoUrl: service.provider?.logoUrl || '',
      description: service.provider?.description || ''
    },
    details: service.details || [],
    tags: service.tags || [],
    image_url: service.imageUrl || null,
    status: 'active'
  };
}

/**
 * Transform non-financial service to database format
 */
function transformNonFinancialService(service) {
  return {
    id: service.id,
    marketplace_type: 'non-financial',
    title: service.title,
    description: service.description,
    category: service.category || null,
    service_type: service.serviceType || null,
    business_stage: service.businessStage || null,
    delivery_mode: service.deliveryMode || null,
    amount: null,
    duration: service.duration || null,
    interest_rate: null,
    eligibility: null,
    price: service.price || null,
    provider: {
      name: service.provider?.name || '',
      logoUrl: service.provider?.logoUrl || '',
      description: service.provider?.description || ''
    },
    details: service.details || [],
    tags: service.tags || [],
    image_url: service.imageUrl || null,
    status: 'active'
  };
}

async function seedServices() {
  console.log('🌱 Seeding marketplace services...\n');

  try {
    // Transform services
    const financialServices = mockFinancialServices.map(transformFinancialService);
    const nonFinancialServices = mockNonFinancialServices.map(transformNonFinancialService);
    const allServices = [...financialServices, ...nonFinancialServices];

    console.log(`📊 Found ${financialServices.length} financial services`);
    console.log(`📊 Found ${nonFinancialServices.length} non-financial services`);
    console.log(`📊 Total: ${allServices.length} services\n`);

    // Upsert services (insert or update if exists)
    const { data, error } = await supabase
      .from('marketplace_services')
      .upsert(allServices, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) {
      throw error;
    }

    console.log('✅ Successfully seeded marketplace services!\n');

    // Verify counts
    const { count: financialCount } = await supabase
      .from('marketplace_services')
      .select('*', { count: 'exact', head: true })
      .eq('marketplace_type', 'financial');

    const { count: nonFinancialCount } = await supabase
      .from('marketplace_services')
      .select('*', { count: 'exact', head: true })
      .eq('marketplace_type', 'non-financial');

    console.log(`✅ Financial services in database: ${financialCount}`);
    console.log(`✅ Non-financial services in database: ${nonFinancialCount}`);
    console.log(`✅ Total services in database: ${(financialCount || 0) + (nonFinancialCount || 0)}\n`);

    console.log('🎉 Seeding complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Update your marketplace service to fetch from database');
    console.log('   2. Services will now persist across branches');

  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();

