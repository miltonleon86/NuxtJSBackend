import { User, HelloResponse } from './types';

// Mock data - changed to let so we can modify it
let users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
];

// Define resolvers
export const resolvers = {
  Query: {
    info: (): string => 'GraphQL API for Nuxt Application',
    users: (): User[] => users,
    user: (_: any, { id }: { id: string }): User | undefined => {
      return users.find(user => user.id === id);
    },
    hello: (): HelloResponse => {
      return {
        message: 'Hello World from GraphQL!',
        timestamp: new Date().toISOString(),
      };
    },
  },
  Mutation: {
    createUser: (_: any, { name, email }: { name: string, email: string }): User => {
      // Generate a new ID
      const id = String(users.length + 1);
      
      // Create the new user
      const newUser: User = { id, name, email };
      
      // Add to our "database"
      users.push(newUser);
      
      return newUser;
    },
    updateUser: (_: any, { id, name, email }: { id: string, name?: string, email?: string }): User | undefined => {
      // Find the user
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return undefined;
      
      // Update the user
      const user = users[userIndex];
      const updatedUser = { 
        ...user,
        name: name !== undefined ? name : user.name,
        email: email !== undefined ? email : user.email
      };
      
      // Save the updated user
      users[userIndex] = updatedUser;
      
      return updatedUser;
    },
    deleteUser: (_: any, { id }: { id: string }): boolean => {
      // Find the user
      const initialLength = users.length;
      
      // Remove the user
      users = users.filter(user => user.id !== id);
      
      // Return true if a user was removed
      return users.length < initialLength;
    }
  }
}; 