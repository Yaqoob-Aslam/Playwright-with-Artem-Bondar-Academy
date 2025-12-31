import { test as base } from '@playwright/test';

type MyFixtures = {
  helloWorld: string;
  greatDay: string;
};

type WorkflowFixtures = {
  cupOfCoffee: string;
};

export const test = base.extend<MyFixtures, WorkflowFixtures>({

  helloWorld: async ({}, use) => {
    const myWorld = 'Hello, World!';
    await use(myWorld);
  },

  greatDay: async ({helloWorld, page}, use) => {
    // await page.goto('https://example.com');
    const myDay = helloWorld +  '. Today is a great day!';
    await use(myDay);
  },

  cupOfCoffee: [async ({}, use, workerInfo) => {
  const cup = 'The cup of coffee No.: ' + workerInfo.workerIndex;
  await use(cup);
}, { scope: 'worker' }]

});