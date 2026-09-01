import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization, useWorkspace } from "@/lib/context";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}/$resourceSlug/")(
  {
    component: ResourceHome,
  },
);

/**
 * Resource home.
 * Main page for a nested resource - shows app-specific content.
 */
function ResourceHome() {
  const { workspaceSlug, resourceSlug } = Route.useParams();
  const { activeOrganization } = useOrganization();
  const { workspaces } = useWorkspace();

  const resource = workspaces.find((w) => w.slug === resourceSlug);

  if (!resource) return null;

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-muted-foreground text-sm">
        <Link
          to="/@{$workspaceSlug}"
          params={{ workspaceSlug }}
          className="hover:text-foreground"
        >
          {activeOrganization?.slug}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{resource.slug}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-bold text-2xl">{resource.name}</h1>
        <p className="text-muted-foreground">/{resource.slug}</p>
      </div>

      {/* App-specific content goes here */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          This is where your app-specific resource content goes.
        </p>
        <p className="mt-2 text-muted-foreground text-sm">
          Examples: projects list, dashboard widgets, activity feed, etc.
        </p>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/@{$workspaceSlug}/$resourceSlug/~/settings"
          params={{ workspaceSlug, resourceSlug }}
          className="rounded-lg border p-4 text-center transition-colors hover:bg-muted"
        >
          Resource Settings
        </Link>
      </div>
    </div>
  );
}
