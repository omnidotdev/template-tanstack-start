import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/core/DataTable";
import { CancelSubscription } from "@/components/profile/CancelSubscription";
import { ManageSubscription } from "@/components/profile/ManageSubscription";
import { capitalizeFirstLetter } from "@/lib/util/capitalizeFirstLetter";
import { stripe } from "@/payments/client";
import { authMiddleware } from "@/server/authMiddleware";

import type Stripe from "stripe";

interface Subscription {
  id: Stripe.Subscription["id"];
  customerId: Stripe.Customer["id"];
  price: Stripe.Price;
}

const columnHelper = createColumnHelper<Subscription>();

const columns = [
  columnHelper.display({
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex w-full justify-center gap-1">
        <ManageSubscription
          customerId={row.original.customerId}
          subscriptionId={row.original.id}
        />

        <CancelSubscription
          customerId={row.original.customerId}
          subscriptionId={row.original.id}
        />
      </div>
    ),
    meta: {
      tableCellClassName: "text-center max-w-10",
    },
  }),
  columnHelper.accessor("id", {
    header: "Sub ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: "Tier",
    cell: (info) => {
      const price = info.getValue();

      return capitalizeFirstLetter(price.metadata.tier);
    },
  }),
];

const fetchSubscriptions = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const customers = await stripe.customers.search({
      query: `metadata['externalId']:'${context.idToken.sub}'`,
    });

    if (!customers.data.length) return [];

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
    });

    return subscriptions.data.map((sub) => ({
      id: sub.id,
      // NB: type assertion is required here so that the server function knows this is serializable.
      // We do not expand customer, so this will always return the customer ID, thus this type assertion is safe
      customerId: sub.customer as string,
      price: sub.items.data[0].price,
    }));
  });

export const Route = createFileRoute("/_auth/profile")({
  loader: async () => {
    const subscriptions = await fetchSubscriptions();

    return { subscriptions };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext();
  const { subscriptions } = Route.useLoaderData();

  const table = useReactTable({
    columns,
    data: subscriptions,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col text-pretty px-4 py-8 text-center sm:text-start">
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

        {subscriptions.length ? (
          <DataTable table={table} containerProps="mt-6" />
        ) : (
          <p className="mt-4">No active subscriptions.</p>
        )}
      </div>
    </div>
  );
}
