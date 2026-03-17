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

async function updateArchitectureSection() {
  console.log('📝 Updating Architecture section...\n');

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

  // New Architecture section with overview and table
  const newArchitectureSection = `## Architecture

The DWS platform follows a modern, microservices-oriented architecture designed for scalability, maintainability, and performance. The architecture is structured across three primary layers: system architecture (frontend, backend, and infrastructure), deployment strategy (environment management, CI/CD, version control, and rollback procedures), and security architecture (authentication, authorization, data protection, API security, and compliance). This comprehensive approach ensures that the platform can scale efficiently, deploy reliably, and maintain the highest standards of security and operational excellence.

| Architecture Layer | Component | Description |
|---|---|---|
| **System Architecture** | **Frontend Architecture** | React-based single-page application (SPA) with client-side routing, component-based approach with reusable UI components, state management through React Query and Apollo Client, and Progressive Web App (PWA) capabilities for offline support and enhanced mobile experience. |
| **System Architecture** | **Backend Architecture** | Serverless functions for API endpoints and business logic, PostgreSQL database hosted on Supabase for data persistence with ACID compliance, real-time subscriptions for live data updates, and event-driven pattern for asynchronous processing and decoupled system components. |
| **System Architecture** | **Infrastructure** | Azure Blob Storage for document and media file storage, Azure AD integration for enterprise single sign-on (SSO) authentication, Vercel deployment platform with edge-optimized deployment and automatic scaling, and global CDN for fast content delivery worldwide. |
| **Deployment Strategy** | **Environment Management** | Three distinct environments supporting the development lifecycle: development environment with local setup and hot reloading for rapid iteration, staging environment as pre-production space for comprehensive testing, and production environment as live system with monitoring and alerting for reliability and performance. |
| **Deployment Strategy** | **CI/CD Pipeline** | Automated software delivery process with testing on every pull request for code quality, automatic build and deployment after merge, environment-specific configuration management, and automated rollback capabilities for quick recovery from deployment issues. |
| **Deployment Strategy** | **Version Control** | Git-based version control with branch-based deployment strategies for parallel development, semantic versioning for all releases, changelog maintenance for stakeholder communication, and tagged releases for production deployments enabling easy rollback. |
| **Deployment Strategy** | **Rollback Procedures** | Comprehensive rollback capabilities including immediate reversion to previous stable versions for critical issues, database migration rollback support for safe schema change reversal, configuration rollback procedures for rapid restoration, and communication protocols for stakeholder notification during rollback events. |
| **Security Architecture** | **Authentication** | Azure AD with multi-factor authentication (MFA) support for additional security layer, Single Sign-On (SSO) capabilities for seamless user experience, robust session management and token refresh mechanisms, and password policies with account lockout procedures protecting against brute force attacks. |
| **Security Architecture** | **Authorization** | Role-based access control (RBAC) for feature access based on user roles, permission-based authorization for fine-grained control over actions and resources, resource-level access control ensuring role-appropriate data access, and comprehensive audit logging for security monitoring and compliance. |
| **Security Architecture** | **Data Protection** | Multiple layers of encryption including end-to-end encryption protecting sensitive data throughout lifecycle, encryption at rest for stored data protection, encryption in transit via TLS/SSL for secure communications, and key management with rotation procedures for secure encryption key maintenance. |
| **Security Architecture** | **API Security** | Multiple protective measures including rate limiting preventing abuse and DoS attacks, input validation and sanitization ensuring safe and properly formatted inputs, authentication required for all endpoints, CORS policy configuration controlling cross-origin access, and API versioning with deprecation strategies for safe evolution. |
| **Security Architecture** | **Compliance** | Adherence to multiple compliance standards including GDPR for European data protection and user privacy, SOC 2 for security controls and operational procedures, industry-specific regulations like HIPAA and PCI-DSS where applicable, data residency requirements for appropriate geographic storage, and privacy policy adherence for transparent data handling. |`;

  // Find and replace the Architecture section
  const architectureRegex = /## Architecture[\s\S]*?(?=\n## |$)/i;
  
  if (!architectureRegex.test(current.body)) {
    console.error('❌ Architecture section not found in blueprint');
    return;
  }

  const updatedBody = current.body.replace(architectureRegex, newArchitectureSection);

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

  console.log('✅ Successfully updated Architecture section!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  console.log('   Architecture section now includes overview and table format');
}

updateArchitectureSection().catch(console.error);

