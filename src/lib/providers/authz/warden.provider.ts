import { AUTHZ_API_URL, AUTHZ_ENABLED } from "@/lib/config/env.config";

import type { AuthzProvider } from "./interface";

/**
 * Warden authorization provider.
 * Uses OpenFGA-compatible API for permission checks.
 */
class WardenAuthzProvider implements AuthzProvider {
  async checkPermission(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: string,
  ): Promise<boolean> {
    // Permissive when disabled
    if (AUTHZ_ENABLED !== "true") return true;
    if (!AUTHZ_API_URL) return true;

    try {
      const response = await fetch(`${AUTHZ_API_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: `user:${userId}`,
          relation: permission,
          object: `${resourceType}:${resourceId}`,
        }),
      });

      if (!response.ok) {
        console.error(`AuthZ check failed: ${response.status}`);
        return false;
      }

      const result = (await response.json()) as { allowed: boolean };
      return result.allowed;
    } catch (error) {
      console.error("Authorization check failed:", error);
      // Fail-closed: deny access when PDP is unavailable
      return false;
    }
  }

  async batchCheckPermissions(
    checks: Array<{
      userId: string;
      resourceType: string;
      resourceId: string;
      permission: string;
    }>,
  ): Promise<boolean[]> {
    // Permissive when disabled
    if (AUTHZ_ENABLED !== "true") return checks.map(() => true);
    if (!AUTHZ_API_URL) return checks.map(() => true);

    try {
      const response = await fetch(`${AUTHZ_API_URL}/check/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checks: checks.map((c) => ({
            user: `user:${c.userId}`,
            relation: c.permission,
            object: `${c.resourceType}:${c.resourceId}`,
          })),
        }),
      });

      if (!response.ok) {
        console.error(`AuthZ batch check failed: ${response.status}`);
        return checks.map(() => false);
      }

      const result = (await response.json()) as {
        results: Array<{ allowed: boolean }>;
      };
      return result.results.map((r) => r.allowed);
    } catch (error) {
      console.error("Batch authorization check failed:", error);
      // Fail-closed: deny access when PDP is unavailable
      return checks.map(() => false);
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    if (!AUTHZ_API_URL) {
      return { healthy: false, message: "AUTHZ_API_URL not configured" };
    }

    try {
      const response = await fetch(`${AUTHZ_API_URL}/health`);
      return {
        healthy: response.ok,
        message: response.ok ? "OK" : `Status ${response.status}`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export default WardenAuthzProvider;
