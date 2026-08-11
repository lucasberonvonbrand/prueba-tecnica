import { defineConfig } from 'vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Permite que Vite responda a dominios externos como Render
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },
})

export default config
