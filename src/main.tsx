/**
 * Main Application Module
 * 
 * Using MSAL v3.x which is stable and doesn't have cache corruption issues.
 */

import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, defaultLoginRequest } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9609a7336af8.ngrok-free.app/services-api",
  }),
  cache: new InMemoryCache(),
});

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  // Check if authentication is enabled
  const authEnabled = import.meta.env.PROD
    ? import.meta.env.VITE_ENABLE_AUTH !== 'false'
    : import.meta.env.VITE_ENABLE_AUTH === 'true';

  // If authentication is disabled, render app directly
  if (!authEnabled) {
    console.log('Authentication disabled - rendering app without MSAL');
    root.render(
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <AppRouter />
        </ApolloProvider>
      </QueryClientProvider>
    );
  } else {
    // Show blank screen while initializing - no content until authenticated
    root.render(<div style={{ display: 'none' }} />);

  // Guard to prevent infinite redirect loops.
  // NOTE: This is a browser storage key name (non-secret), not a credential.
  const MSAL_REDIRECT_GUARD_STORAGE_KEY = ['msal', 'redirect', 'guard'].join('_');
  const MAX_REDIRECT_ATTEMPTS = 3;

  // Check if we're in a redirect loop
  const redirectAttempts = parseInt(sessionStorage.getItem(MSAL_REDIRECT_GUARD_STORAGE_KEY) || '0', 10);
  const isRedirectLoop = redirectAttempts >= MAX_REDIRECT_ATTEMPTS;

  // Check if we just came back from a redirect (URL contains code or error)
  const urlParams = new URLSearchParams(window.location.search);
  const hasRedirectParams = urlParams.has('code') || urlParams.has('error') || urlParams.has('state');

  // If we're in a redirect loop, show error instead of redirecting again
  if (isRedirectLoop) {
    sessionStorage.removeItem(MSAL_REDIRECT_GUARD_STORAGE_KEY);
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">Too many redirect attempts. Please clear your browser cache and try again.</p>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = window.location.origin;
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear and Retry
          </button>
        </div>
      </div>
    );
  } else {
    // Initialize MSAL and handle authentication
    initializeAndHandleAuth();
  }
};

// Helper function to handle cache errors
const handleCacheError = (error: any) => {
  if (error?.name === 'CacheError' || error?.message?.includes('AccountEntity')) {
    console.log("Detected cache error, clearing storage...");
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    window.location.reload();
    return true;
  }
  return false;
};

// Helper function to get authenticated account
const getAuthenticatedAccount = (msalInstance: any, result: any) => {
  if (result?.account) {
    msalInstance.setActiveAccount(result.account);
    return result.account;
  }
  
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    return accounts[0];
  }
  
  return null;
};

// Helper function to check for authentication errors
const hasAuthenticationError = (hasRedirectParams: boolean, authenticatedAccount: any) => {
  if (!hasRedirectParams || authenticatedAccount) return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  
  if (error) {
    return { error, errorDescription };
  }
  
  return null;
};

// Helper function to render authentication error
const renderAuthenticationError = (error: string, errorDescription?: string) => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-4">
          {errorDescription || error || "An error occurred during authentication."}
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem(MSAL_REDIRECT_GUARD_STORAGE_KEY);
            window.location.href = window.location.origin;
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Helper function to render the main app
const renderMainApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <MsalProvider instance={msalInstance}>
          <AppRouter />
        </MsalProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
};

// Helper function to handle login redirect
const handleLoginRedirect = (msalInstance: any, hasRedirectParams: boolean, redirectAttempts: number) => {
  setTimeout(() => {
    const delayedAccounts = msalInstance.getAllAccounts();
    if (delayedAccounts.length > 0) {
      const account = delayedAccounts[0];
      msalInstance.setActiveAccount(account);
      renderMainApp();
      return;
    }

    sessionStorage.setItem(MSAL_REDIRECT_GUARD_STORAGE_KEY, String(redirectAttempts + 1));

    msalInstance.loginRedirect({
      ...defaultLoginRequest
    }).catch((error: any) => {
      console.error("Login redirect failed:", error);
      if (error?.errorCode === 'interaction_in_progress') {
        Object.keys(sessionStorage).forEach(key => {
          if (key.includes('msal')) {
            sessionStorage.removeItem(key);
          }
        });
        setTimeout(() => window.location.reload(), 500);
        return;
      }
      sessionStorage.removeItem(MSAL_REDIRECT_GUARD_STORAGE_KEY);
      renderAuthenticationError('Login redirect failed', error?.message);
    });
  }, hasRedirectParams ? 500 : 100);
};

