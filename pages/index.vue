<template>
  <div class="container">
    <div class="card">
      <h1 class="title">{{ message }}</h1>
      <p class="subtitle">Nuxt.js with Integrated Backend</p>
      
      <div class="status-indicator" :class="statusClass">
        <span class="status-dot"></span>
        <span>{{ statusText }}</span>
      </div>
      
      <div class="buttons">
        <a href="https://nuxt.com/docs" target="_blank" class="button">Nuxt Docs</a>
        <a href="https://nitro.unjs.io/guide" target="_blank" class="button">Nitro Docs</a>
      </div>
      
      <div class="graphql-section">
        <h3>GraphQL API</h3>
        <p>Explore the GraphQL API using our interactive interface:</p>
        <div class="buttons">
          <a href="/api/graphiql" class="button graphql-button">GraphiQL Explorer</a>
          <NuxtLink to="/graphql" class="button graphql-demo-button">GraphQL Demo</NuxtLink>
        </div>
      </div>
      
      <div v-if="showDebug" class="debug-info">
        <div class="debug-header">
          <h3>Debug Information</h3>
          <button @click="showDebug = false" class="close-button">×</button>
        </div>
        <div class="debug-content">
          <p><strong>Environment:</strong> <span :class="{ 'env-prod-text': isProd }">{{ currentEnv }}</span></p>
          <p><strong>API URL:</strong> {{ apiUrl }}</p>
          <p><strong>Config value:</strong> {{ config.public.apiBaseUrl }}</p>
          <p><strong>Status:</strong> {{ status }}</p>
          <div v-if="error">
            <p><strong>Error:</strong> {{ error }}</p>
          </div>
          <div v-if="data">
            <p><strong>Data:</strong> {{ JSON.stringify(data) }}</p>
          </div>
        </div>
      </div>
      
      <button @click="showDebug = !showDebug" class="debug-toggle">
        {{ showDebug ? 'Hide' : 'Show' }} Debug Info
      </button>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const apiUrl = `/api/hello`;
const showDebug = ref(false);

// Get the current environment
const isProd = process.env.NODE_ENV === 'production';
const currentEnv = isProd ? 'PRODUCTION' : 'DEVELOPMENT';

// Use the useFetch composable with the server option to ensure it's made on the server side
const { data, pending, error } = await useFetch(apiUrl, {
  server: true,
  headers: {
    'Accept': 'application/json'
  }
});

const status = computed(() => {
  if (error.value) return 'error';
  if (pending.value) return 'loading';
  return 'success';
});

const statusText = computed(() => {
  if (error.value) return 'API Connection Error';
  if (pending.value) return 'Loading...';
  return 'Nuxt API Connected';
});

const statusClass = computed(() => {
  return `status-${status.value}`;
});

const message = computed(() => {
  if (error.value) return 'Error loading message from server';
  if (pending.value) return 'Loading...';
  return data.value?.message || 'No message received';
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: calc(100vh - 130px); /* Adjust for header and footer */
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 600px;
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

.env-prod-text {
  color: var(--prod-color);
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white !important;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.debug-toggle {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-align: left;
  max-width: 100%;
  overflow-x: auto;
  position: relative;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.debug-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #adb5bd;
}

.debug-content {
  font-size: 0.9rem;
}

.debug-content p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .card {
    padding: 2rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .buttons {
    flex-direction: column;
  }
}

.graphql-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.graphql-section h3 {
  margin-top: 0;
  color: var(--text-color);
}

.graphql-button {
  background-color: #E535AB; /* GraphQL pink color */
}

.graphql-button:hover {
  background-color: #b5007a;
  box-shadow: 0 4px 12px rgba(225, 0, 152, 0.3);
}

.graphql-demo-button {
  background-color: #4c51bf;
}

.graphql-demo-button:hover {
  background-color: #434190;
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.3);
}
</style> 