import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization, useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug/",
)({
  component: WorkspaceDashboard,
});

/**
 * Workspace dashboard.
 * Main page for a workspace - shows app-specific content.
 */
function WorkspaceDashboard() {
  const { orgSlug, workspaceSlug } = Route.useParams();
  const { activeOrganization } = useOrganization();
  const { workspaces } = useWorkspace();

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (!workspace) return null;

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-muted-foreground text-sm">
        <Link
          to="/organizations/$orgSlug"
          params={{ orgSlug }}
          className="hover:text-foreground"
        >
          {activeOrganization?.slug}
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/organizations/$orgSlug/workspaces"
          params={{ orgSlug }}
          className="hover:text-foreground"
        >
          workspaces
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{workspace.slug}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-bold text-2xl">{workspace.name}</h1>
        <p className="text-muted-foreground">/{workspace.slug}</p>
      </div>

      {/* App-specific content goes here */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          This is where your app-specific workspace content goes.
        </p>
        <p className="mt-2 text-muted-foreground text-sm">
          Examples: projects list, dashboard widgets, activity feed, etc.
        </p>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/organizations/$orgSlug/workspaces/$workspaceSlug/settings"
          params={{ orgSlug, workspaceSlug }}
          className="rounded-lg border p-4 text-center transition-colors hover:bg-muted"
        >
          Workspace Settings
        </Link>
      </div>
    </div>
  );
}
