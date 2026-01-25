import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

export const Route = createFileRoute("/_auth/organizations/")({
  component: OrganizationsPage,
});

/**
 * Organizations list page.
 * Shows all organizations the user is a member of.
 */
function OrganizationsPage() {
  const { organizations } = useOrganization();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Organizations</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Link
            key={org.id}
            to="/organizations/$orgSlug"
            params={{ orgSlug: org.slug }}
            className="block rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{org.slug}</h2>
              {org.type === "personal" && (
                <span className="rounded bg-muted px-2 py-1 text-xs">
                  Personal
                </span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {org.roles.join(", ")}
            </p>
            {org.teams.length > 0 && (
              <p className="mt-2 text-muted-foreground text-xs">
                Teams: {org.teams.map((t) => t.name).join(", ")}
              </p>
            )}
          </Link>
        ))}
      </div>

      {organizations.length === 0 && (
        <p className="text-muted-foreground">
          No organizations found. You should have at least a personal
          organization.
        </p>
      )}
    </div>
  );
}
