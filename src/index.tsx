import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Clear stale/corrupted MSAL cache before initializing to prevent version mismatch errors
const msalKeys = Object.keys(localStorage).filter((k) => k.toLowerCase().includes('msal'));
msalKeys.forEach((k) => localStorage.removeItem(k));
sessionStorage.clear();
// Strip auth params from URL to prevent redirect loops on stale state
const _search = globalThis.location.search;
if (_search.includes('code=') || _search.includes('error=') || _search.includes('state=')) {
  globalThis.history.replaceState({}, '', globalThis.location.pathname);
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(<div style={{ display: 'none' }} />);

  const redirectAttempts = parseInt(sessionStorage.getItem(REDIRECT_GUARD_KEY) ?? '0', 10);
  const isRedirectLoop = redirectAttempts >= MAX_REDIRECT_ATTEMPTS;

  const urlParams = new URLSearchParams(globalThis.location.search);
  const hasRedirectParams = urlParams.has('code') ?? urlParams.has('error') ?? urlParams.has('state');

  if (isRedirectLoop) {
    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
    renderErrorUI(
      root,
      "Authentication Error",
      "Too many redirect attempts. Please clear your browser cache and try again.",
      "Clear and Retry",
      () => {
        sessionStorage.clear();
        globalThis.location.href = globalThis.location.origin;
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
              errorDescription ?? error ?? "An error occurred during authentication.",
              "Try Again",
              () => {
                sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                globalThis.location.href = globalThis.location.origin;
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
                <QueryClientProvider client={queryClient}>
                  <ApolloProvider client={client}>
                    <MsalProvider instance={msalInstance}>
                      <AppRouter />
                    </MsalProvider>
                  </ApolloProvider>
                </QueryClientProvider>
              );
              return;
            }

            sessionStorage.setItem(REDIRECT_GUARD_KEY, String(redirectAttempts + 1));

            msalInstance.loginRedirect({
              scopes: ["openid", "profile", "email", "offline_access"]
            }).catch((loginError) => {
              console.error("Login redirect failed:", loginError);
              sessionStorage.removeItem(REDIRECT_GUARD_KEY);
              renderErrorUI(
                root,
                "Authentication Required",
                "Please sign in to access this application.",
                "Retry Login",
                () => {
                  sessionStorage.removeItem(REDIRECT_GUARD_KEY);
                  globalThis.location.reload();
                }
              );
            });
          }, hasRedirectParams ? 500 : 100);
          return;
        }

        if (shouldRedirectToOnboarding(result)) {
          globalThis.location.replace("/dashboard/onboarding");
          return;
        }

        root.render(
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={client}>
              <MsalProvider instance={msalInstance}>
                <AppRouter />
              </MsalProvider>
            </ApolloProvider>
          </QueryClientProvider>
        );
      } catch (e: unknown) {
        console.error("MSAL initialization failed:", e);
        sessionStorage.removeItem(REDIRECT_GUARD_KEY);

        try {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
            root.render(
              <QueryClientProvider client={queryClient}>
                <ApolloProvider client={client}>
                  <MsalProvider instance={msalInstance}>
                    <AppRouter />
                  </MsalProvider>
                </ApolloProvider>
              </QueryClientProvider>
            );
            return;
          }
        } catch (accountError) {
          console.warn("Error checking accounts:", accountError);
        }

        renderErrorUI(
          root,
          "Authentication Error",
          "Unable to initialize authentication. Please refresh the page.",
          "Refresh Page",
          () => {
            sessionStorage.removeItem(REDIRECT_GUARD_KEY);
            globalThis.location.reload();
          }
        );
      }
    };

    initializeAndHandleAuth();
  }
}
