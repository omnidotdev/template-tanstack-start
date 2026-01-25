import { BILLING_BASE_URL } from "@/lib/config/env.config";

import type {
  EntitlementProvider,
  EntitlementsResponse,
  Subscription,
} from "./interface";

/**
 * Aether entitlement provider.
 * Fetches entitlements and manages subscriptions via Aether billing service.
 */
class AetherEntitlementProvider implements EntitlementProvider {
  async getEntitlements(
    entityType: string,
    entityId: string,
    productId?: string,
    accessToken?: string,
  ): Promise<EntitlementsResponse | null> {
    if (!BILLING_BASE_URL) {
      return null;
    }

    try {
      const url = new URL(
        `${BILLING_BASE_URL}/entitlements/${entityType}/${entityId}`,
      );
      if (productId) {
        url.searchParams.set("productId", productId);
      }

      const headers: HeadersInit = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, { headers });

      if (!res.ok) {
        return null;
      }

      return res.json();
    } catch {
      return null;
    }
  }

  async checkEntitlement(
    entityType: string,
    entityId: string,
    productId: string,
    featureKey: string,
    accessToken?: string,
  ): Promise<string | null> {
    const entitlements = await this.getEntitlements(
      entityType,
      entityId,
      productId,
      accessToken,
    );

    if (!entitlements) {
      return null;
    }

    const entitlement = entitlements.entitlements.find(
      (e) => e.featureKey === featureKey,
    );

    return entitlement?.value ?? null;
  }

  async getSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<Subscription | null> {
    if (!BILLING_BASE_URL) {
      return null;
    }

    try {
      const response = await fetch(
        `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch subscription:", await response.text());
        return null;
      }

      const { subscription } = await response.json();
      return subscription;
    } catch {
      return null;
    }
  }

  async getBillingPortalUrl(
    entityType: string,
    entityId: string,
    productId: string,
    returnUrl: string,
    accessToken: string,
  ): Promise<string> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/${entityType}/${entityId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId,
          returnUrl,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Failed to get billing portal URL");
    }

    const { url } = await response.json();
    return url;
  }

  async cancelSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<string> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Failed to cancel subscription");
    }

    const { id } = await response.json();
    return id;
  }

  async renewSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<void> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}/renew`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Failed to renew subscription");
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    if (!BILLING_BASE_URL) {
      return { healthy: false, message: "BILLING_BASE_URL not configured" };
    }

    try {
      const response = await fetch(`${BILLING_BASE_URL}/health`);
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

export default AetherEntitlementProvider;
