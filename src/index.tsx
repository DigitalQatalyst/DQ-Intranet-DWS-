import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/auth/msal";

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

const claims = (result?.idTokenClaims ?? {}) as Record<string, unknown>;
const isNewUser = [true, "true"].includes(claims.newUser as boolean | string);
const isSignupState = result?.state?.includes("ej-signup");
const redirectStatePrefix = "dq-redirect:";
const redirectTarget = (() => {
  const userState = result?.state?.split("|").pop() ?? null;
  if (!userState?.startsWith(redirectStatePrefix)) return null;

  try {
    const decoded = decodeURIComponent(userState.slice(redirectStatePrefix.length));
    return decoded.startsWith("/") ? decoded : null;
  } catch {
    return null;
  }
})();

if (isSignupState || isNewUser) {
  globalThis.location.replace("/dashboard/onboarding");
} else if (redirectTarget) {
  globalThis.location.replace(redirectTarget);
} else {
  if (result || globalThis.location.hash || globalThis.location.search) {
    globalThis.history.replaceState({}, "", globalThis.location.pathname);
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
}
