<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="header-title">Nuxt Integrated App</h1>
        <div class="environment-badge" :class="{ 'env-prod': isProd }">
          {{ currentEnv }}
        </div>
        <div class="header-links">
          <a href="https://nuxt.com" target="_blank">Nuxt</a>
          <a href="https://nitro.unjs.io" target="_blank">Nitro</a>
          <a href="https://github.com" target="_blank">GitHub</a>
        </div>
      </div>
    </header>
    <main class="app-main">
      <NuxtPage />
    </main>
    <footer class="app-footer">
      <p>Built with Nuxt.js and Nitro Server</p>
    </footer>
  </div>
</template>

<script setup>
// Get the current environment
const isProd = process.env.NODE_ENV === 'production';
const currentEnv = isProd ? 'PRODUCTION' : 'DEVELOPMENT';
</script>

<style>
:root {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --accent-color: #4cc9f0;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --font-main: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --dev-color: #48bb78;
  --prod-color: #e53e3e;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
}

body {
  font-family: var(--font-main);
  color: var(--text-color);
  background-color: var(--light-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.environment-badge {
  background-color: var(--dev-color);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.env-prod {
  background-color: var(--prod-color);
}

.header-links {
  display: flex;
  gap: 1.5rem;
}

.header-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.header-links a:hover {
  opacity: 0.8;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-footer {
  background-color: #f1f1f1;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--secondary-color);
}

button {
  cursor: pointer;
  font-family: var(--font-main);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-links {
    gap: 1rem;
  }
}
</style> 