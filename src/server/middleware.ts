import { createMiddleware } from "@tanstack/react-start";

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
