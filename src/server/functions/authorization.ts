import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authz } from "@/lib/providers";
import { authMiddleware } from "@/server/middleware";

const checkPermissionSchema = z.object({
  resourceType: z.string(),
  resourceId: z.string().uuid(),
  permission: z.string(),
});

const batchCheckSchema = z.object({
  checks: z.array(
    z.object({
      resourceType: z.string(),
      resourceId: z.string().uuid(),
      permission: z.string(),
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
    return authz.batchCheckPermissions(
      data.checks.map((check) => ({
        userId: context.session.user.id,
        ...check,
      })),
    );
  });
