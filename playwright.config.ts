import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
/**
 * CI already restores the production `dist` artifact from the build job, so the
 * E2E job only needs to *serve* it. Rebuilding there wasted the whole
 * `webServer` budget (a cold `npm run build` can exceed the old 120s timeout,
 * which aborted the run before a single test executed).
 */
const skipBuild = process.env.PLAYWRIGHT_SKIP_BUILD === '1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: isCI ? 2 : 0,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reasonable timeouts for CI and local development
    actionTimeout: 12000,
    navigationTimeout: 25000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Increase timeouts for mobile emulation overhead
        actionTimeout: 20000,
        navigationTimeout: 40000,
      },
      // Reduce workers to avoid resource contention on mobile emulator
      workers: 1,
      // Increase per-test timeout for mobile
      timeout: 90000,
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        // Increase timeouts for mobile emulation overhead
        actionTimeout: 20000,
        navigationTimeout: 40000,
      },
      // Reduce workers to avoid resource contention on mobile emulator
      workers: 1,
      // Increase per-test timeout for mobile
      timeout: 90000,
    },
  ],
  webServer: {
    command: skipBuild ? 'npm run preview' : 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    // Reusing a local server speeds up iteration; CI must always start a clean
    // one so results are not influenced by a stale process.
    reuseExistingServer: !isCI,
    timeout: skipBuild ? 60000 : 240000,
  },
  expect: {
    timeout: 8000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  // Reasonable per-test timeout for local CI
  timeout: 45000,
  // NOTE: deliberately no `globalTimeout`. With 5 browser projects and retries,
  // the previous 10-minute cap aborted runs mid-suite on the CI runner; the
  // per-test timeout plus the job-level `timeout-minutes` bound the run instead.
});
