import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy workspace settings path. Permanently redirects to the handle-based
 * workspace admin route behind the `~` sentinel per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug/settings",
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@$orgSlug/$workspaceSlug/~/settings",
      params: {
        orgSlug: params.orgSlug,
        workspaceSlug: params.workspaceSlug,
      },
    });
  },
});
