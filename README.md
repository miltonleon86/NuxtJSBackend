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
- [API Endpoints](#api-endpoints)
- [GraphQL API](#graphql-api)
- [Middleware](#middleware)
- [Testing](#testing)
- [Benefits of Integrated Architecture](#benefits-of-integrated-architecture)
- [Development Guide](#development-guide)
- [License](#license)

## Architecture Overview

This application uses a unified architecture where both frontend and backend are integrated within a single Nuxt.js application:

- **Frontend**: Nuxt.js pages and components for the user interface
- **Backend**: API endpoints defined directly in the Nuxt server directory using Nitro
- **GraphQL**: Integrated GraphQL API for flexible data querying
- **Single Service**: Everything runs as one service on a single port
- **Environment Awareness**: The application displays whether it's running in development or production mode

## Features

- **Nuxt.js Frontend**: Modern Vue-based UI with server-side rendering
- **Integrated API**: REST endpoints using the built-in Nitro server
- **GraphQL API**: Flexible data querying with GraphiQL explorer
- **Request Logging**: Middleware for tracking API performance
- **Docker Integration**: Containerization for consistent development and deployment
- **Hot Reloading**: Instant feedback during development
- **Environment Detection**: Visual indicators for development/production modes
- **Debug Panel**: Interactive debugging information
- **Comprehensive Testing**: Unit and integration test setup

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)
- Git

## Project Structure

```
project/
├── app.vue                  # Main application component
├── pages/                   # Nuxt.js pages
│   ├── index.vue            # Homepage
│   └── graphql.vue          # GraphQL demo page
├── server/                  # Server-side code
│   ├── api/                 # API endpoints
│   │   ├── hello.ts         # Hello world endpoint
│   │   ├── health.ts        # Health check endpoint
│   │   ├── graphql.ts       # GraphQL API endpoint
│   │   └── graphiql.ts      # GraphiQL interface
│   ├── graphql/             # GraphQL implementation
│   │   ├── schema.ts        # GraphQL schema definition
│   │   ├── resolvers.ts     # GraphQL resolvers
│   │   └── types.ts         # TypeScript types for GraphQL
│   └── middleware/          # Server middleware
│       └── logger.ts        # Request logging middleware
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── docker-compose.yml       # Development Docker configuration
├── docker-compose.prod.yml  # Production Docker configuration
├── Dockerfile.nuxt.dev      # Development Dockerfile
├── Dockerfile.nuxt.prod     # Production Dockerfile
├── nuxt.config.ts           # Nuxt configuration
├── tsconfig.json            # TypeScript configuration
├── GRAPHQL.md               # GraphQL documentation
└── package.json             # Project dependencies and scripts
```

## Request Flow

1. A request comes to port 3000
2. Server middleware processes the request (e.g., logging)
3. Nuxt's server handles the request:
   - If it's a page request (e.g., `/`), Nuxt renders the appropriate page
   - If it's a REST API request (e.g., `/api/hello`), Nuxt routes it to the corresponding API handler
   - If it's a GraphQL request (to `/api/graphql`), it's processed by the GraphQL engine

## Environment Modes

The application is designed to run in two environments:

### Development Mode
- Hot reloading enabled
- Detailed error messages
- Environment badge shows "DEVELOPMENT" in green
- Non-minified code for easier debugging

### Production Mode
- Optimized build with minified assets
- Performance-focused configuration
- Environment badge shows "PRODUCTION" in red
- Reduced logging and error details

## Running the Application

### Development Mode

1. Start the development environment:

```bash
docker-compose up --build
```

2. Access the application at http://localhost:3000
3. Access the REST API at http://localhost:3000/api/hello
4. Access the GraphQL explorer at http://localhost:3000/api/graphiql
5. Access the GraphQL demo page at http://localhost:3000/graphql

### Production Mode

1. Build and start the production environment:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

2. Access the application at http://localhost:3000

## API Endpoints

### REST Endpoints

- `GET /api/hello` - Returns a simple "Hello World" message with a timestamp
- `GET /api/health` - Returns a status check for monitoring

### GraphQL API

- `POST /api/graphql` - GraphQL API endpoint for queries
- `GET /api/graphiql` - Interactive GraphQL explorer interface

## GraphQL API

This application includes a fully-featured GraphQL API that provides a flexible and efficient way to query and modify data.

### GraphQL Interface and Demo

The application provides two ways to interact with the GraphQL API:

**GraphiQL Interface**:
- URL: `http://localhost:3000/api/graphiql`
- A lightweight, standalone GraphQL IDE
- Perfect for quick queries and schema exploration
- Includes documentation explorer for your GraphQL schema
- Provides syntax highlighting and autocompletion

**GraphQL Demo Page**:
- URL: `http://localhost:3000/graphql`
- Interactive UI for demonstrating GraphQL functionality
- Displays user data fetched via GraphQL queries
- Shows the hello message with timestamp
- Includes a form to add new users via GraphQL mutations
- Provides a practical example of using GraphQL in a frontend application

### Available Queries

The GraphQL API supports the following queries:

```graphql
# Get API information
query {
  info
}

# Get all users
query {
  users {
    id
    name
    email
  }
}

# Get a specific user by ID
query {
  user(id: "1") {
    id
    name
    email
  }
}

# Get a hello message with timestamp
query {
  hello {
    message
    timestamp
  }
}
```

### Available Mutations

The API also supports the following mutations for modifying data:

```graphql
# Create a new user
mutation {
  createUser(name: "New User", email: "newuser@example.com") {
    id
    name
    email
  }
}

# Update an existing user
mutation {
  updateUser(id: "1", name: "Updated Name", email: "updated@example.com") {
    id
    name
    email
  }
}

# Delete a user
mutation {
  deleteUser(id: "3")
}
```

### Data Persistence

In the current implementation:

- Data is stored in memory during the server's runtime
- Changes made through mutations persist between requests as long as the server is running
- Data resets to initial values when the server restarts
- For production use, you would replace the in-memory storage with a database connection

### Using the GraphQL API Programmatically

You can interact with the GraphQL API using any GraphQL client. Here's an example using fetch:

```javascript
async function fetchGraphQL(query, variables = {}) {
  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      query,
      variables 
    }),
  });
  
  return response.json();
}

// Example: Get all users
fetchGraphQL(`
  query {
    users {
      id
      name
      email
    }
  }
`).then(result => {
  console.log(result.data);
});

// Example: Create a new user
fetchGraphQL(`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`, {
  name: "New User",
  email: "newuser@example.com"
}).then(result => {
  console.log(result.data);
});
```

## Middleware

The application includes server middleware for enhanced functionality:

### Logger Middleware

The logger middleware tracks API requests and provides performance metrics:

- Records request method, URL, and client IP
- Measures response time and classifies performance (Good/Slow/Very Slow)
- Logs user agent and other request details
- Can be configured to include or exclude specific routes

You can customize which routes are logged by modifying the `excludedRoutes` array in `server/middleware/logger.ts`.

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

### Creating Frontend Components with GraphQL

To create frontend components that interact with the GraphQL API, follow the pattern used in the GraphQL demo page:

1. Create a new page or component:

```vue
<!-- Example component using GraphQL -->
<template>
  <div>
    <h2>User List</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>

<script setup>
const loading = ref(true);
const error = ref(null);
const users = ref([]);

// Function to fetch data from GraphQL
async function fetchUsers() {
  try {
    const query = `
      query {
        users {
          id
          name
          email
        }
      }
    `;
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    users.value = result.data.users;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Fetch data when component is mounted
onMounted(() => {
  fetchUsers();
});
</script>
```

2. For mutations, use a similar pattern:

```javascript
async function addUser(name, email) {
  const mutation = `
    mutation($name: String!, $email: String!) {
      createUser(name: $name, email: $email) {
        id
        name
        email
      }
    }
  `;
  
  const variables = { name, email };
  
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: mutation, variables }),
  });
  
  return response.json();
}
```

3. See the complete implementation in `pages/graphql.vue` for a full example of a page that uses both queries and mutations.

### Adding New GraphQL Types and Resolvers

To extend the GraphQL API, modify the schema and resolvers:

1. Add new types to `server/graphql/schema.ts`:

```typescript
// Add to the typeDefs string
type Product {
  id: ID!
  name: String!
  price: Float!
}

// Add to the Query type
products: [Product!]!
product(id: ID!): Product
```

2. Add corresponding resolvers in `server/graphql/resolvers.ts`:

```typescript
// Add to the resolvers object
products: () => products,
product: (_: any, { id }: { id: string }) => {
  return products.find(product => product.id === id);
},
```

3. Add TypeScript types in `server/graphql/types.ts`:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

### Adding New GraphQL Mutations

To add new mutations for modifying data:

1. Add mutation definitions to `server/graphql/schema.ts`:

```typescript
// Add to the Mutation type
createProduct(name: String!, price: Float!): Product!
updateProduct(id: ID!, name: String, price: Float): Product
deleteProduct(id: ID!): Boolean!
```

2. Implement mutation resolvers in `server/graphql/resolvers.ts`:

```typescript
// Add to the Mutation object in resolvers
createProduct: (_: any, { name, price }: { name: string, price: number }): Product => {
  const id = String(products.length + 1);
  const newProduct = { id, name, price };
  products.push(newProduct);
  return newProduct;
},
updateProduct: (_: any, { id, name, price }: { id: string, name?: string, price?: number }): Product | undefined => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  const product = products[index];
  const updatedProduct = { 
    ...product,
    name: name !== undefined ? name : product.name,
    price: price !== undefined ? price : product.price
  };
  
  products[index] = updatedProduct;
  return updatedProduct;
},
deleteProduct: (_: any, { id }: { id: string }): boolean => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
}
```

3. For production applications, replace the in-memory storage with database operations.

### Customizing the Logger Middleware

To modify which routes are logged or excluded from logging:

1. Open `server/middleware/logger.ts`
2. Update the `excludedRoutes` array:

```typescript
const excludedRoutes = [
  '/favicon.ico',
  '/_nuxt/',
  '/assets/',
  // Add more routes to exclude as needed
];
```

## License

MIT 