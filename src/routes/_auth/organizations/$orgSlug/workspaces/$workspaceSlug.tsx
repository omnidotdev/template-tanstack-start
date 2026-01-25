import { Outlet, createFileRoute } from "@tanstack/react-router";

import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug",
)({
  beforeLoad: async ({ params }) => {
    // Validate workspace exists and user has access
    // This would typically fetch from API or check context
    return { workspaceSlug: params.workspaceSlug };
  },
  component: WorkspaceLayout,
});

/**
 * Workspace layout.
 * Wraps all routes under /organizations/$orgSlug/workspaces/$workspaceSlug/
 */
function WorkspaceLayout() {
  const { workspaceSlug } = Route.useParams();
  const { workspaces } = useWorkspace();

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (!workspace) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Workspace not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          Workspace "{workspaceSlug}" doesn't exist or you don't have access.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
