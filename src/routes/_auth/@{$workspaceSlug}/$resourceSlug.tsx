import { Outlet, createFileRoute } from "@tanstack/react-router";

import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}/$resourceSlug")({
  beforeLoad: async ({ params }) => {
    // Validate resource exists and user has access
    // This would typically fetch from API or check context
    return { resourceSlug: params.resourceSlug };
  },
  component: ResourceLayout,
});

/**
 * Resource layout.
 * Wraps all routes under a nested resource
 * (`/@{$workspaceSlug}/$resourceSlug/`). The resource is a flat, user-minted
 * item under the workspace handle, and demonstrates how the `~` admin sentinel
 * composes again at a nested level.
 */
function ResourceLayout() {
  const { resourceSlug } = Route.useParams();
  const { workspaces } = useWorkspace();

  const resource = workspaces.find((w) => w.slug === resourceSlug);

  if (!resource) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Resource not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          Resource "{resourceSlug}" doesn't exist or you don't have access.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
