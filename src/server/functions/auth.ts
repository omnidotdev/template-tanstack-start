import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

import auth from "@/lib/auth/auth";
import { AUTH_BASE_URL } from "@/lib/config/env.config";

/**
 * Fetch the current user session.
 * Returns session with user info if authenticated, null otherwise.
 */
export const fetchSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) return { session: null };

  // Get access token and identity provider ID for downstream use
  let accessToken: string | undefined;
  let identityProviderId: string | undefined;

  try {
    const tokenResult = await auth.api.getAccessToken({
      body: { providerId: "omni" },
      headers,
    });
    accessToken = tokenResult?.accessToken;

    // Extract identity provider ID from the ID token
    if (tokenResult?.idToken) {
      const jwks = createRemoteJWKSet(new URL(`${AUTH_BASE_URL}/jwks`));
      const { payload } = await jwtVerify(tokenResult.idToken, jwks);
      identityProviderId = payload.sub;
    }
  } catch (err) {
    console.error("[fetchSession] Error getting access token:", err);
  }

  return {
    session: {
      ...session,
      accessToken,
      user: {
        ...session.user,
        identityProviderId,
      },
    },
  };
});

/**
 * Sign out and redirect to home page.
 * @knipignore - Exported for downstream use
 */
export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const headers = getRequestHeaders();
    await auth.api.signOut({ headers });
    throw redirect({ to: "/" });
  },
);
