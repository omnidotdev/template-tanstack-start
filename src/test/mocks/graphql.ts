import { HttpResponse } from "msw";

import { mockUsersQuery } from "@/generated/graphql.mock";
import { TEST_USER } from "./auth";

/**
 * GraphQL MSW handlers using generated mocks from GraphQL CodeGen.
 */
export const graphqlHandlers = [
  mockUsersQuery(() => {
    return HttpResponse.json({
      data: {
        users: {
          nodes: [
            {
              id: TEST_USER.id,
              identityProviderId: TEST_USER.id,
            },
          ],
        },
      },
    });
  }),
];
