import { defineConfig } from "@playwright/test";

/**
 * Playwright configuration.
 * @see https://playwright.dev/docs/test-configuration
 */
const playwrightConfig = defineConfig({
  testDir: "src/test/e2e",
  // Maximum single-test timeout (3 minutes)
  timeout: 180_000,
  expect: {
    timeout: 5_000,
  },
  // Run tests within the same file in parallel
  fullyParallel: true,
  // Test output reporter
  reporter: process.env.CI
    ? // blob is used in CI to merge sharded test results
      "blob"
    : [["html", { outputFolder: "src/generated/test-report" }]],
  // Fail build in CI if `test.only` is left in source code
  forbidOnly: !!process.env.CI,
  // Number of retry attempts on test failure
  retries: process.env.CI ? 2 : 0,
  // Use single worker to mitigate flakiness from parallel tests
  workers: 1,
  // Artifact output location (screenshots, videos, traces)
  outputDir: "src/generated/test-artifacts",
  // Run dev server before starting the tests
  webServer: {
    command: "bun dev",
    port: 3000,
    timeout: 120_000,
    // Do not use an existing server in CI
    reuseExistingServer: !process.env.CI,
  },
  use: {
    headless: true,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "https://localhost:3000",
    // Retry a test with tracing if it is failing
    trace: "retry-with-trace",
    // Ignore HTTPS errors for self-signed certificates
    ignoreHTTPSErrors: true,
  },
});

export default playwrightConfig;
