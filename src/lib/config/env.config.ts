/**
 * Environment variables.
 */
export const {
  // core
  VITE_BASE_URL: BASE_URL,
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_AUTH_BASE_URL: AUTH_BASE_URL,
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
} = { ...import.meta.env, ...process.env };

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// Startup warnings for optional integrations
if (!BILLING_BASE_URL)
  console.warn("BILLING_BASE_URL not set, billing disabled");
if (!STRIPE_PORTAL_CONFIG_ID)
  console.warn("STRIPE_PORTAL_CONFIG_ID not set, Stripe portal disabled");
if (!AUTHZ_API_URL) console.warn("AUTHZ_API_URL not set, authorization disabled");
if (!AUTHZ_ENABLED) console.warn("AUTHZ_ENABLED not set, authorization disabled");
if (!VORTEX_API_URL)
  console.warn("VORTEX_API_URL not set, event streaming disabled");
if (!VORTEX_API_KEY)
  console.warn("VORTEX_API_KEY not set, event streaming disabled");

// environment helpers
export const isDevEnv = import.meta.env.DEV;
