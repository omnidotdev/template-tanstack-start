import { describe, expect, test } from "bun:test";

import prismClient from "./prism";

describe("prism analytics client", () => {
  test("exposes a track and flush API", () => {
    expect(typeof prismClient.track).toBe("function");
    expect(typeof prismClient.flush).toBe("function");
  });

  test("no-ops without a configured collector url", () => {
    // The Prism env vars are unset under test, so the client is a no-op
    // and neither tracking nor flushing should throw
    expect(() => prismClient.track("signup", { plan: "free" })).not.toThrow();
    expect(() => prismClient.flush()).not.toThrow();
  });
});
