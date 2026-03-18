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
Object.keys(globalThis.localStorage).filter((k: string) => k.toLowerCase().includes('msal')).forEach((k: string) => globalThis.localStorage.removeItem(k));
globalThis.sessionStorage.clear();
if (globalThis.location.search.includes('code=') || globalThis.location.search.includes('error=') || globalThis.location.search.includes('state=')) {
  globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
}

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

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
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
      try {
        const isSignupState =
          typeof result?.state === "string" &&
          result.state.includes("ej-signup");
        const claims = result?.idTokenClaims || {};
        const isNewUser =
          (claims as Record<string, unknown>)?.newUser === true ||
          (claims as Record<string, unknown>)?.newUser === "true";
        if (isSignupState || isNewUser) {
          globalThis.location.replace("/dashboard/onboarding");
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
