import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/auth/msal";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Import test function for debugging (only in dev)
if (import.meta.env.DEV) {
  import("./utils/testSupabaseConnection");
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9609a7336af8.ngrok-free.app/services-api",
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  
  // Render function to avoid duplication
  const renderApp = () => {
    root.render(
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <MsalProvider instance={msalInstance}>
            <AppRouter />
          </MsalProvider>
        </ApolloProvider>
      </ErrorBoundary>
    );
  };

  // Render immediately - don't wait for MSAL
  renderApp();

  // Initialize MSAL in the background
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
    })
    .catch((e) => {
      console.error("MSAL initialization failed:", e);
      // App is already rendered, continue
    });
}
