import { test, expect } from '@playwright/test';

test.describe('Remix Go Video Editor Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to main app
    await page.goto('/');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete video creation and integration workflow', async ({ page }) => {
    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');
    await expect(page).toHaveURL('/apps/remix-go/');

    // Wait for Remix Go to load
    await page.waitForSelector('header.theme-header', { timeout: 10000 });

    // Create new video project
    await page.click('[data-testid="new-project-button"]');
    await page.fill('[data-testid="project-name"]', 'Test Marketing Video');
    await page.click('[data-testid="create-project-button"]');

    // Verify project creation
    await expect(page.locator('text=Test Marketing Video')).toBeVisible();

    // Add video elements
    await page.click('[data-testid="add-text-overlay"]');
    await page.fill('[data-testid="text-input"]', 'Welcome to our product!');
    await page.click('[data-testid="apply-text-button"]');

    // Save project
    await page.click('[data-testid="save-project-button"]');
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Navigate back to main app
    await page.click('[data-testid="back-to-higgsfield"]');
    await expect(page).toHaveURL('/dashboard');

    // Verify project appears in main app
    await page.click('[data-testid="projects-menu"]');
    await expect(page.locator('text=Test Marketing Video')).toBeVisible();
  });

  test('cross-app data synchronization', async ({ page }) => {
    // Create project in main app
    await page.click('[data-testid="new-project-button"]');
    await page.fill('[data-testid="project-name"]', 'Cross-App Test Project');
    await page.click('[data-testid="create-project-main"]');

    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');
    await expect(page).toHaveURL('/apps/remix-go/');

    // Verify project appears in Remix Go
    await expect(page.locator('text=Cross-App Test Project')).toBeVisible();

    // Make changes in Remix Go
    await page.click('[data-testid="edit-project-button"]');
    await page.fill('[data-testid="project-description"]', 'Updated description');
    await page.click('[data-testid="save-changes-button"]');

    // Navigate back and verify changes in main app
    await page.click('[data-testid="back-to-higgsfield"]');
    await expect(page.locator('text=Updated description')).toBeVisible();
  });

  test('theme consistency across apps', async ({ page }) => {
    // Check main app theme
    const mainAppHeader = page.locator('header').first();
    const mainAppPrimaryColor = await mainAppHeader.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');

    // Check Remix Go theme matches
    const remixGoHeader = page.locator('header.theme-header');
    await expect(remixGoHeader).toBeVisible();

    const remixGoPrimaryColor = await remixGoHeader.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Theme should be consistent (allowing for slight variations)
    expect(remixGoPrimaryColor).toBe(mainAppPrimaryColor);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');

    // Check mobile layout
    const sidebar = page.locator('.plugins-sidebar');
    await expect(sidebar).toBeVisible();

    // Sidebar should be full width on mobile
    const sidebarWidth = await sidebar.evaluate(el => el.offsetWidth);
    const viewportWidth = page.viewportSize().width;
    expect(sidebarWidth).toBeCloseTo(viewportWidth, -50); // Allow some margin
  });

  test('error handling and recovery', async ({ page }) => {
    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');

    // Simulate network error
    await page.route('**/api/**', route => route.abort());

    // Try to save project
    await page.click('[data-testid="save-project-button"]');

    // Should show error message
    await expect(page.locator('text=Failed to save')).toBeVisible();

    // Should allow retry
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('accessibility compliance', async ({ page }) => {
    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');

    // Check for ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const accessibleName = await button.textContent();

      // Each button should have either aria-label or accessible text
      expect(ariaLabel || accessibleName.trim()).toBeTruthy();
    }

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('performance benchmarks', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to Remix Go
    await page.click('[data-testid="video-editor-menu"]');

    // Wait for app to load
    await page.waitForSelector('header.theme-header', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check bundle size (if available)
    const resources = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.js'))
        .reduce((total, r) => total + r.transferSize, 0)
    );

    // Bundle should be under 2MB
    expect(resources).toBeLessThan(2 * 1024 * 1024);
  });
});