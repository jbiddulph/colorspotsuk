import { defineNuxtConfig } from 'nuxt/config'; // Correct import for Nuxt 3

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  target: 'server', // or 'static' for static sites
  ssr: true, // ensures the app is rendered server-side
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  supabase: {
    redirect: false,
  },
  imports: {
    dirs: ['stores']
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      if (!globalThis.fetch) {
        import('node-fetch').then((fetchModule) => {
          globalThis.fetch = fetchModule.default;
        });
      }
    }
  }
});
