import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers';

// Define GraphQL type definitions
const typeDefs = `
  type Query {
    info: String
    users: [User!]!
    user(id: ID!): User
    hello: HelloResponse!
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type HelloResponse {
    message: String!
    timestamp: String!
  }
`;

// Create and export the executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); 