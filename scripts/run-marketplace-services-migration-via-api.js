import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;
if (!dbPassword) {
  console.error('❌ Missing SUPABASE_DB_PASSWORD environment variable.');
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project reference
const urlMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
const projectRef = urlMatch ? urlMatch[1] : null;

if (!projectRef) {
  console.error('❌ Could not extract project reference from Supabase URL');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeMigrationViaAPI() {
  console.log('🚀 Running migration via Supabase Management API...\n');

  try {
    // Read the migration SQL file
    const migrationPath = join(__dirname, '..', 'supabase', 'marketplace-services-schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('⏳ Executing migration via Supabase API...\n');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Use Supabase REST API to execute SQL
    // Note: Supabase doesn't support arbitrary SQL execution via REST API
    // We'll need to use the Management API or create a function
    // For now, let's try using the database connection directly with the password

    const pg = await import('pg');
    const { Client } = pg.default || pg;

    // Try to get the connection string from Supabase
    // The format should be: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
    // But we might need to get the actual connection string from Supabase dashboard

    // Try multiple connection formats
    const connectionStrings = [
      `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`,
      `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    ];

    let client;
    let connected = false;

    for (let i = 0; i < connectionStrings.length; i++) {
      try {
        console.log(`🔌 Trying connection ${i + 1}/${connectionStrings.length}...`);
        client = new Client({
          connectionString: connectionStrings[i],
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 10000
        });

        await client.connect();
        console.log(`✅ Connected successfully!\n`);
        connected = true;
        break;
      } catch (error) {
        console.log(`   Failed: ${error.message.substring(0, 80)}...`);
        if (client) {
          try {
            await client.end();
          } catch (e) {
            // Ignore
          }
        }
      }
    }

    if (!connected) {
      throw new Error('Failed to connect to database with all connection methods');
    }

    // Execute the migration SQL
    console.log('⏳ Executing migration SQL...');
    try {
      await client.query(migrationSQL);
      console.log('✅ Migration executed successfully!\n');
    } catch (sqlError) {
      // Check if it's a "already exists" error
      if (sqlError.message.includes('already exists') && sqlError.message.includes('duplicate')) {
        console.log('⚠️  Some objects may already exist (this is OK)\n');
      } else {
        throw sqlError;
      }
    }

    // Verify the table was created
    console.log('🔍 Verifying migration...');
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'marketplace_services'
      );
    `);

    if (result.rows[0].exists) {
      console.log('✅ Table "marketplace_services" exists!\n');

      // Check row count
      const countResult = await client.query('SELECT COUNT(*) FROM marketplace_services');
      console.log(`📊 Current row count: ${countResult.rows[0].count}\n`);

      console.log('🎉 Migration complete! You can now seed the services:');
      console.log('   npm run db:seed-services\n');
    } else {
      console.log('❌ Table verification failed - table does not exist');
      throw new Error('Table was not created');
    }

    await client.end();

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Alternative: Run migration manually');
    console.error('   1. Go to https://app.supabase.com');
    console.error('   2. Open SQL Editor');
    console.error('   3. Copy contents of: supabase/marketplace-services-schema.sql');
    console.error('   4. Paste and run\n');
    throw error;
  }
}

// Check if table already exists
async function checkTableExists() {
  try {
    const { data, error } = await supabase
      .from('marketplace_services')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return false;
      }
      throw error;
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🚀 Marketplace Services Migration\n');
  console.log('='.repeat(50));

  // Check if table already exists
  console.log('\n🔍 Checking if table already exists...');
  const exists = await checkTableExists();

  if (exists) {
    console.log('✅ Table "marketplace_services" already exists!');

    const { count } = await supabase
      .from('marketplace_services')
      .select('*', { count: 'exact', head: true });

    console.log(`   Current row count: ${count || 0}\n`);
    console.log('✅ Migration already complete!\n');
    return;
  }

  console.log('❌ Table does not exist - running migration...\n');
  await executeMigrationViaAPI();
}

main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

