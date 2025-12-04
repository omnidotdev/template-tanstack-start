import Stripe from "stripe";

import { STRIPE_API_KEY } from "@/lib/config/env.config";

if (!STRIPE_API_KEY) throw new Error("`STRIPE_API_KEY` is missing");

/**
 * Payments client.
 */
const payments = new Stripe(STRIPE_API_KEY);

export default payments;
