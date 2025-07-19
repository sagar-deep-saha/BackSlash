import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'back-slash-front-ui.vercel.app',
      'backslash-front-ui.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        // target: 'http://localhost:8000',
        target: 'https://back-slash-back-server.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'esnext',
  },
  css: {
    postcss: './postcss.config.cjs'
  }
})
