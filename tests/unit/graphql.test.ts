import { describe, it, expect, beforeEach } from 'vitest';
import { resolvers } from '../../server/graphql/resolvers';

// Direct access to the users array for testing
// @ts-ignore - Accessing the users array directly for testing
let users = resolvers.Query.users();

describe('GraphQL Resolvers', () => {
  // Reset users before each test to ensure test isolation
  beforeEach(() => {
    // Clear the array
    while (users.length > 0) {
      users.pop();
    }
    
    // Add test data
    users.push(
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
    );
  });

  describe('Query Resolvers', () => {
    it('should return API info', () => {
      const result = resolvers.Query.info();
      expect(result).toBe('GraphQL API for Nuxt Application');
    });

    it('should return all users', () => {
      const result = resolvers.Query.users();
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Smith');
      expect(result[2].name).toBe('Bob Johnson');
    });

    it('should return a single user by ID', () => {
      const result = resolvers.Query.user(null, { id: '2' });
      expect(result).toBeDefined();
      expect(result?.id).toBe('2');
      expect(result?.name).toBe('Jane Smith');
      expect(result?.email).toBe('jane@example.com');
    });

    it('should return undefined for non-existent user', () => {
      const result = resolvers.Query.user(null, { id: '999' });
      expect(result).toBeUndefined();
    });

    it('should return hello response with message and timestamp', () => {
      const result = resolvers.Query.hello();
      expect(result).toHaveProperty('message', 'Hello World from GraphQL!');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });

  describe('Mutation Resolvers', () => {
    it('should create a new user', () => {
      const initialLength = users.length;
      const result = resolvers.Mutation.createUser(null, { 
        name: 'Alice Williams', 
        email: 'alice@example.com' 
      });
      
      expect(result).toBeDefined();
      expect(result.id).toBe('4'); // Since we have 3 users already
      expect(result.name).toBe('Alice Williams');
      expect(result.email).toBe('alice@example.com');
      expect(users.length).toBe(initialLength + 1);
    });

    it('should update an existing user', () => {
      const result = resolvers.Mutation.updateUser(null, { 
        id: '1', 
        name: 'John Updated', 
        email: 'john.updated@example.com' 
      });
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('John Updated');
      expect(result?.email).toBe('john.updated@example.com');
      
      // Verify the user was actually updated in the array
      const updatedUser = users.find(u => u.id === '1');
      expect(updatedUser?.name).toBe('John Updated');
    });

    it('should return undefined when updating non-existent user', () => {
      const result = resolvers.Mutation.updateUser(null, { 
        id: '999', 
        name: 'Not Found' 
      });
      
      expect(result).toBeUndefined();
    });

    it('should delete an existing user', () => {
      // Get the current users array
      const usersBefore = [...users];
      const initialLength = usersBefore.length;
      
      // Call the deleteUser resolver
      const result = resolvers.Mutation.deleteUser(null, { id: '2' });
      
      // Get the updated users array
      const usersAfter = resolvers.Query.users();
      
      // Verify the result and the users array
      expect(result).toBe(true);
      expect(usersAfter.length).toBe(initialLength - 1);
      expect(usersAfter.find(u => u.id === '2')).toBeUndefined();
    });

    it('should return false when deleting non-existent user', () => {
      const initialLength = users.length;
      const result = resolvers.Mutation.deleteUser(null, { id: '999' });
      
      expect(result).toBe(false);
      expect(users.length).toBe(initialLength);
    });
  });
}); 