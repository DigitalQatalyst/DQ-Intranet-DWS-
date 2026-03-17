/**
 * Shared database connection helper for migration / admin scripts.
 *
 * Usage:
 *   import { connectDb } from './db.js';
 *   const client = await connectDb();
 *   // … run queries …
 *   await client.end();
 *
 * Reads the connection string from environment variables
 * (SUPABASE_CONNECTION_STRING or DATABASE_URL).
 * Loads .env via dotenv/config automatically.
 */
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const CONNECTION_STRING_ENV = process.env.SUPABASE_CONNECTION_STRING || process.env.DATABASE_URL;

/**
 * Creates and connects a pg Client.
 * Exits the process with a clear error if the connection string is missing.
 */
export async function connectDb() {
    if (!CONNECTION_STRING_ENV) {
        console.error('❌ Missing SUPABASE_CONNECTION_STRING or DATABASE_URL environment variable.');
        console.error('   Set it in your .env file before running this script.');
        process.exit(1);
    }

    const client = new Client({ connectionString: CONNECTION_STRING_ENV });
    await client.connect();
    console.log('Connected to Supabase database\n');
    return client;
}
