import { describe, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildCommands } from "./CommandPalette";

import type { BuildCommandsParams } from "./CommandPalette";

/**
 * Conformance test for the shared command palette. Copied into every product so
 * each adapter stays aligned with the fleet standard
 * (`@omnidotdev/thornberry/command-palette`): a `buildCommands` factory that
 * yields grouped actions, and an adapter that defers to the shared shell and
 * hotkeys rather than re-implementing them locally.
 */

const here = dirname(fileURLToPath(import.meta.url));
const adapterSource = readFileSync(join(here, "CommandPalette.tsx"), "utf8");
const rootSource = readFileSync(
  join(here, "..", "routes", "__root.tsx"),
  "utf8",
);

/** Navigate is never invoked in these unit tests, so a no-op stub is enough. */
const params = (
  overrides: Partial<BuildCommandsParams> = {},
): BuildCommandsParams => ({
  navigate: mock() as unknown as BuildCommandsParams["navigate"],
  isAuthenticated: false,
  theme: "light",
  toggleTheme: mock(),
  ...overrides,
});

describe("buildCommands", () => {
  test("returns a non-empty list of actions", () => {
    expect(buildCommands(params()).length).toBeGreaterThan(0);
  });

  test("groups actions only under 'Navigation' and 'Preferences'", () => {
    const groups = new Set(
      buildCommands(params({ isAuthenticated: true })).map(
        (command) => command.group,
      ),
    );

    expect(groups).toContain("Navigation");
    expect(groups).toContain("Preferences");
    expect([...groups].sort()).toEqual(["Navigation", "Preferences"]);
  });

  test("includes a Preferences theme toggle wired to the shared hotkey", () => {
    const toggleTheme = mock();

    const toggle = buildCommands(params({ toggleTheme })).find(
      (command) => command.group === "Preferences",
    );

    expect(toggle).toBeDefined();
    expect(toggle?.shortcut).toBeTruthy();

    toggle?.onSelect();
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  test("gates authenticated navigation behind a session", () => {
    const signedOut = buildCommands(params({ isAuthenticated: false }));
    const signedIn = buildCommands(params({ isAuthenticated: true }));

    expect(signedIn.length).toBeGreaterThan(signedOut.length);
  });
});

describe("command palette conformance", () => {
  test("adapter builds on the shared Thornberry shell", () => {
    expect(adapterSource).toContain('@omnidotdev/thornberry/command-palette"');
  });

  test("adapter binds the shared hotkey surface", () => {
    expect(adapterSource).toContain('@omnidotdev/thornberry/use-hotkeys"');
  });

  test("adapter does not import a local command primitive as the palette", () => {
    expect(adapterSource).not.toMatch(
      /from\s+["'](?:\.\/ui\/command|@\/components\/ui\/command)["']/,
    );
  });

  test("adapter does not re-declare the shared hotkeys", () => {
    // GLOBAL_HOTKEYS must be imported, never redefined locally
    expect(adapterSource).not.toMatch(
      /(?:const|let|var|enum)\s+GLOBAL_HOTKEYS\b/,
    );
    // and it must not reach past the shared surface into the raw hook library
    expect(adapterSource).not.toMatch(/from\s+["']react-hotkeys-hook["']/);
  });

  test("root layout mounts the palette once", () => {
    expect(rootSource).toContain("<CommandPalette");
  });
});
