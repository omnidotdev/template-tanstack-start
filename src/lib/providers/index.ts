/**
 * Shared provider instances.
 *
 * Instantiates authorization and billing providers from @omnidotdev/providers
 * with app-specific configuration from environment variables.
 */

import {
  createAuthzProvider,
  createBillingProvider,
  resolveProvider,
} from "@omnidotdev/providers";

import { AUTHZ_API_URL, BILLING_BASE_URL } from "@/lib/config/env.config";

const authzProviderName = resolveProvider(
  process.env.VITE_AUTHZ_PROVIDER ?? process.env.AUTHZ_PROVIDER,
  "warden",
);

const billingProviderName = resolveProvider(
  process.env.VITE_BILLING_PROVIDER ?? process.env.BILLING_PROVIDER,
  "aether",
);

export const authz = createAuthzProvider(authzProviderName, {
  apiUrl: AUTHZ_API_URL ?? "",
});

export const billing = createBillingProvider(billingProviderName, {
  baseUrl: BILLING_BASE_URL ?? "",
  appId: "platform",
});
