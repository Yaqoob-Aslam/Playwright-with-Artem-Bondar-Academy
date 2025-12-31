import { test as base } from '@playwright/test';

type MyFixtures = {
  myFixture: string;
};

export const test = base.extend<MyFixtures>({
  myFixture: async ({}, use) => {
    console.log('Setting up myFixture');
    await use('This is my fixture value');
    console.log('Tearing down myFixture');
  }
});