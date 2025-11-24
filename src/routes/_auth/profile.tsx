import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { stripe } from "@/payments/client";
import { authMiddleware } from "@/server/authMiddleware";

import type Stripe from "stripe";

const fetchCustomer = createServerFn()
  .middleware([authMiddleware])
  // @ts-expect-error TODO: fix. See: https://discord.com/channels/719702312431386674/1442566447598534767
  .handler(async ({ context }) => {
    const customers = await stripe.customers.search({
      query: `metadata['externalId']:'${context.idToken.sub}'`,
      expand: ["data.subscriptions"],
    });

    if (!customers.data.length) return null;

    return customers.data[0];
  });

export const Route = createFileRoute("/_auth/profile")({
  // @ts-expect-error TODO: fix. See: https://discord.com/channels/719702312431386674/1442566447598534767
  loader: async () => {
    const customer = await fetchCustomer();

    // TODO: remove type casting when typescript issues above are resolved
    return { customer: customer as Stripe.Customer | null };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext();
  const { customer } = Route.useLoaderData();

  return (
    <div className="flex h-full flex-col text-pretty px-4 py-8 text-center sm:text-start">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl sm:text-3xl">
          Welcome, {auth?.user.name}!
        </h1>
        <h2 className="text-muted-foreground text-sm sm:text-lg">
          Review and manage details about your account below.
        </h2>
      </div>

      <div className="mt-8 flex flex-col text-start">
        <h1 className="font-bold sm:text-xl">Subscriptions</h1>
        <h2 className="text-muted-foreground text-xs sm:text-sm">
          View details and manage your currently active subscriptions.
        </h2>

        {customer ? (
          <div className="mt-4 flex flex-col">
            {customer.subscriptions?.data.map((sub) => (
              <div key={sub.id} className="flex gap-4">
                <p>{sub.id}</p>
                <p>{sub.items.data[0].price.metadata.tier}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4">No active subscriptions.</p>
        )}
      </div>
    </div>
  );
}
