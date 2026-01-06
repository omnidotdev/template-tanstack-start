import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCancelSubscriptionUrl } from "@/server/functions/subscriptions";

interface Props {
  subscriptionId: string;
}

/**
 * Cancel subscription.
 */
const CancelSubscription = ({ subscriptionId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: cancelSubscription } = useMutation({
    mutationFn: async () =>
      await getCancelSubscriptionUrl({
        data: { subscriptionId },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => cancelSubscription()}>
      <Trash2Icon className="text-red-500" />
    </Button>
  );
};

export default CancelSubscription;
