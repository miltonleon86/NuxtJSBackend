// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
  // Server-side rendering mode
  ssr: true,

  // Global page headers
  app: {
    head: {
      title: 'Nuxt with Integrated Backend',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Nuxt with integrated backend' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      // @ts-ignore
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  },

  // Server configuration
  nitro: {
    preset: 'node-server'
  },

  // Development server configuration
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  }
}) 