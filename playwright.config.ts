import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// to load ResReq Api using that .env file
dotenv.config({ quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  projects: [
    {
      // the saucedemo ui browser tests
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',
        trace: 'on-first-retry',
      },
    },
    {
      // api key test
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://reqres.in',
        extraHTTPHeaders: {
          'x-api-key': process.env.REQRES_API_KEY ?? '',
        },
      },
    },
  ],
});