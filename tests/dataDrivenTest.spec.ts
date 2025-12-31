import { test, expect } from '@playwright/test';

test.describe('Sign up - Data Driven Test', () => {

  const testData = [
    { username: "12", errorMessage: "username is too short (minimum is 3 characters)", isErrorDisplayed: true },
    { username: "123", errorMessage: "username", isErrorDisplayed: false },
    { username: "12345678901234567890", errorMessage: "username", isErrorDisplayed: false },
    { username: "123456789012345678901", errorMessage: "username is too long (maximum is 20 characters)", isErrorDisplayed: true }
  ];

  testData.forEach(({ username, errorMessage, isErrorDisplayed }) => {
    test(`Username "${username}" → ${isErrorDisplayed ? 'shows error' : 'no error'}`, async ({ page }) => {
      await page.context().clearCookies();

      await page.goto('https://conduit.bondaracademy.com/', { waitUntil: 'networkidle' });
      const signupLink = page.getByRole('link', { name: 'Sign up', exact: true });
      await expect(signupLink).toBeVisible({ timeout: 50000 });

      await signupLink.click();

      await page.getByRole('textbox', { name: 'Username' }).fill(username);
      await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('HelloWorld');
      await page.getByRole('button', { name: 'Sign up' }).click();

      const errorLocator = page.locator('.error-messages');

      if (isErrorDisplayed) {
        await expect(errorLocator).toContainText(errorMessage);
      } else {
        await expect(errorLocator).not.toContainText(errorMessage);
      }
    });
  });
});