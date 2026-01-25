import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";
import {
  getManageBillingUrl,
  getSubscription,
  reactivateSubscription,
  revokeSubscription,
} from "@/server/functions/subscriptions";

export const Route = createFileRoute("/_auth/organizations/$orgSlug/billing")({
  component: OrgBillingPage,
});

/**
 * Organization billing page.
 * Integrates with Aether for subscription management.
 */
function OrgBillingPage() {
  const { orgSlug } = Route.useParams();
  const router = useRouter();
  const { organizations } = useOrganization();

  const org = organizations.find((o) => o.slug === orgSlug);

  // TODO: Get workspaceId from context or URL params
  // For now, this is a placeholder - in a real app, billing might be
  // at the organization level or workspace level depending on your model
  const workspaceId = org?.id ?? "";

  // Fetch subscription data
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription", workspaceId],
    queryFn: () => getSubscription({ data: { workspaceId } }),
    enabled: !!workspaceId,
  });

  // Billing portal mutation
  const billingPortalMutation = useMutation({
    mutationFn: async () => {
      const url = await getManageBillingUrl({
        data: {
          workspaceId,
          returnUrl: window.location.href,
        },
      });
      window.location.href = url;
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: () => revokeSubscription({ data: { workspaceId } }),
    onSuccess: () => router.invalidate(),
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: () => reactivateSubscription({ data: { workspaceId } }),
    onSuccess: () => router.invalidate(),
  });

  if (!org) return null;

  const planName = subscription?.product?.name ?? "Free";
  const planDescription =
    subscription?.product?.description ?? "Basic features for personal use";
  const isSubscribed = subscription?.status === "active";
  const isCanceling = !!subscription?.cancelAt;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Billing</h1>

      <div className="space-y-6">
        {/* Current Plan */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">Current Plan</h2>
          {isLoadingSubscription ? (
            <div className="animate-pulse">
              <div className="h-8 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-48 rounded bg-muted" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-2xl">{planName}</p>
                <p className="text-muted-foreground text-sm">
                  {planDescription}
                </p>
                {isCanceling && subscription?.cancelAt && (
                  <p className="mt-2 text-amber-600 text-sm">
                    Cancels on{" "}
                    {new Date(
                      subscription.cancelAt * 1000,
                    ).toLocaleDateString()}
                  </p>
                )}
                {isSubscribed && subscription?.currentPeriodEnd && (
                  <p className="mt-1 text-muted-foreground text-xs">
                    {isCanceling ? "Access until" : "Renews"}{" "}
                    {new Date(
                      subscription.currentPeriodEnd * 1000,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isCanceling ? (
                  <button
                    type="button"
                    onClick={() => reactivateMutation.mutate()}
                    disabled={reactivateMutation.isPending}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {reactivateMutation.isPending
                      ? "Reactivating..."
                      : "Reactivate Plan"}
                  </button>
                ) : !isSubscribed ? (
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Navigate to pricing page or open checkout
                      router.navigate({ to: "/pricing" });
                    }}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                  >
                    Upgrade Plan
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </section>

        {/* Marketing Features */}
        {subscription?.product?.marketing_features &&
          subscription.product.marketing_features.length > 0 && (
            <section className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold text-lg">Plan Features</h2>
              <ul className="space-y-2">
                {subscription.product.marketing_features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Usage - TODO: Wire to entitlements */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">Usage</h2>
          <p className="text-muted-foreground text-sm">
            Usage metrics will appear here once entitlements are configured.
          </p>
        </section>

        {/* Billing Portal */}
        {isSubscribed && (
          <section className="rounded-lg border p-6">
            <h2 className="mb-4 font-semibold text-lg">Payment & Invoices</h2>
            <p className="mb-4 text-muted-foreground text-sm">
              Manage your payment methods, view invoices, and update billing
              information.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => billingPortalMutation.mutate()}
                disabled={billingPortalMutation.isPending}
                className="rounded-lg border px-4 py-2 transition-colors hover:bg-muted disabled:opacity-50"
              >
                {billingPortalMutation.isPending
                  ? "Opening..."
                  : "Open Billing Portal"}
              </button>
              {!isCanceling && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to cancel your subscription?",
                      )
                    ) {
                      cancelMutation.mutate();
                    }
                  }}
                  disabled={cancelMutation.isPending}
                  className="rounded-lg border border-red-200 px-4 py-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelMutation.isPending ? "Canceling..." : "Cancel Plan"}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
