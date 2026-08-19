import { Outlet, createFileRoute } from "@tanstack/react-router";

/**
 * Legacy organization layout. Kept as a passthrough so the leaf routes below
 * (each a redirect stub) resolve to the handle-based spine per
 * golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute("/_auth/organizations/$orgSlug")({
  component: () => <Outlet />,
});
