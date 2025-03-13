import { defineEventHandler, readBody } from 'h3';
import { ApolloServer } from '@apollo/server';
import { schema } from '../graphql/schema';
import { Context } from '../graphql/types';

// Create Apollo Server instance with explicit configuration
const apollo = new ApolloServer<Context>({
  schema,
  introspection: true, // Explicitly enable introspection
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production', // Include stack traces in development
});

// Track server initialization
let isServerStarted = false;

export default defineEventHandler(async (event) => {
  try {
    // Start Apollo server if not already started
    if (!isServerStarted) {
      await apollo.start();
      isServerStarted = true;
      console.log('Apollo GraphQL server started successfully');
    }
    
    // Get request body
    const body = await readBody(event).catch(() => ({}));
    
    // Log the incoming GraphQL operation for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log(`GraphQL operation received:`, {
        query: body.query?.substring(0, 100) + (body.query?.length > 100 ? '...' : ''),
        operationName: body.operationName,
        variables: body.variables ? JSON.stringify(body.variables).substring(0, 100) : 'none'
      });
    }
    
    // Execute GraphQL query directly
    const response = await apollo.executeOperation({
      query: body.query,
      variables: body.variables || {},
      operationName: body.operationName,
    }, {
      contextValue: {},
    });
    
    // Check if the response is in the Apollo Server format and unwrap it
    if (response.body && response.body.kind === 'single') {
      return response.body.singleResult;
    }
    
    // Return the GraphQL response
    return response;
  } catch (error) {
    console.error('GraphQL Error:', error);
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : 'Unknown GraphQL error',
          extensions: { 
            code: 'INTERNAL_SERVER_ERROR',
            path: event.node.req.url
          }
        }
      ]
    };
  }
}); 