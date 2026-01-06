import { afterEach, beforeEach } from "bun:test";

import { mswServer } from "./mswServer";

/**
 * Setup test context with MSW server lifecycle management.
 * Call this in test files that need API mocking.
 */
export const setupTestContext = () => {
  beforeEach(() => {
    // Reset any test state before each test
  });

  afterEach(() => {
    // Reset MSW handlers after each test to ensure test isolation
    mswServer.resetHandlers();
  });
};
