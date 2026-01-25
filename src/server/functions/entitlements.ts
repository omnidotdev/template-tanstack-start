import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { entitlements } from "@/lib/providers";
import { authMiddleware } from "@/server/middleware";

import type { EntitlementsResponse } from "@/lib/providers";

const entitySchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  productId: z.string().optional(),
});

const checkEntitlementSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  productId: z.string(),
  featureKey: z.string(),
});

/**
 * Get all entitlements for an entity.
 */
export const getEntitlements = createServerFn()
  .inputValidator((data) => entitySchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<EntitlementsResponse | null> => {
    return entitlements.getEntitlements(
      data.entityType,
      data.entityId,
      data.productId,
      context.session.accessToken,
    );
  });

/**
 * Check if an entity has a specific entitlement.
 * Returns the entitlement value if found, null otherwise.
 */
export const checkEntitlement = createServerFn()
  .inputValidator((data) => checkEntitlementSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<string | null> => {
    return entitlements.checkEntitlement(
      data.entityType,
      data.entityId,
      data.productId,
      data.featureKey,
      context.session.accessToken,
    );
  });
