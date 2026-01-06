import { describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

// Mock the useTheme hook
const mockSetTheme = mock(() => {});
let mockTheme = "light";

mock.module("@/providers/ThemeProvider", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

// Import after mocking
const { default: ThemeToggle } = await import(
  "@/components/layout/ThemeToggle"
);

describe("ThemeToggle", () => {
  test("renders toggle button", () => {
    cleanup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  test("calls setTheme with 'dark' when current theme is 'light'", () => {
    cleanup();
    mockTheme = "light";
    mockSetTheme.mockClear();

    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  test("calls setTheme with 'light' when current theme is 'dark'", () => {
    cleanup();
    mockTheme = "dark";
    mockSetTheme.mockClear();

    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
