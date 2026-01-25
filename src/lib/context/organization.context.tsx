import { createContext, useCallback, useContext, useState } from "react";

import type { ReactNode } from "react";

/**
 * Organization from IDP JWT claims.
 */
export interface Organization {
  id: string;
  slug: string;
  /** Discriminator: 'personal' (auto-created, immutable) or 'team' (collaborative) */
  type: "personal" | "team";
  roles: string[];
  teams: { id: string; name: string }[];
}

interface OrganizationContextValue {
  /** All organizations the user is a member of */
  organizations: Organization[];
  /** Currently active organization */
  activeOrganization: Organization | null;
  /** Set the active organization by ID */
  setActiveOrganization: (orgId: string) => void;
  /** User's personal organization (always exists) */
  personalOrganization: Organization | null;
  /** Check if user has a specific role in the active org */
  hasRole: (role: string) => boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(
  null,
);

interface OrganizationProviderProps {
  children: ReactNode;
  organizations: Organization[];
  initialOrgId?: string;
}

/**
 * Provider for organization context.
 * Parses organization claims from IDP session.
 */
export function OrganizationProvider({
  children,
  organizations,
  initialOrgId,
}: OrganizationProviderProps) {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(
    initialOrgId ?? organizations[0]?.id ?? null,
  );

  const activeOrganization =
    organizations.find((o) => o.id === activeOrgId) ?? null;
  const personalOrganization =
    organizations.find((o) => o.type === "personal") ?? null;

  const setActiveOrganization = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
    // Optionally persist to localStorage/cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("activeOrgId", orgId);
    }
  }, []);

  const hasRole = useCallback(
    (role: string) => {
      return activeOrganization?.roles.includes(role) ?? false;
    },
    [activeOrganization],
  );

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        activeOrganization,
        setActiveOrganization,
        personalOrganization,
        hasRole,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

/**
 * Hook to access organization context.
 * Must be used within OrganizationProvider.
 */
export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return context;
}

/**
 * Parse organization claims from IDP ID token.
 * Claims are namespaced under https://manifold.omni.dev/@omni/claims/organizations
 */
export function parseOrganizationClaims(
  idToken: Record<string, unknown>,
): Organization[] {
  const claimsKey = "https://manifold.omni.dev/@omni/claims/organizations";
  const claims = idToken[claimsKey];

  if (!Array.isArray(claims)) {
    return [];
  }

  return claims.map((org) => ({
    id: org.id,
    slug: org.slug,
    type: org.type ?? "team",
    roles: org.roles ?? [],
    teams: org.teams ?? [],
  }));
}
