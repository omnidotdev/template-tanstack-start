import { authzProvider } from "@/lib/config/env.config";
import LocalAuthzProvider from "./local.provider";
import WardenAuthzProvider from "./warden.provider";

import type { AuthzProvider } from "./interface";

export type { AuthzProvider } from "./interface";

/**
 * Create the authorization provider based on environment configuration.
 */
const createAuthzProvider = (): AuthzProvider => {
  switch (authzProvider) {
    case "local":
      return new LocalAuthzProvider();
    case "warden":
      return new WardenAuthzProvider();
    default:
      console.warn(`[authz] Unknown provider "${authzProvider}", using local`);
      return new LocalAuthzProvider();
  }
};

/**
 * Singleton authz provider instance.
 */
const authz = createAuthzProvider();

export default authz;
