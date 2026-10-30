import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/queryClient";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { ViewportGate } from "@/app/ViewportGate";
import { AppRouter } from "@/app/router";

export const AppProviders = () => (
  <ErrorBoundary>
    <ViewportGate>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ViewportGate>
  </ErrorBoundary>
);
