import { betterAuth } from "better-auth/minimal";
import { genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  BASE_URL,
} from "@/lib/config/env.config";

const { AUTH_SECRET } = process.env;

/**
 * Auth server client.
 */
const auth = betterAuth({
  baseURL: BASE_URL,
  basePath: "/api/auth",
  secret: AUTH_SECRET,
  // Trust the app's own origin for auth requests
  trustedOrigins: BASE_URL ? [BASE_URL] : [],
  session: {
    // extend session expiration to 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // refresh session if older than 1 day
    updateAge: 60 * 60 * 24,
    // enable cookie caching for stateless session validation
    cookieCache: {
      enabled: true,
      // match session expiration so OAuth tokens (stored in account_data cookie
      // with the same maxAge) don't expire before the session itself
      maxAge: 60 * 60 * 24 * 30,
      // use encrypted JWE for security
      strategy: "jwe",
      // auto-refresh cookie before expiry (critical for stateless mode)
      refreshCache: true,
    },
  },
  account: {
    // store OAuth tokens (access token, refresh token) in a signed cookie for stateless mode to enable automatic token refresh without a database
    storeAccountCookie: true,
  },
  advanced: {
    // use custom cookie prefix to avoid collision with IDP cookies
    cookiePrefix: "TODO_REPLACE_ME",
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "omni",
          clientId: AUTH_CLIENT_ID ?? "",
          clientSecret: AUTH_CLIENT_SECRET ?? "",
          discoveryUrl: `${AUTH_BASE_URL}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email", "offline_access", "organization"],
          accessType: "offline",
          pkce: true,
        },
      ],
    }),
    // NB: must be the last plugin in the array
    tanstackStartCookies(),
  ],
});

export default auth;
