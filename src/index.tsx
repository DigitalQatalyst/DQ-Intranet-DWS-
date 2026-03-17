import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  REDIRECT_GUARD_KEY,
  MAX_REDIRECT_ATTEMPTS,
  renderErrorUI,
  initializeMsal,
  getAuthenticatedAccount,
  shouldRedirectToOnboarding,
} from "./services/auth/msalInitializer";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9609a7336af8.ngrok-free.app/services-api",
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  
  // Development bypass - check if we have proper Azure credentials
  const azureClientId = import.meta.env.VITE_AZURE_CLIENT_ID;
  const isDevelopment = import.meta.env.DEV;
  const hasValidAzureConfig = azureClientId && azureClientId !== 'your_azure_client_id_here';
  
  // Skip authentication in development if no valid Azure config
  if (isDevelopment && !hasValidAzureConfig) {
    console.log('🚀 Development mode: Bypassing authentication - no valid Azure config found');
    root.render(
      <ApolloProvider client={client}>
        <AppRouter />
      </ApolloProvider>
    );
  } else {
    // Original authentication flow
    root.render(<div style={{ display: 'none' }} />);
    
    const redirectAttempts = parseInt(sessionStorage.getItem(REDIRECT_GUARD_KEY) || '0', 10);
    const isRedirectLoop = redirectAttempts >= MAX_REDIRECT_ATTEMPTS;
    
    const urlParams = new URLSearchParams(window.location.search);
    const hasRedirectParams = urlParams.has('code') || urlParams.has('error') || urlParams.has('state');
    
    if (isRedirectLoop) {
      sessionStorage.removeItem(REDIRECT_GUARD_KEY);
      renderErrorUI(
        root,
        "Authentication Error",
        "Too many redirect attempts. Please clear your browser cache and try again.",
        "Clear and Retry",
        () => {
          sessionStorage.clear();
          window.location.href = window.location.origin;
        }
      );
    } else {
      const initializeAndHandleAuth = async () => {
        try {
          await initializeMsal();
          const { authenticatedAccount, result } = await getAuthenticatedAccount();
          
          if (hasRedirectParams && !authenticatedAccount) {
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            
            if (error) {
              console.error("Authentication error from redirect:", error, errorDescription);
              renderErrorUI(
                root,
                "Authentication Failed",
                errorDescription || error || "An error occurred during authentication.",
                "Try Again",
                () => {
                  sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                  window.location.href = window.location.origin;
                }
              );
              return;
            }
          }
          
          if (!authenticatedAccount) {
            setTimeout(() => {
              const delayedAccounts = msalInstance.getAllAccounts();
              if (delayedAccounts.length > 0) {
                const account = delayedAccounts[0];
                msalInstance.setActiveAccount(account);
                root.render(
                  <ApolloProvider client={client}>
                    <MsalProvider instance={msalInstance}>
                      <AppRouter />
                    </MsalProvider>
                  </ApolloProvider>
                );
                return;
              }
              
              sessionStorage.setItem(REDIRECT_GUARD_KEY, String(redirectAttempts + 1));
              
              msalInstance.loginRedirect({
                scopes: ["openid", "profile", "email", "offline_access"]
              }).catch((error) => {
                console.error("Login redirect failed:", error);
                sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                renderErrorUI(
                  root,
                  "Authentication Required",
                  "Please sign in to access this application.",
                  "Retry Login",
                  () => {
                    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                    window.location.reload();
                  }
                );
              });
            }, hasRedirectParams ? 500 : 100);
            return;
          }
          
          if (shouldRedirectToOnboarding(result)) {
            window.location.replace("/dashboard/onboarding");
            return;
          }
          
          root.render(
            <ApolloProvider client={client}>
              <MsalProvider instance={msalInstance}>
                <AppRouter />
              </MsalProvider>
            </ApolloProvider>
          );
        } catch (e: any) {
          console.error("MSAL initialization failed:", e);
          sessionStorage.removeItem(REDIRECT_GUARD_KEY);
          
          try {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              console.log("Found accounts despite initialization error, proceeding with app render");
              msalInstance.setActiveAccount(accounts[0]);
              root.render(
                <ApolloProvider client={client}>
                  <MsalProvider instance={msalInstance}>
                    <AppRouter />
                  </MsalProvider>
                </ApolloProvider>
              );
              return;
            }
          } catch (accountError) {
            console.warn("Error checking accounts:", accountError);
          }
          
          const errorMessage = e?.message || "Unknown error";
          const additionalContent = process.env.NODE_ENV === 'development' ? (
            <p className="text-sm text-gray-500 mb-4 mt-2">Error: {errorMessage}</p>
          ) : null;
          
          renderErrorUI(
            root,
            "Authentication Error",
            "Unable to initialize authentication. Please refresh the page.",
            "Refresh Page",
            () => {
              sessionStorage.removeItem(REDIRECT_GUARD_KEY);
              window.location.reload();
            },
            additionalContent
          );
        }
      };

      initializeAndHandleAuth();
    }
  }
}