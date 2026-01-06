import { afterEach } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";

import { mswServer } from "./setup/mswServer";

/**
 * Global test preload - runs once before all test files.
 * Sets up happy-dom for DOM testing and starts MSW server for API mocking.
 */

// Register happy-dom globals for React Testing Library
GlobalRegistrator.register();

// Start MSW server for API mocking
mswServer.listen({ onUnhandledRequest: "warn" });

// Clean up DOM between tests
afterEach(() => {
  document.body.innerHTML = "";
  mswServer.resetHandlers();
});

/**
 * Cleanup handler for test environment teardown.
 */
const cleanup = () => {
  mswServer.close();
  GlobalRegistrator.unregister();
};

// Register cleanup handlers for various exit scenarios
process.on("beforeExit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});
