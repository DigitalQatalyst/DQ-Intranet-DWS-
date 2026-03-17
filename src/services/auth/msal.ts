import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

// Support both NEXT_PUBLIC_* and VITE_* envs
const env = (import.meta as any).env as Record<string, string | undefined>;

// Client ID must be provided via environment variable
const CLIENT_ID = env.NEXT_PUBLIC_AAD_CLIENT_ID || env.VITE_AZURE_CLIENT_ID;

// Development mode check - allow missing credentials in development
const isDevelopment = env.DEV === true || env.NODE_ENV === 'development';
const hasValidClientId = CLIENT_ID && CLIENT_ID !== 'your_azure_client_id_here';

if (!CLIENT_ID && !isDevelopment) {
  throw new Error(
    "Azure AD Client ID is required. Please set VITE_AZURE_CLIENT_ID or NEXT_PUBLIC_AAD_CLIENT_ID in your .env file.\n\n" +
    "This application uses Azure Entra ID (not B2C) for authentication."
  );
}

// Use placeholder values in development if real credentials are not available
const DEVELOPMENT_CLIENT_ID = "00000000-0000-0000-0000-000000000000";
const DEVELOPMENT_TENANT_ID = "00000000-0000-0000-0000-000000000000";

const FINAL_CLIENT_ID = hasValidClientId ? CLIENT_ID : DEVELOPMENT_CLIENT_ID;
const REDIRECT_URI =
  env.NEXT_PUBLIC_REDIRECT_URI ||
  env.VITE_AZURE_REDIRECT_URI ||
  window.location.origin;
const POST_LOGOUT_REDIRECT_URI =
  env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI ||
  env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI ||
  REDIRECT_URI;
