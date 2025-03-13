# Testing Guide

This project uses Vitest for unit testing and Playwright for integration testing.

## Directory Structure

```
tests/
├── unit/           # Unit tests
│   ├── api.test.ts # Tests for API endpoints
│   └── app.test.ts # Tests for Vue components
└── integration/    # Integration tests
    └── app.spec.ts # End-to-end tests for the application
```

## Running Tests

### Unit Tests

Unit tests verify that individual components and functions work correctly in isolation.

```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode (for development)
npm run test:unit:watch
```

### Integration Tests

Integration tests verify that the application works correctly as a whole, including API calls and UI interactions.

```bash
# Run all integration tests
npm run test:integration

# Run integration tests with UI mode
npm run test:integration:ui
```

### All Tests

```bash
# Run all tests (unit and integration)
npm run test
```

## Writing Tests

### Unit Tests

Unit tests are written using Vitest and should be placed in the `tests/unit` directory with a `.test.ts` extension.

Example:

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

### Integration Tests

Integration tests are written using Playwright and should be placed in the `tests/integration` directory with a `.spec.ts` extension.

Example:

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## CI/CD Integration

The test configuration is set up to work in both development and CI environments. In CI environments, additional retries and different worker configurations are used.

## Test Configuration

- Unit tests: See `vitest.config.ts`
- Integration tests: See `playwright.config.ts` 