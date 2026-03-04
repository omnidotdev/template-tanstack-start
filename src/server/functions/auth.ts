import { ensureFreshAccessToken } from "@omnidotdev/providers";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import { decodeJwt } from "jose";

import auth from "@/lib/auth/auth";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

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
    const tokenResult = await ensureFreshAccessToken({
      getAccessToken: () =>
        auth.api.getAccessToken({
          body: { providerId: "omni" },
          headers,
        }),
      refreshToken: () =>
        auth.api.refreshToken({
          body: { providerId: "omni" },
          headers,
        }),
    });
    accessToken = tokenResult?.accessToken;

    // Decode identity claims from the ID token — signature was already
    // verified during the OAuth flow; the token is retrieved from our
    // own trusted auth storage so re-verification is unnecessary
    if (tokenResult?.idToken) {
      const payload = decodeJwt(tokenResult.idToken);
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

/**
 * Build the IDP end_session URL for federated logout
 */
export function getIdpLogoutUrl(): string | null {
  if (!AUTH_BASE_URL || !AUTH_CLIENT_ID || !BASE_URL) return null;

  const endSessionUrl = new URL(`${AUTH_BASE_URL}/oauth2/endsession`);
  endSessionUrl.searchParams.set("client_id", AUTH_CLIENT_ID);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", BASE_URL);

  return endSessionUrl.toString();
}

/**
 * Sign out from the local session (server-side)
 * Returns the IDP logout URL for federated logout redirect
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });

    return { idpLogoutUrl: getIdpLogoutUrl() };
  },
);
