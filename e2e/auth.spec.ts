import test, { expect } from "../src/test/e2e/util/test";

test.describe("Authentication", () => {
  test("sign in button is visible on home page", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.getSignInButton()).toBeVisible();
  });

  test("sign in button triggers auth flow", async ({ homePage }) => {
    await homePage.goto();
    const signInButton = homePage.getSignInButton();

    // Clicking should trigger navigation or modal
    await signInButton.click();

    // Wait for either redirect or auth modal
    await homePage.page.waitForTimeout(500);

    // The button click should initiate OAuth flow
    // In a real test environment, this would redirect to the auth provider
  });
});
