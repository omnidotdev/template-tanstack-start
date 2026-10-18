import { createContext, useCallback, useContext, useState } from "react";

import type { ReactNode } from "react";

/**
 * Workspace from IDP JWT claims.
 */
export interface Workspace {
  id: string;
  slug: string;
  /** Discriminator: 'personal' (auto-created, immutable) or 'team' (collaborative) */
  type: "personal" | "team";
  roles: string[];
  teams: { id: string; name: string }[];
}

interface WorkspaceContextValue {
  /** All workspaces the user is a member of */
  workspaces: Workspace[];
  /** Currently active workspace */
  activeWorkspace: Workspace | null;
  /** Set the active workspace by ID */
  setActiveWorkspace: (workspaceId: string) => void;
  /** User's personal workspace (always exists) */
  personalWorkspace: Workspace | null;
  /** Check if user has a specific role in the active workspace */
  hasRole: (role: string) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
  workspaces: Workspace[];
  initialWorkspaceId?: string;
}

/**
 * Provider for workspace context.
 * Parses workspace claims from IDP session.
 */
export function WorkspaceProvider({
  children,
  workspaces,
  initialWorkspaceId,
}: WorkspaceProviderProps) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    initialWorkspaceId ?? workspaces[0]?.id ?? null,
  );

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? null;
  const personalWorkspace =
    workspaces.find((w) => w.type === "personal") ?? null;

  const setActiveWorkspace = useCallback((workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    // Optionally persist to localStorage/cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("activeOrgId", workspaceId);
    }
  }, []);

  const hasRole = useCallback(
    (role: string) => {
      return activeWorkspace?.roles.includes(role) ?? false;
    },
    [activeWorkspace],
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        personalWorkspace,
        hasRole,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * Hook to access workspace context.
 * Must be used within WorkspaceProvider.
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

/**
 * Parse workspace claims from IDP ID token.
 * Claims are namespaced under https://manifold.omni.dev/@omni/claims/organizations
 */
export function parseWorkspaceClaims(
  idToken: Record<string, unknown>,
): Workspace[] {
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
