import { test, expect } from '@playwright/test';
import tags from '../mock/tags.json';

test('Mocking APIs - Popular Tags', async ({ page }) => {
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
    await route.fulfill({ json: tags });
  });

  await page.goto('https://conduit.bondaracademy.com/');

  // Target ONLY the Popular Tags sidebar
  const popularTagsList = page.locator("div[class='tag-list']").locator('a');

  // Wait for at least one tag to appear
  await expect(popularTagsList.first()).toBeVisible({ timeout: 10000 });

  // Assert that the sidebar contains EXACTLY your mocked tags (in any order)
  await expect(popularTagsList).toHaveText([
    'API',
    'Mocking',
    'Playwright',
    'Automation',
    'Testing'
  ]);

  // Optional: Also verify count is exactly 5 (your mocked ones only)
  await expect(popularTagsList).toHaveCount(5);
});


test('Mocking APIs - Popular Tags from JSON file', async ({ page }) => {
  await page.route('**/api/tags', async route => {
    // Only intercept GET requests
    if (route.request().method() === 'GET') {
      await route.fulfill({
        json: tags,  // Better than manual stringify – sets correct Content-Type
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://conduit.bondaracademy.com/');

  // Target only the Popular Tags sidebar to avoid article tag interference
  const popularTagsList = page.locator('.tag-list a');

  // Wait for tags to load
  await expect(popularTagsList.first()).toBeVisible({ timeout: 10000 });

  // Verify all tags match exactly what's in the JSON
  await expect(popularTagsList).toHaveText([
    'API',
    'Mocking',
    'Playwright',
    'Automation',
    'Testing'
  ]);
});