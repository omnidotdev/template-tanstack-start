import { createServerFn } from "@tanstack/react-start";

/**
 * Public runtime configuration delivered to the browser.
 *
 * The client bundle does not inline `VITE_` values at build time (the deploy
 * supplies them at runtime, so the same image is promotable across
 * environments). To make public config available in the browser, the server
 * reads the live `VITE_`-prefixed env and the root route injects it as
 * `window.__ENV__`, which `lib/config/env.config` merges on the client.
 *
 * Only `VITE_`-prefixed keys are public, and any key that looks like a secret
 * (key/secret/token/password) is dropped as a defensive measure so a
 * mis-prefixed credential can never leak to the client. Keys that are public
 * by design (e.g. Prism's collector key, which ships in client JS) are
 * whitelisted explicitly so the filter does not drop them.
 */
const SECRET_LIKE = /secret|token|password|\bkey\b|_key/i;

/** Public-by-design keys exempt from the secret-like filter */
const PUBLIC_KEY_WHITELIST = new Set(["VITE_PRISM_PRODUCT_KEY"]);

const collectPublicEnv = (): Record<string, string> => {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("VITE_")) continue;
    if (SECRET_LIKE.test(key) && !PUBLIC_KEY_WHITELIST.has(key)) continue;
    if (typeof value === "string" && value.length) out[key] = value;
  }

  return out;
};

export const getPublicEnvServerFn = createServerFn().handler(async () =>
  collectPublicEnv(),
);
