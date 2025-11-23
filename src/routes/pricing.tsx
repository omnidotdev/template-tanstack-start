import { TabsRootProvider, useTabs } from "@ark-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { FrequentlyAskedQuestions } from "@/components/pricing/FrequentlyAskedQuestions";
import { PriceCard } from "@/components/pricing/PriceCard";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stripe } from "@/payments/client";

import type { Price } from "@/components/pricing/PriceCard";

const FREE_PRICE: Price = {
  id: "free-price",
  unit_amount: 0,
  product: {
    name: "Free",
    description: "Start for free.",
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
};

const fetchPrices = createServerFn().handler(async () => {
  const prices = await stripe.prices.list();

  const pricesWithProduct = await Promise.all(
    prices.data.map(async (price) => ({
      ...price,
      product: await stripe.products.retrieve(price.product as string),
    })),
  );

  return pricesWithProduct.sort((a, b) => a.unit_amount! - b.unit_amount!);
});

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const prices = await fetchPrices();

    return { prices };
  },
  component: PricingPage,
});

function PricingPage() {
  const { prices } = Route.useLoaderData();

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

        <TabsContent
          value={tabs.value!}
          className="flex flex-col items-center gap-4 lg:flex-row"
        >
          {/** Handling the free tier could be quite different across apps. For now, we disable the action for authenticated users. TODO: Implement downstream. */}
          <PriceCard price={FREE_PRICE} disableAction />

          {filteredPrices.map((price) => (
            <PriceCard key={price.id} price={price} />
          ))}
        </TabsContent>
      </TabsRootProvider>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
}
