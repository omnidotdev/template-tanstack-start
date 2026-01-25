import { Outlet, createFileRoute } from "@tanstack/react-router";

import { useOrganization } from "@/lib/context";

export const Route = createFileRoute("/_auth/organizations/$orgSlug")({
  beforeLoad: async ({ params }) => {
    // Validate org slug exists in user's organizations
    // This will be populated from context in a real app
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
  const { organizations, setActiveOrganization } = useOrganization();

  const org = organizations.find((o) => o.slug === orgSlug);

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

  // Set as active organization when viewing
  // useEffect would be better here in a real app
  if (org.id !== organizations.find((o) => o.slug === orgSlug)?.id) {
    setActiveOrganization(org.id);
  }

  return <Outlet />;
}
