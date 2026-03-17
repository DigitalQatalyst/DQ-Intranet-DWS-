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

async function updateBestPracticesSection() {
  console.log('📝 Updating Best Practices section...\n');

  const slug = 'dws-blueprint';

  // Get current blueprint
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', slug)
    .maybeSingle();

  if (fetchError) {
    console.error('❌ Error fetching blueprint:', fetchError.message);
    return;
  }

  if (!current || !current.body) {
    console.error('❌ DWS Blueprint not found');
    return;
  }

  // New Best Practices section with overview and table
  const newBestPracticesSection = `## Best Practices

The DWS platform follows industry-leading best practices across development, performance, and security domains to ensure code quality, optimal performance, and robust security. These practices are designed to maintain high standards throughout the software development lifecycle, from initial development through deployment and ongoing maintenance. By adhering to these guidelines, teams can deliver reliable, scalable, and secure solutions that meet organizational requirements and exceed user expectations.

| Practice Category | Practice | Description |
|---|---|---|
| **Development Practices** | **Code Quality** | Adhere to TypeScript best practices for type safety, implement comprehensive error handling, write unit and integration tests for critical functionality, follow React best practices and patterns, use code linting and formatting tools, and implement proper logging and monitoring. |
| **Development Practices** | **Code Organization** | Organize code by feature rather than by type, use consistent naming conventions, ensure proper separation of concerns, create reusable components and utilities, document complex logic and algorithms, and maintain clean code principles prioritizing readability and maintainability. |
| **Development Practices** | **Version Control** | Write meaningful commit messages describing what changed and why, create feature branches for all new work, conduct code reviews before merging, keep commits atomic and focused, use pull requests for collaboration, and tag releases appropriately for stable versions. |
| **Performance Optimization** | **Frontend Optimization** | Implement code splitting and lazy loading, optimize images and assets, use caching strategies effectively, minimize bundle sizes through tree shaking, optimize rendering performance with efficient React patterns, and implement virtual scrolling for large lists. |
| **Performance Optimization** | **Backend Optimization** | Monitor and optimize database queries, implement proper indexing strategies, use connection pooling, implement caching layers at multiple levels, optimize API response times, and use pagination for large datasets. |
| **Performance Optimization** | **Network Optimization** | Minimize HTTP requests through request batching, use CDN for static assets, implement request compression, use HTTP/2 where possible, optimize API payload sizes, and enable request batching to reduce round trips. |
| **Security Practices** | **Secure Development** | Never commit sensitive credentials to version control, use environment variables for configuration, implement proper input validation and sanitization, follow OWASP security guidelines, conduct regular security audits and updates, and implement careful error handling without exposing sensitive information. |
| **Security Practices** | **Access Control** | Enforce principle of least privilege, implement role-based access control (RBAC), conduct regular access reviews and audits, implement session timeout mechanisms, enforce secure password policies, and implement account lockout mechanisms. |
| **Security Practices** | **Data Protection** | Encrypt sensitive data at rest and in transit, implement proper data backup procedures, follow data retention policies, implement data anonymization where appropriate, conduct regular security assessments, and maintain incident response procedures. |`;

  // Find and replace the Best Practices section
  const bestPracticesRegex = /## Best Practices[\s\S]*?(?=\n## |$)/i;
  
  if (!bestPracticesRegex.test(current.body)) {
    console.error('❌ Best Practices section not found in blueprint');
    return;
  }

  const updatedBody = current.body.replace(bestPracticesRegex, newBestPracticesSection);

  // Update the blueprint
  const { error: updateError } = await supabase
    .from('guides')
    .update({
      body: updatedBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', slug);

  if (updateError) {
    console.error('❌ Error updating blueprint:', updateError.message);
    return;
  }

  console.log('✅ Successfully updated Best Practices section!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  console.log('   Best Practices section now includes overview and table format');
}

updateBestPracticesSection().catch(console.error);

