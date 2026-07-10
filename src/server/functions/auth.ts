import {
  OMNI_CLAIMS_NAMESPACE,
  ensureFreshAccessToken,
  isInvalidGrant,
} from "@omnidotdev/providers";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import { decodeJwt } from "jose";

import auth from "@/lib/auth/auth";
import { buildIdpLogoutUrl } from "@/lib/auth/idpLogout";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";

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

    if (isInvalidGrant(err)) {
      console.warn("[fetchSession] Invalid refresh token, clearing session");
      try {
        await auth.api.signOut({ headers });
      } catch {
        // Sign-out may fail if session is already corrupt
      }
      return { session: null };
    }
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
export function getIdpLogoutUrl(idTokenHint?: string): string | null {
  // Returns null (falling back to a local-only sign-out) unless every part is
  // present, including the id token: Gatekeeper's end-session endpoint requires
  // id_token_hint, so redirecting without it 400s and breaks sign-out. The id
  // token may be absent after a token refresh, which does not re-issue one.
  return buildIdpLogoutUrl({
    authBaseUrl: AUTH_BASE_URL,
    clientId: AUTH_CLIENT_ID,
    redirectUri: BASE_URL,
    idTokenHint,
  });
}

/**
 * Sign out from the local session (server-side)
 * Returns the IDP logout URL for federated logout redirect
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();
    const headers = request.headers;

    // Grab the ID token before we destroy the local session
    let idToken: string | undefined;
    try {
      const tokenResult = await auth.api.getAccessToken({
        body: { providerId: "omni" },
        headers,
      });
      idToken = tokenResult?.idToken;
    } catch {
      // Token may already be expired — proceed with logout anyway
    }

    await auth.api.signOut({ headers });

    return { idpLogoutUrl: getIdpLogoutUrl(idToken) };
  },
);

/**
 * Get user organizations from IDP token claims.
 * Returns an empty array if unauthenticated or no claims are present.
 */
export const getUserOrganizations = createServerFn().handler(
  async (): Promise<OrganizationClaim[]> => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) return [];

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

      if (!tokenResult?.idToken) return [];

      const payload = decodeJwt(tokenResult.idToken);
      const claims = payload[OMNI_CLAIMS_NAMESPACE];

      if (!Array.isArray(claims)) return [];

      return claims as OrganizationClaim[];
    } catch {
      return [];
    }
  },
);
