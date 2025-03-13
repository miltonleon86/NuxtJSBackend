<template>
  <div class="container">
    <div class="card">
      <h1 class="title">GraphQL Demo</h1>
      <p class="subtitle">Fetching data using GraphQL</p>
      
      <div class="status-indicator" :class="statusClass">
        <span class="status-dot"></span>
        <span>{{ statusText }}</span>
      </div>
      
      <!-- Hello Message Section -->
      <div class="section">
        <h2>Hello Message</h2>
        <div class="message-box">
          <p class="message">{{ helloMessage }}</p>
          <p class="timestamp">{{ timestamp }}</p>
        </div>
      </div>
      
      <!-- Users Section -->
      <div class="section">
        <h2>Users</h2>
        <div v-if="loading" class="loading">Loading users...</div>
        <div v-else-if="error" class="error">Error: {{ error }}</div>
        <div v-else class="users-list">
          <div v-for="user in users" :key="user.id" class="user-card">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
            <p class="user-id">ID: {{ user.id }}</p>
          </div>
        </div>
      </div>
      
      <!-- Add User Form -->
      <div class="section">
        <h2>Add New User</h2>
        <form @submit.prevent="addUser" class="user-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              id="name" 
              v-model="newUser.name" 
              type="text" 
              required 
              placeholder="Enter name"
            >
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              v-model="newUser.email" 
              type="email" 
              required 
              placeholder="Enter email"
            >
          </div>
          <button type="submit" class="button">Add User</button>
        </form>
      </div>
      
      <div class="buttons">
        <NuxtLink to="/" class="button">Back to Home</NuxtLink>
        <a href="/api/graphiql" target="_blank" class="button graphql-button">GraphiQL Explorer</a>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const error = ref(null);
const users = ref([]);
const helloMessage = ref('');
const timestamp = ref('');

const newUser = ref({
  name: '',
  email: ''
});

// Status tracking
const status = ref('loading');
const statusText = computed(() => {
  if (status.value === 'error') return 'GraphQL Connection Error';
  if (status.value === 'loading') return 'Loading...';
  return 'GraphQL Connected';
});

const statusClass = computed(() => {
  return `status-${status.value}`;
});

// Function to fetch users
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    users.value = result.data.users;
    status.value = 'success';
  } catch (err) {
    error.value = err.message;
    status.value = 'error';
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
}

// Function to fetch hello message
async function fetchHello() {
  try {
    const query = `
      query {
        hello {
          message
          timestamp
        }
      }
    `;
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    helloMessage.value = result.data.hello.message;
    timestamp.value = new Date(result.data.hello.timestamp).toLocaleString();
    status.value = 'success';
  } catch (err) {
    error.value = err.message;
    status.value = 'error';
    console.error('Error fetching hello message:', err);
  }
}

// Function to add a new user
async function addUser() {
  try {
    const mutation = `
      mutation($name: String!, $email: String!) {
        createUser(name: $name, email: $email) {
          id
          name
          email
        }
      }
    `;
    
    const variables = {
      name: newUser.value.name,
      email: newUser.value.email
    };
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: mutation,
        variables
      }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    // Add the new user to our list
    users.value.push(result.data.createUser);
    
    // Reset the form
    newUser.value = {
      name: '',
      email: ''
    };
  } catch (err) {
    error.value = err.message;
    console.error('Error adding user:', err);
  }
}

// Fetch data when the component is mounted
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchHello()]);
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: calc(100vh - 130px);
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.message-box {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.timestamp {
  font-size: 0.9rem;
  color: #666;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.user-card {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.user-id {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
}

.user-form {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-success {
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-success .status-dot {
  background-color: #48bb78;
}

.status-loading {
  background-color: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.status-loading .status-dot {
  background-color: #ed8936;
}

.status-error {
  background-color: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.status-error .status-dot {
  background-color: #f56565;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #ed8936;
}

.error {
  text-align: center;
  padding: 1rem;
  color: #f56565;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white !important;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.graphql-button {
  background-color: #e10098;
}

.graphql-button:hover {
  background-color: #b5007a;
}
</style> 