const API_SCOPES = (env.NEXT_PUBLIC_API_SCOPES || env.VITE_AZURE_SCOPES || "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

// Always request standard OIDC scopes; include email to avoid UPN-only claims and offline_access for refresh tokens
const DEFAULT_OIDC_SCOPES = ["openid", "profile", "email", "offline_access"] as const;

// Entra ID (Azure AD) Configuration
// Tenant ID is required for Entra ID authentication
// Can be provided as either tenant ID (GUID) or verified domain name
// Tenant ID or Domain must be provided via environment variable
const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID || env.VITE_AZURE_TENANT_ID;
const TENANT_DOMAIN = env.NEXT_PUBLIC_TENANT_DOMAIN || env.VITE_AZURE_TENANT_DOMAIN;

// Use development placeholders if real credentials are not available
const FINAL_TENANT_ID = (TENANT_ID && TENANT_ID !== 'your_azure_tenant_id_here') ? TENANT_ID : DEVELOPMENT_TENANT_ID;

// Custom domain support (optional)
const CUSTOM_DOMAIN = env.NEXT_PUBLIC_CIAM_CUSTOM_DOMAIN || env.VITE_AZURE_CUSTOM_DOMAIN;

// Compute authority URL for Entra ID (Azure AD):
// Priority:
// 1. Custom domain + tenant ID (e.g. https://login.example.com/{tenantId})
// 2. Tenant ID (https://login.microsoftonline.com/{tenantId})
// 3. Tenant domain (https://login.microsoftonline.com/{domain})
// 4. Explicit authority from env (if provided)
// Note: Single-tenant applications require a tenant-specific endpoint
// The /common endpoint is not supported for single-tenant apps created after 10/15/2018
let computedAuthority: string;
if (CUSTOM_DOMAIN && FINAL_TENANT_ID) {
  computedAuthority = `https://${CUSTOM_DOMAIN}/${FINAL_TENANT_ID}`;
} else if (FINAL_TENANT_ID) {
  computedAuthority = `https://login.microsoftonline.com/${FINAL_TENANT_ID}`;
} else if (TENANT_DOMAIN) {
  computedAuthority = `https://login.microsoftonline.com/${TENANT_DOMAIN}`;
} else if (env.VITE_AZURE_AUTHORITY || env.NEXT_PUBLIC_AZURE_AUTHORITY) {
  // Allow explicit authority override from env (must be tenant-specific)
  computedAuthority = env.VITE_AZURE_AUTHORITY || env.NEXT_PUBLIC_AZURE_AUTHORITY || '';
  
  // CRITICAL: Reject /common endpoint for single-tenant applications (only in production)
  if (computedAuthority.includes('/common') && !isDevelopment) {
    throw new Error(
      `Invalid Azure AD authority configuration: The /common endpoint is not supported for single-tenant applications.\n\n` +
      `Current authority: ${computedAuthority}\n\n` +
      `Please use a tenant-specific endpoint instead:\n` +
      `  - https://login.microsoftonline.com/${FINAL_TENANT_ID || '{your-tenant-id}'}\n` +
      `  - https://login.microsoftonline.com/${TENANT_DOMAIN || '{your-tenant-domain}'}\n\n` +
      `To fix this, either:\n` +
      `  1. Remove VITE_AZURE_AUTHORITY or NEXT_PUBLIC_AZURE_AUTHORITY from your .env file, OR\n` +
      `  2. Set it to a tenant-specific endpoint (not /common)\n\n` +
      `Your tenant ID: ${FINAL_TENANT_ID || 'not set'}\n` +
      `Your tenant domain: ${TENANT_DOMAIN || 'not set'}`
    );
  }
} else {
  // In development, use placeholder authority if tenant is not configured
  if (isDevelopment && !hasValidClientId) {
    computedAuthority = `https://login.microsoftonline.com/${DEVELOPMENT_TENANT_ID}`;
  } else if (!isDevelopment) {
    // Throw error if tenant is not configured - single-tenant apps require tenant-specific endpoint
    throw new Error(
      "Azure AD Tenant configuration is required. Please set one of the following environment variables:\n" +
      "  - NEXT_PUBLIC_TENANT_ID or VITE_AZURE_TENANT_ID (tenant GUID)\n" +
      "  - NEXT_PUBLIC_TENANT_DOMAIN or VITE_AZURE_TENANT_DOMAIN (verified domain name)\n" +
      "  - VITE_AZURE_AUTHORITY (full authority URL, e.g. https://login.microsoftonline.com/{tenantId})\n\n" +
      "Single-tenant applications cannot use the /common endpoint. " +
      "You can find your tenant ID in Azure Portal > Azure Active Directory > Overview."
    );
  } else {
    computedAuthority = `https://login.microsoftonline.com/${DEVELOPMENT_TENANT_ID}`;
  }
}

// Final validation: Ensure authority is tenant-specific (not /common) - skip in development
if (computedAuthority.includes('/common') && !isDevelopment) {
  throw new Error(
    `CRITICAL: Azure AD authority must be tenant-specific, not /common.\n\n` +
    `Detected authority: ${computedAuthority}\n\n` +
    `This application is configured as single-tenant and cannot use the /common endpoint.\n` +
    `Please configure a tenant-specific endpoint using:\n` +
    `  - VITE_AZURE_TENANT_ID=${FINAL_TENANT_ID || '{your-tenant-id}'}\n` +
    `  - OR VITE_AZURE_TENANT_DOMAIN=${TENANT_DOMAIN || '{your-tenant-domain}'}\n` +
    `  - OR VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/${FINAL_TENANT_ID || '{your-tenant-id}'}`
  );
}

// Log the computed authority for debugging (remove in production if needed)
if (isDevelopment) {
  console.log('🔐 Development Mode: Using placeholder Azure AD configuration');
  console.log('🔐 Azure AD Authority:', computedAuthority);
  console.log('🔐 Azure AD Client ID:', FINAL_CLIENT_ID);
  console.log('🔐 Azure AD Tenant ID:', FINAL_TENANT_ID);
}

// Known authorities for MSAL (hostnames only)
const knownAuthorities: string[] = (() => {
  if (CUSTOM_DOMAIN) {
    try {
      const url = new URL(computedAuthority);
      return [url.hostname];
    } catch {
      return [CUSTOM_DOMAIN];
    }
  }
  // For login.microsoftonline.com, we use the hostname
  try {
    const url = new URL(computedAuthority);
    return [url.hostname];
  } catch {
    return ["login.microsoftonline.com"];
  }
})();

// For Entra ID, login and signup use the same authority (no separate policies like B2C)
const AUTHORITY = computedAuthority;

export const msalConfig: Configuration = {
  auth: {
    clientId: FINAL_CLIENT_ID,
    authority: AUTHORITY,
    knownAuthorities: knownAuthorities,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    // Stay on the redirectUri after login instead of bouncing back
    // to the page where login was initiated.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Error) console.error(message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Optionally include Graph User.Read for email resolution fallback (see AuthContext)
const ENABLE_GRAPH_USER_READ = (env.VITE_MSAL_ENABLE_GRAPH_FALLBACK || env.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === 'true';
const GRAPH_SCOPES: string[] = ENABLE_GRAPH_USER_READ ? ["User.Read"] : [];

// For Entra ID, login and signup use the same authority and scopes
// The signup flow is handled by Azure AD's user registration settings
export const defaultLoginRequest = {
  scopes: Array.from(new Set([...(API_SCOPES.length ? API_SCOPES : []), ...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY,
};

// Signup uses the same request as login for Entra ID
// The 'state' parameter is used to identify signup flows for onboarding routing
export const signupRequest = {
  scopes: Array.from(new Set([...(API_SCOPES.length ? API_SCOPES : []), ...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY,
};
