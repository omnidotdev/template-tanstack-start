import { Format, TabsRootProvider, useTabs } from "@ark-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { FrequentlyAskedQuestions } from "@/components/pricing/FrequentlyAskedQuestions";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeFirstLetter } from "@/lib/util/capitalizeFirstLetter";

const FREE_PRODUCT = {
  recurring_interval: "forever",
  title: "free",
  description: "Start for free.",
  unit_amount: 0,
  marketing_features: [
    { name: "Feature 1" },
    { name: "Feature 2" },
    { name: "Feature 3" },
  ],
} as const;

const MOCK_PRODUCTS = [
  FREE_PRODUCT,
  {
    recurring_interval: "month",
    title: "basic",
    description: "Perfect for small teams just getting started.",
    unit_amount: 500,
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
  {
    recurring_interval: "month",
    title: "pro",
    description: "Everything you need for a growing business.",
    unit_amount: 1200,
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
  {
    recurring_interval: "year",
    title: "basic",
    description: "Perfect for small teams just getting started.",
    unit_amount: 4500,
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
  {
    recurring_interval: "year",
    title: "pro",
    description: "Everything you need for a growing business.",
    unit_amount: 10800,
    marketing_features: [
      { name: "Feature 1" },
      { name: "Feature 2" },
      { name: "Feature 3" },
    ],
  },
];

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const tabs = useTabs({ defaultValue: "month" });

  const filteredProducts = MOCK_PRODUCTS.filter(
    (prod) =>
      prod.recurring_interval === "forever" ||
      prod.recurring_interval === tabs.value,
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
          {filteredProducts.map((prod) => (
            <CardRoot
              key={prod.title}
              className="size-full max-w-lg overflow-hidden lg:min-w-80"
            >
              <CardHeader className="bg-muted pb-3 lg:min-h-[202px]">
                <div className="flex flex-1 flex-col">
                  <CardTitle className="text-lg">
                    {capitalizeFirstLetter(prod.title)}
                  </CardTitle>

                  <CardDescription className="mt-2 mb-4 flex-1">
                    {prod.description}
                  </CardDescription>

                  <p className="font-semibold text-lg">
                    <Format.Number
                      value={prod.unit_amount / 100}
                      style="currency"
                      currency="USD"
                      notation="compact"
                      compactDisplay="short"
                    />
                    <span className="pl-1 font-normal text-muted-foreground text-sm">
                      /{prod.recurring_interval}
                    </span>
                  </p>
                </div>

                <Button>Get Started</Button>
              </CardHeader>

              <CardContent className="p-4">
                {prod.marketing_features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-2">
                    <CheckIcon className="size-4 text-primary" />
                    <p>{feature.name}</p>
                  </div>
                ))}
              </CardContent>
            </CardRoot>
          ))}
        </TabsContent>
      </TabsRootProvider>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
}
