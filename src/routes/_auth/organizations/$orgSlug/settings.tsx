import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy org settings path. Permanently redirects to the handle-based admin
 * route behind the `~` sentinel per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute("/_auth/organizations/$orgSlug/settings")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@$orgSlug/~/settings",
      params: { orgSlug: params.orgSlug },
    });
  },
});