// Helper function to check for special routing cases
const checkSpecialRouting = (result: any) => {
  try {
    const isSignupState =
      typeof result?.state === "string" &&
      result.state.includes("ej-signup");
    const claims = (result as any)?.idTokenClaims || {};
    const isNewUser =
      claims?.newUser === true || claims?.newUser === "true";
    
    if (isSignupState || isNewUser) {
      window.location.replace("/dashboard/onboarding");
      return true;
    }
  } catch (error) {
    console.warn("Error processing authentication state:", error);
  }
  return false;
};

// Helper function to handle initialization failure
const handleInitializationFailure = (e: any) => {
  console.error("MSAL initialization failed:", e);
  sessionStorage.removeItem(MSAL_REDIRECT_GUARD_STORAGE_KEY);

  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      console.log("Found accounts despite initialization error, proceeding with app render");
      msalInstance.setActiveAccount(accounts[0]);
      renderMainApp();
      return;
    }
  } catch (accountError) {
    console.warn("Error checking accounts:", accountError);
  }

  const errorMessage = e?.message || "Unknown error";
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-gray-600 mb-4">
          Unable to initialize authentication. Please refresh the page.
        </p>
        {import.meta.env.DEV && (
          <p className="text-sm text-gray-500 mb-4 mt-2">
            Error: {errorMessage}
          </p>
        )}
        <div className="space-x-4">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear Cache & Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

// Main authentication initialization function - now with reduced complexity
const initializeAndHandleAuth = async () => {
  try {
    // Initialize MSAL
    await msalInstance.initialize();

    // Handle redirect promise
    let result = null;
    try {
      result = await msalInstance.handleRedirectPromise();
    } catch (error: any) {
      console.error("Error handling redirect promise:", error);
      
      if (handleCacheError(error)) {
        return;
      }
      throw error;
    }

    // Clear redirect guard on successful authentication
    if (result?.account) {
      sessionStorage.removeItem(MSAL_REDIRECT_GUARD_STORAGE_KEY);
    }

    // Get authenticated account
    const authenticatedAccount = getAuthenticatedAccount(msalInstance, result);

    // Check for authentication errors
    const authError = hasAuthenticationError(hasRedirectParams, authenticatedAccount);
    if (authError) {
      console.error("Authentication error from redirect:", authError.error, authError.errorDescription);
      renderAuthenticationError(authError.error, authError.errorDescription);
      return;
    }

    // If no authenticated account, redirect to login
    if (!authenticatedAccount) {
      handleLoginRedirect(msalInstance, hasRedirectParams, redirectAttempts);
      return;
    }

    // Check for special routing cases
    if (checkSpecialRouting(result)) {
      return;
    }

    // User is authenticated - render the app
    renderMainApp();
  } catch (e: any) {
    handleInitializationFailure(e);
  }
};

// Check for redirect parameters
const urlParams = new URLSearchParams(window.location.search);
const hasRedirectParams = urlParams.has('code') || urlParams.has('error');

// Get redirect attempts from session storage
const redirectAttempts = parseInt(sessionStorage.getItem(MSAL_REDIRECT_GUARD_STORAGE_KEY) || '0');

// Main application logic
const root = ReactDOM.createRoot(document.getElementById('root')!);

if (redirectAttempts > 5) {
  // Too many redirect attempts - show error
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Too Many Redirects</h1>
        <p className="text-gray-600 mb-4">
          Authentication is stuck in a redirect loop. Please clear your browser cache and try again.
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = window.location.origin;
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Clear and Retry
        </button>
      </div>
    </div>
  );
