import { createContext, useCallback, useContext, useState } from "react";

import type { ReactNode } from "react";

/**
 * Resource within a workspace.
 * Resources are app-specific and fetched from the app's API.
 */
export interface Resource {
  id: string;
  slug: string;
  name: string;
  organizationId: string;
}

interface ResourceContextValue {
  /** All resources in the current workspace */
  resources: Resource[];
  /** Currently active resource */
  activeResource: Resource | null;
  /** Set the active resource by ID */
  setActiveResource: (resourceId: string) => void;
  /** Loading state for resource list */
  isLoading: boolean;
  /** Refresh resource list */
  refreshResources: () => Promise<void>;
}

const ResourceContext = createContext<ResourceContextValue | null>(null);

interface ResourceProviderProps {
  children: ReactNode;
  resources: Resource[];
  initialResourceId?: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

/**
 * Provider for resource context.
 * Resources are fetched from the app's API, filtered by workspace.
 */
export function ResourceProvider({
  children,
  resources,
  initialResourceId,
  isLoading = false,
  onRefresh,
}: ResourceProviderProps) {
  const [activeResourceId, setActiveResourceId] = useState<string | null>(
    initialResourceId ?? resources[0]?.id ?? null,
  );

  const activeResource =
    resources.find((r) => r.id === activeResourceId) ?? null;

  const setActiveResource = useCallback((resourceId: string) => {
    setActiveResourceId(resourceId);
    // Optionally persist to localStorage/cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("activeResourceId", resourceId);
    }
  }, []);

  const refreshResources = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    }
  }, [onRefresh]);

  return (
    <ResourceContext.Provider
      value={{
        resources,
        activeResource,
        setActiveResource,
        isLoading,
        refreshResources,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}

/**
 * Hook to access resource context.
 * Must be used within ResourceProvider.
 */
export function useResource() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
}
