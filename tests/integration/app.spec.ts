import { test, expect } from '@playwright/test';

test.describe('Application Integration Tests', () => {
  test('homepage loads and displays the correct message', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Wait for the API response to be processed
    await page.waitForSelector('.title');
    
    // Check the title is displayed
    const title = await page.textContent('.title');
    expect(title).toContain('Hello World from Nuxt Backend');
    
    // Check the environment badge is displayed
    const badge = await page.textContent('.environment-badge');
    expect(badge?.trim()).toBeTruthy();
  });
  
  test('debug information can be toggled', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Initially, debug info should be hidden
    expect(await page.isVisible('.debug-info')).toBe(false);
    
    // Click the debug toggle button
    await page.click('.debug-toggle');
    
    // Now debug info should be visible
    expect(await page.isVisible('.debug-info')).toBe(true);
    
    // Check that the API URL is displayed
    const apiUrlText = await page.textContent('.debug-content');
    expect(apiUrlText).toContain('/api/hello');
    
    // Click the debug toggle button again
    await page.click('.debug-toggle');
    
    // Debug info should be hidden again
    expect(await page.isVisible('.debug-info')).toBe(false);
  });
}); 