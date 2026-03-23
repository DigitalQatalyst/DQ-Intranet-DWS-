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
const isDevelopment = import.meta.env?.DEV;
const isValidClientId = CLIENT_ID && CLIENT_ID !== 'your_azure_client_id_here';

if (!CLIENT_ID || !isValidClientId) {
  if (isDevelopment) {
    console.warn('⚠️ Azure AD Client ID not configured for development - authentication will be bypassed');
  } else {
    throw new Error(
      "Azure AD Client ID is required. Please set VITE_AZURE_CLIENT_ID or NEXT_PUBLIC_AAD_CLIENT_ID in your .env file.\n\n" +
      "This application uses Azure Entra ID (not B2C) for authentication."
    );
  }
}
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

// Skip the rest of configuration in development if credentials are invalid
const shouldSkipAuth = isDevelopment && (!CLIENT_ID || !isValidClientId);

// Wrap initialization in a function to avoid exporting mutable lets
const initializeAuth = () => {
  if (shouldSkipAuth) return { msalConfig: null, msalInstance: null, defaultLoginRequest: null, signupRequest: null };

  // Custom domain support (optional)
  const CUSTOM_DOMAIN = env.NEXT_PUBLIC_CIAM_CUSTOM_DOMAIN || env.VITE_AZURE_CUSTOM_DOMAIN;

  // Compute authority URL for Entra ID (Azure AD):
  let computedAuthority: string;
  if (CUSTOM_DOMAIN && TENANT_ID) {
    computedAuthority = `https://${CUSTOM_DOMAIN}/${TENANT_ID}`;
  } else if (TENANT_ID) {
    computedAuthority = `https://login.microsoftonline.com/${TENANT_ID}`;
  } else if (TENANT_DOMAIN) {
    computedAuthority = `https://login.microsoftonline.com/${TENANT_DOMAIN}`;
  } else if (env.VITE_AZURE_AUTHORITY || env.NEXT_PUBLIC_AZURE_AUTHORITY) {
    computedAuthority = env.VITE_AZURE_AUTHORITY || env.NEXT_PUBLIC_AZURE_AUTHORITY || '';
    if (computedAuthority.includes('/common')) {
      throw new Error(
        `Invalid Azure AD authority configuration: The /common endpoint is not supported for single-tenant applications.`
      );
    }
  } else {
    throw new Error(
      "Azure AD Tenant configuration is required."
    );
  }

  if (computedAuthority.includes('/common')) {
    throw new Error(`CRITICAL: Azure AD authority must be tenant-specific, not /common.`);
  }

  console.log('🔐 Azure AD Authority:', computedAuthority);
  console.log('🔐 Azure AD Client ID:', CLIENT_ID);
  console.log('🔐 Azure AD Tenant ID:', TENANT_ID);

  const knownAuthorities: string[] = (() => {
    if (CUSTOM_DOMAIN) {
      try {
        const url = new URL(computedAuthority);
        return [url.hostname];
      } catch {
        return [CUSTOM_DOMAIN];
      }
    }
    try {
      const url = new URL(computedAuthority);
      return [url.hostname];
    } catch {
      return ["login.microsoftonline.com"];
    }
  })();

  const AUTHORITY = computedAuthority;

  const msalConfigObj = {
    auth: {
      clientId: CLIENT_ID,
      authority: AUTHORITY,
      knownAuthorities: knownAuthorities,
      redirectUri: REDIRECT_URI,
      postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning,
        loggerCallback: (level: any, message: any) => {
          if (level >= LogLevel.Error) console.error(message);
        },
      },
    },
  };

  const msalInst = new PublicClientApplication(msalConfigObj);

  const ENABLE_GRAPH_USER_READ = (env.VITE_MSAL_ENABLE_GRAPH_FALLBACK || env.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === 'true';
  const GRAPH_SCOPES: string[] = ENABLE_GRAPH_USER_READ ? ["User.Read"] : [];

  const loginReq = {
    scopes: Array.from(new Set([...(API_SCOPES.length ? API_SCOPES : []), ...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
    authority: AUTHORITY,
  };

  const signupReq = {
    scopes: Array.from(new Set([...(API_SCOPES.length ? API_SCOPES : []), ...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
    authority: AUTHORITY,
  };

  return { msalConfig: msalConfigObj, msalInstance: msalInst, defaultLoginRequest: loginReq, signupRequest: signupReq };
};

export const { msalConfig, msalInstance, defaultLoginRequest, signupRequest } = initializeAuth();

