import { describe, expect, mock, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

import type { Price } from "@/components/pricing/PriceCard";

// Mock auth client
mock.module("@/lib/auth/authClient", () => ({
  default: {
    signIn: {
      oauth2: mock(() => Promise.resolve()),
    },
  },
}));

// Mock server function
mock.module("@/server/functions/subscriptions", () => ({
  getCheckoutUrl: mock(() => Promise.resolve("https://checkout.stripe.com")),
}));

// Import after mocking
const { default: PriceCard } = await import("@/components/pricing/PriceCard");

const mockPrice: Price = {
  id: "price_123",
  unit_amount: 2999,
  product: {
    name: "Pro",
    description: "Perfect for growing teams",
    marketing_features: [
      { name: "Unlimited projects" },
      { name: "Priority support" },
      { name: "Advanced analytics" },
    ],
  },
  recurring: {
    interval: "month",
    interval_count: 1,
    trial_period_days: null,
    usage_type: "licensed",
    meter: null,
  },
};

const renderWithProviders = async (
  price: Price,
  auth: {
    user: { id: string; email: string; name: string; image: null };
  } | null = null,
  disableAction = false,
) => {
  cleanup();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const rootRoute = createRootRoute({
    component: () => <PriceCard price={price} disableAction={disableAction} />,
  });

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/pricing"] }),
    context: { auth },
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  // Wait for component to render
  await waitFor(() => {
    expect(result.container.textContent).toContain("Pro");
  });

  return result;
};

describe("PriceCard", () => {
  test("renders price card with product name", async () => {
    await renderWithProviders(mockPrice);

    expect(screen.getByText("Pro")).toBeDefined();
  });

  test("renders product description", async () => {
    await renderWithProviders(mockPrice);

    expect(screen.getByText("Perfect for growing teams")).toBeDefined();
  });

  test("renders recurring interval", async () => {
    await renderWithProviders(mockPrice);

    expect(screen.getByText("/month")).toBeDefined();
  });

  test("renders marketing features", async () => {
    await renderWithProviders(mockPrice);

    expect(screen.getByText("Unlimited projects")).toBeDefined();
    expect(screen.getByText("Priority support")).toBeDefined();
    expect(screen.getByText("Advanced analytics")).toBeDefined();
  });

  test("renders Get Started button", async () => {
    await renderWithProviders(mockPrice);

    const button = screen.getByRole("button", { name: "Get Started" });
    expect(button).toBeDefined();
  });

  test("handles one-time payment (no recurring)", async () => {
    const oneTimePrice: Price = {
      ...mockPrice,
      recurring: undefined,
    };

    await renderWithProviders(oneTimePrice);

    expect(screen.getByText("/forever")).toBeDefined();
  });
});
