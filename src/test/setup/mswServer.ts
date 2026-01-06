import { setupServer } from "msw/node";

import { authHandlers, graphqlHandlers } from "../mocks";

/**
 * MSW server instance with all mock handlers.
 */
export const mswServer = setupServer(...authHandlers, ...graphqlHandlers);
