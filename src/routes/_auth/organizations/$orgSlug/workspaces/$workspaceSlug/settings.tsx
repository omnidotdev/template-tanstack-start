import { createFileRoute } from "@tanstack/react-router";

import { useWorkspace } from "@/lib/context";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug/settings",
)({
  component: WorkspaceSettingsPage,
});

/**
 * Workspace settings page.
 */
function WorkspaceSettingsPage() {
  const { workspaceSlug } = Route.useParams();
  const { workspaces } = useWorkspace();

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (!workspace) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Workspace Settings</h1>

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">General</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="workspace-name"
                className="block font-medium text-sm"
              >
                Workspace Name
              </label>
              <input
                id="workspace-name"
                type="text"
                defaultValue={workspace.name}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="workspace-slug"
                className="block font-medium text-sm"
              >
                Slug
              </label>
              <input
                id="workspace-slug"
                type="text"
                defaultValue={workspace.slug}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Used in URLs. Must be unique within the organization.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-destructive/50 p-6">
          <h2 className="mb-4 font-semibold text-destructive text-lg">
            Danger Zone
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Permanently delete this workspace and all its data.
          </p>
          <button
            type="button"
            className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Workspace
          </button>
        </section>
      </div>
    </div>
  );
}
