import { describe, expect, test } from "bun:test";

import cn from "@/lib/utils";

describe("cn utility", () => {
  test("merges class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  test("handles undefined and null values", () => {
    const result = cn("foo", undefined, null, "bar");
    expect(result).toBe("foo bar");
  });

  test("handles conditional classes with clsx syntax", () => {
    const result = cn("base", { active: true, disabled: false });
    expect(result).toBe("base active");
  });

  test("handles array of classes", () => {
    const result = cn(["foo", "bar"], "baz");
    expect(result).toBe("foo bar baz");
  });

  test("resolves Tailwind conflicts (tailwind-merge)", () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  test("resolves complex Tailwind conflicts", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  test("preserves non-conflicting Tailwind classes", () => {
    const result = cn("px-4", "py-2", "text-lg");
    expect(result).toBe("px-4 py-2 text-lg");
  });

  test("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  test("handles mixed conditional and string classes", () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      "base-class",
      isActive && "active-class",
      isDisabled && "disabled-class",
      "final-class",
    );
    expect(result).toBe("base-class active-class final-class");
  });
});
