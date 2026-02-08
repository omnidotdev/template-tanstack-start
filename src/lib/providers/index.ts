/**
 * Shared provider instances.
 *
 * Instantiates authorization and billing providers from @omnidotdev/providers
 * with app-specific configuration from environment variables.
 */

import {
  createAuthzProvider,
  createBillingProvider,
} from "@omnidotdev/providers";

import { AUTHZ_API_URL, BILLING_BASE_URL } from "@/lib/config/env.config";

export const authz = createAuthzProvider({
  apiUrl: AUTHZ_API_URL,
});

export const billing = createBillingProvider({
  baseUrl: BILLING_BASE_URL,
  appId: "platform",
});
