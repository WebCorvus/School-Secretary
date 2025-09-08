
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://proxy:80',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
