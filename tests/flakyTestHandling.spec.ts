import { test, expect } from '@playwright/test';

test('Playwright runs fast!', async ({ page }) => {
  test.slow(); // Mark this test as slow to give it more time reduce flakiness sometimes the app is slow to respond

  await page.goto('https://petclinic.bondaracademy.com');
  await page.getByTitle("pettypes").click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/33*');

  await expect(page.getByRole('textbox')).toHaveValue('cat');
  await page.getByRole('textbox').fill('rabbit');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.locator('[id="0"]')).toHaveValue('rabbit');
});