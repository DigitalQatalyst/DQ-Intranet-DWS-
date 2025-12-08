import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n=== Environment Variables Check ===\n');

if (url) {
  // Show partial URL for privacy
  const urlParts = url.split('.');
  if (urlParts.length > 0) {
    const masked = urlParts[0] + '.' + urlParts.slice(1).map(() => '***').join('.');
    console.log('VITE_SUPABASE_URL:', masked);
  } else {
    console.log('VITE_SUPABASE_URL:', url);
  }
  
  // Check if it looks like a valid Supabase URL
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    console.log('⚠️  URL should start with https://');
  }
  if (!url.includes('supabase')) {
    console.log('⚠️  URL should contain "supabase"');
  }
} else {
  console.log('❌ VITE_SUPABASE_URL is not set');
}

if (anon) {
  console.log('VITE_SUPABASE_ANON_KEY:', anon.substring(0, 20) + '...' + anon.substring(anon.length - 10));
  console.log('Key length:', anon.length, 'characters');
} else {
  console.log('❌ VITE_SUPABASE_ANON_KEY is not set');
}

console.log('\n=== Common Issues ===\n');
console.log('If you see placeholder values like:');
console.log('  - "your-project.supabase.co"');
console.log('  - "your-anon-key-here"');
console.log('\nYou need to:');
console.log('  1. Create a Supabase project at https://supabase.com');
console.log('  2. Get your credentials from Settings > API');
console.log('  3. Update your .env file with real values');
console.log('  4. Restart your dev server (npm run dev)');
console.log('\nIf your project URL is correct but connection fails:');
console.log('  - Check your internet connection');
console.log('  - Verify the Supabase project exists and is active');
console.log('  - Try accessing the URL in a browser');
