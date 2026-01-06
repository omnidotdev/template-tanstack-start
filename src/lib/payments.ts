import Stripe from "stripe";

/**
 * Payments client.
 */
const payments = new Stripe(process.env.STRIPE_API_KEY!);

export default payments;
