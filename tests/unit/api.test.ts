import { describe, it, expect } from 'vitest';
import { defineEventHandler } from 'h3';

// Import the API handler
import helloHandler from '../../server/api/hello';

describe('API Endpoints', () => {
  describe('/api/hello', () => {
    it('should return the correct message', async () => {
      // Call the handler directly
      const result = await helloHandler({} as any);
      
      // Assert the response
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Hello World from Nuxt Backend');
    });
  });
}); 