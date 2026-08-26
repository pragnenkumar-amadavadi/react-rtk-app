import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './visual-tests',
  fullyParallel: true,
  reporter: 'list',
  webServer: {
    command: 'npx vite preview --outDir storybook-static --port 6007 --strictPort',
    port: 6007,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:6007',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
