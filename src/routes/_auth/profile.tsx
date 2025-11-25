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

const ch = createColumnHelper<Stripe.Subscription>();

const columns = [
  ch.display({
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex w-full justify-center gap-1">
        <ManageSubscription
          // NB: if at any point `customer` is expanded in the `fetchCustomer` (for subscriptions) server function below this type cast will break
          customerId={row.original.customer as string}
          subscriptionId={row.original.id}
        />

        <CancelSubscription
          // NB: if at any point `customer` is expanded in the `fetchCustomer` (for subscriptions) server function below this type cast will break
          customerId={row.original.customer as string}
          subscriptionId={row.original.id}
        />
      </div>
    ),
    meta: {
      tableCellClassName: "text-center max-w-10",
    },
  }),
  ch.accessor("id", {
    header: "Sub ID",
    cell: (info) => info.getValue(),
  }),
  ch.accessor("items.data", {
    header: "Tier",
    cell: (info) => {
      const data = info.getValue();

      return capitalizeFirstLetter(data[0].price.metadata.tier);
    },
  }),
];

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

  const table = useReactTable({
    columns,
    data: customer?.subscriptions?.data ?? [],
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

        {customer?.subscriptions?.data.length ? (
          <DataTable table={table} containerProps="mt-6" />
        ) : (
          <p className="mt-4">No active subscriptions.</p>
        )}
      </div>
    </div>
  );
}
