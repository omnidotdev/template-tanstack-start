import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { EditIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BASE_URL, STRIPE_PORTAL_CONFIG_ID } from "@/lib/config/env.config";
import payments from "@/lib/payments";
import authMiddleware from "@/server/authMiddleware";

const manageSubscriptionSchema = z.object({
  subscriptionId: z.string().startsWith("sub_"),
});

const getManageSubscriptionUrl = createServerFn()
  .inputValidator((data) => manageSubscriptionSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const customers = await payments.customers.search({
      query: `metadata['externalId']:'${context.idToken.sub}'`,
    });

    if (!customers.data.length) throw new Error("Invalid customer");

    const session = await payments.billingPortal.sessions.create({
      customer: customers.data[0].id,
      configuration: STRIPE_PORTAL_CONFIG_ID,
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
  subscriptionId: string;
}

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
