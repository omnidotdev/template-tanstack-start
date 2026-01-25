import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getManageBillingUrl } from "@/server/functions/subscriptions";

interface Props {
  workspaceId?: string;
}

/**
 * Manage billing button.
 * Opens Stripe billing portal for the workspace.
 */
const ManageBilling = ({ workspaceId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: manageBilling, isPending } = useMutation({
    mutationFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      return await getManageBillingUrl({
        data: {
          workspaceId,
          returnUrl: window.location.href,
        },
      });
    },
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  if (!workspaceId) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => manageBilling()}
      disabled={isPending}
    >
      <SettingsIcon className="mr-2 h-4 w-4" />
      Manage Billing
    </Button>
  );
};

export default ManageBilling;
