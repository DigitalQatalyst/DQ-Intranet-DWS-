#!/usr/bin/env node
/**
 * Helper script to guide you through setting up Supabase environment variables
 * Run with: node setup-supabase-env.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🔧 Supabase Environment Setup\n');
  console.log('This script will help you add your Supabase credentials to .env\n');
  console.log('To get your credentials:');
  console.log('1. Go to https://app.supabase.com');
  console.log('2. Log in with: donna.nyacuru@digitalqatalyst.com');
  console.log('3. Select your DWS project');
  console.log('4. Go to Settings → API');
  console.log('5. Copy the Project URL and anon/public key\n');

  const url = await question('Enter your VITE_SUPABASE_URL: ');
  const anonKey = await question('Enter your VITE_SUPABASE_ANON_KEY: ');
  const serviceKey = await question('Enter your SUPABASE_SERVICE_ROLE_KEY (optional, press Enter to skip): ');

  if (!url || !anonKey) {
    console.log('\n❌ URL and Anon Key are required!');
    rl.close();
    return;
  }

  // Read current .env
  const envPath = resolve(process.cwd(), '.env');
  let envContent = '';
  try {
    envContent = readFileSync(envPath, 'utf-8');
  } catch (err) {
    console.log('Creating new .env file...');
  }

  // Remove old Supabase entries if they exist
  const lines = envContent.split('\n');
  const filteredLines = [];
  let inSupabaseSection = false;
  
  for (const line of lines) {
    if (line.includes('# Supabase Configuration')) {
      inSupabaseSection = true;
      continue;
    }
    if (inSupabaseSection && (line.startsWith('VITE_SUPABASE') || line.startsWith('SUPABASE_SERVICE') || line.trim() === '')) {
      continue;
    }
    if (inSupabaseSection && !line.startsWith('VITE_SUPABASE') && !line.startsWith('SUPABASE_SERVICE') && line.trim() !== '') {
      inSupabaseSection = false;
    }
    if (!inSupabaseSection) {
      filteredLines.push(line);
    }
  }

  // Add new Supabase entries
  filteredLines.push('');
  filteredLines.push('# Supabase Configuration');
  filteredLines.push(`VITE_SUPABASE_URL=${url}`);
  filteredLines.push(`VITE_SUPABASE_ANON_KEY=${anonKey}`);
  if (serviceKey) {
    filteredLines.push(`SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`);
  }

  // Write back to .env
  writeFileSync(envPath, filteredLines.join('\n') + '\n');

  console.log('\n✅ Environment variables saved to .env');
  console.log('\n📝 Next steps:');
  console.log('1. Restart your development server (if running)');
  console.log('2. Run: node test-supabase-connection.js');
  console.log('3. Check your Work Directory page\n');

  rl.close();
}

setup().catch(console.error);

