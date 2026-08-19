import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy workspaces-list path. The org handle home (`/@$orgSlug`) now lists
 * workspaces, so this permanently redirects there per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/",
)({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/@$orgSlug", params: { orgSlug: params.orgSlug } });
  },
});
