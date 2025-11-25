import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { EditIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BASE_URL, MANAGE_SUB_CONFIG_ID } from "@/lib/config/env.config";
import { stripe } from "@/payments/client";
import { authMiddleware } from "@/server/authMiddleware";

const manageSubscriptionSchema = z.object({
  customerId: z.string().startsWith("cus_"),
  subscriptionId: z.string().startsWith("sub_"),
});

const getManageSubscriptionUrl = createServerFn()
  .inputValidator((data) => manageSubscriptionSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const customer = await stripe.customers.retrieve(data.customerId);

    if (customer.deleted) throw new Error("Invalid customer");

    if (customer.metadata.externalId !== context.idToken.sub!)
      throw new Error("Unauthorized");

    const session = await stripe.billingPortal.sessions.create({
      customer: data.customerId,
      configuration: MANAGE_SUB_CONFIG_ID,
      flow_data: {
        type: "subscription_update",
        subscription_update: {
          subscription: data.subscriptionId,
        },
      },
      return_url: `${BASE_URL}/profile`,
    });

    return session.url;
  });

interface Props {
  customerId: string;
  subscriptionId: string;
}

export const ManageSubscription = ({ customerId, subscriptionId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: manageSubscription } = useMutation({
    mutationFn: async () =>
      await getManageSubscriptionUrl({
        data: { customerId, subscriptionId },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => manageSubscription()}>
      <EditIcon className="text-blue-500" />
    </Button>
  );
};
