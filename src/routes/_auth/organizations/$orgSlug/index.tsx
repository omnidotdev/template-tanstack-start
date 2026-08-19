import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy org path. Permanently redirects to the handle-based home
 * (`/@$orgSlug`) per golden/URL-GRAMMAR.md, so old bookmarks survive.
 */
export const Route = createFileRoute("/_auth/organizations/$orgSlug/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/@$orgSlug", params: { orgSlug: params.orgSlug } });
  },
});
