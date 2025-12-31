import { test, expect } from '@playwright/test';

test('Random pop up', async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/');
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Dialog').click();
  
  await page.addLocatorHandler(
    page.getByText('Friendly reminder'), 
    async () => {
      await page.getByRole('button', { name: 'OK' }).click();
    }
  );

  await page.getByRole('button', { name: 'Enter Name' }).click();
  await page.getByRole('textbox').fill('Artem');
  await page.getByRole('button', { name: 'Submit' }).click();
});