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



// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);

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
  const isNewUser = [true, "true"].includes(claims.newUser as boolean | string);
  // NOSONAR: || is correct here, both operands are boolean (not nullable)
  shouldRedirect = isSignupState || isNewUser; // NOSONAR
} catch (error) {
  console.warn("Error processing authentication state:", error);
}

if (shouldRedirect) { // NOSONAR: top-level await already used above
  globalThis.location.replace("/dashboard/onboarding");
} else {
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
