// Define TypeScript interfaces for GraphQL types

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface HelloResponse {
  message: string;
  timestamp: string;
}

// Define resolver context type
export interface Context {
  // Add any context properties here
  // For example: user: User;
} 