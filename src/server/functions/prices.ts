import { createServerFn } from "@tanstack/react-start";

import app from "@/lib/config/app.config";
import payments from "@/lib/payments";

import type Stripe from "stripe";

/**
 * Expand a Stripe Price object with a Stripe Product object.
 * @see https://docs.stripe.com/api/prices/object
 * @see https://docs.stripe.com/api/products/object
 */
export interface ExpandedProductPrice extends Stripe.Price {
  product: Stripe.Product;
}

/**
 * Fetch all prices for this app from Stripe.
 * Prices are filtered by app name metadata and sorted by unit amount (ascending).
 */
export const getPrices = createServerFn().handler(async () => {
  const prices = await payments.prices.search({
    query: `metadata['app']:'${app.name}'`,
    expand: ["data.product"],
  });

  return prices.data.sort(
    (a, b) => (a.unit_amount ?? Infinity) - (b.unit_amount ?? Infinity),
  ) as ExpandedProductPrice[];
});
