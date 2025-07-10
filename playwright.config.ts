import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

export const ADMIN_STATE = path.join(__dirname, 'tests/auth/adminState.json');

export default defineConfig({
  //testDir: './tests',
  timeout: process.env.CI ? 4 * 60 * 1000 : 0, // 4 minutes for CI
  maxFailures: process.env.CI ? 0 : 0,
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  grep: [new RegExp('@smoke') ],
  expect: {
    timeout: process.env.CI ? 30 * 1000 : 0, // 30 seconds for CI
  },
  reporter: [
    ['html', { open: 'always' }],
    //['./customreporter.ts'],
    ['junit', { outputFile: 'results.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: process.env.CI ? 18 * 1000 : 0, // 18 seconds for CI, 60 seconds for local development
    headless: process.env.CI ? true : false,
    launchOptions: {
      slowMo: 350,
    },
    acceptDownloads: true,
    // devtools: true,
    trace: process.env.CI ? 'on-first-retry' : 'on',
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'smoke',
      testMatch: ['**/tests/e2e/*.spec.ts','**/tests/api/*.spec.ts'],
      use: {
        viewport: { width: 1300, height: 700 },
        //storageState: STAGE_STATE,
        baseURL: process.env.URL,
      },
    },
    {
      name: 'admin',
      testMatch: ['**/tests/e2e/*.spec.ts'],
      use: {
        viewport: { width: 1300, height: 700 },
        storageState: ADMIN_STATE,
        baseURL: 'https://unas.hu/belepes',
      },
    },
    {
      name: 'savestate',
      testMatch: 'tests/auth/login.page.ts',
    },

    {
      name: 'api',
      testMatch: ['**/tests/api/*.spec.ts'],
      use: {
        viewport: { width: 1300, height: 700 },
        baseURL: 'https://api.escuelajs.co',
      },
    },
  ],
});
