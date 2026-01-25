import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization, useWorkspace } from "@/lib/context";

export const Route = createFileRoute("/_auth/organizations/$orgSlug/")({
  component: OrgDashboard,
});

/**
 * Organization dashboard.
 * Shows org overview and list of workspaces.
 */
function OrgDashboard() {
  const { orgSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const { workspaces } = useWorkspace();

  const org = organizations.find((o) => o.slug === orgSlug);

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
        {/* Workspaces Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Workspaces</h2>
            <Link
              to="/organizations/$orgSlug/workspaces"
              params={{ orgSlug }}
              className="text-primary text-sm hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {workspaces.slice(0, 5).map((ws) => (
              <Link
                key={ws.id}
                to="/organizations/$orgSlug/workspaces/$workspaceSlug"
                params={{ orgSlug, workspaceSlug: ws.slug }}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{ws.name}</span>
                <span className="ml-2 text-muted-foreground text-sm">
                  /{ws.slug}
                </span>
              </Link>
            ))}

            {workspaces.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No workspaces yet.{" "}
                <Link
                  to="/organizations/$orgSlug/workspaces"
                  params={{ orgSlug }}
                  className="text-primary hover:underline"
                >
                  Create one
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* Quick Links Section */}
        <section>
          <h2 className="mb-4 font-semibold text-lg">Settings</h2>
          <div className="space-y-2">
            <Link
              to="/organizations/$orgSlug/settings"
              params={{ orgSlug }}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              Organization Settings
            </Link>
            <Link
              to="/organizations/$orgSlug/members"
              params={{ orgSlug }}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              Members
            </Link>
            <Link
              to="/organizations/$orgSlug/billing"
              params={{ orgSlug }}
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
