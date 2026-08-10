import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
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
