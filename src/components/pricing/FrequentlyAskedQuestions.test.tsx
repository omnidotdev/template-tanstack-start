import { describe, expect, test } from "bun:test";

import { render, screen } from "@testing-library/react";

import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions";

describe("FrequentlyAskedQuestions", () => {
  test("renders the FAQ heading", () => {
    render(<FrequentlyAskedQuestions />);

    const heading = screen.getByText("Frequently Asked Questions");
    expect(heading).toBeDefined();
  });

  test("renders all FAQ items", () => {
    render(<FrequentlyAskedQuestions />);

    // Check that the questions are rendered
    expect(screen.getByText("Can I switch plans later?")).toBeDefined();
    expect(
      screen.getByText("What payment methods do you accept?"),
    ).toBeDefined();
    expect(
      screen.getByText("What happens to my data if I cancel?"),
    ).toBeDefined();
    expect(screen.getByText("Can I self-host this software?")).toBeDefined();
  });

  test("applies custom className", () => {
    const { container } = render(
      <FrequentlyAskedQuestions className="custom-class" />,
    );

    const wrapper = container.firstChild;
    expect((wrapper as HTMLElement).className).toContain("custom-class");
  });
});
