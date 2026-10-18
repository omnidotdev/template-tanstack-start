import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { useWorkspace } from "@/lib/context";
import { getOrganizationBySlug } from "@/server/functions/organizations";

import type { Workspace } from "@/lib/context";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}")({
  beforeLoad: async ({ params }) => {
    return { workspaceSlug: params.workspaceSlug };
  },
  component: WorkspaceLayout,
});

/**
 * Workspace layout.
 * Wraps all routes under the workspace handle (`/@{$workspaceSlug}/`). An org is
 * 1:1 with a workspace, so the `@handle` IS the workspace, one level deep.
 */
function WorkspaceLayout() {
  const { workspaceSlug } = Route.useParams();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();

  const claimOrg = workspaces.find((o) => o.slug === workspaceSlug);

  // A just-created workspace is not yet in the JWT claims (the org list is
  // hydrated from a short-lived cache), so fall back to a live Gatekeeper lookup
  // until claims catch up. Skipped once the workspace is present in claims.
  const { data: fallbackOrg, isLoading: isResolvingFallback } = useQuery({
    queryKey: ["organization-fallback", workspaceSlug],
    queryFn: () => getOrganizationBySlug({ data: { slug: workspaceSlug } }),
    enabled: !claimOrg,
  });

  const org: Workspace | undefined =
    claimOrg ??
    (fallbackOrg
      ? {
          id: fallbackOrg.id,
          slug: fallbackOrg.slug,
          type: fallbackOrg.type,
          roles: [],
          teams: [],
        }
      : undefined);

  useEffect(() => {
    if (claimOrg && activeWorkspace?.id !== claimOrg.id) {
      setActiveWorkspace(claimOrg.id);
    }
  }, [claimOrg, activeWorkspace?.id, setActiveWorkspace]);

  if (!org && isResolvingFallback) return null;

  if (!org) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Workspace not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don't have access to workspace "{workspaceSlug}"
        </p>
      </div>
    );
  }

  return <Outlet />;
}
