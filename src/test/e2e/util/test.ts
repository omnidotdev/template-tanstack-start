import { test as testBase } from "@playwright/test";

import {
  createHomePageObject,
  createPricingPageObject,
} from "@/test/e2e/fixtures/pages";

import type {
  HomePageObject,
  PricingPageObject,
} from "@/test/e2e/fixtures/pages";

interface PageObjects {
  homePage: HomePageObject;
  pricingPage: PricingPageObject;
}

/**
 * Augmented version of Playwright's `test` function that provides
 * [page objects](https://martinfowler.com/bliki/PageObject.html) as fixtures.
 *
 * @see https://playwright.dev/docs/test-fixtures
 */
const test = testBase.extend<PageObjects>({
  homePage: async ({ page, context }, use) =>
    use(createHomePageObject({ page, context })),
  pricingPage: async ({ page, context }, use) =>
    use(createPricingPageObject({ page, context })),
});

export { expect } from "@playwright/test";
export default test;
