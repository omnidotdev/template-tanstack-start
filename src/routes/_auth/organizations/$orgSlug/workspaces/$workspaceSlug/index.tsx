import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy workspace path. Permanently redirects to the flat, handle-based
 * workspace route (`/@$orgSlug/$workspaceSlug`) per golden/URL-GRAMMAR.md.
 */
export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug/",
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@$orgSlug/$workspaceSlug",
      params: {
        orgSlug: params.orgSlug,
        workspaceSlug: params.workspaceSlug,
      },
    });
  },
});
