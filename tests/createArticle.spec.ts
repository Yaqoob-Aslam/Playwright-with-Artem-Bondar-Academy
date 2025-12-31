import { test, expect } from '@playwright/test';

test('Create a new article', async ({ page }) => {

   test.slow(); // Marking the test as slow to accommodate potential delays
   
  // 1. Navigate to the application
  await page.goto('https://conduit.bondaracademy.com/');

  // 2. Click "Sign in" button in the top right corner
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();

  // Verify login page is opened
  await expect(page).toHaveURL(/.*login/);

  // 3. Enter email and password, click Sign in
  await page.getByRole('textbox', { name: 'Email' }).fill('pwtest@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome2');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verify redirected to home page and user is logged in
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  // Assuming username is displayed, check for a link or text with username
  await expect(page.getByRole('link', { name: 'pwtest' })).toBeVisible(); // Adjust if username is different

  // 4. Click "New Article" link
  await page.getByRole('link', { name: 'New Article' }).click();

  // Verify editor page is displayed
  await expect(page).toHaveURL(/.*editor/);

  // 5. Fill out the form with random data
  const articleTitle = 'Test Article ' + Math.random().toString(36).substring(7);
  const articleDescription = 'Test Description ' + Math.random().toString(36).substring(7);
  const articleBody = 'Test Body ' + Math.random().toString(36).substring(7);

  await page.getByRole('textbox', { name: 'Article Title' }).fill(articleTitle);
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill(articleDescription);
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill(articleBody);

  // Click Publish Article button
  await page.getByRole('button', { name: 'Publish Article' }).click();

  // Verify article details page is opened
  await expect(page.locator('h1')).toContainText(articleTitle);
  await expect(page.getByRole('link', { name: 'Edit Article' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete Article' }).first()).toBeVisible();
  // Comments block should be visible
  await expect(page.getByRole('textbox', { name: 'Write a comment...' })).toBeVisible();

  // 6. Click "Home" link
  await page.getByRole('link', { name: 'Home' }).click();

  // Verify redirected to home page, Global Feed active
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
  await expect(page.getByText('Global Feed')).toBeVisible();

  // Validate first article is the created one
  const firstArticle = page.locator('.article-preview').first();
  await expect(firstArticle).toContainText(articleTitle);

  // 7. Click on the newly created article
  await firstArticle.getByRole('link').click();

  // Verify article details page
  await expect(page.locator('h1')).toContainText(articleTitle);

  // 8. Delete the article
  await page.getByRole('button', { name: 'Delete Article' }).first().click();

  // Verify redirected or article deleted, perhaps back to home
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
});