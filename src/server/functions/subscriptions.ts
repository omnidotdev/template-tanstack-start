import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import billing from "@/lib/providers/billing";
import { authMiddleware } from "@/server/middleware";

const checkoutSchema = z.object({
  priceId: z.string().startsWith("price_"),
  successUrl: z.string().url().optional(),
});

const subscriptionSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
});

/**
 * Validate access token or throw.
 */
const requireAccessToken = (accessToken: string | undefined): string => {
  if (!accessToken) {
    throw new Error("Access token required");
  }
  return accessToken;
};

/**
 * Get subscription details for an entity.
 */
export const getSubscription = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session for a new subscription.
 */
export const getCheckoutUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => checkoutSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.createCheckoutSession({
      priceId: data.priceId,
      successUrl: data.successUrl ?? `${BASE_URL}/pricing`,
      customerEmail: context.session.user.email!,
      customerName: context.session.user.name ?? undefined,
      metadata: {
        externalId: context.session.user.identityProviderId!,
        omniProduct: app.name.toLowerCase(),
      },
    });
  });

/**
 * Get billing portal URL for managing subscription.
 */
export const getBillingPortalUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getBillingPortalUrl(
      data.entityType,
      data.entityId,
      app.name.toLowerCase(),
      `${BASE_URL}/profile`,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Cancel a subscription.
 */
export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.cancelSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Renew a subscription (remove scheduled cancellation).
 * @knipignore
 */
export const renewSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => subscriptionSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.renewSubscription(
      data.entityType,
      data.entityId,
      requireAccessToken(context.session.accessToken),
    );
  });
