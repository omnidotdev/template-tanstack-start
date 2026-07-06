import { Button } from "@omnidotdev/thornberry/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { renewSubscription as renewSubscriptionFn } from "@/server/functions/subscriptions";

interface Props {
  entityType: string;
  entityId: string;
}

/**
 * Renew subscription (remove scheduled cancellation).
 */
const RenewSubscription = ({ entityType, entityId }: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync: renewSubscription } = useMutation({
    mutationFn: async () =>
      await renewSubscriptionFn({
        data: { entityType, entityId },
      }),
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Subscription resumed");
    },
    onError: () => toast.error("Failed to resume subscription"),
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Resume subscription"
      onClick={() => renewSubscription()}
    >
      <RotateCcwIcon className="text-green-500" />
    </Button>
  );
};

export default RenewSubscription;
