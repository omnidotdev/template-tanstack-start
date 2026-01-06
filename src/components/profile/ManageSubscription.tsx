import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getManageSubscriptionUrl } from "@/server/functions/subscriptions";

interface Props {
  subscriptionId: string;
}

/**
 * Manage subscription.
 */
const ManageSubscription = ({ subscriptionId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: manageSubscription } = useMutation({
    mutationFn: async () =>
      await getManageSubscriptionUrl({
        data: { subscriptionId },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => manageSubscription()}>
      <EditIcon className="text-blue-500" />
    </Button>
  );
};

export default ManageSubscription;
