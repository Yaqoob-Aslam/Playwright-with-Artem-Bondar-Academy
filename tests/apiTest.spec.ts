import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Simple Get Request', async ({ request }) => {
 const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
 const responseBody = await response.json()
//  console.log(responseBody)
 expect(responseBody.tags[1]).toBe('Git');
 expect(responseBody.tags.length).toBe(10);
});

test('Simple POST Request', async ({ request }) => {
 const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers:{
      Authorization:'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozNTc0Nn0sImlhdCI6MTc2NzI1MTMyMSwiZXhwIjoxNzcyNDM1MzIxfQ.QNN3erXE0telGD50CifzMtHJcI3-4kfBk4-8M_G5taY',
    },
    data:{
      "article":{"title":"Test1122","description":"Article123","body":"Let me introduce myself first.","tagList":["Tag123"]}
    }
  });
  const responseBody = await response.json()
  console.log(responseBody)
});