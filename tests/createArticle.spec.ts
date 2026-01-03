import { test, expect } from '@playwright/test';

test('Create a new article and record HAR', async ({ browser }) => {
  // HAR recording 
  const context = await browser.newContext({
    recordHar: { 
      path: 'output.har',     
      mode: 'minimal',       
      content: 'embed'        
    }
  });

  const page = await context.newPage();

  test.slow(); 

  // 1. Navigate to the app
  await page.goto('https://conduit.bondaracademy.com/');

  // 2. Click Sign in
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/.*login/);

  // 3. Login
  await page.getByRole('textbox', { name: 'Email' }).fill('pwtest@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome2');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  await expect(page.locator('nav').getByRole('link', { name: 'pwtest' })).toBeVisible();

  // 4. New Article
  await page.getByRole('link', { name: 'New Article' }).click();
  await expect(page).toHaveURL(/.*editor/);

  // 5. Fill and publish article
  const articleTitle = 'Test Article ' + Math.random().toString(36).substring(7);

  await page.getByRole('textbox', { name: 'Article Title' }).fill(articleTitle);
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('Test Description');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('Test Body');

  await page.getByRole('button', { name: 'Publish Article' }).click();

  await expect(page.locator('h1')).toContainText(articleTitle);

  // 6. Go Home and verify in feed
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');

  const firstArticle = page.locator('.article-preview').first();
  await expect(firstArticle).toContainText(articleTitle);

  // 7. Open article again
  await firstArticle.locator('.preview-link').click();
  await expect(page.locator('h1')).toContainText(articleTitle);

  // 8. Delete article
  await page.locator('.article-meta').first().getByRole('button', { name: 'Delete Article' }).click();
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');

  
  await context.close();
});