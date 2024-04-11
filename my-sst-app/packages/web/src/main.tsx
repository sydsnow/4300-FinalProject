import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Create a client
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });
// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

console.log("import.meta.env.VITE_APP_KINDE_AUDIENCE", import.meta.env.VITE_APP_KINDE_AUDIENCE)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KindeProvider
        audience={import.meta.env.VITE_APP_KINDE_AUDIENCE}
        clientId="dc3796f7f4244099b50d45a46b2656fa"
        domain="https://mytodoapp.kinde.com"
        logoutUri={window.location.origin}
        redirectUri={window.location.origin}
    >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>,
);