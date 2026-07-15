import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authz } from "@/lib/providers";
import { authMiddleware } from "@/server/middleware";

import type {
  PermissionCheck,
  WardenRelation,
  WardenResourceType,
} from "@omnidotdev/providers/authz";

// The authz provider types resourceType/permission as the Warden resource and
// relation unions. Validate they are strings at runtime (the provider enforces
// the actual values) while typing them to satisfy the strongly-typed API
const resourceType = z.custom<WardenResourceType>((v) => typeof v === "string");
const permission = z.custom<WardenRelation<WardenResourceType>>(
  (v) => typeof v === "string",
);

const checkPermissionSchema = z.object({
  resourceType,
  resourceId: z.string().uuid(),
  permission,
});

const batchCheckSchema = z.object({
  checks: z.array(
    z.object({
      resourceType,
      resourceId: z.string().uuid(),
      permission,
    }),
  ),
});

/**
 * Check if the current user has permission on a resource.
 */
export const checkPermission = createServerFn()
  .inputValidator((data) => checkPermissionSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean> => {
    return authz.checkPermission(
      context.session.user.id,
      data.resourceType,
      data.resourceId,
      data.permission,
    );
  });

/**
 * Batch check permissions for multiple resources.
 * Returns an array of booleans corresponding to each check.
 */
export const batchCheckPermissions = createServerFn()
  .inputValidator((data) => batchCheckSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<boolean[]> => {
    if (!authz.checkPermissionsBatch) {
      // Fallback to individual checks
      const results: boolean[] = [];
      for (const check of data.checks) {
        const allowed = await authz.checkPermission(
          context.session.user.id,
          check.resourceType,
          check.resourceId,
          check.permission,
        );
        results.push(allowed);
      }
      return results;
    }

    const results = await authz.checkPermissionsBatch(
      // Runtime-valid checks; cast bridges the broad validated unions to the
      // provider's discriminated PermissionCheck type
      data.checks.map((check) => ({
        userId: context.session.user.id,
        ...check,
      })) as PermissionCheck[],
    );
    return results.map((r) => r.allowed);
  });
