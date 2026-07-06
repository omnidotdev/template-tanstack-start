import { Button } from "@omnidotdev/thornberry/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cancelSubscription as cancelSubscriptionFn } from "@/server/functions/subscriptions";

interface Props {
  entityType: string;
  entityId: string;
}

/**
 * Cancel subscription, guarded by a confirmation dialog.
 */
const CancelSubscription = ({ entityType, entityId }: Props) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { mutateAsync: cancelSubscription, isPending } = useMutation({
    mutationFn: async () =>
      await cancelSubscriptionFn({
        data: { entityType, entityId },
      }),
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Subscription scheduled for cancellation");
      setOpen(false);
    },
    onError: () => toast.error("Failed to cancel subscription"),
  });

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cancel subscription"
        onClick={() => setOpen(true)}
      >
        <Trash2Icon className="text-red-500" />
      </Button>

      <DialogBackdrop />

      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />

          <DialogTitle>Cancel subscription?</DialogTitle>

          <DialogDescription>
            Your plan stays active until the end of the current billing period,
            then it will not renew. You can resume it any time before then.
          </DialogDescription>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Keep subscription
            </Button>

            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => cancelSubscription()}
            >
              {isPending ? "Cancelling..." : "Cancel subscription"}
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CancelSubscription;
