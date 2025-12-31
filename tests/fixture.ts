import { test as base } from '@playwright/test';

type MyFixtures = {
  helloWorld: string;
};

export const test = base.extend<MyFixtures>({

  helloWorld: async ({}, use) => {

    const myWorld = 'Hello, World!';
    await use(myWorld);
  }
});