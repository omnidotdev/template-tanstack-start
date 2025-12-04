import Stripe from "stripe";

/**
 * Payments client.
 */
const payments = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default payments;
