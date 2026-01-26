import { createFileRoute } from "@tanstack/react-router";

import { CancelSubscription, ManageSubscription } from "@/components/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSession } from "@/server/functions/auth";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Subscription } from "@/lib/providers/billing";

/**
 * Format Unix timestamp to readable date.
 */
const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString();

/**
 * Subscription card component.
 */
const SubscriptionCard = ({
  subscription,
  entityType,
  entityId,
}: {
  subscription: Subscription;
  entityType: string;
  entityId: string;
}) => {
  const isPendingCancellation = subscription.cancelAt !== null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {subscription.product?.name ?? "Subscription"}
        </CardTitle>
        <div className="flex gap-1">
          <ManageSubscription entityType={entityType} entityId={entityId} />
          {!isPendingCancellation && (
            <CancelSubscription entityType={entityType} entityId={entityId} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="capitalize">
            {isPendingCancellation
              ? `Cancels ${formatDate(subscription.cancelAt!)}`
              : subscription.status}
          </dd>
          <dt className="text-muted-foreground">Current Period Ends</dt>
          <dd>{formatDate(subscription.currentPeriodEnd)}</dd>
          {subscription.product?.description && (
            <>
              <dt className="text-muted-foreground">Description</dt>
              <dd>{subscription.product.description}</dd>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

/**
 * Profile page.
 */
const ProfilePage = () => {
  const { auth } = Route.useRouteContext();
  const { subscription, entityType, entityId } = Route.useLoaderData();

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
        <h1 className="font-bold sm:text-xl">Subscription</h1>
        <h2 className="text-muted-foreground text-xs sm:text-sm">
          View details and manage your subscription.
        </h2>

        <div className="mt-6">
          {subscription ? (
            <SubscriptionCard
              subscription={subscription}
              entityType={entityType}
              entityId={entityId}
            />
          ) : (
            <p className="text-muted-foreground">No active subscription.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile")({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { subscription: null, entityType: "user", entityId: "" };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

    const subscription = await getSubscription({
      data: { entityType, entityId },
    });

    return { subscription, entityType, entityId };
  },
  component: ProfilePage,
});
