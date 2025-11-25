import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { EditIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/config/env.config";
import { stripe } from "@/payments/client";
import { fetchPrices } from "@/routes/pricing";
import { authMiddleware } from "@/server/authMiddleware";

const manageSubscriptionSchema = z.object({
  customerId: z.string().startsWith("cus_"),
  subscriptionId: z.string().startsWith("sub_"),
  returnUrl: z.string(),
});

const getManageSubscriptionUrl = createServerFn()
  .inputValidator((data) => manageSubscriptionSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const [prices, customer] = await Promise.all([
      fetchPrices(),
      stripe.customers.retrieve(data.customerId),
    ]);

    if (customer.deleted) throw new Error("Invalid customer");

    if (customer.metadata.externalId !== context.idToken.sub!)
      throw new Error("Unauthorized");

    const map = new Map<string, string[]>();

    for (const price of prices) {
      const productId = price.product.id;
      const priceId = price.id;

      if (!map.has(productId)) {
        map.set(productId, []);
      }

      map.get(productId)!.push(priceId);
    }

    const products = Array.from(map, ([product, prices]) => ({
      product,
      prices,
    }));

    // TODO: move this config to stripe and just access the ID (through env var or something) rather than creating it each time
    const configuration = await stripe.billingPortal.configurations.create({
      features: {
        payment_method_update: {
          enabled: true,
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price"],
          products,
        },
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: data.customerId,
      configuration: configuration.id,
      flow_data: {
        type: "subscription_update",
        subscription_update: {
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

export const ManageSubscription = ({ customerId, subscriptionId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: manageSubscription } = useMutation({
    mutationFn: async () =>
      await getManageSubscriptionUrl({
        data: { customerId, subscriptionId, returnUrl: `${BASE_URL}/profile` },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => manageSubscription()}>
      <EditIcon className="text-blue-500" />
    </Button>
  );
};
