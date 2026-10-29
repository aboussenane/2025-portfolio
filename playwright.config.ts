import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }, baseURL: 'http://127.0.0.1:3146', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 3146', url: 'http://127.0.0.1:3146', reuseExistingServer: !process.env.CI },
});
