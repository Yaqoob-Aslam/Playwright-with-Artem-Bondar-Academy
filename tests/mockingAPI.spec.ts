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