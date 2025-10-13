import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Alias simple: '@' -> '/src'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
})