# GraphQL API Documentation

This application includes a GraphQL API that provides access to user data and other information.

## Accessing the GraphQL API

The GraphQL API is available at:

```
http://localhost:3000/api/graphql
```

When the application is running, you can access the GraphQL Playground at the same URL to interactively explore and test the API.

## Available Queries

### Get API Information

```graphql
query {
  info
}
```

### Get All Users

```graphql
query {
  users {
    id
    name
    email
  }
}
```

### Get a Specific User

```graphql
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

### Get Hello Message

```graphql
query {
  hello {
    message
    timestamp
  }
}
```

## Example Usage with curl

```bash
# Query for all users
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { id name email } }"}' \
  http://localhost:3000/api/graphql

# Query for a specific user
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ user(id: \"1\") { id name email } }"}' \
  http://localhost:3000/api/graphql

# Query for hello message
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello { message timestamp } }"}' \
  http://localhost:3000/api/graphql
```

## Example Usage with JavaScript

```javascript
// Using fetch API
async function fetchGraphQL(query) {
  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  return response.json();
}

// Example: Get all users
fetchGraphQL(`
  {
    users {
      id
      name
      email
    }
  }
`).then(result => {
  console.log(result.data);
});
``` 