import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  // HTML for a page with embedded GraphiQL
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GraphiQL Interface</title>
  
  <!-- Load required CSS -->
  <link href="https://unpkg.com/graphiql@2.4.7/graphiql.min.css" rel="stylesheet" />
  
  <style>
    body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
    #graphiql { height: calc(100vh - 50px); width: 100%; }
    .header { background: #1a1a1a; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; height: 30px; }
    .header h1 { margin: 0; font-size: 1.5rem; }
    .header a { color: #61dafb; margin-left: 15px; text-decoration: none; }
    .header a:hover { text-decoration: underline; }
    .error-message { background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px; border-radius: 4px; display: none; }
    .loading { display: flex; justify-content: center; align-items: center; height: 100%; font-size: 1.2rem; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>GraphiQL Explorer</h1>
    <div>
      <a href="/api/graphql" target="_blank">GraphQL Endpoint</a>
      <a href="/" target="_blank">Back to App</a>
    </div>
  </div>
  
  <div id="error-message" class="error-message"></div>
  <div id="graphiql">
    <div class="loading">Loading GraphiQL interface...</div>
  </div>
  
  <!-- Load required JS -->
  <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/graphiql@2.4.7/graphiql.min.js"></script>
  
  <script>
    // Initialize GraphiQL
    const errorMessageEl = document.getElementById('error-message');
    const graphiqlEl = document.getElementById('graphiql');
    
    function showError(message) {
      errorMessageEl.textContent = message;
      errorMessageEl.style.display = 'block';
      console.error(message);
    }
    
    const graphQLFetcher = graphQLParams => {
      return fetch('/api/graphql', {
        method: 'post',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(graphQLParams),
        credentials: 'same-origin'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        })
        .then(result => {
          // Hide any previous error
          errorMessageEl.style.display = 'none';
          
          // Check for GraphQL errors
          if (result.errors && result.errors.length) {
            console.warn('GraphQL errors:', result.errors);
          }
          
          // Handle Apollo Server response format
          if (result.body && result.body.kind === 'single') {
            return result.body.singleResult;
          }
          
          return result;
        })
        .catch(error => {
          // Show error message
          showError('Error connecting to GraphQL: ' + error.message);
          
          // Return empty result to prevent GraphiQL from crashing
          return { data: null };
        });
    };
    
    // Default query
    const defaultQuery = \`# Welcome to GraphiQL
#
# Try running some queries:
query {
  info
  users {
    id
    name
    email
  }
  hello {
    message
    timestamp
  }
}

# Or try a mutation:
# mutation {
#   createUser(name: "New User", email: "user@example.com") {
#     id
#     name
#     email
#   }
# }
\`;

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      try {
        // Initialize GraphiQL
        ReactDOM.render(
          React.createElement(GraphiQL, {
            fetcher: graphQLFetcher,
            defaultQuery: defaultQuery
          }),
          graphiqlEl
        );
      } catch (error) {
        showError('Failed to initialize GraphiQL: ' + error.message);
      }
    });
    
    // Also try to initialize immediately in case DOMContentLoaded already fired
    try {
      if (window.GraphiQL) {
        ReactDOM.render(
          React.createElement(GraphiQL, {
            fetcher: graphQLFetcher,
            defaultQuery: defaultQuery
          }),
          graphiqlEl
        );
      }
    } catch (error) {
      console.warn('Initial render attempt failed, will try again on DOMContentLoaded', error);
    }
  </script>
</body>
</html>
  `;

  return html;
}); 