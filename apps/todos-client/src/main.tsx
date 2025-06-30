import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./queries/client";

import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        <ReactQueryDevtools initialIsOpen={false} client={queryClient} />// only for debugging
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
