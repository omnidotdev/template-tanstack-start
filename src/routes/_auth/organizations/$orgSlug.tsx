import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { useOrganization } from "@/lib/context";
import { getOrganizationBySlug } from "@/server/functions/organizations";

import type { Organization } from "@/lib/context";

export const Route = createFileRoute("/_auth/organizations/$orgSlug")({
  beforeLoad: async ({ params }) => {
    return { orgSlug: params.orgSlug };
  },
  component: OrgLayout,
});

/**
 * Organization layout.
 * Wraps all routes under /organizations/$orgSlug/
 */
function OrgLayout() {
  const { orgSlug } = Route.useParams();
  const { organizations, activeOrganization, setActiveOrganization } =
    useOrganization();

  const claimOrg = organizations.find((o) => o.slug === orgSlug);

  // A just-created organization is not yet in the JWT claims (the org list is
  // hydrated from a short-lived cache), so fall back to a live Gatekeeper lookup
  // until claims catch up. Skipped once the org is present in claims.
  const { data: fallbackOrg, isLoading: isResolvingFallback } = useQuery({
    queryKey: ["organization-fallback", orgSlug],
    queryFn: () => getOrganizationBySlug({ data: { slug: orgSlug } }),
    enabled: !claimOrg,
  });

  const org: Organization | undefined =
    claimOrg ??
    (fallbackOrg
      ? {
          id: fallbackOrg.id,
          slug: fallbackOrg.slug,
          type: fallbackOrg.type,
          roles: [],
          teams: [],
        }
      : undefined);

  useEffect(() => {
    if (claimOrg && activeOrganization?.id !== claimOrg.id) {
      setActiveOrganization(claimOrg.id);
    }
  }, [claimOrg, activeOrganization?.id, setActiveOrganization]);

  if (!org && isResolvingFallback) return null;

  if (!org) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="font-bold text-2xl text-destructive">
          Organization not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don't have access to organization "{orgSlug}"
        </p>
      </div>
    );
  }

  return <Outlet />;
}
