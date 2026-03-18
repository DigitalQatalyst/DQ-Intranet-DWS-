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

// Clear stale MSAL cache + strip auth code from URL before MSAL runs
Object.keys(localStorage).filter((k: string) => k.toLowerCase().includes('msal')).forEach((k: string) => localStorage.removeItem(k));
sessionStorage.clear();
if (window.location.search.includes('code=') || window.location.search.includes('error=') || window.location.search.includes('state=')) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

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
  // Ensure MSAL is initialized and redirect response handled before using any APIs
  msalInstance
    .initialize()
    .then(() => msalInstance.handleRedirectPromise())
    .then((result) => {
      if (result?.account) {
        msalInstance.setActiveAccount(result.account);
      } else {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 1) {
          msalInstance.setActiveAccount(accounts[0]);
        }
      }
      // If this was an explicit Sign Up flow or a brand new account, route to onboarding
      try {
        const isSignupState =
          typeof result?.state === "string" &&
          result.state.includes("ej-signup");
        const claims = (result as any)?.idTokenClaims || {};
        const isNewUser =
          claims?.newUser === true || claims?.newUser === "true";
        if (isSignupState || isNewUser) {
          // Navigate to onboarding without adding history entry
          window.location.replace("/dashboard/onboarding");
          return;
        }
      } catch (error) {
        console.warn("Error processing authentication state:", error);
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
    })
    .catch((e) => {
      console.error("MSAL initialization failed:", e);
    });
}
