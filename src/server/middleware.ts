import { createMiddleware } from "@tanstack/react-start";

import payments from "@/lib/payments";
import { fetchSession } from "@/server/functions/auth";

/**
 * Authentication middleware.
 * Validates the user session and adds it to the context.
 * Throws if the user is not authenticated.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { session } = await fetchSession();

  if (!session) throw new Error("Unauthorized");

  return next({ context: { session } });
});

/**
 * Customer middleware.
 * Chains on authMiddleware to look up the Stripe customer by identity provider ID.
 * Adds the customer (or null if not found) to the context.
 */
export const customerMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { data: customers } = await payments.customers.search({
      query: `metadata["externalId"]:"${context.session.user.identityProviderId!}"`,
    });

    return next({
      context: { customer: customers.length ? customers[0] : null },
    });
  });
