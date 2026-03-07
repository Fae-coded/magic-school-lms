import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: './src/test/setupTests.js',
    environment: 'jsdom',
    globals: true,
  },
})
