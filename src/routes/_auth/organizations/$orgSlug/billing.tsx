import { Link, createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

export const Route = createFileRoute("/_auth/organizations/$orgSlug/billing")({
  component: OrgBillingPage,
});

/**
 * Organization billing page.
 * Placeholder for Aether integration.
 *
 * In production, this would integrate with:
 * - Aether for entitlements and subscription management
 * - Stripe for payment processing
 */
function OrgBillingPage() {
  const { orgSlug } = Route.useParams();
  const { organizations } = useOrganization();

  const org = organizations.find((o) => o.slug === orgSlug);

  if (!org) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Billing</h1>

      <div className="space-y-6">
        {/* Current Plan */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-2xl">Free</p>
              <p className="text-muted-foreground text-sm">
                Basic features for personal use
              </p>
            </div>
            <Link
              to="/pricing"
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Upgrade Plan
            </Link>
          </div>
        </section>

        {/* Usage Placeholder */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">Usage</h2>
          <p className="text-muted-foreground text-sm">
            Usage metrics will appear here once entitlements are configured via
            Aether.
          </p>
        </section>

        {/* Integration Note */}
        <section className="rounded-lg border border-dashed p-6">
          <h2 className="mb-2 font-semibold text-lg">Integration Guide</h2>
          <p className="text-muted-foreground text-sm">
            This page is a placeholder for organization billing. To enable full
            billing functionality:
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground text-sm">
            <li>Configure Aether for entitlement management</li>
            <li>Set up Stripe for payment processing</li>
            <li>
              Implement subscription server functions in{" "}
              <code className="rounded bg-muted px-1">
                server/functions/subscriptions.ts
              </code>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
