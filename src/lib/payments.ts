import Stripe from "stripe";

export const payments = new Stripe(process.env.STRIPE_SECRET_KEY!);
