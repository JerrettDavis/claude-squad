import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'on',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx vite --port 4173 --host',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_USE_MOCKS: 'false',
      VITE_API_BASE_URL: process.env.E2E_API_BASE_URL || 'http://localhost:8790',
    },
  },
})
