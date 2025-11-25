import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/config/env.config";
import { stripe } from "@/payments/client";
import { authMiddleware } from "@/server/authMiddleware";

const cancelSubscriptionSchema = z.object({
  customerId: z.string().startsWith("cus_"),
  subscriptionId: z.string().startsWith("sub_"),
  returnUrl: z.string(),
});

const getCancelSubscriptionUrl = createServerFn()
  .inputValidator((data) => cancelSubscriptionSchema.parse(data))
  .middleware([authMiddleware])
  // TODO: add middleware to handle validating that it is indeed the signed in user's subscription
  .handler(async ({ data }) => {
    // TODO: move this config to stripe and just access the ID (through env var or something) rather than creating it each time
    const config = await stripe.billingPortal.configurations.create({
      features: {
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: ["too_expensive", "other"],
          },
        },
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: data.customerId,
      configuration: config.id,
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: data.subscriptionId,
        },
      },
      return_url: data.returnUrl,
    });

    return session.url;
  });

interface Props {
  customerId: string;
  subscriptionId: string;
}

export const CancelSubscription = ({ customerId, subscriptionId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: cancelSubscription } = useMutation({
    mutationFn: async () =>
      await getCancelSubscriptionUrl({
        data: { customerId, subscriptionId, returnUrl: `${BASE_URL}/profile` },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => cancelSubscription()}>
      <Trash2Icon className="text-red-500" />
    </Button>
  );
};
