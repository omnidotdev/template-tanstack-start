import { gatekeeperOrgManageUrl } from "@omnidotdev/providers/react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { ExternalLink } from "@/components/core";
import { ACCOUNT_URL } from "@/lib/config/env.config";

export const Route = createFileRoute("/_auth/@{$workspaceSlug}/~/members")({
  component: MembersPage,
});

/**
 * Members page.
 *
 * Team membership and roles live in the shared Omni account hub (backed by
 * Gatekeeper, the shared IDP), not re-implemented per product. Deep-link the
 * members route to the hub's org-management page instead of self-hosting a
 * member UI.
 */
function MembersPage() {
  const { workspaceSlug } = Route.useParams();

  const manageUrl = ACCOUNT_URL
    ? gatekeeperOrgManageUrl(ACCOUNT_URL, workspaceSlug)
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-tight">Members</h1>

        <p className="text-muted-foreground">
          Team members and roles are managed in your Omni account, so they stay
          consistent across every Omni product you use.
        </p>
      </div>

      {manageUrl && (
        <ExternalLink variant="solid" href={manageUrl}>
          Manage members in Omni
          <ExternalLinkIcon className="size-4" />
        </ExternalLink>
      )}
    </div>
  );
}
