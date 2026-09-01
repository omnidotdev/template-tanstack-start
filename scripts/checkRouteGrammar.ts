/**
 * URL-grammar guardrail (see golden/URL-GRAMMAR.md).
 *
 * Fails the build if a workspace handle route segment is spelled anything other
 * than the canonical `@{$workspaceSlug}`. The handle is the workspace and its
 * route param is `workspaceSlug`, fleet-wide; `@$orgSlug`, `@{$orgSlug}`, and
 * `@{$username}` are the historical spellings this check exists to prevent
 * drifting back to. Nested resources carry their own descriptive params
 * (`$storeSlug`, `$boardSlug`, ...) and are not handles, so they are ignored.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = join(import.meta.dir, "..", "src", "routes");
const CANONICAL = "@{$workspaceSlug}";

/** Every path segment that starts with `@` is a workspace handle segment. */
const collectHandleSegments = (dir: string): string[] => {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const segment = entry.name.replace(/\.tsx?$/, "");
    if (segment.startsWith("@")) found.push(segment);
    if (entry.isDirectory())
      found.push(...collectHandleSegments(join(dir, entry.name)));
  }
  return found;
};

const offenders = [...new Set(collectHandleSegments(ROUTES_DIR))].filter(
  (segment) => segment !== CANONICAL,
);

if (offenders.length > 0) {
  console.error(
    `\nURL-grammar check failed. Workspace handle segments must be \`${CANONICAL}\`:\n` +
      offenders.map((o) => `  - ${o}`).join("\n") +
      "\n\nRename the handle route param to `workspaceSlug` (see golden/URL-GRAMMAR.md, Rule 9).\n",
  );
  process.exit(1);
}

// Silent on success; the check is a pre-commit gate, not a reporter
