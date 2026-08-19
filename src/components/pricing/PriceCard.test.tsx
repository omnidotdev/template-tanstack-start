import { describe, expect, mock, spyOn, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as TanStackRouter from "@tanstack/react-router";
import { cleanup, render, screen } from "@testing-library/react";

import type { Price } from "./PriceCard";

// Spy on router hooks for this test file
spyOn(TanStackRouter, "useRouteContext").mockReturnValue({ auth: null });
spyOn(TanStackRouter, "useNavigate").mockReturnValue(mock());
spyOn(TanStackRouter, "useSearch").mockReturnValue({});

// Mock auth client
mock.module("@/lib/auth/authClient", () => ({
  default: {
    signIn: {
      oauth2: mock(() => Promise.resolve()),
    },
  },
}));

// Mock server function (PriceCard imports `createCheckoutWithWorkspace`)
mock.module("@/server/functions/subscriptions", () => ({
  createCheckoutWithWorkspace: mock(() =>
    Promise.resolve({ checkoutUrl: "https://checkout.stripe.com" }),
  ),
}));

// Import after mocking
const { default: PriceCard } = await import("./PriceCard");

const mockPrice: Price = {
  id: "price_123",
  active: true,
  currency: "usd",
  unit_amount: 2999,
  product: {
    id: "prod_123",
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
  metadata: { tier: "pro" },
};

const renderPriceCard = (price: Price) => {
  cleanup();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <PriceCard price={price} />
    </QueryClientProvider>,
  );
};

describe("PriceCard", () => {
  test("renders the tier name", () => {
    renderPriceCard(mockPrice);

    // The tier name renders in more than one place (card title and the
    // create-workspace dialog), so assert presence rather than uniqueness
    expect(screen.getAllByText("Pro").length).toBeGreaterThan(0);
  });

  test("renders product description", () => {
    renderPriceCard(mockPrice);

    expect(screen.getByText("Perfect for growing teams")).toBeDefined();
  });

  test("renders recurring interval", () => {
    renderPriceCard(mockPrice);

    expect(screen.getByText("/month")).toBeDefined();
  });

  test("renders marketing features", () => {
    renderPriceCard(mockPrice);

    expect(screen.getByText("Unlimited projects")).toBeDefined();
    expect(screen.getByText("Priority support")).toBeDefined();
    expect(screen.getByText("Advanced analytics")).toBeDefined();
  });

  test("renders the subscribe button for a paid tier", () => {
    renderPriceCard(mockPrice);

    const button = screen.getByRole("button", { name: "Continue with Pro" });
    expect(button).toBeDefined();
  });

  test("omits the interval suffix for a one-time (non-recurring) price", () => {
    const oneTimePrice: Price = {
      ...mockPrice,
      recurring: null,
    };

    renderPriceCard(oneTimePrice);

    // No `/interval` suffix is rendered when the price is not recurring
    expect(screen.queryByText("/month")).toBeNull();
  });
});
