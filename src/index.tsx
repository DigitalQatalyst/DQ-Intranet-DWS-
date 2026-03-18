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
const msalKeys = Object.keys(globalThis.localStorage).filter((k) => k.toLowerCase().includes('msal'));
msalKeys.forEach((k) => globalThis.localStorage.removeItem(k));
globalThis.sessionStorage.clear();
const search = globalThis.location.search;
if (search.includes('code=') || search.includes('error=') || search.includes('state=')) {
  globalThis.history.replaceState({}, '', globalThis.location.pathname);
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

function renderApp(root: ReturnType<typeof createRoot>): void {
  root.render(
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <MsalProvider instance={msalInstance}>
          <AppRouter />
        </MsalProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  try {
    await msalInstance.initialize();
  } catch (e: unknown) {
    console.error("MSAL initialization failed:", e);
  }

  let result: Awaited<ReturnType<typeof msalInstance.handleRedirectPromise>> = null;
  try {
    result = await msalInstance.handleRedirectPromise();
  } catch (e: unknown) {
    console.error("MSAL redirect handling failed:", e);
  }

  if (result?.account) {
    msalInstance.setActiveAccount(result.account);
  } else {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 1) {
      msalInstance.setActiveAccount(accounts[0]);
    }
  }

  let shouldRedirect = false;
  try {
    const isSignupState =
      typeof result?.state === "string" &&
      result.state.includes("ej-signup");
    const claims = (result?.idTokenClaims ?? {}) as Record<string, unknown>;
    const isNewUser = claims.newUser === true || claims.newUser === "true";
    shouldRedirect = isSignupState || isNewUser;
  } catch (error) {
    console.warn("Error processing authentication state:", error);
  }

  if (shouldRedirect) {
    globalThis.location.replace("/dashboard/onboarding");
  } else {
    renderApp(root);
  }
}
