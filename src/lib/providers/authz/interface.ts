/**
 * Authorization provider interface.
 */
export interface AuthzProvider {
  /**
   * Check if a user has permission on a resource.
   */
  checkPermission(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: string,
  ): Promise<boolean>;

  /**
   * Batch check permissions for multiple resources.
   */
  batchCheckPermissions(
    checks: Array<{
      userId: string;
      resourceType: string;
      resourceId: string;
      permission: string;
    }>,
  ): Promise<boolean[]>;

  /**
   * Health check for the provider.
   */
  healthCheck?(): Promise<{ healthy: boolean; message?: string }>;
}
