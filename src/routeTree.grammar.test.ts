import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The generated route tree is the source of truth for this app's URL surface.
// These assertions guard the platform @handle URL grammar against regression:
// tenancy is the canonical @{$workspaceSlug} handle (never a legacy path-based
// or wrong-param form), and admin lives behind the ~ sentinel
const tree = readFileSync(
  fileURLToPath(new URL("./routeTree.gen.ts", import.meta.url)),
  "utf8",
);

describe("URL grammar", () => {
  test("no legacy tenancy routes remain", () => {
    for (const legacy of [
      "@{$orgSlug}",
      "@{$username}",
      "@{$handle}",
      "$organizationSlug",
      "workspaces/$workspaceSlug",
      "organizations/$orgSlug",
    ]) {
      expect(tree).not.toContain(legacy);
    }
  });

  test("the workspace handle uses the canonical workspaceSlug param", () => {
    expect(tree).toContain("workspaceSlug");
  });
});
