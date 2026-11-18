import { createPrismClient } from "@omnidotdev/providers/analytics";

import {
  PRISM_COLLECTOR_URL,
  PRISM_PRODUCT_KEY,
} from "@/lib/config/env.config";

/**
 * Shared Prism analytics client for the app.
 *
 * A single instance is created at module load and reused everywhere, which
 * gives `usePageview` a stable client identity across renders. The underlying
 * client is SSR-safe and no-ops when the collector URL is unset (dev/local), so
 * importing and calling `track` is always safe, on the server and the client.
 *
 * The collector only accepts a product's public collector key (`pk_...`), so
 * analytics is also disabled (empty collector URL) when the key is unset rather
 * than sending batches the collector would reject.
 */
const prismClient = createPrismClient({
  collectorUrl: PRISM_PRODUCT_KEY ? PRISM_COLLECTOR_URL : undefined,
  product: PRISM_PRODUCT_KEY ?? "",
});

export default prismClient;
