/**
 * Environment variables.
 */
declare global {
  interface Window {
    /** Public runtime config injected by the root route (see server/functions/env) */
    __ENV__?: Record<string, string>;
  }
}

// This app's build does not inline `VITE_` values into the client bundle, so on
// the client they arrive at runtime via `window.__ENV__` (injected by the root
// route from the server's live env) and override the empty `import.meta.env`.
// On the server, read the live `process.env` directly. Both sides resolve from
// the same runtime env, so hydrated values match.
const env =
  typeof window === "undefined"
    ? { ...import.meta.env, ...process.env }
    : { ...import.meta.env, ...(window.__ENV__ ?? {}) };

export const {
  // core
  VITE_BASE_URL: BASE_URL,
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_AUTH_BASE_URL: AUTH_BASE_URL,
  VITE_ACCOUNT_URL: ACCOUNT_URL,
  // auth (server-side secrets)
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  // billing
  VITE_BILLING_BASE_URL: BILLING_BASE_URL,
  // payment processing
  VITE_STRIPE_PORTAL_CONFIG_ID: STRIPE_PORTAL_CONFIG_ID,
  // authorization
  VITE_AUTHZ_API_URL: AUTHZ_API_URL,
  VITE_AUTHZ_ENABLED: AUTHZ_ENABLED,
  // event streaming
  VITE_VORTEX_API_URL: VORTEX_API_URL,
  VITE_VORTEX_API_KEY: VORTEX_API_KEY,
} = env;

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// Startup warnings for optional integrations. Server-side only: these run at
// module load, so guarding them keeps internal var names out of the browser
// console (the client bundle imports this module too)
if (typeof window === "undefined") {
  if (!BILLING_BASE_URL)
    console.warn("BILLING_BASE_URL not set, billing disabled");
  if (!STRIPE_PORTAL_CONFIG_ID)
    console.warn("STRIPE_PORTAL_CONFIG_ID not set, Stripe portal disabled");
  if (!AUTHZ_API_URL)
    console.warn("AUTHZ_API_URL not set, authorization disabled");
  if (!AUTHZ_ENABLED)
    console.warn("AUTHZ_ENABLED not set, authorization disabled");
  if (!VORTEX_API_URL)
    console.warn("VORTEX_API_URL not set, event streaming disabled");
  if (!VORTEX_API_KEY)
    console.warn("VORTEX_API_KEY not set, event streaming disabled");
}

// environment helpers
export const isDevEnv = import.meta.env.DEV;
