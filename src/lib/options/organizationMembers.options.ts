/**
 * Query options for organization members from IDP
 */

import { queryOptions } from "@tanstack/react-query";

import { listOrganizationMembers } from "@/server/functions/organizations";

export interface OrganizationMembersVariables {
  organizationId: string;
  accessToken: string;
}

/**
 * Query options for fetching organization members from IDP
 */
const organizationMembersOptions = ({
  organizationId,
  accessToken,
}: OrganizationMembersVariables) =>
  queryOptions({
    queryKey: ["organizationMembers", organizationId],
    queryFn: () =>
      listOrganizationMembers({ data: { organizationId, accessToken } }),
    enabled: !!organizationId && !!accessToken,
  });

export default organizationMembersOptions;
