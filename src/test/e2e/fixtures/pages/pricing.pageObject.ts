import { createPageObject } from "@/test/e2e/util";

import type { PageObjectContext } from "@/test/e2e/util";

/**
 * Pricing page object.
 */
const createPricingPageObject = ({ page, context }: PageObjectContext) =>
  createPageObject({
    page,
    context,
    name: "Pricing",
    baseUrl: "/pricing",
    // Page-specific helpers
    getPriceCards: () => page.locator('[class*="CardRoot"]'),
    getMonthlyTab: () => page.getByRole("tab", { name: /monthly/i }),
    getYearlyTab: () => page.getByRole("tab", { name: /yearly/i }),
    getFAQSection: () => page.getByText("Frequently Asked Questions"),
    getGetStartedButtons: () =>
      page.getByRole("button", { name: "Get Started" }),
  });

export type PricingPageObject = ReturnType<typeof createPricingPageObject>;

export default createPricingPageObject;
