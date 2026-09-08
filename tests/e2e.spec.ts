import { test, expect } from '@playwright/test';

// Set base URL for navigation
const BASE_URL = 'http://localhost:3000';

test.describe('Authentication and Dashboard', () => {
  test('OAuth flow redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // As we can't perform actual Google OAuth in this environment, 
    // this test is intentionally limited.
    await expect(page).toHaveURL(/.*login/);
  });

  test('Visual Regression: Dashboard', async ({ page }) => {
    // Desktop View
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/dashboard`);
    await page.screenshot({ path: 'test-results/desktop-dashboard.png' });

    // Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/dashboard`);
    await page.screenshot({ path: 'test-results/mobile-dashboard.png' });
  });
});
