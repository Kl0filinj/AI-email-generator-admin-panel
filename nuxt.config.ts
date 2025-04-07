// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fileURLToPath } = require('node:url');

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  plugins: ['~/plugins/afetch.ts'],
  alias: {
    '@t': fileURLToPath(new URL('./types', import.meta.url)),
  },
  runtimeConfig: {
    baseUri: process.env.BASE_URL,
  },
});
