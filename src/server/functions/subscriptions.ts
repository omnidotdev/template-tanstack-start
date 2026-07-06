import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { billing } from "@/lib/providers";
import { authMiddleware } from "@/server/middleware";

const organizationSchema = z.object({
  organizationId: z.string().min(1),
});

const checkoutWithWorkspaceSchema = z
  .object({
    priceId: z.string().startsWith("price_"),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    workspaceId: z.string().min(1).optional(),
    createWorkspace: z
      .object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100).optional(),
      })
      .optional(),
  })
  .refine((data) => data.workspaceId || data.createWorkspace, {
    message: "Either workspaceId or createWorkspace is required",
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
 * Get subscription details for an organization.
 */
export const getSubscription = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Create a checkout session with workspace creation/selection.
 * Routes through Aether for orchestration.
 */
export const createCheckoutWithWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => checkoutWithWorkspaceSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.createCheckoutWithWorkspace({
      appId: app.name.toLowerCase(),
      priceId: data.priceId,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      accessToken: requireAccessToken(context.session.accessToken),
      workspaceId: data.workspaceId,
      createWorkspace: data.createWorkspace,
    });
  });

/**
 * Get billing portal URL for managing subscription.
 */
export const getBillingPortalUrl = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.getBillingPortalUrl(
      "organization",
      data.organizationId,
      app.name.toLowerCase(),
      `${BASE_URL}/settings`,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Cancel a subscription.
 */
export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.cancelSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });

/**
 * Renew a subscription (remove scheduled cancellation).
 */
export const renewSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }) => {
    return billing.renewSubscription(
      "organization",
      data.organizationId,
      requireAccessToken(context.session.accessToken),
    );
  });
