import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy org billing path. Permanently redirects to the handle-based admin
 * route behind the `~` sentinel per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute("/_auth/organizations/$orgSlug/billing")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@$orgSlug/~/billing",
      params: { orgSlug: params.orgSlug },
    });
  },
});
