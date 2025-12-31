import { test as base } from '@playwright/test';

type MyFixtures = {
  helloWorld: string;
  greatDay: string;
};

export const test = base.extend<MyFixtures>({

  helloWorld: async ({}, use) => {
    const myWorld = 'Hello, World!';
    await use(myWorld);
  },

  greatDay: async ({helloWorld, page}, use) => {
    await page.goto('https://example.com');
    const myDay = helloWorld +  '. Today is a great day!';
    await use(myDay);
  },
});