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
  // self-hosted mode
  VITE_SELF_HOSTED: SELF_HOSTED,
  // provider overrides
  VITE_ENTITLEMENT_PROVIDER: ENTITLEMENT_PROVIDER,
  VITE_AUTHZ_PROVIDER: AUTHZ_PROVIDER,
} = { ...import.meta.env, ...process.env };

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// environment helpers
export const isDevEnv = import.meta.env.DEV;
export const isSelfHosted = SELF_HOSTED === "true";

/**
 * Resolve a provider based on env var or self-hosted defaults.
 */
const resolveProvider = (
  envVar: string | undefined,
  defaultSaas: string,
  defaultSelfHosted = "local",
): string => {
  if (envVar) return envVar;
  return isSelfHosted ? defaultSelfHosted : defaultSaas;
};

export const entitlementProvider = resolveProvider(
  ENTITLEMENT_PROVIDER,
  "aether",
);
export const authzProvider = resolveProvider(AUTHZ_PROVIDER, "warden");
