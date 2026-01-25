/**
 * Entitlement from billing service.
 */
export interface Entitlement {
  id: string;
  productId: string;
  featureKey: string;
  value: string | null;
  source: string;
  validFrom: string;
  validUntil: string | null;
}

/**
 * Entitlements response from billing service.
 */
export interface EntitlementsResponse {
  billingAccountId: string;
  entityType: string;
  entityId: string;
  entitlementVersion: number;
  entitlements: Entitlement[];
}

/**
 * Subscription details.
 */
export interface Subscription {
  id: string;
  status: string;
  cancelAt: number | null;
  currentPeriodEnd: number;
  priceId: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    marketing_features: Array<{ name: string }>;
  } | null;
}

/**
 * Entitlement provider interface.
 */
export interface EntitlementProvider {
  /**
   * Get all entitlements for an entity.
   */
  getEntitlements(
    entityType: string,
    entityId: string,
    productId?: string,
    accessToken?: string,
  ): Promise<EntitlementsResponse | null>;

  /**
   * Check if an entity has a specific entitlement.
   */
  checkEntitlement(
    entityType: string,
    entityId: string,
    productId: string,
    featureKey: string,
    accessToken?: string,
  ): Promise<string | null>;

  /**
   * Get subscription details for an entity.
   */
  getSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<Subscription | null>;

  /**
   * Get billing portal URL for an entity.
   */
  getBillingPortalUrl(
    entityType: string,
    entityId: string,
    productId: string,
    returnUrl: string,
    accessToken: string,
  ): Promise<string>;

  /**
   * Cancel a subscription.
   */
  cancelSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<string>;

  /**
   * Renew a subscription (remove scheduled cancellation).
   */
  renewSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<void>;

  /**
   * Health check for the provider.
   */
  healthCheck?(): Promise<{ healthy: boolean; message?: string }>;
}
