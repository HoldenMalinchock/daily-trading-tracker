// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],
  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: "double",
        indent: 2,
      },
    },
  },
  vue: {
    propsDestructure: true,
  },
  runtimeConfig: {
    alpacaApiKey: process.env.ALPACA_API_KEY,
    alpacaSecretKey: process.env.ALPACA_SECRET_KEY,
  },
})
