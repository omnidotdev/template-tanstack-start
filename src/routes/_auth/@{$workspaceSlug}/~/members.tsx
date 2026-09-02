import { gatekeeperOrgManageUrl } from "@omnidotdev/providers/react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { AUTH_BASE_URL } from "@/lib/config/env.config";

// Org/team membership is managed centrally at the account hub (backed by
// Gatekeeper, the shared IDP), not re-implemented per product. Deep-link the
// members route to the hub's org-management page instead of self-hosting a
// member UI. See plans/2026-09-02-org-membership-central-hub-adr.md.
export const Route = createFileRoute("/_auth/@{$workspaceSlug}/~/members")({
  beforeLoad: ({ params }) => {
    const { workspaceSlug } = params;
    if (!workspaceSlug || !AUTH_BASE_URL) throw redirect({ to: "/" });
    throw redirect({
      href: gatekeeperOrgManageUrl(AUTH_BASE_URL, workspaceSlug),
    });
  },
});
