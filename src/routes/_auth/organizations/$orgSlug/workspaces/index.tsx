import { Link, createFileRoute } from "@tanstack/react-router";

import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/",
)({
  component: WorkspacesPage,
});

/**
 * Workspaces list page.
 * Shows all workspaces in the current organization.
 */
function WorkspacesPage() {
  const { orgSlug } = Route.useParams();
  const { workspaces, isLoading } = useWorkspace();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Workspaces</h1>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Create Workspace
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading workspaces...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              to="/organizations/$orgSlug/workspaces/$workspaceSlug"
              params={{ orgSlug, workspaceSlug: ws.slug }}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <h2 className="font-semibold">{ws.name}</h2>
              <p className="text-muted-foreground text-sm">/{ws.slug}</p>
            </Link>
          ))}

          {workspaces.length === 0 && (
            <p className="col-span-full text-muted-foreground">
              No workspaces yet. Create one to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
