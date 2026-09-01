import { createFileRoute } from "@tanstack/react-router";

import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_auth/@{$workspaceSlug}/$resourceSlug/~/settings",
)({
  component: ResourceSettingsPage,
});

/**
 * Resource settings page.
 * Admin lives behind the `~` sentinel at every level, so a resource's own
 * system area never collides with a user-minted item slug inside it.
 */
function ResourceSettingsPage() {
  const { resourceSlug } = Route.useParams();
  const { workspaces } = useWorkspace();

  const resource = workspaces.find((w) => w.slug === resourceSlug);

  if (!resource) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Resource Settings</h1>

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">General</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="resource-name"
                className="block font-medium text-sm"
              >
                Resource Name
              </label>
              <input
                id="resource-name"
                type="text"
                defaultValue={resource.name}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="resource-slug"
                className="block font-medium text-sm"
              >
                Slug
              </label>
              <input
                id="resource-slug"
                type="text"
                defaultValue={resource.slug}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Used in URLs. Must be unique within the workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-destructive/50 p-6">
          <h2 className="mb-4 font-semibold text-destructive text-lg">
            Danger Zone
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Permanently delete this resource and all its data.
          </p>
          <button
            type="button"
            className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Resource
          </button>
        </section>
      </div>
    </div>
  );
}
