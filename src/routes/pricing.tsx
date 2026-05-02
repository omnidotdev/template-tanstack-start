import { TabsRootProvider, useTabs } from "@ark-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { FrequentlyAskedQuestions, PriceCard } from "@/components/pricing";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserOrganizations } from "@/server/functions/auth";
import { getPrices } from "@/server/functions/prices";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Subscription } from "@omnidotdev/providers";
import type { Price } from "@/components/pricing";

const FREE_PRICE: Price = {
  id: "free-price",
  active: true,
  currency: "usd",
  unit_amount: 0,
  recurring: null,
  product: {
    id: "free-product",
    name: "Free",
    description: "Start for free.",
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
  metadata: { tier: "free" },
};

const searchSchema = z.object({
  tier: z.string().optional(),
});

/**
 * Pricing page
 */
const PricingPage = () => {
  const { prices, organizations, orgSubscriptions } = Route.useLoaderData();

  const tabs = useTabs({ defaultValue: "month" });

  const filteredPrices = prices.filter(
    (price) => price.recurring?.interval === tabs.value,
  );

  return (
    <div className="flex h-full flex-col items-center px-4 py-8 text-center">
      <h1 className="my-6 font-bold text-4xl">Simple, transparent pricing</h1>

      <h2 className="font-medium text-muted-foreground text-xl">
        Start for free. As your business grows, upgrade to fit your needs.
      </h2>

      <TabsRootProvider
        value={tabs}
        className="mt-8 flex w-full flex-col lg:w-fit"
      >
        <TabsList className="place-self-center">
          <TabsTrigger value="month">Monthly</TabsTrigger>
          <TabsTrigger value="year">Yearly</TabsTrigger>
        </TabsList>

        {tabs.value != null && (
          <TabsContent
            value={tabs.value}
            className="flex flex-col items-center gap-4 lg:flex-row"
          >
            <PriceCard
              price={FREE_PRICE}
              organizations={organizations}
              orgSubscriptions={orgSubscriptions}
            />

            {filteredPrices.map((price) => (
              <PriceCard
                key={price.id}
                price={price}
                organizations={organizations}
                orgSubscriptions={orgSubscriptions}
              />
            ))}
          </TabsContent>
        )}
      </TabsRootProvider>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
};

export const Route = createFileRoute("/pricing")({
  validateSearch: searchSchema,
  loader: async () => {
    const prices = await getPrices();
    const organizations = await getUserOrganizations();

    // Fetch subscriptions for all user organizations to determine current tiers
    const orgSubscriptions: Record<string, Subscription | null> = {};

    if (organizations.length > 0) {
      const results = await Promise.all(
        organizations.map(async (org) => {
          try {
            const subscription = await getSubscription({
              data: { organizationId: org.id },
            });
            return { orgId: org.id, subscription };
          } catch {
            return { orgId: org.id, subscription: null };
          }
        }),
      );

      for (const { orgId, subscription } of results) {
        orgSubscriptions[orgId] = subscription;
      }
    }

    return { prices, organizations, orgSubscriptions };
  },
  component: PricingPage,
});
