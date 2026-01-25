import { createContext, useCallback, useContext, useState } from "react";

import type { ReactNode } from "react";

/**
 * Workspace within an organization.
 * Workspaces are app-specific and fetched from the app's API.
 */
export interface Workspace {
  id: string;
  slug: string;
  name: string;
  organizationId: string;
}

interface WorkspaceContextValue {
  /** All workspaces in the current organization */
  workspaces: Workspace[];
  /** Currently active workspace */
  activeWorkspace: Workspace | null;
  /** Set the active workspace by ID */
  setActiveWorkspace: (workspaceId: string) => void;
  /** Loading state for workspace list */
  isLoading: boolean;
  /** Refresh workspace list */
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
  workspaces: Workspace[];
  initialWorkspaceId?: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

/**
 * Provider for workspace context.
 * Workspaces are fetched from the app's API, filtered by organization.
 */
export function WorkspaceProvider({
  children,
  workspaces,
  initialWorkspaceId,
  isLoading = false,
  onRefresh,
}: WorkspaceProviderProps) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    initialWorkspaceId ?? workspaces[0]?.id ?? null,
  );

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? null;

  const setActiveWorkspace = useCallback((workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    // Optionally persist to localStorage/cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("activeWorkspaceId", workspaceId);
    }
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    }
  }, [onRefresh]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        isLoading,
        refreshWorkspaces,
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
