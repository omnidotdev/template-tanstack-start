import { createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/core";
import { CancelSubscription, ManageSubscription } from "@/components/profile";
import { capitalizeFirstLetter } from "@/lib/util";
import { getSubscriptions } from "@/server/functions/subscriptions";

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
        <ManageSubscription subscriptionId={row.original.id} />

        <CancelSubscription subscriptionId={row.original.id} />
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

/**
 * Profile page.
 */
const ProfilePage = () => {
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
};

export const Route = createFileRoute("/_auth/profile")({
  loader: async () => {
    const subscriptions = await getSubscriptions();

    return { subscriptions };
  },
  component: ProfilePage,
});
