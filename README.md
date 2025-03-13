# Nuxt with Integrated Backend

This project demonstrates a modern Nuxt.js application with integrated backend API capabilities, containerized with Docker for both development and production environments.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Request Flow](#request-flow)
- [Environment Modes](#environment-modes)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Benefits of Integrated Architecture](#benefits-of-integrated-architecture)
- [Development Guide](#development-guide)
- [License](#license)

## Architecture Overview

This application uses a unified architecture where both frontend and backend are integrated within a single Nuxt.js application:

- **Frontend**: Nuxt.js pages and components for the user interface
- **Backend**: API endpoints defined directly in the Nuxt server directory using Nitro
- **Single Service**: Everything runs as one service on a single port
- **Environment Awareness**: The application displays whether it's running in development or production mode

## Features

- Nuxt.js frontend with server-side rendering
- Integrated Nuxt API endpoints using the built-in Nitro server
- Docker containerization for consistent development and deployment
- Hot reloading for development
- Single service architecture for simplified deployment
- Comprehensive test suite with unit and integration tests
- Environment indicator (development/production)
- Debug information panel

## Prerequisites

- Docker and Docker Compose

## Project Structure

```
project/
├── app.vue                  # Main application component
├── pages/                   # Nuxt.js pages
│   └── index.vue            # Homepage
├── server/                  # Server-side code
│   └── api/                 # API endpoints
│       ├── hello.ts         # Hello world endpoint
│       └── health.ts        # Health check endpoint
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   │   ├── api.test.ts      # API endpoint tests
│   │   └── app.test.ts      # Component tests
│   └── integration/         # Integration tests
│       └── app.spec.ts      # End-to-end tests
├── docker-compose.yml       # Development Docker configuration
├── docker-compose.prod.yml  # Production Docker configuration
├── Dockerfile.nuxt.dev      # Development Dockerfile
├── Dockerfile.nuxt.prod     # Production Dockerfile
├── nuxt.config.ts           # Nuxt configuration
├── vitest.config.ts         # Unit test configuration
├── playwright.config.ts     # Integration test configuration
└── package.json             # Project dependencies and scripts
```

## Request Flow

1. A request comes to port 3000
2. Nuxt's server handles the request:
   - If it's a page request (e.g., `/`), Nuxt renders the appropriate page
   - If it's an API request (e.g., `/api/hello`), Nuxt routes it to the corresponding API handler in the `server/api/` directory

## Environment Modes

The application is designed to run in two environments:

### Development Mode
- Hot reloading enabled
- Detailed error messages
- Environment badge shows "DEVELOPMENT" in green

### Production Mode
- Optimized build
- Minimized assets
- Environment badge shows "PRODUCTION" in red

## Running the Application

### Development Mode

1. Start the development environment:

```bash
docker-compose up --build
```

2. Access the application at http://localhost:3000
3. Access the API at http://localhost:3000/api/hello

**Note:** In development mode, the application runs with hot reloading enabled for both frontend and API code.

### Production Mode

1. Build and start the production environment:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

2. Access the application at http://localhost:3000
3. Access the API at http://localhost:3000/api/hello

## Testing

This project includes a comprehensive testing setup with both unit and integration tests.

### Test Structure

- **Unit Tests**: Test individual components and API endpoints in isolation
- **Integration Tests**: Test the entire application flow including UI interactions

### Running Tests

```bash
# Run all tests
docker-compose exec app npm run test

# Run only unit tests
docker-compose exec app npm run test:unit

# Run unit tests in watch mode (for development)
docker-compose exec app npm run test:unit:watch

# Run only integration tests
docker-compose exec app npm run test:integration

# Run integration tests with UI mode
docker-compose exec app npm run test:integration:ui
```

### Testing Technologies

- **Unit Testing**: Vitest with Vue Test Utils and Happy DOM
- **Integration Testing**: Playwright for end-to-end browser testing
- **Test Configuration**: Separate config files for unit and integration tests

For more details on testing, see [tests/README.md](tests/README.md).

## API Endpoints

- `GET /api/hello` - Returns a simple "Hello World" message
- `GET /api/health` - Returns a status check

## Benefits of Integrated Architecture

- **Simplified Development**: One codebase to manage
- **Reduced Complexity**: No need to coordinate between separate services
- **Improved Performance**: Reduced overhead from running multiple services
- **Easier Deployment**: Single container to deploy
- **Better Developer Experience**: Unified tooling and configuration
- **Type Safety**: TypeScript throughout the entire stack
- **Shared Code**: Easily share types and utilities between frontend and backend

## Development Guide

### Adding New API Endpoints

To add a new API endpoint, create a new file in the `server/api/` directory:

```typescript
// server/api/example.ts
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  return { data: 'This is a new endpoint' };
});
```

This will be available at `/api/example`.

### Adding New Pages

To add a new page, create a new file in the `pages/` directory:

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>About Page</h1>
    <p>This is the about page.</p>
  </div>
</template>
```

This will be available at `/about`.

## License

MIT 