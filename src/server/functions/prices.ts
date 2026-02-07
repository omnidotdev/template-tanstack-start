import { createServerFn } from "@tanstack/react-start";

import app from "@/lib/config/app.config";
import { billing } from "@/lib/providers";

import type { Price } from "@omnidotdev/providers";

/**
 * Fetch all prices for this app.
 * Prices are filtered by app name metadata and sorted by unit amount (ascending).
 */
export const getPrices = createServerFn().handler(
  async (): Promise<Price[]> => {
    return billing.getPrices(app.name);
  },
);
