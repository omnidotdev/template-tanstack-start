import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  workspaceId?: string;
}

/**
 * Manage billing button placeholder.
 *
 * In production, this would open the Stripe billing portal.
 * Requires Aether integration for workspace-level billing.
 */
const ManageBilling = ({ workspaceId }: Props) => {
  if (!workspaceId) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        // TODO: Implement with Aether + Stripe integration
        void workspaceId;
      }}
    >
      <SettingsIcon className="mr-2 h-4 w-4" />
      Manage Billing
    </Button>
  );
};

export default ManageBilling;
