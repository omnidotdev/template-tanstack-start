/**
 * Application configuration.
 */
const app = {
  name: "Omni TanStack Start Template",
  // Product symbol, mirrors the omni-api catalog SSOT (`catalog/products.ts`
  // `icon`). Used in the "Made with <symbol> by Omni" footer credit
  // ! TODO: replace with this product's catalog symbol when the template is used
  icon: "🧩",
  description: "Tanstack Start template. Designed and maintained by Omni.",
  // ! TODO: replace with application url when this template is used.
  url: "https://template-start.omni.dev",
  docsUrl: "https://docs.omni.dev",
  socials: {
    discord: "https://discord.gg/omnidotdev",
    x: "https://x.com/omnidotdev",
    threads: "https://www.threads.com/@omnidotdev",
  },
  // Legal links mirror the omni-api catalog SSOT
  legal: {
    privacy: "https://omni.dev/legal/privacy",
    terms: "https://omni.dev/legal/terms",
    cookies: "https://omni.dev/legal/cookies",
  },
  organization: {
    name: "Omni",
    url: "https://omni.dev",
    supportEmailAddress: "support@omni.dev",
  },
  /** PWA configuration. Values should match public/manifest.json. */
  pwa: {
    themeColor: "#000000",
    backgroundColor: "#000000",
  },
};

export default app;
