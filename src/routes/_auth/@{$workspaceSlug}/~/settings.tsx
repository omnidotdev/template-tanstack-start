import { createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}/~/settings")({
  component: WorkspaceSettingsPage,
});

/**
 * Workspace settings page.
 */
function WorkspaceSettingsPage() {
  const { workspaceSlug } = Route.useParams();
  const { organizations } = useOrganization();

  const org = organizations.find((o) => o.slug === workspaceSlug);

  if (!org) return null;

  const isPersonal = org.type === "personal";

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Workspace Settings</h1>

      {isPersonal && (
        <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            This is your personal workspace. Some settings cannot be changed.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">General</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="org-name" className="block font-medium text-sm">
                Workspace Name
              </label>
              <input
                id="org-name"
                type="text"
                defaultValue={org.slug}
                disabled={isPersonal}
                className="mt-1 w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="org-slug" className="block font-medium text-sm">
                Slug
              </label>
              <input
                id="org-slug"
                type="text"
                defaultValue={org.slug}
                disabled={isPersonal}
                className="mt-1 w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </section>

        {!isPersonal && (
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
        )}
      </div>
    </div>
  );
}
