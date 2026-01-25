import type { AuthzProvider } from "./interface";

/**
 * Local authorization provider.
 * Always returns true (permissive) for self-hosted mode.
 */
class LocalAuthzProvider implements AuthzProvider {
  async checkPermission(
    _userId: string,
    _resourceType: string,
    _resourceId: string,
    _permission: string,
  ): Promise<boolean> {
    return true;
  }

  async batchCheckPermissions(
    checks: Array<{
      userId: string;
      resourceType: string;
      resourceId: string;
      permission: string;
    }>,
  ): Promise<boolean[]> {
    return checks.map(() => true);
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    return { healthy: true, message: "Local provider always healthy" };
  }
}

export default LocalAuthzProvider;
