import Stripe from "stripe";

import { isSelfHosted } from "@/lib/config/env.config";

let _payments: Stripe | null = null;

/**
 * Get payments client.
 *
 * Lazily initialized to avoid errors in self-hosted mode where Stripe is not configured.
 */
const getPayments = (): Stripe => {
  if (_payments) return _payments;

  const apiKey = process.env.STRIPE_API_KEY;

  if (!apiKey) {
    if (isSelfHosted) {
      throw new Error("Stripe is not available in self-hosted mode");
    }

    throw new Error("STRIPE_API_KEY environment variable is required");
  }

  _payments = new Stripe(apiKey);

  return _payments;
};

/**
 * Payments client proxy.
 *
 * Proxies access to the lazily-initialized Stripe client.
 */
const payments = new Proxy({} as Stripe, {
  get(_, prop) {
    return getPayments()[prop as keyof Stripe];
  },
});

export default payments;
