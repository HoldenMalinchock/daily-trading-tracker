// Create my nuxt server api endpoint
export default defineEventHandler((event) => {
    // This is going to need to get data from alpaca so we will need to use the env variables
    return {
      hello: 'world'
    }
  })