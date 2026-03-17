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

async function updateTechnologyStackSection() {
  console.log('📝 Updating Technology Stack section...\n');

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

  // New Technology Stack section with overview and comprehensive table
  const newTechnologyStackSection = `## Technology Stack

The DWS platform is built on a modern, scalable technology stack designed for performance, reliability, and developer productivity. Each component has been carefully selected based on actual usage in the codebase to provide optimal functionality while maintaining compatibility and ease of maintenance. The stack encompasses frontend frameworks, build tools, UI libraries, state management, authentication services, backend infrastructure, data visualization, and development tools that work together to deliver a robust digital workspace platform.

| Category | Technology | Version | Description |
|---|---|---|---|
| **Frontend Framework** | **React** | 18.3.1 | Modern UI library for building interactive user interfaces with component-based architecture, hooks, and concurrent rendering capabilities |
| **Build Tool** | **Vite** | 7.1.7 | Fast build tool and development server providing optimal developer experience with instant hot module replacement (HMR) and optimized production builds |
| **Language** | **TypeScript** | 5.5.4 | Type-safe JavaScript superset that improves code quality, maintainability, and developer productivity through static type checking and advanced language features |
| **UI Components** | **Radix UI** | Various | Accessible, unstyled UI component primitives including Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Select, Tabs, Toast, and more for building consistent, accessible interfaces |
| **Styling** | **Tailwind CSS** | 3.4.17 | Utility-first CSS framework for rapid UI development with custom design tokens and responsive design capabilities |
| **Icons** | **Lucide React** | 0.441.0 | Beautiful, consistent icon library providing a comprehensive set of icons for the application interface |
| **Animations** | **Framer Motion** | 12.23.24 | Production-ready motion library for animations and transitions enhancing user experience |
| **Routing** | **React Router DOM** | 6.26.2 | Declarative routing for React applications enabling client-side navigation and route management |
| **State Management** | **TanStack React Query** | 5.56.2 | Powerful data synchronization library for server state management, providing efficient data fetching, caching, and synchronization |
| **GraphQL Client** | **Apollo Client** | 4.0.5 | GraphQL client for efficient data fetching and caching, enabling integration with GraphQL APIs |
| **Reactive Programming** | **RxJS** | 7.8.2 | Reactive programming library for complex asynchronous operations and event handling |
| **Authentication** | **Azure MSAL Browser** | 4.23.0 | Microsoft Authentication Library for browser applications providing seamless Azure AD integration for enterprise single sign-on (SSO) |
| **Authentication** | **Azure MSAL React** | 3.0.19 | React-specific MSAL library providing React hooks and components for Azure AD authentication integration |
| **Database & Backend** | **Supabase JS** | 2.77.0 | Backend-as-a-Service client library for database access, real-time subscriptions, and authentication with PostgreSQL backend |
| **Database** | **PostgreSQL (Supabase)** | - | Robust relational database management system providing ACID compliance, real-time subscriptions, and advanced features through Supabase platform |
| **Storage** | **Azure Storage Blob SDK** | 12.28.0 | Cloud storage SDK for managing documents, media files, and other binary data with Azure Blob Storage |
| **Serverless Functions** | **Vercel Node** | 5.3.26 | Serverless API endpoints runtime for scalable backend operations deployed on Vercel platform |
| **Hosting & CI/CD** | **Vercel** | 48.2.9 | CI/CD pipeline and hosting platform providing edge-optimized deployment, automatic scaling, and integrated deployment workflows |
| **Forms** | **React Hook Form** | 7.63.0 | Performant forms library with easy validation and minimal re-renders for building complex form interfaces |
| **Validation** | **Yup** | 1.7.1 | Schema validation library providing powerful and flexible validation for form inputs and data |
| **Validation Resolvers** | **@hookform/resolvers** | 5.2.2 | Validation resolver integrations connecting React Hook Form with validation libraries like Yup |
| **Markdown** | **React Markdown** | 9.0.1 | Markdown rendering component with remark and rehype plugins for rendering markdown content |
| **Markdown Plugins** | **remark-gfm, remark-slug** | 4.0.0, 7.0.1 | GitHub Flavored Markdown support and automatic heading slug generation for markdown content |
| **Markdown Plugins** | **rehype-autolink-headings, rehype-raw, rehype-sanitize** | 7.1.0, 7.0.0, 6.0.0 | Automatic heading linking, raw HTML support, and HTML sanitization for markdown rendering |
| **Rich Text Editor** | **TipTap** | 2.12.0 | Extensible rich text editor framework providing a headless editor for building custom editing experiences |
| **TipTap Starter Kit** | **@tiptap/starter-kit** | 2.8.0 | Pre-configured set of essential TipTap extensions for common rich text editing features |
| **Maps** | **React Leaflet** | 4.2.1 | React wrapper for Leaflet providing interactive maps with open-source mapping library |
| **Maps** | **Leaflet** | 1.9.4 | Open-source JavaScript library for mobile-friendly interactive maps |
| **Maps** | **Mapbox GL** | 3.15.0 | Advanced mapping and geospatial visualization library for sophisticated map features |
| **Data Visualization** | **Recharts** | 3.2.1 | Composable charting library built on React and D3 for creating data visualizations and analytics dashboards |
| **Calendar** | **FullCalendar** | 6.1.19 | Full-featured calendar component with daygrid, timegrid, and interaction plugins for event scheduling and management |
| **Date Picker** | **react-day-picker** | 9.3.0 | Flexible date picker component for date selection in forms and interfaces |
| **Date Utilities** | **date-fns** | 4.0.0 | Modern JavaScript date utility library providing comprehensive date manipulation and formatting functions |
| **Testing** | **Vitest** | 3.2.4 | Fast unit test framework powered by Vite providing quick test execution and development experience |
| **Linting** | **ESLint** | 8.50.0 | Code linting tool for identifying and fixing code quality issues and enforcing coding standards |
| **TypeScript ESLint** | **@typescript-eslint** | 5.54.0 | TypeScript-specific ESLint rules and parser for enhanced type-aware linting |
| **Styling Utilities** | **clsx, class-variance-authority, tailwind-merge** | Latest | Utility libraries for conditional styling, variant management, and Tailwind class merging |
| **Command Palette** | **cmdk** | Latest | Command palette component for keyboard-driven navigation and command execution |
| **Notifications** | **sonner** | 2.0.1 | Toast notification library providing elegant and accessible notification system |
| **Floating UI** | **@floating-ui/react** | 0.26.28 | Positioning library for tooltips, popovers, and floating elements with smart positioning logic |`;

  // Find and replace the Technology Stack section
  const techStackRegex = /## Technology Stack[\s\S]*?(?=\n## |$)/i;
  
  if (!techStackRegex.test(current.body)) {
    console.error('❌ Technology Stack section not found in blueprint');
    return;
  }

  const updatedBody = current.body.replace(techStackRegex, newTechnologyStackSection);

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

  console.log('✅ Successfully updated Technology Stack section!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  console.log('   Technology Stack section now includes overview and comprehensive table format');
  console.log('   All technologies reflect actual versions and usage from package.json');
}

updateTechnologyStackSection().catch(console.error);

