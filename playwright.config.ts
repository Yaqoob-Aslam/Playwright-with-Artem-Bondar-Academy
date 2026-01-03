import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60_000,

  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixels: 250 },
  },
    
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 30_000,
    navigationTimeout: 30_000,
  },


  projects: [
    
    {
  name: 'chromium',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1920, height: 1080 },  // Fixed large size, null mat rakho
    deviceScaleFactor: undefined,
    isMobile: false,
    launchOptions: {
      headless: false,
      args: ['--start-maximized'], 
    },
  },
},
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1040 },  
        deviceScaleFactor: undefined,
        isMobile: false,
        launchOptions: {
          headless: false,
        },
      },
    },
  ],
});
