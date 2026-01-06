import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

// In CI, use built app with HTTP; locally use dev server with HTTPS
const baseURL = isCI
  ? "http://localhost:3000"
  : (process.env.PLAYWRIGHT_TEST_BASE_URL ?? "https://localhost:3000");

/**
 * Playwright configuration.
 * @see https://playwright.dev/docs/test-configuration
 */
const playwrightConfig = defineConfig({
  testDir: "e2e",
  // Maximum single-test timeout (3 minutes)
  timeout: 180_000,
  expect: {
    timeout: 5_000,
  },
  // Run tests within the same file in parallel
  fullyParallel: true,
  // Test output reporter
  reporter: isCI
    ? // blob is used in CI to merge sharded test results
      "blob"
    : [["html", { outputFolder: "src/generated/test-report" }]],
  // Fail build in CI if `test.only` is left in source code
  forbidOnly: isCI,
  // Number of retry attempts on test failure
  retries: isCI ? 2 : 0,
  // Use single worker to mitigate flakiness from parallel tests
  workers: 1,
  // Artifact output location (screenshots, videos, traces)
  outputDir: "src/generated/test-artifacts",
  // Run dev server before starting the tests
  webServer: {
    command: isCI ? "bun start" : "bun dev",
    url: baseURL,
    timeout: 120_000,
    // Do not use an existing server in CI
    reuseExistingServer: !isCI,
    // Ignore HTTPS errors for self-signed certificates
    ignoreHTTPSErrors: true,
  },
  use: {
    headless: true,
    baseURL,
    // Retry a test with tracing if it is failing
    trace: "retry-with-trace",
    // Ignore HTTPS errors for self-signed certificates
    ignoreHTTPSErrors: true,
  },
});

export default playwrightConfig;
