import test, { expect } from "../src/test/e2e/util/test";

test.describe("Pricing Page", () => {
  // Note: Pricing page tests are skipped because they require valid Stripe API keys.
  // The page loader fetches prices from Stripe, which fails without valid credentials.
  // To run these tests, configure valid Stripe keys in .env.test or mock the API.

  test.skip("loads successfully", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.page).toHaveURL(/\/pricing/);
    await expect(pricingPage.getHeading()).toBeVisible();
  });

  test.skip("displays monthly/yearly tabs", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getMonthlyTab()).toBeVisible();
    await expect(pricingPage.getYearlyTab()).toBeVisible();
  });

  test.skip("displays FAQ section", async ({ pricingPage }) => {
    await pricingPage.goto();
    await expect(pricingPage.getFAQSection()).toBeVisible();
  });
});
