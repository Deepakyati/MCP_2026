import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './APITesting',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: 'playwright-report-api', open: 'never' }]],
  use: {
    baseURL: 'https://rahulshettyacademy.com',
    extraHTTPHeaders: {
      Accept: 'text/html',
    },
  },
});
