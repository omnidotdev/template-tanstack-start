import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import gatekeeperOrg from "@/lib/config/gatekeeper";
import { authMiddleware } from "@/server/middleware";

export type { GatekeeperOrganization as Organization } from "@omnidotdev/providers";

// Org/team membership (invite, roles, remove) is managed centrally at the
// account hub (backed by Gatekeeper), not per product, so this template ships
// no member-management server functions. See
// plans/2026-09-02-org-membership-central-hub-adr.md.

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  slug: z.string().optional(),
});

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Create a new organization via Gatekeeper.
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.createOrganization(data, accessToken);
  });

const checkOrganizationHandleSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Check whether an organization handle (slug) is available across the ecosystem
 * namespace. Backs live validation in the create-organization form. Public
 * check, so no auth middleware
 */
export const checkOrganizationHandleAvailability = createServerFn({
  method: "GET",
})
  .inputValidator((data) => checkOrganizationHandleSchema.parse(data))
  .handler(async ({ data }) => {
    return gatekeeperOrg.checkNamespaceAvailability(data.slug);
  });

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      return null;
    }

    return gatekeeperOrg.getOrganizationBySlug(data.slug, accessToken);
  });

/**
 * Fetch an organization by slug without authentication.
 * Used for public access when no JWT is available
 */
export const fetchOrganizationBySlug = createServerFn()
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await gatekeeperOrg.fetchOrganizationBySlug(data.slug);
    } catch (error) {
      console.error("Error fetching organization by slug:", error);
      return null;
    }
  });
