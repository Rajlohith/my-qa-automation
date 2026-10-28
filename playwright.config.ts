import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// to load ReqRes Api key using that .env file
dotenv.config({ quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // tests are independent
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
        testIdAttribute: 'data-test', // saucedemo with data-test, but Playwright default data-testid
        trace: 'on-first-retry',
      },
    },
    {
      // test for reqres.in with HTTP
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://reqres.in',
        extraHTTPHeaders: {
          'x-api-key': process.env.REQRES_API_KEY ?? '',  // sent every API request
        },
      },
    },
  ],
});