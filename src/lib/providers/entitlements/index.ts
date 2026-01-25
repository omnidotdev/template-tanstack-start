import { entitlementProvider } from "@/lib/config/env.config";
import AetherEntitlementProvider from "./aether.provider";
import LocalEntitlementProvider from "./local.provider";

import type { EntitlementProvider } from "./interface";

export type {
  Entitlement,
  EntitlementProvider,
  EntitlementsResponse,
  Subscription,
} from "./interface";

/**
 * Create the entitlement provider based on environment configuration.
 */
const createEntitlementProvider = (): EntitlementProvider => {
  switch (entitlementProvider) {
    case "local":
      return new LocalEntitlementProvider();
    case "aether":
      return new AetherEntitlementProvider();
    default:
      console.warn(
        `[entitlements] Unknown provider "${entitlementProvider}", using local`,
      );
      return new LocalEntitlementProvider();
  }
};

/**
 * Singleton entitlement provider instance.
 */
const entitlements = createEntitlementProvider();

export default entitlements;
