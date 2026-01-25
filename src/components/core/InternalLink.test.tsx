import { describe, expect, test } from "bun:test";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";

import InternalLink from "./InternalLink";

// Helper to wrap InternalLink with router context
const renderWithRouter = async (ui: React.ReactElement, initialPath = "/") => {
  const rootRoute = createRootRoute({
    component: () => ui,
  });

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  const result = render(<RouterProvider router={router} />);

  // Wait for router to be ready
  await waitFor(() => {
    expect(result.container.querySelector("a")).not.toBeNull();
  });

  return result;
};

describe("InternalLink", () => {
  test("renders as a link element", async () => {
    await renderWithRouter(<InternalLink to="/">Home</InternalLink>);

    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeDefined();
  });

  test("renders children content", async () => {
    await renderWithRouter(<InternalLink to="/pricing">About Us</InternalLink>);

    expect(screen.getByText("About Us")).toBeDefined();
  });

  test("applies button variant styles", async () => {
    await renderWithRouter(<InternalLink to="/">Click me</InternalLink>);

    const link = screen.getByRole("link");
    expect(link.className).toContain("inline-flex");
  });

  test("applies ghost variant styles", async () => {
    await renderWithRouter(
      <InternalLink to="/" variant="ghost">
        Ghost Link
      </InternalLink>,
    );

    const link = screen.getByRole("link");
    expect(link.className).toContain("hover:bg-accent");
  });

  test("applies custom className", async () => {
    await renderWithRouter(
      <InternalLink to="/" className="custom-test-class">
        Custom Class
      </InternalLink>,
    );

    const link = screen.getByRole("link");
    expect(link.className).toContain("custom-test-class");
  });
});
