import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 *
 * NOTE: Many lib files are intentionally unused in the template.
 * They serve as reference patterns for Omni products to adopt.
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
    "src/sw.ts",
  ],
  project: ["src/**/*.{ts,tsx,css}"],
  // based on https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // used for proper management of Thornberry components, see https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: [
    "**/*.gen.*",
    "**/generated/**",
    "src/test/**",
    "src/__tests__/**",
    "**/*.test.{ts,tsx}",
    // Reference patterns - unused in template but available for adoption
    "src/components/profile/ManageBilling.tsx",
    "src/lib/config/env.config.ts",
    "src/lib/context/organization.context.tsx",
    "src/lib/context/workspace.context.tsx",
    "src/lib/providers/**",
    "src/server/functions/authorization.ts",
    "src/server/functions/entitlements.ts",
  ],
  ignoreDependencies: [
    "@changesets/changelog-github",
    "@changesets/cli",
    "dotenv",
    "@faker-js/faker",
    "@happy-dom/global-registrator",
    "@testing-library/jest-dom",
    "@testing-library/dom",
    "@testing-library/react",
    "happy-dom",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
