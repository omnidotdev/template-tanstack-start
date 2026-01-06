import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import app from "@/lib/config/app.config";
import { BASE_URL, STRIPE_PORTAL_CONFIG_ID } from "@/lib/config/env.config";
import payments from "@/lib/payments";
import { customerMiddleware } from "@/server/middleware";

const checkoutSchema = z.object({
  priceId: z.string().startsWith("price_"),
  successUrl: z.string().url().optional(),
});

const subscriptionSchema = z.object({
  subscriptionId: z.string().startsWith("sub_"),
});

/**
 * Get user's active subscriptions.
 */
export const getSubscriptions = createServerFn()
  .middleware([customerMiddleware])
  .handler(async ({ context }) => {
    if (!context.customer) return [];

    const subscriptions = await payments.subscriptions.list({
      customer: context.customer.id,
      status: "active",
    });

    return subscriptions.data.map((sub) => ({
      id: sub.id,
      customerId: context.customer?.id,
      price: sub.items.data[0].price,
    }));
  });

/**
 * Create a checkout session for a new subscription.
 * Creates the Stripe customer if one doesn't exist.
 */
export const getCheckoutUrl = createServerFn({ method: "POST" })
  .middleware([customerMiddleware])
  .inputValidator((data) => checkoutSchema.parse(data))
  .handler(async ({ data, context }) => {
    let customer = context.customer;

    if (!customer) {
      customer = await payments.customers.create({
        email: context.session.user.email!,
        name: context.session.user.name ?? undefined,
        metadata: {
          externalId: context.session.user.identityProviderId!,
        },
      });
    }

    const checkout = await payments.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      success_url: data.successUrl ?? `${BASE_URL}/pricing`,
      line_items: [{ price: data.priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          omniProduct: app.name.toLowerCase(),
        },
      },
    });

    return checkout.url!;
  });

/**
 * Get billing portal URL for managing a subscription.
 */
export const getManageSubscriptionUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => subscriptionSchema.parse(data))
  .middleware([customerMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.customer) throw new Error("No customer found");

    const session = await payments.billingPortal.sessions.create({
      customer: context.customer.id,
      configuration: STRIPE_PORTAL_CONFIG_ID,
      flow_data: {
        type: "subscription_update",
        subscription_update: { subscription: data.subscriptionId },
      },
      return_url: `${BASE_URL}/profile`,
    });

    return session.url;
  });

/**
 * Get billing portal URL for canceling a subscription.
 */
export const getCancelSubscriptionUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => subscriptionSchema.parse(data))
  .middleware([customerMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.customer) throw new Error("No customer found");

    const session = await payments.billingPortal.sessions.create({
      customer: context.customer.id,
      configuration: STRIPE_PORTAL_CONFIG_ID,
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: { subscription: data.subscriptionId },
      },
      return_url: `${BASE_URL}/profile`,
    });

    return session.url;
  });
