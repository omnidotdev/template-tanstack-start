import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

import type { RenderOptions, RenderResult } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

/**
 * Create a new QueryClient for testing with disabled retries.
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: ReactNode;
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Initial route for the router */
  initialRoute?: string;
  /** Pre-configured QueryClient instance */
  queryClient?: QueryClient;
  /** Auth context to inject */
  auth?: {
    user: {
      id: string;
      email: string;
      name: string;
      image: string | null;
    };
  } | null;
}

/**
 * Custom render function that wraps components with necessary providers.
 */
export const renderWithProviders = (
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult & { queryClient: QueryClient } => {
  const {
    initialRoute = "/",
    queryClient = createTestQueryClient(),
    auth = null,
    ...renderOptions
  } = options;

  // Create a simple root route for testing
  const rootRoute = createRootRoute({
    component: () => ui,
    context: () => ({ auth }),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  });

  const routeTree = rootRoute.addChildren([indexRoute]);

  const memoryHistory = createMemoryHistory({
    initialEntries: [initialRoute],
  });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: { auth },
  });

  const Wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>{children}</RouterProvider>
    </QueryClientProvider>
  );

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...result,
    queryClient,
  };
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { renderWithProviders as render };
