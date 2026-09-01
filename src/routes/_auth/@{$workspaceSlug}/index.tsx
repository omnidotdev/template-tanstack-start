import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization, useWorkspace } from "@/lib/context";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}/")({
  component: WorkspaceHome,
});

/**
 * Workspace home.
 * The workspace handle root (`/@{$workspaceSlug}`) lists the workspace's nested
 * resources and links to admin (behind the `~` sentinel).
 */
function WorkspaceHome() {
  const { workspaceSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const { workspaces } = useWorkspace();

  const org = organizations.find((o) => o.slug === workspaceSlug);

  if (!org) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl">{org.slug}</h1>
          {org.type === "personal" && (
            <span className="rounded bg-muted px-2 py-1 text-xs">Personal</span>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">
          Roles: {org.roles.join(", ")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resources Section (nested resources under the workspace handle) */}
        <section>
          <h2 className="mb-4 font-semibold text-lg">Resources</h2>

          <div className="space-y-2">
            {workspaces.map((resource) => (
              <Link
                key={resource.id}
                to="/@{$workspaceSlug}/$resourceSlug"
                params={{ workspaceSlug, resourceSlug: resource.slug }}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{resource.name}</span>
                <span className="ml-2 text-muted-foreground text-sm">
                  /{resource.slug}
                </span>
              </Link>
            ))}

            {workspaces.length === 0 && (
              <p className="text-muted-foreground text-sm">No resources yet.</p>
            )}
          </div>
        </section>

        {/* Admin Section (behind the ~ sentinel) */}
        <section>
          <h2 className="mb-4 font-semibold text-lg">Settings</h2>
          <div className="space-y-2">
            <Link
              to="/@{$workspaceSlug}/~/settings"
              params={{ workspaceSlug }}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              Workspace Settings
            </Link>
            <Link
              to="/@{$workspaceSlug}/~/members"
              params={{ workspaceSlug }}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              Members
            </Link>
            <Link
              to="/@{$workspaceSlug}/~/billing"
              params={{ workspaceSlug }}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              Billing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
