import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// to load ReqRes Api key using that .env file
dotenv.config({ quiet: true });

const apiKey = process.env.REQRES_API_KEY?.trim();

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
        // send the key on every API request, only when one is set
        extraHTTPHeaders: apiKey ? { 'x-api-key': apiKey } : {},
      },
    },
  ],
});