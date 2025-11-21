import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: ["src/routes/**/*.{ts,tsx}", "src/router.tsx"],
  project: ["src/**/*.{ts,tsx}"],
  ignore: ["**/*.gen.*"],
  ignoreDependencies: [
    // used for globals.css
    "tailwindcss",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
