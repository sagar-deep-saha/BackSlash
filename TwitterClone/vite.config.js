import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 5174,  // Different port from FrontEnd
    host: true
  },
  css: {
    postcss: './postcss.config.cjs'
  }
})
