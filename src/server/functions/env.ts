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
 * mis-prefixed credential can never leak to the client.
 */
const SECRET_LIKE = /secret|token|password|\bkey\b|_key/i;

const collectPublicEnv = (): Record<string, string> => {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("VITE_")) continue;
    if (SECRET_LIKE.test(key)) continue;
    if (typeof value === "string" && value.length) out[key] = value;
  }

  return out;
};

export const getPublicEnvServerFn = createServerFn().handler(async () =>
  collectPublicEnv(),
);
