import "./index.css";
import "./styles/theme.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9609a7336af8.ngrok-free.app/services-api",
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  
  console.log('🚀 Starting application without authentication');
  
  root.render(
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  );
}
