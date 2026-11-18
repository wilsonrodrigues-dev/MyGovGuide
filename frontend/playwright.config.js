import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const frontend = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, retries: 0, timeout: 30000,
  expect: { timeout: 10000 }, outputDir: './test-results',
  reporter: [['list'], ['json', { outputFile: 'reports/e2e-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, channel: process.platform === 'win32' ? 'msedge' : undefined,
    trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } }, { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }],
  webServer: process.env.MYGOVGUIDE_E2E_SERVERS === 'external' ? undefined : [
    { command: 'npm start', cwd: path.join(frontend, '../backend'), url: 'http://127.0.0.1:3011/api/health', reuseExistingServer: false,
      env: { PORT: '3011', HOST: '127.0.0.1', NODE_ENV: 'test' }, timeout: 30000 },
    { command: 'npm run preview', cwd: frontend, url: 'http://127.0.0.1:4173', reuseExistingServer: false,
      env: { API_PROXY_TARGET: 'http://127.0.0.1:3011' }, timeout: 30000 }
  ]
});
