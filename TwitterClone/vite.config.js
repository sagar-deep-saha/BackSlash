import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    plugins: [solidPlugin()],
    server: {
      port: 5177,
      host: true,
      allowedHosts: [
        'backslash-twitter-clone.onrender.com',
        'backslash-twitter-clone-five.vercel.app',
        'back-slash-front-ui.vercel.app',
        'localhost',
        '127.0.0.1',
        'backslash-twitter-back-xi.vercel.app'
      ],
      proxy: {
        '/api': {
          target: isDev ? 'http://localhost:8001' : 'https://backslash-twitter-back-xi.vercel.app',
          changeOrigin: true,
          secure: !isDev,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
            })
          }
        }
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['solid-js'],
            api: ['./src/services/api.js']
          }
        }
      }
    },
    css: {
      postcss: './postcss.config.cjs'
    }
  }
});