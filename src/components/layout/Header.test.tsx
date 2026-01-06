import { describe, expect, mock, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

// Mock auth client before importing Header
const mockSignIn = mock(() => Promise.resolve());
const mockSignOut = mock(() => Promise.resolve());

mock.module("@/lib/auth/authClient", () => ({
  default: {
    signIn: {
      oauth2: mockSignIn,
    },
    signOut: mockSignOut,
  },
}));

// Mock useTheme
mock.module("@/providers/ThemeProvider", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mock(() => {}),
  }),
}));

// Import after mocking
const { default: Header } = await import("./Header");

const createTestRouter = (
  ui: React.ReactElement,
  auth: {
    user: { id: string; email: string; name: string; image: string | null };
  } | null = null,
) => {
  const rootRoute = createRootRoute({
    component: () => ui,
  });

  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    context: { auth },
  });
};

const renderWithProviders = async (
  auth: {
    user: { id: string; email: string; name: string; image: string | null };
  } | null = null,
) => {
  cleanup();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const router = createTestRouter(<Header />, auth);

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  // Wait for router to render content
  await waitFor(() => {
    expect(result.container.querySelector("header")).not.toBeNull();
  });

  return result;
};

describe("Header", () => {
  test("renders header element", async () => {
    await renderWithProviders();

    const header = screen.getByRole("banner");
    expect(header).toBeDefined();
  });

  test("renders pricing link", async () => {
    await renderWithProviders();

    const pricingLink = screen.getByRole("link", { name: "Pricing" });
    expect(pricingLink).toBeDefined();
  });

  test("shows Sign In button when unauthenticated", async () => {
    await renderWithProviders(null);

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    expect(signInButton).toBeDefined();
  });

  test("shows user avatar when authenticated", async () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    await renderWithProviders(auth);

    // Should show the first letter of the user's name as fallback
    expect(screen.getByText("T")).toBeDefined();
  });

  test("does not show Sign In button when authenticated", async () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    await renderWithProviders(auth);

    const signInButton = screen.queryByRole("button", { name: "Sign In" });
    expect(signInButton).toBeNull();
  });
});
