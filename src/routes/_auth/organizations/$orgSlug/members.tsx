import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy org members path. Permanently redirects to the handle-based admin
 * route behind the `~` sentinel per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute("/_auth/organizations/$orgSlug/members")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@$orgSlug/~/members",
      params: { orgSlug: params.orgSlug },
    });
  },
});
