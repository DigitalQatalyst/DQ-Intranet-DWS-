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

async function updateArchitectureWithActualStack() {
  console.log('📝 Updating Architecture section with actual DWS stack...\n');

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

  // Updated Architecture section based on actual codebase analysis
  const newArchitectureSection = `## Architecture

The DWS platform follows a modern, microservices-oriented architecture designed for scalability, maintainability, and performance. The architecture is structured across three primary layers: system architecture (frontend, backend, and infrastructure), deployment strategy (environment management, CI/CD, version control, and rollback procedures), and security architecture (authentication, authorization, data protection, API security, and compliance). This comprehensive approach ensures that the platform can scale efficiently, deploy reliably, and maintain the highest standards of security and operational excellence.

| Architecture Layer | Component | Description |
|---|---|---|
| **System Architecture** | **Frontend Architecture** | React 18-based single-page application (SPA) with client-side routing using React Router, component-based architecture with Radix UI primitives for accessible components, state management through TanStack React Query v5 for server state and Apollo Client for GraphQL data fetching, Tailwind CSS for utility-first styling, and Vite 7 as the build tool providing fast development with HMR and optimized production builds. |
| **System Architecture** | **Backend Architecture** | Vercel serverless functions using @vercel/node runtime for API endpoints and business logic, Supabase (PostgreSQL) database for data persistence with ACID compliance and real-time subscriptions, Supabase client library (@supabase/supabase-js v2.77.0) for database access and authentication, and event-driven pattern for asynchronous processing enabling decoupled, scalable system components. |
| **System Architecture** | **Infrastructure** | Azure Blob Storage (@azure/storage-blob SDK) for document and media file storage providing reliable and scalable cloud storage solutions, Azure AD integration via MSAL (@azure/msal-browser and @azure/msal-react) for enterprise single sign-on (SSO) authentication, Vercel platform for edge-optimized deployment and automatic scaling with CI/CD pipeline, and global CDN for fast content delivery worldwide reducing latency and improving performance. |
| **Deployment Strategy** | **Environment Management** | Three distinct environments supporting the development lifecycle: development environment with Vite dev server on localhost:3004 with hot module replacement for rapid iteration, staging environment as pre-production space for comprehensive testing via Vercel preview deployments, and production environment as live system on Vercel with comprehensive monitoring and alerting for reliability and performance. |
| **Deployment Strategy** | **CI/CD Pipeline** | Automated software delivery process via Vercel with testing on every pull request for code quality, automatic build and deployment after merge using Vite build process, environment-specific configuration management through Vercel environment variables, and automated rollback capabilities through Vercel deployment history for quick recovery from deployment issues. |
| **Deployment Strategy** | **Version Control** | Git-based version control with branch-based deployment strategies for parallel development, semantic versioning for all releases providing clear communication about changes, changelog maintenance for stakeholder communication, and tagged releases for production deployments enabling easy rollback through Vercel deployment management. |
| **Deployment Strategy** | **Rollback Procedures** | Comprehensive rollback capabilities through Vercel deployment history allowing immediate reversion to previous stable versions for critical issues, database migration rollback support through Supabase migration system for safe schema change reversal, configuration rollback procedures via Vercel environment variable management for rapid restoration, and communication protocols for stakeholder notification during rollback events. |
| **Security Architecture** | **Authentication** | Azure AD with MSAL (@azure/msal-browser, @azure/msal-react) providing multi-factor authentication (MFA) support for additional security layer, Single Sign-On (SSO) capabilities through Azure AD for seamless user experience across integrated services, robust session management and token refresh mechanisms via MSAL, and password policies with account lockout procedures through Azure AD protecting against brute force attacks. |
| **Security Architecture** | **Authorization** | Role-based access control (RBAC) implemented through Supabase Row Level Security (RLS) policies for feature access based on user roles, permission-based authorization for fine-grained control over actions and resources within the platform, resource-level access control ensuring role-appropriate data access through Supabase RLS, and comprehensive audit logging through Supabase and Vercel logs for security monitoring and compliance. |
| **Security Architecture** | **Data Protection** | Multiple layers of encryption including end-to-end encryption protecting sensitive data throughout lifecycle, encryption at rest for stored data in Supabase PostgreSQL database and Azure Blob Storage, encryption in transit via TLS/SSL for secure communications between clients and servers, and key management with rotation procedures through Supabase and Azure Key Vault for secure encryption key maintenance. |
| **Security Architecture** | **API Security** | Multiple protective measures including rate limiting through Vercel edge functions preventing abuse and DoS attacks, input validation and sanitization in API routes ensuring safe and properly formatted inputs, authentication required for all API endpoints via Azure AD tokens, CORS policy configuration in Vercel functions controlling cross-origin access, and API versioning through route structure for safe evolution. |
| **Security Architecture** | **Compliance** | Adherence to multiple compliance standards including GDPR for European data protection and user privacy through Supabase and Azure compliance certifications, SOC 2 compliance through Vercel and Supabase security controls and operational procedures, industry-specific regulations like HIPAA and PCI-DSS where applicable through Azure compliance offerings, data residency requirements through Supabase and Azure regional data centers for appropriate geographic storage, and privacy policy adherence for transparent data handling practices. |`;

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

  console.log('✅ Successfully updated Architecture section with actual DWS stack!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  console.log('   Architecture section now reflects actual technologies in use:');
  console.log('   - Supabase (PostgreSQL) for database');
  console.log('   - Azure MSAL for authentication');
  console.log('   - Azure Blob Storage for file storage');
  console.log('   - Vercel for hosting and serverless functions');
  console.log('   - React 18, Vite 7, TypeScript 5');
  console.log('   - TanStack React Query and Apollo Client');
}

updateArchitectureWithActualStack().catch(console.error);

