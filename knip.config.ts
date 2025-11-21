import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
  ],
  project: ["src/**/*.{ts,tsx}"],
  // NB: Modified from the default GraphQL Codegen configuration, see: https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // Used for proper management of thornberry components. See: https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: ["**/*.gen.*", "**/generated/**"],
  ignoreDependencies: [
    // used for globals.css
    "tailwindcss",
    // used for graphql codegen scripts
    "dotenv",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
