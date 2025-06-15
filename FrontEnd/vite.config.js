import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://backslash-backend.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'esnext',
  },
})
